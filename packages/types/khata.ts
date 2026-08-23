/**
 * Type definitions for Khata (neighborhood credit ledger) feature
 */
export interface KhataEntry {
  id: string;
  shopId: string;
  customerId: string;
  amount: number;
  date: string;
  type: 'purchase' | 'repayment';
  status: 'pending' | 'approved' | 'rejected';
  description?: string;
}

export interface LinkedShop {
  id: string;
  name: string;
  ownerId: string;
  khataBalance: number;
  lastActivity: string;
  phoneNumber: string;
  address?: string;
}

export interface KhataRequest {
  id: string;
  shopId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export interface KhataSummary {
  totalBalance: number;
  shopsCount: number;
  recentActivity: KhataEntry[];
  pendingRequests: number;
}

export interface LogPurchaseInput {
  shopId: string;
  customerId: string;
  amount: number;
  description?: string;
  date?: string;
}

export interface LogRepaymentInput {
  shopId: string;
  customerId: string;
  amount: number;
  description?: string;
  date?: string;
  paymentMethod?: 'cash' | 'upi' | 'bank_transfer';
}