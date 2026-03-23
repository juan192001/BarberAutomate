import React from 'react';
import { cn } from '../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className, ...props }: CardProps) => (
  <div 
    className={cn(
      "bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden",
      className
    )} 
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className, ...props }: CardProps) => (
  <div className={cn("px-6 py-4 border-b border-slate-100", className)} {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, className, ...props }: CardProps) => (
  <div className={cn("px-6 py-4", className)} {...props}>
    {children}
  </div>
);

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline: "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const Badge = ({ 
  children, 
  variant = 'neutral',
  className
}: { 
  children: React.ReactNode; 
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}) => {
  const variants = {
    neutral: "bg-slate-100 text-slate-600",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border border-amber-100",
    error: "bg-red-50 text-red-700 border border-red-100",
    info: "bg-blue-50 text-blue-700 border border-blue-100",
  };

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider", variants[variant], className)}>
      {children}
    </span>
  );
};

import { X } from 'lucide-react';

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
