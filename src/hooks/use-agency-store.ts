"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { demoData } from "@/lib/demo-data";
import type {
  ActiveWorker,
  AgencyData,
  Currency,
  Customer,
  Motorcycle,
  MotorcycleStatus,
  PaymentMethod,
  Sale,
} from "@/lib/types";

const STORAGE_KEY = "re-motos-agency-data-v1";
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

type SaleInput = {
  customerId: string;
  motorcycleId: string;
  branch: string;
  paymentMethod: PaymentMethod;
  seller: string;
  sellerId?: string;
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

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

function isRecord(value: unknown): value is Partial<AgencyData> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeMotorcycle(motorcycle: Motorcycle): Motorcycle {
  const stock = Number(motorcycle.stock || 0);

  return {
    ...motorcycle,
    price: Number(motorcycle.price || 0),
    currency: motorcycle.currency || "ARS",
    cost: Number(motorcycle.cost || 0),
    stock,
    status: motorcycle.status || statusFromStock(stock),
    image: motorcycle.image || DEFAULT_MOTORCYCLE_IMAGE,
  };
}

function withSyncedBranchStock(data: AgencyData): AgencyData {
  return {
    ...data,
    branches: data.branches.map((branch) => ({
      ...branch,
      stock: data.motorcycles
        .filter((motorcycle) => motorcycle.branch === branch.name)
        .reduce((total, motorcycle) => total + motorcycle.stock, 0),
    })),
  };
}

function normalizeAgencyData(input: unknown): AgencyData {
  const candidate = isRecord(input) ? input : {};

  const normalizedData = {
    ...demoData,
    ...candidate,
    motorcycles: Array.isArray(candidate.motorcycles)
      ? candidate.motorcycles.map((motorcycle) =>
          normalizeMotorcycle(motorcycle as Motorcycle),
        )
      : demoData.motorcycles,
    customers: Array.isArray(candidate.customers)
      ? candidate.customers
      : demoData.customers,
    sales: Array.isArray(candidate.sales) ? candidate.sales : demoData.sales,
    financings: Array.isArray(candidate.financings)
      ? candidate.financings
      : demoData.financings,
    branches: Array.isArray(candidate.branches)
      ? candidate.branches
      : demoData.branches,
    monthlySales: Array.isArray(candidate.monthlySales)
      ? candidate.monthlySales
      : demoData.monthlySales,
    financingBreakdown:
      Array.isArray(candidate.financingBreakdown)
        ? candidate.financingBreakdown
        : demoData.financingBreakdown,
    activityLog: Array.isArray(candidate.activityLog)
      ? candidate.activityLog
      : demoData.activityLog,
    lastUpdated:
      typeof candidate.lastUpdated === "string"
        ? candidate.lastUpdated
        : new Date().toISOString(),
  };

  return withSyncedBranchStock(normalizedData);
}

function readStoredData() {
  if (typeof window === "undefined") return demoData;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return demoData;

  try {
    return normalizeAgencyData(JSON.parse(stored));
  } catch {
    return demoData;
  }
}

function activityId() {
  return makeId("act");
}

export function useAgencyStore() {
  const [data, setData] = useState<AgencyData>(demoData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setData(readStoredData());
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, ready]);

  const addCustomer = useCallback((input: CustomerInput) => {
    setData((currentData) => ({
      ...currentData,
      customers: [
        {
          id: makeId("cli"),
          ...input,
          joinedAt: today(),
          status: "Nuevo",
          balance: 0,
        },
        ...currentData.customers,
      ],
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const addMotorcycle = useCallback((input: MotorcycleInput) => {
    setData((currentData) => {
      const now = new Date().toISOString();
      const motorcycle: Motorcycle = {
        id: makeId("moto"),
        ...input,
        price: Number(input.price || 0),
        currency: input.currency || "ARS",
        cost: Number(input.cost || 0),
        stock: Number(input.stock || 0),
        status: statusFromStock(Number(input.stock)),
        image: input.image || DEFAULT_MOTORCYCLE_IMAGE,
        updatedAt: now,
      };

      return withSyncedBranchStock({
        ...currentData,
        motorcycles: [motorcycle, ...currentData.motorcycles],
        activityLog: [
          {
            id: activityId(),
            type: "stock",
            workerName: "Sistema",
            description: `Alta de modelo ${motorcycle.brand} ${motorcycle.model} con ${motorcycle.stock} unidades.`,
            createdAt: now,
          },
          ...currentData.activityLog,
        ],
        lastUpdated: now,
      });
    });
  }, []);

  const adjustMotorcycleStock = useCallback(
    (motorcycleId: string, amount: number, worker?: ActiveWorker) => {
      setData((currentData) => {
        const now = new Date().toISOString();
        const target = currentData.motorcycles.find(
          (motorcycle) => motorcycle.id === motorcycleId,
        );
        if (!target || amount === 0) return currentData;

        const motorcycles = currentData.motorcycles.map((motorcycle) => {
          if (motorcycle.id !== motorcycleId) return motorcycle;
          const stock = Math.max(0, motorcycle.stock + amount);
          return {
            ...motorcycle,
            stock,
            status: statusFromStock(stock),
            updatedAt: now,
          };
        });

        return withSyncedBranchStock({
          ...currentData,
          motorcycles,
          activityLog: [
            {
              id: activityId(),
              type: "stock",
              workerId: worker?.id,
              workerName: worker?.name || "Sistema",
              description: `${amount > 0 ? "Ingreso" : "Egreso"} manual de ${Math.abs(
                amount,
              )} unidad(es) en ${target.brand} ${target.model}.`,
              createdAt: now,
            },
            ...currentData.activityLog,
          ],
          lastUpdated: now,
        });
      });
    },
    [],
  );

  const receiveMotorcycleStock = useCallback((input: StockReceiptInput) => {
    setData((currentData) => {
      const now = new Date().toISOString();
      const target = currentData.motorcycles.find(
        (motorcycle) => motorcycle.id === input.motorcycleId,
      );
      if (!target || input.quantity <= 0) return currentData;

      const motorcycles = currentData.motorcycles.map((motorcycle) => {
        if (motorcycle.id !== input.motorcycleId) return motorcycle;
        const stock = motorcycle.stock + input.quantity;
        return {
          ...motorcycle,
          stock,
          cost:
            typeof input.cost === "number" && input.cost >= 0
              ? input.cost
              : motorcycle.cost,
          price:
            typeof input.price === "number" && input.price > 0
              ? input.price
              : motorcycle.price,
          currency: input.currency || motorcycle.currency,
          image: input.image || motorcycle.image,
          status: statusFromStock(stock),
          notes: input.note || motorcycle.notes,
          updatedAt: now,
        };
      });

      return withSyncedBranchStock({
        ...currentData,
        motorcycles,
        activityLog: [
          {
            id: activityId(),
            type: "stock",
            workerId: input.worker?.id,
            workerName: input.worker?.name || "Sistema",
            description: `Ingreso de ${input.quantity} unidad(es) para ${target.brand} ${target.model}.`,
            amount: input.cost,
            currency: input.currency || target.currency,
            createdAt: now,
          },
          ...currentData.activityLog,
        ],
        lastUpdated: now,
      });
    });
  }, []);

  const updateMotorcyclePricing = useCallback((input: MotorcyclePricingInput) => {
    setData((currentData) => {
      const now = new Date().toISOString();
      const target = currentData.motorcycles.find(
        (motorcycle) => motorcycle.id === input.motorcycleId,
      );
      if (!target) return currentData;

      return {
        ...currentData,
        motorcycles: currentData.motorcycles.map((motorcycle) =>
          motorcycle.id === input.motorcycleId
            ? {
                ...motorcycle,
                price: input.price,
                cost: input.cost,
                currency: input.currency,
                notes: input.note || motorcycle.notes,
                updatedAt: now,
              }
            : motorcycle,
        ),
        activityLog: [
          {
            id: activityId(),
            type: "precio",
            workerId: input.worker?.id,
            workerName: input.worker?.name || "Sistema",
            description: `Actualizo precio/costo de ${target.brand} ${target.model}.`,
            amount: input.price,
            currency: input.currency,
            createdAt: now,
          },
          ...currentData.activityLog,
        ],
        lastUpdated: now,
      };
    });
  }, []);

  const registerSale = useCallback((input: SaleInput) => {
    setData((currentData) => {
      const customer = currentData.customers.find(
        (candidate) => candidate.id === input.customerId,
      );
      const motorcycle = currentData.motorcycles.find(
        (candidate) => candidate.id === input.motorcycleId,
      );

      if (!customer || !motorcycle || motorcycle.stock <= 0) return currentData;

      const saleId = makeId("ven");
      const sale: Sale = {
        id: saleId,
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

      const downPayment = Math.round(motorcycle.price * 0.2);
      const financedAmount = motorcycle.price - downPayment;
      const installmentAmount = Math.round(financedAmount / 12);
      const financing =
        input.paymentMethod === "Financiación" && motorcycle.currency === "ARS"
          ? [
              {
                id: makeId("fin"),
                saleId,
                customerName: customer.name,
                motorcycleModel: `${motorcycle.brand} ${motorcycle.model}`,
                total: motorcycle.price,
                downPayment,
                financedAmount,
                installments: 12,
                installmentAmount,
                paidInstallments: 0,
                nextDueDate: addDays(30),
                status: "Activa" as const,
                overdueAmount: 0,
              },
            ]
          : [];

      const motorcycles = currentData.motorcycles.map((candidate) => {
        if (candidate.id !== motorcycle.id) return candidate;
        const stock = Math.max(0, candidate.stock - 1);
        return {
          ...candidate,
          stock,
          status: statusFromStock(stock),
          updatedAt: new Date().toISOString(),
        };
      });

      return withSyncedBranchStock({
        ...currentData,
        motorcycles,
        sales: [sale, ...currentData.sales],
        financings: [...financing, ...currentData.financings],
        activityLog: [
          {
            id: activityId(),
            type: "venta",
            workerId: input.sellerId,
            workerName: input.seller,
            description: `Vendió ${motorcycle.brand} ${motorcycle.model} a ${customer.name}`,
            amount: motorcycle.price,
            currency: motorcycle.currency,
            createdAt: new Date().toISOString(),
          },
          ...currentData.activityLog,
        ],
        lastUpdated: new Date().toISOString(),
      });
    });
  }, []);

  const registerPayment = useCallback((financingId: string, worker?: ActiveWorker) => {
    setData((currentData) => ({
      ...currentData,
      financings: currentData.financings.map((financing) => {
        if (
          financing.id !== financingId ||
          financing.paidInstallments >= financing.installments
        ) {
          return financing;
        }

        const paidInstallments = financing.paidInstallments + 1;
        const isFinished = paidInstallments >= financing.installments;

        return {
          ...financing,
          paidInstallments,
          nextDueDate: isFinished ? financing.nextDueDate : addDays(30),
          status: isFinished ? "Finalizada" : "Activa",
          overdueAmount: 0,
          lastPaymentBy: worker?.name || financing.lastPaymentBy,
          lastPaymentAt: new Date().toISOString(),
        };
      }),
      activityLog: [
        ...currentData.financings
          .filter(
            (financing) =>
              financing.id === financingId &&
              financing.paidInstallments < financing.installments,
          )
          .map((financing) => ({
            id: activityId(),
            type: "cobro" as const,
            workerId: worker?.id,
            workerName: worker?.name,
            description: `Registró cuota de ${financing.customerName}`,
            amount: financing.installmentAmount,
            currency: "ARS" as const,
            createdAt: new Date().toISOString(),
          })),
        ...currentData.activityLog,
      ],
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const resetData = useCallback(() => {
    setData(demoData);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const importData = useCallback((input: unknown) => {
    const importedData = normalizeAgencyData(input);

    setData({
      ...importedData,
      lastUpdated: new Date().toISOString(),
    });
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
        (motorcycle.currency === "USD" ? 0 : motorcycle.price * motorcycle.stock),
      0,
    );
    const stockValueUsd = data.motorcycles.reduce(
      (total, motorcycle) =>
        total +
        (motorcycle.currency === "USD" ? motorcycle.price * motorcycle.stock : 0),
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
    registerSale,
    registerPayment,
    resetData,
    importData,
  };
}
