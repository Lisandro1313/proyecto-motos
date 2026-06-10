"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { demoData } from "@/lib/demo-data";
import type {
  ActiveWorker,
  AgencyData,
  Customer,
  Motorcycle,
  MotorcycleStatus,
  PaymentMethod,
  Sale,
} from "@/lib/types";

const STORAGE_KEY = "motocenter-agency-data-v1";

type CustomerInput = Pick<
  Customer,
  "name" | "dni" | "phone" | "email" | "city"
>;

type MotorcycleInput = Pick<
  Motorcycle,
  "brand" | "model" | "category" | "price" | "cost" | "stock" | "branch"
> & {
  image?: string;
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

function readStoredData() {
  if (typeof window === "undefined") return demoData;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return demoData;

  try {
    const parsed = JSON.parse(stored) as Partial<AgencyData>;
    return {
      ...demoData,
      ...parsed,
      motorcycles: parsed.motorcycles || demoData.motorcycles,
      customers: parsed.customers || demoData.customers,
      sales: parsed.sales || demoData.sales,
      financings: parsed.financings || demoData.financings,
      branches: parsed.branches || demoData.branches,
      monthlySales: parsed.monthlySales || demoData.monthlySales,
      financingBreakdown:
        parsed.financingBreakdown || demoData.financingBreakdown,
      activityLog: parsed.activityLog || demoData.activityLog,
      lastUpdated: parsed.lastUpdated || demoData.lastUpdated,
    } as AgencyData;
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
    setData((currentData) => ({
      ...currentData,
      motorcycles: [
        {
          id: makeId("moto"),
          ...input,
          status: statusFromStock(Number(input.stock)),
          image:
            input.image ||
            "https://images.unsplash.com/photo-1558980394-4c7c9299fe96?auto=format&fit=crop&w=900&q=80",
        },
        ...currentData.motorcycles,
      ],
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const adjustMotorcycleStock = useCallback(
    (motorcycleId: string, amount: number) => {
      setData((currentData) => ({
        ...currentData,
        motorcycles: currentData.motorcycles.map((motorcycle) => {
          if (motorcycle.id !== motorcycleId) return motorcycle;
          const stock = Math.max(0, motorcycle.stock + amount);
          return {
            ...motorcycle,
            stock,
            status: statusFromStock(stock),
          };
        }),
        lastUpdated: new Date().toISOString(),
      }));
    },
    [],
  );

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
        paymentMethod: input.paymentMethod,
        sellerId: input.sellerId,
        seller: input.seller,
        status: "Confirmada",
      };

      const downPayment = Math.round(motorcycle.price * 0.2);
      const financedAmount = motorcycle.price - downPayment;
      const installmentAmount = Math.round(financedAmount / 12);
      const financing =
        input.paymentMethod === "Financiación"
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
        };
      });

      return {
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
            createdAt: new Date().toISOString(),
          },
          ...currentData.activityLog,
        ],
        lastUpdated: new Date().toISOString(),
      };
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

  const totals = useMemo(() => {
    const salesTotal = data.sales.reduce((total, sale) => total + sale.price, 0);
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

    return {
      salesTotal,
      stockTotal,
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
    registerSale,
    registerPayment,
    resetData,
  };
}
