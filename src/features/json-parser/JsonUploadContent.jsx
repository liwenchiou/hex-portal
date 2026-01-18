import React, { useState } from "react";
import { FileJson, UploadCloud, Globe, Code, Copy, Check } from "lucide-react";
import PageTitle from "../../components/layout/PageTitle";

const JSON_EXAMPLE = [
  {
    "title": "範例商品 A",
    "category": "測試分類",
    "origin_price": 1000,
    "price": 800,
    "unit": "個",
    "description": "這是商品描述",
    "content": "這是商品詳細內容",
    "is_enabled": 1,
    "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    "imagesUrl": ["", "", "", "", ""]
  }
];

const JsonUploadContent = ({ apiPath, onBulkUpload }) => {
  const [jsonInput, setJsonInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [showExample, setShowExample] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(JSON_EXAMPLE, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProcess = () => {
    try {
      const data = JSON.parse(jsonInput);
      onBulkUpload(Array.isArray(data) ? data : [data]);
      setJsonInput("");
    } catch (e) {
      alert("JSON 格式錯誤，請檢查語法（例如括號或逗號是否正確）。");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageTitle 
        icon={FileJson} 
        title="JSON 批量上傳" 
        subtitle="Bulk Import Tool" 
      />

      <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* API 狀態資訊 */}
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-tight">
              Target Path: <span className="font-mono ml-1">{apiPath || "未設定"}</span>
            </span>
          </div>
          <button 
            onClick={() => setShowExample(!showExample)}
            className="text-[10px] font-black uppercase px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all flex items-center gap-1.5"
          >
            <Code size={12} /> {showExample ? "隱藏範例" : "查看範例格式"}
          </button>
        </div>

        {/* 範例展示區 */}
        {showExample && (
          <div className="relative group animate-in zoom-in-95 duration-200">
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={handleCopy}
                className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:scale-110 active:scale-95 transition-all shadow-sm me-4"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>
            <pre className="p-6 bg-slate-900 text-emerald-400 text-xs font-mono rounded-2xl overflow-x-auto border border-slate-800 shadow-inner max-h-48">
              {JSON.stringify(JSON_EXAMPLE, null, 2)}
            </pre>
          </div>
        )}

        {/* 輸入區域 */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 dark:text-slate-200 uppercase tracking-widest px-1">
            請貼上 JSON 數據陣列
          </label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='[ { "title": "商品名稱", ... } ]'
            className="w-full h-80 p-6 font-mono text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-indigo-600 dark:text-indigo-400 transition-all shadow-inner placeholder:text-slate-300 dark:placeholder:text-slate-800"
          />
        </div>

        <button 
          onClick={handleProcess}
          disabled={!jsonInput.trim()}
          className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale disabled:pointer-events-none"
        >
          <UploadCloud size={24} /> 
          <span className="text-lg">開始批量導入數據</span>
        </button>
      </div>
    </div>
  );
};

export default JsonUploadContent;