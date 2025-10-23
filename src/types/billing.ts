export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  amountPaid: number;
  balance: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  insuranceClaimId?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'insurance' | 'check' | 'bank_transfer';
  reference?: string;
  notes?: string;
  processedBy: string;
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  patientId: string;
  patientName: string;
  insuranceProvider: string;
  policyNumber: string;
  dateOfService: string;
  submissionDate: string;
  claimAmount: number;
  approvedAmount: number;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'denied' | 'appealed';
  diagnoisCodes: string[];
  procedureCodes: string[];
  notes?: string;
  denialReason?: string;
}

export interface BillingStats {
  totalRevenue: number;
  revenueChange: number;
  outstandingBalance: number;
  balanceChange: number;
  claimsProcessed: number;
  claimsChange: number;
  averageClaimTime: number;
  timeChange: number;
}
