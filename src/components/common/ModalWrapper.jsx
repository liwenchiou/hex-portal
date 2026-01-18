import React from "react";
import { X } from "lucide-react";

const ModalWrapper = ({ title, icon, children, onClose, footer, maxWidth = "max-w-2xl" }) => (
  <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
    {/* 背景遮罩 */}
    <div
      className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      onClick={onClose}
    ></div>
    
    {/* 視窗主體 */}
    <div className={`relative bg-white dark:bg-slate-800 w-full ${maxWidth} rounded-[2.5rem] shadow-2xl overflow-hidden border dark:border-slate-700 animate-modal flex flex-col text-slate-800 dark:text-white max-h-[92vh]`}>
      
      {/* Header */}
      <div className="p-8 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 shrink-0">
        <h4 className="text-xl font-black flex items-center gap-3">
          {icon} {title}
        </h4>
        <button 
          onClick={onClose}
          className="p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all"
        >
          <X size={24} />
        </button>
      </div>

      {/* Body */}
      <div className="p-10 overflow-y-auto">
        {children}
      </div>

      {/* Footer */}
      <div className="p-8 border-t dark:border-slate-700 flex justify-end gap-4 bg-slate-50 dark:bg-slate-900/50 shrink-0">
        {footer || (
          <button
            onClick={onClose}
            className="px-10 py-3.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black rounded-2xl active:scale-95 transition-all"
          >
            關閉視窗
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ModalWrapper;