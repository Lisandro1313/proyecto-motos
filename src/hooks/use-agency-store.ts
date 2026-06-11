"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db, hasFirebaseConfig } from "@/lib/firebase";
import { demoData } from "@/lib/demo-data";
import type {
  ActiveWorker,
  AgencyData,
  Branch,
  Currency,
  Customer,
  Financing,
  Motorcycle,
  MotorcycleStatus,
  PaymentMethod,
  Sale,
  ActivityEvent,
} from "@/lib/types";

const DEFAULT_MOTORCYCLE_IMAGE = "/re-motos-logo.jpeg";

type CustomerInput = Pick<
  Customer,
  "name" | "dni" | "phone" | "email" | "city"
>;

type MotorcycleInput = Pick<
  Motorcycle,
  | "brand"
  | "model"
  | "category"
  | "price"
  | "currency"
  | "cost"
  | "stock"
  | "branch"
> & {
  image?: string;
  cardInstallments?: Motorcycle["cardInstallments"];
  notes?: string;
};

type StockReceiptInput = {
  motorcycleId: string;
  quantity: number;
  cost?: number;
  price?: number;
  currency?: Currency;
  image?: string;
  note?: string;
  worker?: ActiveWorker;
};

type MotorcyclePricingInput = {
  motorcycleId: string;
  price: number;
  cost: number;
  currency: Currency;
  note?: string;
  worker?: ActiveWorker;
};

type MotorcycleEditInput = Partial<
  Pick<
    Motorcycle,
    | "brand"
    | "model"
    | "category"
    | "price"
    | "currency"
    | "cost"
    | "stock"
    | "image"
    | "notes"
    | "cardInstallments"
  >
>;

type SaleInput = {
  customerId: string;
  motorcycleId: string;
  branch: string;
  paymentMethod: PaymentMethod;
  seller: string;
  sellerId?: string;
  installments?: number;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function statusFromStock(stock: number): MotorcycleStatus {
  if (stock <= 0) return "Sin stock";
  if (stock <= 2) return "Últimas unidades";
  if (stock <= 4) return "Pocas unidades";
  return "Disponible";
}

function mapDocs<T>(snapshot: {
  docs: { id: string; data: () => Record<string, unknown> }[];
}): T[] {
  return snapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as T);
}

const MONTH_LABELS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

function buildMonthlySales(sales: Sale[]) {
  const now = new Date();
  const months: { month: string; total: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const total = sales.reduce((sum, sale) => {
      if (sale.currency === "USD" || !sale.date) return sum;
      const saleDate = new Date(sale.date);
      const saleKey = `${saleDate.getFullYear()}-${saleDate.getMonth()}`;
      return saleKey === key ? sum + sale.price : sum;
    }, 0);
    months.push({ month: MONTH_LABELS[date.getMonth()], total });
  }

  return months;
}

function buildFinancingBreakdown(financings: Financing[]) {
  const plans: { label: string; installments: number; color: string }[] = [
    { label: "Tarjeta 3", installments: 3, color: "#2563eb" },
    { label: "Tarjeta 6", installments: 6, color: "#10b981" },
    { label: "Tarjeta 12", installments: 12, color: "#7c3aed" },
    { label: "Tarjeta 18", installments: 18, color: "#f97316" },
  ];

  return plans.map((plan) => ({
    label: plan.label,
    color: plan.color,
    count: financings.filter((f) => f.installments === plan.installments).length,
  }));
}

export function useAgencyStore() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [financings, setFinancings] = useState<Financing[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityEvent[]>([]);
  const [ready, setReady] = useState(!hasFirebaseConfig);

  useEffect(() => {
    if (!hasFirebaseConfig) return;

    const unsubscribers = [
      onSnapshot(collection(db, "motorcycles"), (snap) => {
        setMotorcycles(mapDocs<Motorcycle>(snap));
        setReady(true);
      }),
      onSnapshot(collection(db, "customers"), (snap) =>
        setCustomers(mapDocs<Customer>(snap)),
      ),
      onSnapshot(collection(db, "sales"), (snap) =>
        setSales(mapDocs<Sale>(snap)),
      ),
      onSnapshot(collection(db, "financings"), (snap) =>
        setFinancings(mapDocs<Financing>(snap)),
      ),
      onSnapshot(collection(db, "branches"), (snap) =>
        setBranches(mapDocs<Branch>(snap)),
      ),
      onSnapshot(
        query(
          collection(db, "activity_log"),
          orderBy("createdAt", "desc"),
          limit(100),
        ),
        (snap) => setActivityLog(mapDocs<ActivityEvent>(snap)),
      ),
    ];

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, []);

  const data = useMemo<AgencyData>(() => {
    const branchesWithStock = branches.map((branch) => ({
      ...branch,
      stock: motorcycles
        .filter((motorcycle) => motorcycle.branch === branch.name)
        .reduce((total, motorcycle) => total + (motorcycle.stock || 0), 0),
      monthlySales: sales.filter(
        (sale) => sale.branch === branch.name && sale.currency !== "USD",
      ).length,
    }));

    return {
      motorcycles,
      customers,
      sales,
      financings,
      branches: branchesWithStock,
      monthlySales: buildMonthlySales(sales),
      financingBreakdown: buildFinancingBreakdown(financings),
      activityLog,
      lastUpdated: new Date().toISOString(),
    };
  }, [motorcycles, customers, sales, financings, branches, activityLog]);

  const logActivity = useCallback((event: Omit<ActivityEvent, "id">) => {
    return addDoc(collection(db, "activity_log"), event);
  }, []);

  const addCustomer = useCallback((input: CustomerInput) => {
    void addDoc(collection(db, "customers"), {
      ...input,
      joinedAt: today(),
      status: "Nuevo",
      balance: 0,
    });
  }, []);

  const addMotorcycle = useCallback(
    (input: MotorcycleInput) => {
      const now = new Date().toISOString();
      const stock = Number(input.stock || 0);
      void addDoc(collection(db, "motorcycles"), {
        ...input,
        price: Number(input.price || 0),
        currency: input.currency || "ARS",
        cost: Number(input.cost || 0),
        stock,
        status: statusFromStock(stock),
        image: input.image || DEFAULT_MOTORCYCLE_IMAGE,
        updatedAt: now,
      }).then(() =>
        logActivity({
          type: "stock",
          workerName: "Sistema",
          description: `Alta de modelo ${input.brand} ${input.model} con ${stock} unidades.`,
          createdAt: now,
        }),
      );
    },
    [logActivity],
  );

  const adjustMotorcycleStock = useCallback(
    (motorcycleId: string, amount: number, worker?: ActiveWorker) => {
      const target = motorcycles.find((m) => m.id === motorcycleId);
      if (!target || amount === 0) return;
      const now = new Date().toISOString();
      const stock = Math.max(0, target.stock + amount);

      void updateDoc(doc(db, "motorcycles", motorcycleId), {
        stock,
        status: statusFromStock(stock),
        updatedAt: now,
      }).then(() =>
        logActivity({
          type: "stock",
          workerId: worker?.id,
          workerName: worker?.name || "Sistema",
          description: `${amount > 0 ? "Ingreso" : "Egreso"} manual de ${Math.abs(
            amount,
          )} unidad(es) en ${target.brand} ${target.model}.`,
          createdAt: now,
        }),
      );
    },
    [motorcycles, logActivity],
  );

  const receiveMotorcycleStock = useCallback(
    (input: StockReceiptInput) => {
      const target = motorcycles.find((m) => m.id === input.motorcycleId);
      if (!target || input.quantity <= 0) return;
      const now = new Date().toISOString();
      const stock = target.stock + input.quantity;

      const updates: Record<string, unknown> = {
        stock,
        status: statusFromStock(stock),
        updatedAt: now,
      };
      if (typeof input.cost === "number" && input.cost >= 0)
        updates.cost = input.cost;
      if (typeof input.price === "number" && input.price > 0)
        updates.price = input.price;
      if (input.currency) updates.currency = input.currency;
      if (input.image) updates.image = input.image;
      if (input.note) updates.notes = input.note;

      void updateDoc(doc(db, "motorcycles", input.motorcycleId), updates).then(
        () =>
          logActivity({
            type: "stock",
            workerId: input.worker?.id,
            workerName: input.worker?.name || "Sistema",
            description: `Ingreso de ${input.quantity} unidad(es) para ${target.brand} ${target.model}.`,
            amount: input.cost,
            currency: input.currency || target.currency,
            createdAt: now,
          }),
      );
    },
    [motorcycles, logActivity],
  );

  const updateMotorcyclePricing = useCallback(
    (input: MotorcyclePricingInput) => {
      const target = motorcycles.find((m) => m.id === input.motorcycleId);
      if (!target) return;
      const now = new Date().toISOString();

      void updateDoc(doc(db, "motorcycles", input.motorcycleId), {
        price: input.price,
        cost: input.cost,
        currency: input.currency,
        notes: input.note || target.notes || "",
        updatedAt: now,
      }).then(() =>
        logActivity({
          type: "precio",
          workerId: input.worker?.id,
          workerName: input.worker?.name || "Sistema",
          description: `Actualizó precio/costo de ${target.brand} ${target.model}.`,
          amount: input.price,
          currency: input.currency,
          createdAt: now,
        }),
      );
    },
    [motorcycles, logActivity],
  );

  const updateMotorcycle = useCallback(
    (motorcycleId: string, fields: MotorcycleEditInput, worker?: ActiveWorker) => {
      const target = motorcycles.find((m) => m.id === motorcycleId);
      if (!target) return;
      const now = new Date().toISOString();

      const updates: Record<string, unknown> = { updatedAt: now };
      if (fields.brand !== undefined) updates.brand = fields.brand;
      if (fields.model !== undefined) updates.model = fields.model;
      if (fields.category !== undefined) updates.category = fields.category;
      if (fields.currency !== undefined) updates.currency = fields.currency;
      if (fields.image !== undefined) updates.image = fields.image;
      if (fields.notes !== undefined) updates.notes = fields.notes;
      if (fields.cardInstallments !== undefined)
        updates.cardInstallments = fields.cardInstallments;
      if (fields.price !== undefined) updates.price = Number(fields.price) || 0;
      if (fields.cost !== undefined) updates.cost = Number(fields.cost) || 0;
      if (fields.stock !== undefined) {
        const stock = Math.max(0, Number(fields.stock) || 0);
        updates.stock = stock;
        updates.status = statusFromStock(stock);
      }

      void updateDoc(doc(db, "motorcycles", motorcycleId), updates).then(() =>
        logActivity({
          type: "stock",
          workerId: worker?.id,
          workerName: worker?.name || "Sistema",
          description: `Editó la ficha de ${updates.brand || target.brand} ${
            updates.model || target.model
          }.`,
          createdAt: now,
        }),
      );
    },
    [motorcycles, logActivity],
  );

  const deleteMotorcycle = useCallback(
    (motorcycleId: string, worker?: ActiveWorker) => {
      const target = motorcycles.find((m) => m.id === motorcycleId);
      if (!target) return;
      const now = new Date().toISOString();

      void deleteDoc(doc(db, "motorcycles", motorcycleId)).then(() =>
        logActivity({
          type: "stock",
          workerId: worker?.id,
          workerName: worker?.name || "Sistema",
          description: `Eliminó del inventario ${target.brand} ${target.model}.`,
          createdAt: now,
        }),
      );
    },
    [motorcycles, logActivity],
  );

  const registerSale = useCallback(
    (input: SaleInput) => {
      const customer = customers.find((c) => c.id === input.customerId);
      const motorcycle = motorcycles.find((m) => m.id === input.motorcycleId);
      if (!customer || !motorcycle || motorcycle.stock <= 0) return;

      const now = new Date().toISOString();
      const batch = writeBatch(db);
      const saleRef = doc(collection(db, "sales"));

      const sale: Omit<Sale, "id"> = {
        customerId: customer.id,
        customerName: customer.name,
        motorcycleId: motorcycle.id,
        motorcycleModel: `${motorcycle.brand} ${motorcycle.model}`,
        branch: input.branch,
        date: today(),
        price: motorcycle.price,
        currency: motorcycle.currency,
        paymentMethod: input.paymentMethod,
        sellerId: input.sellerId,
        seller: input.seller,
        status: "Confirmada",
      };
      batch.set(saleRef, sale);

      if (input.paymentMethod === "Financiación" && motorcycle.currency === "ARS") {
        const installments = input.installments || 12;
        const cardCuota =
          motorcycle.cardInstallments?.[installments as 3 | 6 | 12 | 18];

        let downPayment: number;
        let financedAmount: number;
        let installmentAmount: number;
        let total: number;

        if (cardCuota) {
          // Plan con tarjeta (precio con recargo, sin entrega).
          downPayment = 0;
          installmentAmount = cardCuota;
          financedAmount = cardCuota * installments;
          total = financedAmount;
        } else {
          // Plan propio: 20% de entrega y el resto en cuotas.
          downPayment = Math.round(motorcycle.price * 0.2);
          financedAmount = motorcycle.price - downPayment;
          installmentAmount = Math.round(financedAmount / installments);
          total = motorcycle.price;
        }

        const financing: Omit<Financing, "id"> = {
          saleId: saleRef.id,
          customerName: customer.name,
          motorcycleModel: `${motorcycle.brand} ${motorcycle.model}`,
          total,
          downPayment,
          financedAmount,
          installments,
          installmentAmount,
          paidInstallments: 0,
          nextDueDate: addDays(30),
          status: "Activa",
          overdueAmount: 0,
        };
        batch.set(doc(collection(db, "financings")), financing);
      }

      const stock = Math.max(0, motorcycle.stock - 1);
      batch.update(doc(db, "motorcycles", motorcycle.id), {
        stock,
        status: statusFromStock(stock),
        updatedAt: now,
      });

      batch.set(doc(collection(db, "activity_log")), {
        type: "venta",
        workerId: input.sellerId,
        workerName: input.seller,
        description: `Vendió ${motorcycle.brand} ${motorcycle.model} a ${customer.name}`,
        amount: motorcycle.price,
        currency: motorcycle.currency,
        createdAt: now,
      });

      void batch.commit();
    },
    [customers, motorcycles],
  );

  const registerPayment = useCallback(
    (financingId: string, worker?: ActiveWorker) => {
      const financing = financings.find((f) => f.id === financingId);
      if (!financing || financing.paidInstallments >= financing.installments)
        return;

      const now = new Date().toISOString();
      const paidInstallments = financing.paidInstallments + 1;
      const isFinished = paidInstallments >= financing.installments;

      void updateDoc(doc(db, "financings", financingId), {
        paidInstallments,
        nextDueDate: isFinished ? financing.nextDueDate : addDays(30),
        status: isFinished ? "Finalizada" : "Activa",
        overdueAmount: 0,
        lastPaymentBy: worker?.name || financing.lastPaymentBy || "",
        lastPaymentAt: now,
      }).then(() =>
        logActivity({
          type: "cobro",
          workerId: worker?.id,
          workerName: worker?.name,
          description: `Registró cuota de ${financing.customerName}`,
          amount: financing.installmentAmount,
          currency: "ARS",
          createdAt: now,
        }),
      );
    },
    [financings, logActivity],
  );

  const resetData = useCallback(() => {
    // Restaura el catálogo base de motos (no toca clientes ni ventas).
    const batch = writeBatch(db);
    for (const motorcycle of demoData.motorcycles) {
      batch.set(doc(db, "motorcycles", motorcycle.id), {
        ...motorcycle,
        stock: 0,
        status: statusFromStock(0),
      });
    }
    void batch.commit();
  }, []);

  const importData = useCallback((input: unknown) => {
    if (!input || typeof input !== "object") return;
    const payload = input as Partial<AgencyData>;
    const batch = writeBatch(db);

    const upsert = (
      name: string,
      rows: { id?: string }[] | undefined,
    ) => {
      if (!Array.isArray(rows)) return;
      for (const row of rows) {
        const ref = row.id
          ? doc(db, name, row.id)
          : doc(collection(db, name));
        batch.set(ref, row);
      }
    };

    upsert("motorcycles", payload.motorcycles);
    upsert("customers", payload.customers);
    upsert("sales", payload.sales);
    upsert("financings", payload.financings);
    void batch.commit();
  }, []);

  const totals = useMemo(() => {
    const salesTotal = data.sales.reduce(
      (total, sale) => total + (sale.currency === "USD" ? 0 : sale.price),
      0,
    );
    const stockTotal = data.motorcycles.reduce(
      (total, motorcycle) => total + motorcycle.stock,
      0,
    );
    const activeFinancings = data.financings.filter(
      (financing) => financing.status !== "Finalizada",
    ).length;
    const overdueTotal = data.financings.reduce(
      (total, financing) => total + financing.overdueAmount,
      0,
    );
    const stockValueArs = data.motorcycles.reduce(
      (total, motorcycle) =>
        total +
        (motorcycle.currency === "USD"
          ? 0
          : motorcycle.price * motorcycle.stock),
      0,
    );
    const stockValueUsd = data.motorcycles.reduce(
      (total, motorcycle) =>
        total +
        (motorcycle.currency === "USD"
          ? motorcycle.price * motorcycle.stock
          : 0),
      0,
    );

    return {
      salesTotal,
      stockTotal,
      stockValueArs,
      stockValueUsd,
      activeFinancings,
      overdueTotal,
      customersTotal: data.customers.length,
    };
  }, [data]);

  return {
    data,
    ready,
    totals,
    addCustomer,
    addMotorcycle,
    adjustMotorcycleStock,
    receiveMotorcycleStock,
    updateMotorcyclePricing,
    updateMotorcycle,
    deleteMotorcycle,
    registerSale,
    registerPayment,
    resetData,
    importData,
  };
}
