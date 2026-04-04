import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  Share2, 
  Calendar, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  X,
  UserCircle,
  QrCode,
  Layout,
  Grid,
  Maximize2,
  Settings,
  Shield,
  Eye,
  EyeOff,
  RefreshCw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Circle,
  Play,
  Square,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Student } from '../../types';

interface IDCardsModuleProps {
  students: Student[];
}

export const IDCardsModule = ({ students }: IDCardsModuleProps) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(s => 
    (!selectedClass || s.class === selectedClass) &&
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.studentId.includes(searchTerm))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-heading tracking-tight uppercase">ID Card Generator</h1>
          <p className="text-text-sub font-medium">Generate and print professional ID cards for students and staff.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2"><Printer size={18} /> Bulk Print</button>
          <button className="btn-primary flex items-center gap-2"><Download size={18} /> Export PDFs</button>
        </div>
      </div>

      <Card className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select 
            label="Filter by Class" 
            options={['LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']} 
            value={selectedClass} 
            onChange={(e: any) => setSelectedClass(e.target.value)} 
          />
          <Input label="Search Student" placeholder="Name or ID..." value={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStudents.map((s) => (
          <Card key={s.id} className="p-0 overflow-hidden group">
            <div className="bg-primary p-6 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-black uppercase tracking-widest">Global International School</h3>
                <p className="text-[8px] font-bold opacity-80 uppercase tracking-[0.2em]">Excellence in Education</p>
              </div>
            </div>
            <div className="p-8 text-center relative">
              <div className="w-24 h-24 rounded-2xl bg-slate-100 mx-auto -mt-20 border-4 border-white shadow-xl flex items-center justify-center text-primary font-black text-3xl mb-4">
                {s.name[0]}
              </div>
              <h4 className="text-xl font-black text-text-heading uppercase tracking-tight">{s.name}</h4>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-6">Student ID: {s.studentId}</p>
              
              <div className="grid grid-cols-2 gap-4 text-left mb-6">
                <div>
                  <p className="text-[8px] font-black text-text-sub uppercase tracking-widest">Class</p>
                  <p className="text-xs font-bold text-text-heading">{s.class}-{s.section}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-text-sub uppercase tracking-widest">Roll No</p>
                  <p className="text-xs font-bold text-text-heading">{s.rollNo}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-text-sub uppercase tracking-widest">Blood Group</p>
                  <p className="text-xs font-bold text-red-500">{s.bloodGroup}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-text-sub uppercase tracking-widest">Contact</p>
                  <p className="text-xs font-bold text-text-heading">{s.mobile}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center p-4 bg-slate-50 rounded-2xl">
                <QrCode size={48} className="text-text-heading" />
              </div>
            </div>
            <div className="p-4 bg-slate-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <button className="btn-primary flex-1 py-2 text-[10px]"><Printer size={14} /> Print</button>
              <button className="btn-secondary flex-1 py-2 text-[10px]"><Download size={14} /> Download</button>
            </div>
          </Card>
        ))}
        {filteredStudents.length === 0 && (
          <div className="lg:col-span-3 py-20 text-center text-text-sub font-medium italic">No students found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};
