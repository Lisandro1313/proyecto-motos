export type MotorcycleStatus =
  | "Disponible"
  | "Pocas unidades"
  | "Últimas unidades"
  | "Reservada"
  | "Sin stock";

export type CustomerStatus = "Activo" | "Al día" | "Mora" | "Nuevo";

export type PaymentMethod =
  | "Contado"
  | "Transferencia"
  | "Tarjeta"
  | "Financiación";

export type SaleStatus = "Confirmada" | "Pendiente" | "Cancelada";

export type FinancingStatus = "Activa" | "En mora" | "Finalizada";

export type Motorcycle = {
  id: string;
  brand: string;
  model: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  branch: string;
  status: MotorcycleStatus;
  image: string;
};

export type Customer = {
  id: string;
  name: string;
  dni: string;
  phone: string;
  email: string;
  city: string;
  joinedAt: string;
  status: CustomerStatus;
  balance: number;
  nextDueDate?: string;
};

export type Sale = {
  id: string;
  customerId: string;
  customerName: string;
  motorcycleId: string;
  motorcycleModel: string;
  branch: string;
  date: string;
  price: number;
  paymentMethod: PaymentMethod;
  seller: string;
  status: SaleStatus;
};

export type Financing = {
  id: string;
  saleId: string;
  customerName: string;
  motorcycleModel: string;
  total: number;
  downPayment: number;
  financedAmount: number;
  installments: number;
  installmentAmount: number;
  paidInstallments: number;
  nextDueDate: string;
  status: FinancingStatus;
  overdueAmount: number;
};

export type Branch = {
  id: string;
  name: string;
  city: string;
  address: string;
  manager: string;
  stock: number;
  monthlySales: number;
  todaySales: number;
};

export type MonthlySale = {
  month: string;
  total: number;
};

export type FinancingBreakdown = {
  label: string;
  count: number;
  color: string;
};

export type AgencyData = {
  motorcycles: Motorcycle[];
  customers: Customer[];
  sales: Sale[];
  financings: Financing[];
  branches: Branch[];
  monthlySales: MonthlySale[];
  financingBreakdown: FinancingBreakdown[];
  lastUpdated: string;
};
