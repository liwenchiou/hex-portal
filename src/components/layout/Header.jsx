import React from "react";
import { Menu, LogOut, Database } from "lucide-react";

const Header = ({ activeTab, onMenuClick, onLogout, hasToken, apiPath, isPathConfirmed, isSidebarOpen }) => {
  const getDisplayTitle = () => {
    const titles = { productList: "Management", jsonUpload: "JSON Parser", path: "Environment" };
    return titles[activeTab] || activeTab.toUpperCase();
  };

  return (
    <header className="h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 md:px-10 flex items-center justify-between z-10 shrink-0">
      <div className="flex items-center gap-6">
        {/* 邏輯修正：md:hidden 確保此按鈕在桌面版完全消失，僅在手機版且側邊欄關閉時出現 */}
        <button 
          onClick={onMenuClick} 
          className={`p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-200 transition-all duration-300 md:hidden ${
            isSidebarOpen ? "opacity-0 pointer-events-none -translate-x-5" : "opacity-100"
          }`}
        >
          <Menu size={24} />
        </button>
        
        {/* 標題在桌面版會因為沒有漢堡按鈕而自動靠左，視覺上更乾淨 */}
        <h2 className="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-white">
          {getDisplayTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* 環境顯示標籤 */}
        {isPathConfirmed && (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
            <Database size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-black text-blue-700 dark:text-blue-300 font-mono uppercase">
              {apiPath}
            </span>
          </div>
        )}

        {hasToken && (
          <button 
            onClick={onLogout} 
            className="flex items-center gap-3 px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl font-black text-slate-700 dark:text-slate-100 hover:text-red-600 dark:hover:text-red-400 transition-all active:scale-95"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">登出系統</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;