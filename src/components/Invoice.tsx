import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';
import type { Order } from '../types';

interface InvoiceProps {
    order: Order;
}

const InvoiceContent = ({ order }: { order: Order }) => {
    return (
        <div className="p-8 bg-white text-black font-sans max-w-3xl mx-auto" id={`invoice-${order.id}`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-8 border-b-2 border-emerald-900 pb-6">
                <div>
                    <h1 className="text-4xl font-black text-emerald-900 mb-2 font-serif">HINDSOLF PHARMA</h1>
                    <p className="text-sm text-gray-600">Pure. Potent. 100% Ayurvedic.</p>
                    <p className="text-sm mt-2 text-gray-500 max-w-xs">
                        123, Wellness Street, Himalaya Foothills,<br />
                        Uttarakhand, India - 248001<br />
                        GSTIN: 05ABCDE1234F1Z5
                    </p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Invoice</h2>
                    <div className="text-sm">
                        <p className="font-bold text-gray-800">Invoice #: <span className="font-mono font-normal">INV-{order.id.slice(0, 6).toUpperCase()}</span></p>
                        <p className="font-bold text-gray-800 mt-1">Date: <span className="font-mono font-normal">{order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : new Date().toLocaleDateString()}</span></p>
                    </div>
                </div>
            </div>

            {/* Bill To */}
            <div className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Bill To</h3>
                <p className="font-bold text-lg text-gray-900">{order.customer?.name || 'Valued Customer'}</p>
                <p className="text-gray-600 whitespace-pre-line mt-1">
                    {order.customer?.address || 'Address not provided'}<br />
                    {order.customer?.city ? `${order.customer.city}, ` : ''}
                    {order.customer?.pincode}
                </p>
                <p className="text-gray-600 mt-2">Phone: {order.customer?.phone || 'N/A'}</p>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8">
                <thead>
                    <tr className="border-b-2 border-gray-100">
                        <th className="text-left py-3 font-bold text-xs text-gray-400 uppercase tracking-wider">Item</th>
                        <th className="text-center py-3 font-bold text-xs text-gray-400 uppercase tracking-wider">Qty</th>
                        <th className="text-right py-3 font-bold text-xs text-gray-400 uppercase tracking-wider">Price</th>
                        <th className="text-right py-3 font-bold text-xs text-gray-400 uppercase tracking-wider">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items?.map((item, index: number) => (
                        <tr key={index} className="border-b border-gray-50">
                            <td className="py-4">
                                <p className="font-bold text-gray-800">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.category}</p>
                            </td>
                            <td className="text-center py-4 text-gray-600">{item.quantity}</td>
                            <td className="text-right py-4 text-gray-600">₹{item.price}</td>
                            <td className="text-right py-4 font-medium text-gray-900">₹{item.price * item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">₹{order.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium text-emerald-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-xl font-black border-t-2 border-emerald-900 pt-3 mt-3 text-emerald-900">
                        <span>Total</span>
                        <span>₹{order.total}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-400 pt-8 border-t border-gray-100">
                <p className="mb-2">Thank you for choosing Ayurveda. Get well soon!</p>
                <p>For support, email us at support@hindsole.com</p>
            </div>
        </div>
    );
};

export const InvoiceButton = ({ order }: InvoiceProps) => {
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef, // Updated for newer react-to-print versions or fallback to old api if needed
        // NOTE: If using v3+, structure is different. Assuming v2 standard here or handling appropriately.
        // For standard refs: content: () => componentRef.current
        // @ts-expect-error Library type mismatch
        content: () => componentRef.current,
    });

    return (
        <>
            <div style={{ display: 'none' }}>
                <div ref={componentRef}>
                    <InvoiceContent order={order} />
                </div>
            </div>
            <button
                onClick={() => handlePrint()}
                className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
            >
                <Printer size={16} /> Invoice
            </button>
        </>
    );
};
