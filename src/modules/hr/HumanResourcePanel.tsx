import React, { useState } from 'react';
import { 
  Users, 
  CalendarRange, 
  CheckCircle2, 
  Building2, 
  UserCog, 
  Plus, 
  X, 
  Trash2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Staff } from '../../types';

interface HumanResourcePanelProps {
  staff: Staff[];
  setStaff: (staff: Staff[]) => void;
  departments: any[];
  setDepartments: (departments: any[]) => void;
  designations: any[];
  setDesignations: (designations: any[]) => void;
  leaveRequests: any[];
  setLeaveRequests: (leaveRequests: any[]) => void;
}

export const HumanResourcePanel = ({ 
  staff, 
  setStaff, 
  departments, 
  setDepartments, 
  designations, 
  setDesignations, 
  leaveRequests, 
  setLeaveRequests 
}: HumanResourcePanelProps) => {
  const [activeTab, setActiveTab] = useState('staff-list');
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<Staff>>({
    status: 'Active',
    joiningDate: new Date().toISOString().split('T')[0]
  });
  const [newDepartment, setNewDepartment] = useState('');
  const [newDesignation, setNewDesignation] = useState('');
  const [newLeave, setNewLeave] = useState<any>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
    status: 'Pending'
  });

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.surname || !newStaff.role) return;
    const staffMember: Staff = {
      ...newStaff as Staff,
      id: `STF-${Math.floor(100000 + Math.random() * 900000)}`
    };
    setStaff([...staff, staffMember]);
    setShowAddStaff(false);
    setNewStaff({ status: 'Active', joiningDate: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-text-heading">Human Resource</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddStaff(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} /> Add Staff
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { id: 'staff-list', label: 'Staff Details', icon: Users },
          { id: 'leave', label: 'Apply Leave', icon: CalendarRange },
          { id: 'approve-leave', label: 'Approve Leave', icon: CheckCircle2 },
          { id: 'departments', label: 'Department', icon: Building2 },
          { id: 'designations', label: 'Designation', icon: UserCog }
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

      {activeTab === 'staff-list' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Staff ID</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Name</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Role</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Department</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Designation</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Mobile</th>
                  <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {staff.map((s: Staff) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm font-bold text-primary">{s.id}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs overflow-hidden">
                          {s.photo ? <img src={s.photo} alt="" className="w-full h-full object-cover" /> : s.name[0]}
                        </div>
                        <span className="font-bold text-text-heading">{s.name} {s.surname}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-text-sub">{s.role}</td>
                    <td className="py-4 text-sm text-text-sub">{s.department}</td>
                    <td className="py-4 text-sm text-text-sub">{s.designation}</td>
                    <td className="py-4 text-sm text-text-sub">{s.mobile}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                        s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'leave' && (
        <Card className="max-w-xl mx-auto p-8">
          <h3 className="text-xl font-black text-text-heading mb-6 uppercase tracking-tight">Apply Leave</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Date" type="date" value={newLeave.startDate} onChange={(e: any) => setNewLeave({...newLeave, startDate: e.target.value})} />
              <Input label="End Date" type="date" value={newLeave.endDate} onChange={(e: any) => setNewLeave({...newLeave, endDate: e.target.value})} />
            </div>
            <div className="w-full">
              <label className="label-text">Reason</label>
              <textarea 
                className="input-field min-h-[120px]" 
                value={newLeave.reason}
                onChange={(e: any) => setNewLeave({...newLeave, reason: e.target.value})}
              />
            </div>
            <button 
              onClick={() => {
                if (!newLeave.reason) return;
                setLeaveRequests([{...newLeave, id: Date.now().toString(), staffName: 'Current User', staffId: 'STF-001'}, ...leaveRequests]);
                setNewLeave({
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0],
                  reason: '',
                  status: 'Pending'
                });
              }}
              className="btn-primary w-full py-4"
            >
              Submit Leave Request
            </button>
          </div>
        </Card>
      )}

      {activeTab === 'approve-leave' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 px-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Staff</th>
                  <th className="pb-4 px-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Duration</th>
                  <th className="pb-4 px-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Reason</th>
                  <th className="pb-4 px-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Status</th>
                  <th className="pb-4 px-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leaveRequests.map((l: any) => (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="text-sm font-bold text-text-heading">{l.staffName}</p>
                      <p className="text-[10px] text-text-sub uppercase">{l.staffId}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-bold text-text-heading">{l.startDate} to {l.endDate}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-text-sub max-w-xs truncate">{l.reason}</td>
                    <td className="py-4 px-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                        l.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                        l.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {l.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setLeaveRequests(leaveRequests.map((r: any) => r.id === l.id ? {...r, status: 'Approved'} : r))}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                          <button 
                            onClick={() => setLeaveRequests(leaveRequests.map((r: any) => r.id === l.id ? {...r, status: 'Rejected'} : r))}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {leaveRequests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-text-sub font-medium italic">No leave requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 p-6">
            <h3 className="text-lg font-bold mb-6">Add Department</h3>
            <div className="space-y-4">
              <Input label="Department Name" value={newDepartment} onChange={(e: any) => setNewDepartment(e.target.value)} />
              <button 
                onClick={() => {
                  if (!newDepartment) return;
                  setDepartments([...departments, { id: Date.now().toString(), name: newDepartment }]);
                  setNewDepartment('');
                }}
                className="btn-primary w-full py-3"
              >
                Save Department
              </button>
            </div>
          </Card>
          <Card className="md:col-span-2 p-6">
            <h3 className="text-lg font-bold mb-6">Department List</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Name</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {departments.map((d: any) => (
                    <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 text-sm font-bold text-text-heading">{d.name}</td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => setDepartments(departments.filter((dep: any) => dep.id !== d.id))}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'designations' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 p-6">
            <h3 className="text-lg font-bold mb-6">Add Designation</h3>
            <div className="space-y-4">
              <Input label="Designation Name" value={newDesignation} onChange={(e: any) => setNewDesignation(e.target.value)} />
              <button 
                onClick={() => {
                  if (!newDesignation) return;
                  setDesignations([...designations, { id: Date.now().toString(), name: newDesignation }]);
                  setNewDesignation('');
                }}
                className="btn-primary w-full py-3"
              >
                Save Designation
              </button>
            </div>
          </Card>
          <Card className="md:col-span-2 p-6">
            <h3 className="text-lg font-bold mb-6">Designation List</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider">Name</th>
                    <th className="pb-4 font-bold text-xs uppercase text-text-secondary tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {designations.map((d: any) => (
                    <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 text-sm font-bold text-text-heading">{d.name}</td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => setDesignations(designations.filter((des: any) => des.id !== d.id))}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Add Staff Modal */}
      <AnimatePresence>
        {showAddStaff && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-text-heading">Add New Staff</h3>
                <button onClick={() => setShowAddStaff(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="First Name" required value={newStaff.name} onChange={(e: any) => setNewStaff({...newStaff, name: e.target.value})} />
                <Input label="Last Name" required value={newStaff.surname} onChange={(e: any) => setNewStaff({...newStaff, surname: e.target.value})} />
                <Input label="Email" type="email" value={newStaff.email} onChange={(e: any) => setNewStaff({...newStaff, email: e.target.value})} />
                <Input label="Mobile" value={newStaff.mobile} onChange={(e: any) => setNewStaff({...newStaff, mobile: e.target.value})} />
                
                <div className="w-full">
                  <label className="label-text">Role <span className="text-red-500">*</span></label>
                  <select 
                    className="input-field"
                    value={newStaff.role}
                    onChange={(e: any) => setNewStaff({...newStaff, role: e.target.value})}
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Librarian">Librarian</option>
                    <option value="Warden">Warden</option>
                  </select>
                </div>

                <div className="w-full">
                  <label className="label-text">Department</label>
                  <select 
                    className="input-field"
                    value={newStaff.department}
                    onChange={(e: any) => setNewStaff({...newStaff, department: e.target.value})}
                  >
                    <option value="">Select Department</option>
                    {departments.map((d: any) => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>

                <div className="w-full">
                  <label className="label-text">Designation</label>
                  <select 
                    className="input-field"
                    value={newStaff.designation}
                    onChange={(e: any) => setNewStaff({...newStaff, designation: e.target.value})}
                  >
                    <option value="">Select Designation</option>
                    {designations.map((d: any) => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>

                <Input label="Joining Date" type="date" value={newStaff.joiningDate} onChange={(e: any) => setNewStaff({...newStaff, joiningDate: e.target.value})} />
              </div>

              <div className="mt-8 flex gap-3">
                <button onClick={() => setShowAddStaff(false)} className="flex-1 py-4 font-bold text-text-sub hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                <button onClick={handleAddStaff} className="flex-1 btn-primary py-4">Save Staff</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
