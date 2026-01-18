import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, productTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* 視窗主體 */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-red-100 dark:border-red-900/30 animate-in fade-in zoom-in duration-200">
        
        {/* 頂部警示圖示 */}
        <div className="pt-10 pb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center animate-pulse">
            <AlertTriangle size={40} strokeWidth={2.5} />
          </div>
        </div>

        {/* 文字內容 */}
        <div className="px-10 text-center space-y-3">
          <h3 className="text-xl font-black text-slate-800 dark:text-white">確定要刪除嗎？</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            您即將刪除「<span className="font-black text-red-600 underline decoration-2 underline-offset-4">{productTitle}</span>」。此動作無法復原，請確認是否繼續？
          </p>
        </div>

        {/* 操作按鈕 */}
        <div className="p-8 mt-6 flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-500/30 hover:bg-red-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={18} /> 確認永久刪除
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            取消
          </button>
        </div>

        {/* 右上角關閉按鈕 */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;