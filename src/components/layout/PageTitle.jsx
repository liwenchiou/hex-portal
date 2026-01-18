import React from "react";

const PageTitle = ({ icon: Icon, title, subtitle, extra }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-slate-200 dark:border-slate-800 pb-6 gap-6">
    <div>
      {/* 主標題：dark:text-blue-400 提升亮度 */}
      <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400 flex items-center gap-3">
        {Icon && <Icon size={32} />} {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-slate-600 dark:text-slate-200 mt-2 uppercase font-black tracking-widest bg-slate-100 dark:bg-slate-800 w-fit px-3 py-1.5 rounded-lg">
          {subtitle}
        </p>
      )}
    </div>
    {extra && <div className="w-full md:w-auto">{extra}</div>}
  </div>
);

export default PageTitle;