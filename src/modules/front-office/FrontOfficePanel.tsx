import React, { useState } from 'react';
import { 
  UserPlus, 
  BookOpen, 
  AlertCircle, 
  Plus, 
  X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { AdmissionEnquiry, Visitor, Complaint } from '../../types';

interface FrontOfficePanelProps {
  enquiries: AdmissionEnquiry[];
  setEnquiries: (enquiries: AdmissionEnquiry[]) => void;
  visitors: Visitor[];
  setVisitors: (visitors: Visitor[]) => void;
  complaints: Complaint[];
  setComplaints: (complaints: Complaint[]) => void;
  setView: (view: string) => void;
  setFormData: (data: any) => void;
  currentUser: any;
}

export const FrontOfficePanel = ({ 
  enquiries, 
  setEnquiries, 
  visitors, 
  setVisitors, 
  complaints, 
  setComplaints, 
  setView, 
  setFormData, 
  currentUser 
}: FrontOfficePanelProps) => {
  const [activeTab, setActiveTab] = useState('enquiry');
  const [showAddEnquiry, setShowAddEnquiry] = useState(false);
  const [newEnquiry, setNewEnquiry] = useState<Partial<AdmissionEnquiry>>({
    status: 'Pending',
    date: new Date().toISOString().split('T')[0]
  });
  const [newVisitor, setNewVisitor] = useState<Partial<Visitor>>({
    date: new Date().toISOString().split('T')[0],
    inTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  const [newComplaint, setNewComplaint] = useState<Partial<Complaint>>({
    date: new Date().toISOString().split('T')[0],
    status: 'Pending'
  });

  const handleAddEnquiry = () => {
    if (!newEnquiry.name || !newEnquiry.mobile) return;
    const enquiry: AdmissionEnquiry = {
      ...newEnquiry as AdmissionEnquiry,
      id: `ENQ-${Date.now()}`
    };
    setEnquiries([enquiry, ...enquiries]);
    setShowAddEnquiry(false);
    setNewEnquiry({ status: 'Pending', date: new Date().toISOString().split('T')[0] });
  };

  const handleApproveForAdmission = (enquiry: AdmissionEnquiry) => {
    // 1. Update enquiry status
    setEnquiries(enquiries.map((e: AdmissionEnquiry) => 
      e.id === enquiry.id ? { ...e, status: 'Approved' } : e
    ));

    // 2. Pre-fill student registration form
    setFormData({
      name: enquiry.name,
      surname: enquiry.surname,
      mobile: enquiry.mobile,
      email: enquiry.email,
      class: enquiry.class,
      fatherName: enquiry.fatherName,
      motherName: enquiry.motherName,
      address: enquiry.address,
      gender: enquiry.gender,
      fatherMobile: enquiry.mobile // Assuming mobile is father's mobile if not specified
    });

    // 3. Navigate to registration
    setView('register-student');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-text-heading">Front Office</h2>
        <button 
          onClick={() => setShowAddEnquiry(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> New Enquiry
        </button>
      </div>

      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { id: 'enquiry', label: 'Admission Enquiry', icon: UserPlus },
          { id: 'visitors', label: 'Visitor Book', icon: BookOpen },
          { id: 'complaints', label: 'Complaints', icon: AlertCircle }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-primary'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'enquiry' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Date</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Student Name</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Mobile</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Class</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Status</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {enquiries.map((e: AdmissionEnquiry) => (
                  <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm text-text-sub">{e.date}</td>
                    <td className="py-4 text-sm font-bold text-text-heading">{e.name} {e.surname}</td>
                    <td className="py-4 text-sm text-text-sub">{e.mobile}</td>
                    <td className="py-4 text-sm text-text-sub">{e.class}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                        e.status === 'Closed' ? 'bg-slate-100 text-slate-700' : 
                        e.status === 'Follow-up' ? 'bg-orange-100 text-orange-700' : 
                        e.status === 'Approved' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {currentUser?.role === 'admin' && e.status !== 'Approved' && (
                        <button 
                          onClick={() => handleApproveForAdmission(e)}
                          className="text-[10px] font-black text-primary hover:underline uppercase"
                        >
                          Approve for Admission
                        </button>
                      )}
                      {e.status === 'Approved' && (
                        <span className="text-[10px] font-black text-green-600 uppercase">Admission Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'visitors' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 p-6">
            <h3 className="text-lg font-bold mb-6">Add Visitor</h3>
            <div className="space-y-4">
              <Input label="Visitor Name" value={newVisitor.name} onChange={(e: any) => setNewVisitor({...newVisitor, name: e.target.value})} />
              <Input label="Mobile" value={newVisitor.mobile} onChange={(e: any) => setNewVisitor({...newVisitor, mobile: e.target.value})} />
              <Input label="Purpose" value={newVisitor.purpose} onChange={(e: any) => setNewVisitor({...newVisitor, purpose: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Date" type="date" value={newVisitor.date} onChange={(e: any) => setNewVisitor({...newVisitor, date: e.target.value})} />
                <Input label="In Time" type="time" value={newVisitor.inTime} onChange={(e: any) => setNewVisitor({...newVisitor, inTime: e.target.value})} />
              </div>
              <button 
                onClick={() => {
                  if (!newVisitor.name || !newVisitor.mobile) return;
                  setVisitors([{...newVisitor as Visitor, id: Date.now().toString()}, ...visitors]);
                  setNewVisitor({
                    date: new Date().toISOString().split('T')[0],
                    inTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  });
                }}
                className="btn-primary w-full py-3"
              >
                Save Visitor
              </button>
            </div>
          </Card>
          <Card className="md:col-span-2 p-6">
            <h3 className="text-lg font-bold mb-6">Visitor List</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Date</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Name</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Purpose</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">In Time</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Out Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {visitors.map((v: Visitor) => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 text-sm text-text-sub">{v.date}</td>
                      <td className="py-4 text-sm font-bold text-text-heading">{v.name}</td>
                      <td className="py-4 text-sm text-text-sub">{v.purpose}</td>
                      <td className="py-4 text-sm text-text-sub">{v.inTime}</td>
                      <td className="py-4 text-sm text-text-sub">
                        {v.outTime ? v.outTime : (
                          <button 
                            onClick={() => setVisitors(visitors.map((vis: Visitor) => vis.id === v.id ? {...vis, outTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} : vis))}
                            className="text-[10px] font-black text-primary hover:underline uppercase"
                          >
                            Mark Out
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'complaints' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 p-6">
            <h3 className="text-lg font-bold mb-6">Add Complaint</h3>
            <div className="space-y-4">
              <Input label="Complainant Name" value={newComplaint.name} onChange={(e: any) => setNewComplaint({...newComplaint, name: e.target.value})} />
              <Input label="Complaint Type" value={newComplaint.type} onChange={(e: any) => setNewComplaint({...newComplaint, type: e.target.value})} />
              <Input label="Source" value={newComplaint.source} onChange={(e: any) => setNewComplaint({...newComplaint, source: e.target.value})} />
              <Input label="Date" type="date" value={newComplaint.date} onChange={(e: any) => setNewComplaint({...newComplaint, date: e.target.value})} />
              <div className="w-full">
                <label className="label-text">Description</label>
                <textarea 
                  className="input-field min-h-[100px]" 
                  value={newComplaint.description}
                  onChange={(e: any) => setNewComplaint({...newComplaint, description: e.target.value})}
                />
              </div>
              <button 
                onClick={() => {
                  if (!newComplaint.name || !newComplaint.description) return;
                  setComplaints([{...newComplaint as Complaint, id: Date.now().toString()}, ...complaints]);
                  setNewComplaint({
                    date: new Date().toISOString().split('T')[0],
                    status: 'Pending'
                  });
                }}
                className="btn-primary w-full py-3"
              >
                Save Complaint
              </button>
            </div>
          </Card>
          <Card className="md:col-span-2 p-6">
            <h3 className="text-lg font-bold mb-6">Complaint List</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Date</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Name</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Type</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Status</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {complaints.map((c: Complaint) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 text-sm text-text-sub">{c.date}</td>
                      <td className="py-4 text-sm font-bold text-text-heading">{c.name}</td>
                      <td className="py-4 text-sm text-text-sub">{c.type}</td>
                      <td className="py-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                          c.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-4">
                        {c.status === 'Pending' && (
                          <button 
                            onClick={() => setComplaints(complaints.map((comp: Complaint) => comp.id === c.id ? {...comp, status: 'Resolved'} : comp))}
                            className="text-[10px] font-black text-primary hover:underline uppercase"
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Add Enquiry Modal */}
      <AnimatePresence>
        {showAddEnquiry && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 w-full max-w-xl shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-text-heading">New Admission Enquiry</h3>
                <button onClick={() => setShowAddEnquiry(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="First Name" required value={newEnquiry.name} onChange={(e: any) => setNewEnquiry({...newEnquiry, name: e.target.value})} />
                <Input label="Surname" required value={newEnquiry.surname} onChange={(e: any) => setNewEnquiry({...newEnquiry, surname: e.target.value})} />
                <Input label="Mobile" required value={newEnquiry.mobile} onChange={(e: any) => setNewEnquiry({...newEnquiry, mobile: e.target.value})} />
                <Input label="Email" value={newEnquiry.email} onChange={(e: any) => setNewEnquiry({...newEnquiry, email: e.target.value})} />
                <Input label="Class" value={newEnquiry.class} onChange={(e: any) => setNewEnquiry({...newEnquiry, class: e.target.value})} />
                <Input label="Gender" value={newEnquiry.gender} onChange={(e: any) => setNewEnquiry({...newEnquiry, gender: e.target.value})} />
                <Input label="Father's Name" value={newEnquiry.fatherName} onChange={(e: any) => setNewEnquiry({...newEnquiry, fatherName: e.target.value})} />
                <Input label="Mother's Name" value={newEnquiry.motherName} onChange={(e: any) => setNewEnquiry({...newEnquiry, motherName: e.target.value})} />
                <Input label="Source" placeholder="e.g. Website, Newspaper" value={newEnquiry.source} onChange={(e: any) => setNewEnquiry({...newEnquiry, source: e.target.value})} />
                <Input label="Date" type="date" value={newEnquiry.date} onChange={(e: any) => setNewEnquiry({...newEnquiry, date: e.target.value})} />
                <div className="md:col-span-2">
                  <label className="label-text">Address</label>
                  <textarea 
                    className="input-field min-h-[80px]" 
                    value={newEnquiry.address}
                    onChange={(e: any) => setNewEnquiry({...newEnquiry, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button onClick={() => setShowAddEnquiry(false)} className="flex-1 py-4 font-bold text-text-sub hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                <button onClick={handleAddEnquiry} className="flex-1 btn-primary py-4">Save Enquiry</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
