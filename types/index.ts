export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt?: Date;
  currency?: string;
  monthlyBudget?: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  description?: string;
  userId: string;
  receiptImage?: string;
  createdAt: Date;
  updatedAt: Date;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  tags?: string[];
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
  userId?: string; // For user-specific categories
  budget?: number;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  spent?: number;
  remaining?: number;
}

export type BudgetPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface FinancialReport {
  totalExpenses: number;
  totalIncome: number;
  netAmount: number;
  period: string;
  categoryBreakdown: CategoryBreakdown[];
  trend: TrendData[];
}

export interface CategoryBreakdown {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  count: number;
}

export interface TrendData {
  date: Date;
  amount: number;
  category: string;
}

export interface AppSettings {
  currency: string;
  dateFormat: string;
  theme: 'light' | 'dark' | 'auto';
  notificationEnabled: boolean;
  budgetAlerts: boolean;
  monthlyBudget?: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

export interface ExpenseFormData {
  title: string;
  amount: string;
  category: string;
  date: Date;
  description: string;
  receiptImage?: string;
}

// Utility Types
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type Require<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;