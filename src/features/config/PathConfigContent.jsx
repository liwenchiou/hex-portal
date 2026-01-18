import React from "react";
import { PlusSquare, Globe, ExternalLink, ArrowRight, ShieldCheck } from "lucide-react";
import PageTitle from "../../components/layout/PageTitle";

const PathConfigContent = ({ apiPath, onChange, onCheckPath }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <PageTitle 
        icon={PlusSquare} 
        title="設定您的 API PATH" 
        subtitle="Environment Configuration" 
      />

      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-10">
        
        {/* 核心說明區塊 */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
            <ShieldCheck size={24} />
            <h4 className="text-xl font-black">請輸入您的專屬路徑名稱</h4>
          </div>
          
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
            <p className="text-sm font-bold text-slate-600 dark:text-slate-200 leading-relaxed">
              此路徑將作為您與後端資料庫連動的唯一識別碼。系統會根據此 Path 讀取您的商品列表與訂單資訊。
            </p>
            
            {/* 新增的申請指引與連結 */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">還沒有路徑嗎？</span>
              <a 
                href="https://ec-course-api.hexschool.io/" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline decoration-2 underline-offset-4"
              >
                前往六角 API 測試區申請 <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* 輸入區塊 */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Globe size={22} />
          </div>
          <input
            type="text"
            value={apiPath}
            onChange={(e) => onChange(e.target.value)}
            placeholder="請輸入 Path 名稱 (例如：my-shop-v2)"
            className="w-full pl-16 pr-8 py-6 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-lg font-black text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-inner"
          />
        </div>

        {/* 驗證按鈕 */}
        <button
          onClick={onCheckPath}
          className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
        >
          連結 Path 並確認
          <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
        </button>
        
        <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Secure Connection Guaranteed by Hex API
        </p>
      </div>
    </div>
  );
};

export default PathConfigContent;