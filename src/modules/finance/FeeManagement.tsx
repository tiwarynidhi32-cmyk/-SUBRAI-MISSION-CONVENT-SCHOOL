import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  Share2, 
  Coins, 
  Wallet, 
  Receipt, 
  ArrowRightLeft, 
  CheckCircle2, 
  AlertCircle,
  X,
  Eye,
  FileEdit,
  ClipboardList,
  BookOpen,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Student, FeeType, FeeMaster, FeeTransaction } from '../../types';

interface FeeManagementProps {
  students: Student[];
  feeTypes: FeeType[];
  setFeeTypes: (feeTypes: FeeType[]) => void;
  feeMaster: FeeMaster[];
  setFeeMaster: (feeMaster: FeeMaster[]) => void;
  feeTransactions: FeeTransaction[];
  setFeeTransactions: (feeTransactions: FeeTransaction[]) => void;
  masterData: any;
  currentUser: any;
  onShowReceipt: (transaction: FeeTransaction) => void;
}

export const FeeManagement = ({ 
  students, 
  feeTypes, 
  setFeeTypes, 
  feeMaster, 
  setFeeMaster, 
  feeTransactions, 
  setFeeTransactions, 
  masterData, 
  currentUser,
  onShowReceipt
}: FeeManagementProps) => {
  const [activeTab, setActiveTab] = useState<'collect' | 'master' | 'reports' | 'ledger'>('collect');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedLedgerStudent, setSelectedLedgerStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<any>({
    class: '',
    feeType: '',
    amount: 0,
    frequency: 'Monthly'
  });
  const [paymentData, setPaymentData] = useState<any>({
    paymentMethod: 'Cash',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredStudents = students.filter(s => 
    (!selectedClass || s.class === selectedClass) &&
    (!selectedSection || s.section === selectedSection) &&
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.studentId.includes(searchTerm))
  );

  const handleCollectFee = () => {
    if (!selectedStudent || !paymentData.amount) return;
    
    const newTransaction: FeeTransaction = {
      id: Date.now().toString(),
      studentId: selectedStudent.studentId,
      studentName: selectedStudent.name,
      class: selectedStudent.class,
      section: selectedStudent.section,
      feeType: paymentData.feeType,
      amount: paymentData.amount,
      discount: paymentData.discount || 0,
      discountReason: paymentData.discountReason || '',
      scholarship: paymentData.scholarship || 0,
      fine: paymentData.fine || 0,
      totalPaid: paymentData.amount - (paymentData.discount || 0) + (paymentData.fine || 0),
      paymentMode: paymentData.paymentMethod || 'Cash',
      paymentMethod: paymentData.paymentMethod,
      date: paymentData.date,
      dueDate: paymentData.dueDate || paymentData.date,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      status: 'Paid',
      remarks: paymentData.remarks
    };
    
    setFeeTransactions([newTransaction, ...feeTransactions]);
    setShowCollectModal(false);
    setSelectedStudent(null);
    setPaymentData({ paymentMethod: 'Cash', date: new Date().toISOString().split('T')[0] });
    onShowReceipt(newTransaction);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-heading tracking-tight uppercase">Fee Management</h1>
          <p className="text-text-sub font-medium">Manage student fees, collections, and financial reports.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2"><FileSpreadsheet size={18} /> Export</button>
          <button className="btn-primary flex items-center gap-2"><Plus size={20} /> Fee Master</button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        <button onClick={() => setActiveTab('collect')} className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'collect' ? 'border-primary text-primary' : 'border-transparent text-text-sub'}`}>Collect Fee</button>
        <button onClick={() => setActiveTab('master')} className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'master' ? 'border-primary text-primary' : 'border-transparent text-text-sub'}`}>Fee Master</button>
        <button onClick={() => setActiveTab('ledger')} className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'ledger' ? 'border-primary text-primary' : 'border-transparent text-text-sub'}`}>Student Ledger</button>
        <button onClick={() => setActiveTab('reports')} className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'reports' ? 'border-primary text-primary' : 'border-transparent text-text-sub'}`}>Reports</button>
      </div>

      {activeTab === 'collect' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select label="Class" options={masterData.classes} value={selectedClass} onChange={(e: any) => setSelectedClass(e.target.value)} />
              <Select label="Section" options={masterData.sections} value={selectedSection} onChange={(e: any) => setSelectedSection(e.target.value)} />
              <div className="md:col-span-2">
                <Input label="Search Student" placeholder="Name or ID..." value={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="p-5 hover:shadow-xl transition-all border-2 border-transparent hover:border-primary/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-black text-primary">
                    {student.name[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-text-heading">{student.name}</h4>
                    <p className="text-xs font-bold text-text-sub uppercase tracking-wider">{student.studentId}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-6 p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-[10px] font-black text-text-sub uppercase">Total Due</p>
                    <p className="text-lg font-black text-primary">₹12,500</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowCollectModal(true);
                    }}
                    className="btn-primary px-4 py-2 text-[10px] uppercase font-black"
                  >
                    Collect
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'master' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 p-6">
            <h3 className="text-lg font-bold mb-6">Add Fee Master</h3>
            <div className="space-y-4">
              <Select label="Class" options={masterData.classes} value={formData.class} onChange={(e: any) => setFormData({ ...formData, class: e.target.value })} />
              <Select label="Fee Type" options={feeTypes.map(t => t.name)} value={formData.feeType} onChange={(e: any) => setFormData({ ...formData, feeType: e.target.value })} />
              <Input label="Amount" type="number" value={formData.amount} onChange={(e: any) => setFormData({ ...formData, amount: Number(e.target.value) })} />
              <Select label="Frequency" options={['Monthly', 'Quarterly', 'Half-Yearly', 'Annually']} value={formData.frequency} onChange={(e: any) => setFormData({ ...formData, frequency: e.target.value })} />
              <button 
                onClick={() => {
                  setFeeMaster([...feeMaster, { ...formData, id: Date.now().toString() }]);
                  setFormData({});
                }}
                className="btn-primary w-full py-3"
              >
                Save Fee Master
              </button>
            </div>
          </Card>
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-lg font-bold mb-6">Fee Structure List</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Class</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Fee Type</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Amount</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Frequency</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {feeMaster.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 text-sm font-bold text-text-heading">{f.class}</td>
                      <td className="py-4 text-sm text-text-sub">{f.feeType}</td>
                      <td className="py-4 text-sm font-black text-primary">₹{f.amount.toLocaleString()}</td>
                      <td className="py-4 text-sm text-text-sub">{f.frequency}</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-slate-100 rounded-lg text-blue-500"><Edit2 size={16} /></button>
                          <button className="p-2 hover:bg-slate-100 rounded-lg text-red-500"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="space-y-8">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1">
                <Select 
                  label="Select Student for Ledger" 
                  options={students.map(s => `${s.name} (${s.studentId})`)} 
                  value={selectedLedgerStudent ? `${selectedLedgerStudent.name} (${selectedLedgerStudent.studentId})` : ''} 
                  onChange={(e: any) => {
                    const id = e.target.value.split('(')[1].replace(')', '');
                    setSelectedLedgerStudent(students.find(s => s.studentId === id) || null);
                  }} 
                />
              </div>
              <button className="btn-secondary flex items-center gap-2 py-3 px-6"><Download size={18} /> Export Ledger</button>
            </div>
          </Card>

          {selectedLedgerStudent ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(() => {
                  const studentFees = feeMaster.filter(f => f.class === selectedLedgerStudent.class);
                  const studentTransactions = feeTransactions.filter(t => t.studentId === selectedLedgerStudent.studentId);
                  
                  const totalAssigned = studentFees.reduce((sum, f) => sum + f.amount, 0);
                  const totalPaid = studentTransactions.reduce((sum, t) => sum + t.totalPaid, 0);
                  const totalDiscount = studentTransactions.reduce((sum, t) => sum + (t.discount || 0), 0);
                  const totalFine = studentTransactions.reduce((sum, t) => sum + (t.fine || 0), 0);
                  const balance = totalAssigned + totalFine - totalPaid - totalDiscount;

                  return (
                    <>
                      <Card className="p-6 border-l-4 border-blue-500">
                        <p className="text-[10px] font-black text-text-sub uppercase tracking-widest mb-1">Total Assigned</p>
                        <p className="text-2xl font-black text-text-heading">₹{totalAssigned.toLocaleString()}</p>
                      </Card>
                      <Card className="p-6 border-l-4 border-green-500">
                        <p className="text-[10px] font-black text-text-sub uppercase tracking-widest mb-1">Total Paid</p>
                        <p className="text-2xl font-black text-green-600">₹{totalPaid.toLocaleString()}</p>
                      </Card>
                      <Card className="p-6 border-l-4 border-orange-500">
                        <p className="text-[10px] font-black text-text-sub uppercase tracking-widest mb-1">Total Discount</p>
                        <p className="text-2xl font-black text-orange-600">₹{totalDiscount.toLocaleString()}</p>
                      </Card>
                      <Card className="p-6 border-l-4 border-red-500">
                        <p className="text-[10px] font-black text-text-sub uppercase tracking-widest mb-1">Balance Due</p>
                        <p className="text-2xl font-black text-red-600">₹{balance.toLocaleString()}</p>
                      </Card>
                    </>
                  );
                })()}
              </div>

              <Card className="p-8">
                <h3 className="text-xl font-black text-text-heading uppercase mb-8 flex items-center gap-3">
                  <BookOpen className="text-primary" /> Transaction History
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Date</th>
                        <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Particulars</th>
                        <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Type</th>
                        <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Debit (Due)</th>
                        <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Credit (Paid)</th>
                        <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(() => {
                        const studentFees = feeMaster.filter(f => f.class === selectedLedgerStudent.class);
                        const studentTransactions = feeTransactions.filter(t => t.studentId === selectedLedgerStudent.studentId);
                        
                        // Combine and sort by date
                        // For simplicity, we'll treat FeeMaster as assigned at the start of the session
                        const ledgerItems = [
                          ...studentFees.map(f => ({
                            date: '2024-04-01', // Session start
                            particulars: `Fee Assigned: ${f.feeType} (${f.frequency})`,
                            type: 'Debit',
                            amount: f.amount,
                            isDebit: true
                          })),
                          ...studentTransactions.map(t => ({
                            date: t.date,
                            particulars: `Fee Paid: ${t.feeType} (Inv: ${t.invoiceNumber})`,
                            type: 'Credit',
                            amount: t.totalPaid,
                            isDebit: false
                          }))
                        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                        let runningBalance = 0;
                        return ledgerItems.map((item, idx) => {
                          if (item.isDebit) runningBalance += item.amount;
                          else runningBalance -= item.amount;

                          return (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 text-sm text-text-sub font-medium">{item.date}</td>
                              <td className="py-4 text-sm font-bold text-text-heading">{item.particulars}</td>
                              <td className="py-4">
                                <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${item.isDebit ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                  {item.type}
                                </span>
                              </td>
                              <td className="py-4 text-sm font-black text-red-600">{item.isDebit ? `₹${item.amount.toLocaleString()}` : '-'}</td>
                              <td className="py-4 text-sm font-black text-green-600">{!item.isDebit ? `₹${item.amount.toLocaleString()}` : '-'}</td>
                              <td className="py-4 text-sm font-black text-primary">₹{runningBalance.toLocaleString()}</td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                <Users size={40} />
              </div>
              <h3 className="text-xl font-black text-text-heading uppercase">No Student Selected</h3>
              <p className="text-text-sub font-medium max-w-xs mx-auto mt-2">Please select a student from the dropdown above to view their detailed financial ledger.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2"><Receipt size={20} className="text-primary" /> Recent Transactions</h3>
            <div className="flex gap-3">
              <button className="btn-secondary flex items-center gap-2"><Printer size={16} /> Print All</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Invoice</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Student</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Fee Type</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Amount</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Date</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {feeTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm font-black text-primary">{t.invoiceNumber}</td>
                    <td className="py-4">
                      <p className="font-bold text-sm text-text-heading">{t.studentName}</p>
                      <p className="text-[10px] text-text-sub font-bold">{t.class} - {t.section}</p>
                    </td>
                    <td className="py-4 text-sm text-text-sub">{t.feeType}</td>
                    <td className="py-4 text-sm font-black text-text-heading">₹{t.totalPaid.toLocaleString()}</td>
                    <td className="py-4 text-sm text-text-sub">{t.date}</td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button onClick={() => onShowReceipt(t)} className="p-2 hover:bg-slate-100 rounded-lg text-primary"><Printer size={16} /></button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-blue-500"><Share2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Collect Fee Modal */}
      {showCollectModal && selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-text-heading uppercase tracking-tight">Collect Fee</h3>
              <button onClick={() => setShowCollectModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                {selectedStudent.name[0]}
              </div>
              <div>
                <p className="font-bold text-text-heading">{selectedStudent.name}</p>
                <p className="text-xs font-bold text-text-sub uppercase tracking-wider">{selectedStudent.studentId} | {selectedStudent.class}-{selectedStudent.section}</p>
              </div>
            </div>

            <div className="space-y-4">
              <Select label="Fee Type" options={feeTypes.map(t => t.name)} value={paymentData.feeType} onChange={(e: any) => setPaymentData({ ...paymentData, feeType: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Amount" type="number" value={paymentData.amount} onChange={(e: any) => setPaymentData({ ...paymentData, amount: Number(e.target.value) })} />
                <Input label="Fine" type="number" value={paymentData.fine} onChange={(e: any) => setPaymentData({ ...paymentData, fine: Number(e.target.value) })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Discount" type="number" value={paymentData.discount} onChange={(e: any) => setPaymentData({ ...paymentData, discount: Number(e.target.value) })} />
                <Select label="Payment Method" options={['Cash', 'Cheque', 'Online', 'UPI']} value={paymentData.paymentMethod} onChange={(e: any) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })} />
              </div>
              <Input label="Date" type="date" value={paymentData.date} onChange={(e: any) => setPaymentData({ ...paymentData, date: e.target.value })} />
              <div className="space-y-2">
                <label className="label-text">Remarks</label>
                <textarea className="input-field min-h-[80px]" value={paymentData.remarks} onChange={(e) => setPaymentData({ ...paymentData, remarks: e.target.value })}></textarea>
              </div>
              
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between mb-6">
                <p className="font-bold text-text-sub">Total Payable</p>
                <p className="text-2xl font-black text-primary">₹{( (paymentData.amount || 0) - (paymentData.discount || 0) + (paymentData.fine || 0) ).toLocaleString()}</p>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setShowCollectModal(false)} className="flex-1 py-4 rounded-2xl font-bold text-text-sub hover:bg-slate-100 transition-all">Cancel</button>
                <button onClick={handleCollectFee} className="flex-1 py-4 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20">Confirm Payment</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
