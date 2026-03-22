import React from 'react';
import { motion } from 'motion/react';
import { Printer, CheckCircle2, Calendar, Clock, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../utils';

interface TicketProps {
  number: string;
  category: string;
  timestamp: Date;
  agencyName: string;
  onDone: () => void;
}

export const Ticket: React.FC<TicketProps> = ({ number, category, timestamp, agencyName, onDone }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="max-w-sm w-full mx-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-700 rounded-full mt-2" />
          <Building2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
          <h2 className="text-sm font-semibold uppercase tracking-widest opacity-80">{agencyName}</h2>
          <p className="text-xs opacity-60">Official Priority Ticket</p>
        </div>

        {/* Ticket Body */}
        <div className="p-8 text-center space-y-6 relative">
          {/* Decorative side cutouts */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border border-slate-100" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border border-slate-100" />
          
          <div className="space-y-1">
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Your Number</p>
            <h1 className="text-7xl font-bold text-slate-900 tracking-tighter">{number}</h1>
          </div>

          <div className="py-4 border-y border-dashed border-slate-200">
            <p className="text-slate-900 font-semibold">{category}</p>
            <p className="text-slate-400 text-xs mt-1">Please wait for your number to be called</p>
          </div>

          <div className="flex justify-between items-center text-slate-500 text-xs px-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(timestamp, 'MMM dd, yyyy')}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(timestamp, 'hh:mm a')}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
          <button
            onClick={() => window.print()}
            className="w-full py-3 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Ticket
          </button>
          <button
            onClick={onDone}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
          >
            <CheckCircle2 className="w-4 h-4" />
            Done
          </button>
        </div>
      </div>
      
      <p className="text-center text-slate-400 text-xs mt-6 px-8">
        This ticket is valid for today only. Please keep it with you at all times.
      </p>
    </motion.div>
  );
};
