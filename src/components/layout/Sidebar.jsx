import React from "react";
import { 
  UserPlus, LogIn, PlusSquare, List, FileJson, 
  BookOpen, Layout, X, Menu, ChevronRight 
} from "lucide-react";

// 選單項目元件
const NavItem = ({ active, onClick, icon: Icon, label, expanded, disabled }) => (
  <button 
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`w-full flex items-center transition-all duration-300 group rounded-2xl
      ${expanded ? "px-6 py-4 gap-4" : "p-4 justify-center"}
      ${disabled ? "opacity-10 cursor-not-allowed grayscale pointer-events-none" : 
        active ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20 translate-x-1" : 
        "text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"} 
    `}
  >
    <Icon size={22} className={`${active ? "text-white" : "text-slate-400 group-hover:text-blue-500"} shrink-0`} />
    {expanded && (
      <span className="font-black text-sm whitespace-nowrap overflow-hidden text-slate-900 dark:text-white">
        {label}
      </span>
    )}
    {active && expanded && <ChevronRight size={16} className="ml-auto opacity-50" />}
  </button>
);

const Sidebar = ({ activeTab, onTabChange, isOpen, setIsOpen, hasToken, isPathConfirmed, apiPath }) => {
  // 定義導覽選單配置
  const navItems = [
    { id: "register", label: "1. 帳號註冊", icon: UserPlus, auth: false, needPath: false },
    { id: "login", label: "2. 帳號登入", icon: LogIn, auth: false, needPath: false },
    { id: "path", label: "3. Path 設定", icon: PlusSquare, auth: true, needPath: false },
    { id: "productList", label: "4. 商品列表管理", icon: List, auth: true, needPath: true },
    { id: "jsonUpload", label: "5. JSON 上傳", icon: FileJson, auth: true, needPath: true },
    { id: "docs", label: "6. 文件資源", icon: BookOpen, auth: false, needPath: false },
  ];

  return (
    <>
      {/* 行動版遮罩 (Overlay)：當側邊欄開啟時，背景變暗並提供點擊關閉功能 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-[45] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        /* 基礎佈局：手機版固定，桌面版相對 */
        fixed md:relative h-full z-50 flex flex-col
        bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-500
        
        /* 寬度與位移控制：isOpen 為 false 時手機版完全隱藏，桌面版縮小 */
        ${isOpen ? "w-72 translate-x-0" : "w-20 -translate-x-full md:translate-x-0"}
      `}>
        
        {/* Logo 區域 */}
        <div className={`p-6 flex items-center ${isOpen ? "gap-4" : "justify-center px-0"}`}>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-2xl shadow-xl text-white">
            <Layout size={24} />
          </div>
          {isOpen && (
            <span className="font-black text-2xl tracking-tighter uppercase dark:text-white">
              Hex Portal
            </span>
          )}
        </div>

        {/* 導覽列表 */}
        <nav className="flex-1 px-3 mt-6 space-y-2">
          {navItems.map((item) => {
            // 判斷按鈕是否應該鎖定 (需登入 或 需驗證 Path)
            const isDisabled = (item.auth && !hasToken) || (item.needPath && !isPathConfirmed);
            
            return (
              <NavItem
                key={item.id}
                active={activeTab === item.id}
                onClick={() => {
                  onTabChange(item.id);
                  // 手機版在點擊選項後自動關閉側邊欄
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                icon={item.icon}
                label={item.label}
                expanded={isOpen}
                disabled={isDisabled}
              />
            );
          })}
        </nav>

        {/* 底部目前路徑顯示區 (僅在驗證後且側邊欄展開時顯示) */}
        {isPathConfirmed && isOpen && (
          <div className="px-6 py-4 mt-auto">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Connected Path
              </p>
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm font-bold truncate uppercase font-mono tracking-tight">
                  {apiPath}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 底部切換按鈕：當開啟時顯示 X 以供收合 */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="w-full flex items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-all active:scale-95"
          >
            {isOpen ? (
              <div className="flex items-center gap-2">
                <X size={20} />
                <span className="text-xs font-black uppercase tracking-widest">收合導覽</span>
              </div>
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;