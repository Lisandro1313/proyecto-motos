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

export type WorkerRole =
  | "Gerencia"
  | "Ventas"
  | "Caja"
  | "Administración"
  | "Taller";

export type Currency = "ARS" | "USD";

export type WorkerProfile = {
  id: string;
  name: string;
  role: WorkerRole;
  pin: string;
  branch: string;
  color: string;
  photo?: string;
  active: boolean;
};

export type ActiveWorker = Omit<WorkerProfile, "pin"> & {
  startedAt: string;
};

export type ActivityType =
  | "venta"
  | "cobro"
  | "stock"
  | "cliente"
  | "precio"
  | "perfil";

export type ActivityEvent = {
  id: string;
  type: ActivityType;
  workerId?: string;
  workerName?: string;
  description: string;
  amount?: number;
  currency?: Currency;
  createdAt: string;
};

export type Motorcycle = {
  id: string;
  brand: string;
  model: string;
  category: string;
  price: number;
  currency: Currency;
  cost: number;
  stock: number;
  branch: string;
  status: MotorcycleStatus;
  image: string;
  cardInstallments?: Partial<Record<3 | 6 | 12 | 18, number>>;
  updatedAt?: string;
  notes?: string;
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
  currency?: Currency;
  paymentMethod: PaymentMethod;
  sellerId?: string;
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
  lastPaymentBy?: string;
  lastPaymentAt?: string;
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
  activityLog: ActivityEvent[];
  lastUpdated: string;
};
