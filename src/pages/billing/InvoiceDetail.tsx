import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Download, DollarSign } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import AuditBadge from '../../components/AuditBadge';
import Modal from '../../components/Modal';
import RBACGuard from '../../components/RBACGuard';
import { useInvoice, usePayments, useRecordPayment } from '../../hooks/useBilling';

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentReference, setPaymentReference] = useState('');

  const { data: invoice, isLoading } = useInvoice(id!);
  const { data: payments } = usePayments(id!);
  const recordPayment = useRecordPayment();

  const handleRecordPayment = async () => {
    if (!invoice) return;

    await recordPayment.mutateAsync({
      invoiceId: invoice.id,
      amount: parseFloat(paymentAmount),
      method: paymentMethod,
      reference: paymentReference,
      date: new Date().toISOString(),
      processedBy: 'current-user@hospital.com',
    });

    setShowPaymentModal(false);
    setPaymentAmount('');
    setPaymentReference('');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Invoice not found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <RBACGuard allowedRoles={['admin', 'manager']}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/billing/invoices')}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Invoice {invoice.invoiceNumber}</h1>
            <p className="mt-1 text-gray-600">Patient: {invoice.patientName}</p>
          </div>
          <AuditBadge action="Invoice Viewed" variant="compact" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Invoice Details</h2>
                  <p className="text-sm text-gray-600">Invoice Date: {new Date(invoice.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">${item.unitPrice.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                          ${item.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        Subtotal:
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        ${invoice.amount.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-right text-sm font-medium text-green-600">
                        Paid:
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-green-600">
                        -${invoice.amountPaid.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-right text-lg font-bold text-gray-900">
                        Balance Due:
                      </td>
                      <td className="px-4 py-3 text-right text-lg font-bold text-gray-900">
                        ${invoice.balance.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {payments && payments.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">${payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">
                          {payment.method.replace('_', ' ')} • {new Date(payment.date).toLocaleDateString()}
                        </p>
                        {payment.reference && (
                          <p className="text-xs text-gray-500">Ref: {payment.reference}</p>
                        )}
                      </div>
                      <AuditBadge action="Payment Recorded" variant="compact" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {invoice.balance > 0 && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                Record Payment
              </button>
            )}
            <button className="btn btn-secondary w-full flex items-center justify-center gap-2">
              <Download size={20} />
              Download Invoice
            </button>
          </div>
        </div>

        <Modal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          title="Record Payment"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign size={20} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  max={invoice.balance}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0.00"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Maximum: ${invoice.balance.toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="card">Credit/Debit Card</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="insurance">Insurance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Number
              </label>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Transaction reference"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                className="btn btn-primary flex-1"
              >
                Record Payment
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </RBACGuard>
  );
}
