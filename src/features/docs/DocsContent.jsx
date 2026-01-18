import React from "react";
import { BookOpen, Globe, LinkIcon, ExternalLink } from "lucide-react";

const DocsContent = () => (
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl group">
      <BookOpen className="text-blue-600 mb-6" size={40} />
      <h4 className="text-2xl font-black mb-4">課程 API 文件</h4>
      <p className="text-slate-500 mb-8 text-sm font-bold">官方提供的 Swagger UI 資源，包含 Admin 端所有資料管理功能與 API 回傳結構說明。</p>
      <a href="https://hexschool.github.io/ec-courses-api-swaggerDoc/" target="_blank" className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all">
        查看 Swagger <ExternalLink size={18} />
      </a>
    </div>
    <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl group">
      <Globe className="text-indigo-600 mb-6" size={40} />
      <h4 className="text-2xl font-black mb-4">API 申請平台</h4>
      <p className="text-slate-500 mb-8 text-sm font-bold">前往六角學院官方系統申請您的專屬 Path ID，並隨時管理個人練習用資料庫。</p>
      <a href="https://ec-course-api.hexschool.io/" target="_blank" className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all">
        前往申請 <ExternalLink size={18} />
      </a>
    </div>
  </div>
);

export default DocsContent;