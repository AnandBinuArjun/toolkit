"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { FileText, Printer, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface InvoiceItem {
  id: string;
  desc: string;
  qty: number;
  price: number;
}


export default function InvoiceCreator() {
  const [from, setFrom] = useState("Your Company Name\n123 Business Rd.\nCity, State, ZIP\nemail@example.com");
  const [to, setTo] = useState("Client Name\nClient Address\nClient City\nclient@example.com");
  const [invoiceNo, setInvoiceNo] = useState("INV-001");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("$");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", desc: "Web Development Services", qty: 1, price: 1500 },
  ]);

  const handlePrint = () => {
    window.print();
  };

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), desc: "", qty: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const total = items.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-printable, #invoice-printable * {
            visibility: visible;
          }
          #invoice-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 2rem;
          }
          .print-hidden {
            display: none !important;
          }
        }
      `}</style>
      
      <ToolLayout id="invoice-creator" name="Invoice Creator" description="Build a professional invoice and export it to PDF using your browser's print dialog.">
        <div className="flex justify-end mb-6 print-hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-accent-primary/20 text-accent-primary border border-accent-primary px-4 py-2 rounded-lg hover:bg-accent-primary hover:text-black transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>

        {/* Builder UI */}
        <div className="bg-bg-panel border border-border-line rounded-xl p-6 lg:p-10 mb-8 print-hidden overflow-hidden">
           <h3 className="text-xl font-bold mb-6 border-b border-border-line pb-4">Invoice Details</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
             <div>
                <label className="block text-xs font-sans font-medium text-text-muted mb-2 uppercase">From</label>
                <Textarea 
                  className="w-full bg-bg-panel border border-border-line rounded-lg p-3 text-sm h-32 outline-none focus:border-accent-primary"
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                />
             </div>
             <div>
                <label className="block text-xs font-sans font-medium text-text-muted mb-2 uppercase">To</label>
                <Textarea 
                  className="w-full bg-bg-panel border border-border-line rounded-lg p-3 text-sm h-32 outline-none focus:border-accent-primary"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                />
             </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-b border-border-line pb-8">
             <div>
                <label className="block text-xs font-sans font-medium text-text-muted mb-2 uppercase">Invoice No</label>
                <Input 
                  type="text"
                  className="w-full bg-bg-panel border border-border-line rounded-lg p-3 text-sm outline-none focus:border-accent-primary"
                  value={invoiceNo}
                  onChange={e => setInvoiceNo(e.target.value)}
                />
             </div>
             <div>
                <label className="block text-xs font-sans font-medium text-text-muted mb-2 uppercase">Date</label>
                <Input 
                  type="date"
                  className="w-full bg-bg-panel border border-border-line rounded-lg p-3 text-sm outline-none focus:border-accent-primary"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
             </div>
             <div>
                <label className="block text-xs font-sans font-medium text-text-muted mb-2 uppercase">Due Date (Optional)</label>
                <Input 
                  type="date"
                  className="w-full bg-bg-panel border border-border-line rounded-lg p-3 text-sm outline-none focus:border-accent-primary"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
             </div>
           </div>

           <div className="mb-8">
             <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-lg">Line Items</h4>
                <div className="flex items-center gap-2">
                   <label className="text-xs text-text-muted font-mono uppercase">Currency</label>
                   <Input 
                      type="text" 
                      className="bg-bg-panel border border-border-line rounded-lg p-1 w-12 text-center text-sm outline-none" 
                      value={currency} 
                      onChange={e => setCurrency(e.target.value)} 
                   />
                </div>
             </div>
             
             <div className="space-y-3">
               {items.map(item => (
                 <div key={item.id} className="flex flex-wrap md:flex-nowrap gap-3 items-start">
                   <Input 
                     type="text"
                     placeholder="Description"
                     className="flex-1 min-w-[200px] bg-bg-panel border border-border-line rounded-lg p-3 text-sm outline-none focus:border-accent-primary"
                     value={item.desc}
                     onChange={e => updateItem(item.id, "desc", e.target.value)}
                   />
                   <Input 
                     type="number"
                     placeholder="Qty"
                     className="w-24 bg-bg-panel border border-border-line rounded-lg p-3 text-sm outline-none focus:border-accent-primary"
                     value={item.qty}
                     min={1}
                     onChange={e => updateItem(item.id, "qty", parseFloat(e.target.value) || 0)}
                   />
                   <Input 
                     type="number"
                     placeholder="Price"
                     className="w-32 bg-bg-panel border border-border-line rounded-lg p-3 text-sm outline-none focus:border-accent-primary"
                     value={item.price}
                     min={0}
                     onChange={e => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                   />
                   <div className="w-24 p-3 text-sm font-mono text-right border border-transparent">
                      {currency}{(item.qty * item.price).toFixed(2)}
                   </div>
                   <button 
                     onClick={() => removeItem(item.id)}
                     className="p-3 text-accent-danger hover:bg-accent-danger/10 rounded-lg transition-colors border border-transparent"
                     title="Remove Item"
                   >
                     <Trash2 className="w-5 h-5" />
                   </button>
                 </div>
               ))}
             </div>
             <button 
               onClick={addItem}
               className="mt-4 flex items-center gap-2 text-sm text-accent-primary hover:text-white transition-colors"
             >
               <Plus className="w-4 h-4" /> Add Item
             </button>
           </div>
        </div>

        {/* Printable View */}
        <div id="invoice-printable" className="bg-white text-black p-10 min-h-[800px] shadow-lg rounded-none print:shadow-none print:p-0">
           <div className="flex justify-between items-start mb-12">
             <div className="whitespace-pre-line text-sm text-gray-700">
               <strong className="text-xl text-black block mb-2 font-sans">{from.split('\n')[0]}</strong>
               {from.substring(from.indexOf('\n') + 1)}
             </div>
             <div className="text-right">
               <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-wide">Invoice</h1>
               <div className="text-gray-500 font-mono text-sm mb-4">{invoiceNo}</div>
               <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                 <div className="text-gray-500 text-left font-medium">Date:</div>
                 <div className="text-right">{date}</div>
                 {dueDate && (
                   <>
                    <div className="text-gray-500 text-left font-medium">Due Date:</div>
                    <div className="text-right">{dueDate}</div>
                   </>
                 )}
               </div>
             </div>
           </div>

           <div className="mb-12">
             <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 border-b border-gray-200 pb-2">Bill To</h3>
             <div className="whitespace-pre-line text-sm text-gray-800">
               <strong className="text-base text-black block">{to.split('\n')[0]}</strong>
               {to.substring(to.indexOf('\n') + 1)}
             </div>
           </div>

           <table className="w-full text-left mb-12 border-collapse">
             <thead>
               <tr className="border-b-2 border-gray-900 text-xs font-bold uppercase tracking-wider text-gray-500">
                 <th className="py-3 px-2">Description</th>
                 <th className="py-3 px-2 text-right">Qty</th>
                 <th className="py-3 px-2 text-right">Price</th>
                 <th className="py-3 px-2 text-right">Total</th>
               </tr>
             </thead>
             <tbody>
               {items.map((item, i) => (
                 <tr key={item.id} className="border-b border-gray-200 text-sm">
                   <td className="py-4 px-2 text-gray-800">{item.desc || "Item Description"}</td>
                   <td className="py-4 px-2 text-right text-gray-600">{item.qty}</td>
                   <td className="py-4 px-2 text-right text-gray-600">{currency}{item.price.toFixed(2)}</td>
                   <td className="py-4 px-2 text-right font-medium text-gray-900">{currency}{(item.qty * item.price).toFixed(2)}</td>
                 </tr>
               ))}
             </tbody>
           </table>

           <div className="flex justify-end">
             <div className="w-64">
               <div className="flex justify-between py-3 border-t-2 border-gray-900">
                 <span className="font-bold text-gray-900">Total Due</span>
                 <span className="font-bold text-xl text-gray-900">{currency}{total.toFixed(2)}</span>
               </div>
             </div>
           </div>
        </div>
      </ToolLayout>
    </>
  );
}