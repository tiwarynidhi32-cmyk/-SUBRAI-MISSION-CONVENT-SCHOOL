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
  bankBalance: number;
  setBankBalance: (val: number) => void;
  cashBalance: number;
  setCashBalance: (val: number) => void;
  contraEntries: any[];
  setContraEntries: (val: any[]) => void;
  adjustmentLogs: any[];
  setAdjustmentLogs: (val: any[]) => void;
  masterData: any;
  showModal: (title: string, message: string) => void;
  getStudentDueFees: (student: any) => number;
}

export const FeeManagement = ({ 
  students, 
  feeTypes, 
  setFeeTypes, 
  feeMaster, 
  setFeeMaster, 
  feeTransactions, 
  setFeeTransactions, 
  bankBalance,
  setBankBalance,
  cashBalance,
  setCashBalance,
  contraEntries,
  setContraEntries,
  adjustmentLogs,
  setAdjustmentLogs,
  masterData, 
  showModal,
  getStudentDueFees
}: FeeManagementProps) => {
  const [activeTab, setActiveTab] = useState<'collect' | 'master' | 'reports' | 'ledger' | 'bank' | 'adjustments'>('collect');
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
    frequency: 'Monthly',
    studentType: 'Both'
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

  const [newFeeTypeName, setNewFeeTypeName] = useState('');
  const [editingFeeType, setEditingFeeType] = useState<FeeType | null>(null);
  const [setupClass, setSetupClass] = useState('');
  const [setupFees, setSetupFees] = useState<Record<string, { selected: boolean, amount: number, frequency: string, studentType: string }>>({});

  const handleAddFeeType = () => {
    if (!newFeeTypeName) return;
    const newType: FeeType = {
      id: Date.now().toString(),
      name: newFeeTypeName,
      description: ''
    };
    setFeeTypes([...feeTypes, newType]);
    setNewFeeTypeName('');
  };

  const handleDeleteFeeType = (id: string) => {
    setFeeTypes(feeTypes.filter(t => t.id !== id));
    // Also remove from feeMaster
    const typeName = feeTypes.find(t => t.id === id)?.name;
    if (typeName) {
      setFeeMaster(feeMaster.filter(m => m.feeType !== typeName));
    }
  };

  const handleAssignFees = () => {
    if (!setupClass) {
      alert('Please select a class first');
      return;
    }

    const newMasters: FeeMaster[] = [];
    Object.entries(setupFees).forEach(([typeName, data]) => {
      if (data.selected && data.amount > 0) {
        newMasters.push({
          id: `${setupClass}-${typeName}-${Date.now()}`,
          class: setupClass,
          feeType: typeName,
          amount: data.amount,
          frequency: data.frequency as any,
          studentType: data.studentType as any
        });
      }
    });

    if (newMasters.length === 0) {
      alert('Please select at least one fee and enter an amount');
      return;
    }

    // Remove existing masters for this class and these types to avoid duplicates
    const selectedTypes = newMasters.map(m => m.feeType);
    const filteredMaster = feeMaster.filter(m => !(m.class === setupClass && selectedTypes.includes(m.feeType)));
    
    setFeeMaster([...filteredMaster, ...newMasters]);
    alert('Fees assigned successfully!');
  };

  const handleSetupClassChange = (className: string) => {
    setSetupClass(className);
    const classFees = feeMaster.filter(m => m.class === className);
    const initialSetup: Record<string, any> = {};
    
    feeTypes.forEach(type => {
      const existing = classFees.find(m => m.feeType === type.name);
      initialSetup[type.name] = {
        selected: !!existing,
        amount: existing ? existing.amount : 0,
        frequency: existing ? existing.frequency : 'Monthly',
        studentType: existing ? (existing.studentType || 'Both') : (
          type.name.toLowerCase().includes('re-admission') ? 'Old' : 
          type.name.toLowerCase().includes('admission') ? 'New' : 'Both'
        )
      };
    });
    setSetupFees(initialSetup);
  };

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
    
    // Update cash/bank balance
    if (paymentData.paymentMethod === 'Cash') {
      setCashBalance(cashBalance + newTransaction.totalPaid);
    } else {
      setBankBalance(bankBalance + newTransaction.totalPaid);
    }

    setShowCollectModal(false);
    setSelectedStudent(null);
    setPaymentData({ paymentMethod: 'Cash', date: new Date().toISOString().split('T')[0] });
    showModal('Success', 'Fee collected successfully!');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-text-heading tracking-tight uppercase">Fee Management</h1>
          <p className="text-text-sub font-medium text-sm">Configure, collect and report school fees</p>
        </div>
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 flex flex-wrap gap-1">
          {[
            { id: 'collect', label: 'Collect Fee' },
            { id: 'master', label: 'Fee Master' },
            { id: 'reports', label: 'Reports' },
            { id: 'ledger', label: 'Student Ledger' },
            { id: 'bank', label: 'Bank / Cash Ledger' },
            { id: 'adjustments', label: 'Adjustment Logs' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-text-sub hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
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
                    <p className="text-lg font-black text-primary">₹{getStudentDueFees(student).toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowCollectModal(true);
                      
                      // Automatically select admission/re-admission fee based on student type
                      const targetType = student.studentType === 'New' ? 'Admission' : 'Re-Admission';
                      const master = feeMaster.find(m => 
                        m.class === student.class && 
                        m.feeType.toLowerCase().includes(targetType.toLowerCase()) &&
                        (m.studentType === 'Both' || m.studentType === student.studentType)
                      );

                      if (master) {
                        setPaymentData({
                          ...paymentData,
                          feeType: master.feeType,
                          amount: master.amount
                        });
                      } else {
                        // Fallback to first available fee for this class/type
                        const firstFee = feeMaster.find(m => 
                          m.class === student.class && 
                          (m.studentType === 'Both' || m.studentType === student.studentType)
                        );
                        if (firstFee) {
                          setPaymentData({
                            ...paymentData,
                            feeType: firstFee.feeType,
                            amount: firstFee.amount
                          });
                        }
                      }
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Fee Types */}
          <Card className="lg:col-span-4 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Coins className="text-primary" size={24} />
              <h3 className="text-xl font-black text-text-heading uppercase tracking-tight">Fee Types</h3>
            </div>
            
            <div className="flex gap-2 mb-8">
              <input 
                type="text" 
                placeholder="New Fee Type" 
                className="input-field py-3"
                value={newFeeTypeName}
                onChange={(e) => setNewFeeTypeName(e.target.value)}
              />
              <button 
                onClick={handleAddFeeType}
                className="btn-primary px-6 py-3 font-black uppercase text-xs"
              >
                Add
              </button>
            </div>

            <div className="space-y-3">
              {feeTypes.map((type) => (
                <div key={type.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-primary/10 transition-all group">
                  <span className="font-bold text-text-heading">{type.name}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="p-2 hover:bg-white rounded-lg text-blue-500 transition-all"><Edit2 size={14} /></button>
                    <button 
                      onClick={() => handleDeleteFeeType(type.id)}
                      className="p-2 hover:bg-white rounded-lg text-red-500 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Right Side: Fee Master Setup */}
          <Card className="lg:col-span-8 p-8">
            <div className="flex items-center gap-3 mb-8">
              <ArrowRightLeft className="text-primary" size={24} />
              <h3 className="text-2xl font-black text-text-heading uppercase tracking-tight">Fee Master (Setup)</h3>
            </div>

            <div className="mb-8 max-w-md">
              <Select 
                label="Select Class" 
                options={masterData.classes} 
                value={setupClass} 
                onChange={(e: any) => handleSetupClassChange(e.target.value)} 
              />
            </div>

            {setupClass ? (
              <div className="space-y-8">
                <div className="border-b border-slate-100 pb-4">
                  <h4 className="text-sm font-black text-primary uppercase tracking-widest">Assign Fees for {setupClass}</h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-text-sub uppercase tracking-widest border-b border-slate-100">
                        <th className="pb-4 px-2">Select</th>
                        <th className="pb-4 px-2">Fee Type</th>
                        <th className="pb-4 px-2">Amount</th>
                        <th className="pb-4 px-2">Frequency</th>
                        <th className="pb-4 px-2">Student Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {feeTypes.map((type) => {
                        const setup = setupFees[type.name] || { selected: false, amount: 0, frequency: 'Monthly', studentType: 'Both' };
                        return (
                          <tr key={type.id} className="hover:bg-slate-50/50 transition-all">
                            <td className="py-4 px-2">
                              <input 
                                type="checkbox" 
                                checked={setup.selected}
                                onChange={(e) => setSetupFees({
                                  ...setupFees,
                                  [type.name]: { ...setup, selected: e.target.checked }
                                })}
                                className="w-5 h-5 rounded-lg border-slate-300 text-primary focus:ring-primary/20"
                              />
                            </td>
                            <td className="py-4 px-2">
                              <span className="font-bold text-text-heading">{type.name}</span>
                            </td>
                            <td className="py-4 px-2">
                              <input 
                                type="number" 
                                placeholder="Amount"
                                value={setup.amount || ''}
                                onChange={(e) => setSetupFees({
                                  ...setupFees,
                                  [type.name]: { ...setup, amount: Number(e.target.value), selected: true }
                                })}
                                className="w-32 px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm"
                              />
                            </td>
                            <td className="py-4 px-2">
                              <select 
                                value={setup.frequency}
                                onChange={(e) => setSetupFees({
                                  ...setupFees,
                                  [type.name]: { ...setup, frequency: e.target.value, selected: true }
                                })}
                                className="px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                              >
                                {['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'].map(f => (
                                  <option key={f} value={f}>{f}</option>
                                ))}
                              </select>
                            </td>
                            <td className="py-4 px-2">
                              <select 
                                value={setup.studentType}
                                onChange={(e) => setSetupFees({
                                  ...setupFees,
                                  [type.name]: { ...setup, studentType: e.target.value, selected: true }
                                })}
                                className={`px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-black uppercase ${
                                  setup.studentType === 'New' ? 'text-green-600' : 
                                  setup.studentType === 'Old' ? 'text-blue-600' : 'text-slate-600'
                                }`}
                              >
                                {['New', 'Old', 'Both'].map(st => (
                                  <option key={st} value={st}>{st}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <button 
                    onClick={handleAssignFees}
                    className="btn-primary px-10 py-4 font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20"
                  >
                    Assign Selected Fees
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                  <ClipboardList size={32} />
                </div>
                <h4 className="text-lg font-black text-text-heading uppercase">No Class Selected</h4>
                <p className="text-text-sub font-medium max-w-xs mx-auto mt-2">Choose a class from the dropdown above to start assigning fees and setting up the structure.</p>
              </div>
            )}
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
                        <button className="p-2 hover:bg-slate-100 rounded-lg text-primary"><Printer size={16} /></button>
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

      {activeTab === 'bank' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Wallet size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">Bank Balance</p>
                  <h3 className="text-3xl font-black">₹{bankBalance.toLocaleString()}</h3>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black uppercase transition-all">Transfer</button>
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black uppercase transition-all">Statement</button>
              </div>
            </Card>
            <Card className="p-8 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-none">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Coins size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">Cash Balance</p>
                  <h3 className="text-3xl font-black">₹{cashBalance.toLocaleString()}</h3>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black uppercase transition-all">Deposit</button>
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black uppercase transition-all">Withdraw</button>
              </div>
            </Card>
          </div>

          <Card className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-text-heading uppercase flex items-center gap-3">
                <ArrowRightLeft className="text-primary" /> Contra Entries
              </h3>
              <button className="btn-primary flex items-center gap-2"><Plus size={18} /> New Entry</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Date</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">From</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">To</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Amount</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {contraEntries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-text-sub italic">No contra entries found.</td>
                    </tr>
                  ) : (
                    contraEntries.map((entry) => (
                      <tr key={entry.id}>
                        <td className="py-4 text-sm">{entry.date}</td>
                        <td className="py-4 text-sm font-bold">{entry.from}</td>
                        <td className="py-4 text-sm font-bold">{entry.to}</td>
                        <td className="py-4 text-sm font-black text-primary">₹{entry.amount.toLocaleString()}</td>
                        <td className="py-4">
                          <span className="text-[10px] font-black px-2 py-1 bg-green-100 text-green-700 rounded-full uppercase">Completed</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'adjustments' && (
        <Card className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-text-heading uppercase flex items-center gap-3">
              <FileEdit className="text-primary" /> Fee Adjustment Logs
            </h3>
            <button className="btn-primary flex items-center gap-2"><Plus size={18} /> New Adjustment</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Date</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Student</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Type</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Amount</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Reason</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Adjusted By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {adjustmentLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-text-sub italic">No adjustment logs found.</td>
                  </tr>
                ) : (
                  adjustmentLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="py-4 text-sm">{log.date}</td>
                      <td className="py-4 text-sm font-bold">{log.studentName}</td>
                      <td className="py-4 text-sm">{log.type}</td>
                      <td className="py-4 text-sm font-black text-primary">₹{log.amount.toLocaleString()}</td>
                      <td className="py-4 text-sm text-text-sub">{log.reason}</td>
                      <td className="py-4 text-sm font-bold">{log.adjustedBy}</td>
                    </tr>
                  ))
                )}
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
              <div className="flex-1">
                <p className="font-bold text-text-heading">{selectedStudent.name}</p>
                <p className="text-xs font-bold text-text-sub uppercase tracking-wider">{selectedStudent.studentId} | {selectedStudent.class}-{selectedStudent.section}</p>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                  selectedStudent.studentType === 'New' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {selectedStudent.studentType}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Select 
                label="Fee Type" 
                options={feeTypes.map(t => t.name)} 
                value={paymentData.feeType} 
                onChange={(e: any) => {
                  const type = e.target.value;
                  const master = feeMaster.find(m => 
                    m.feeType === type && 
                    m.class === selectedStudent.class &&
                    (m.studentType === 'Both' || m.studentType === selectedStudent.studentType)
                  );
                  setPaymentData({ 
                    ...paymentData, 
                    feeType: type,
                    amount: master ? master.amount : 0
                  });
                }} 
              />
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
