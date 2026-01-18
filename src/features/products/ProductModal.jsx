import React from "react";
import { Edit3, ImageIcon, Save, X, Layers } from "lucide-react";
import FormField from "../../components/common/FormField";

const ProductModal = ({ isOpen, onClose, product, onChange, onSave, isEdit = false }) => {
  if (!isOpen) return null;

  const handleSubImgChange = (idx, val) => {
    const currentImages = product.imagesUrl && product.imagesUrl.length > 0 
      ? [...product.imagesUrl] 
      : ["", "", "", "", ""];
    currentImages[idx] = val;
    onChange({ ...product, imagesUrl: currentImages });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border dark:border-slate-700 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20"><Edit3 size={24} /></div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white">{isEdit ? "編輯商品詳細資訊" : "新增商品資訊"}</h4>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-100 rounded-2xl hover:scale-110 transition-all"><X /></button>
        </div>

        {/* Body */}
        <div className="p-10 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* 左側資訊 */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800">
                <span className="text-sm font-black text-blue-900 dark:text-blue-100">產品啟用狀態</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={product.is_enabled === 1} onChange={(e) => onChange({...product, is_enabled: e.target.checked ? 1 : 0})} />
                  <div className="w-12 h-6 bg-slate-300 rounded-full peer dark:bg-slate-700 peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="商品標題" value={product.title} spanFull onChange={(e) => onChange({...product, title: e.target.value})} />
                <FormField label="分類" value={product.category} onChange={(e) => onChange({...product, category: e.target.value})} />
                <FormField label="單位" value={product.unit} onChange={(e) => onChange({...product, unit: e.target.value})} />
                <FormField label="原價" type="number" value={product.origin_price} onChange={(e) => onChange({...product, origin_price: parseInt(e.target.value) || 0})} />
                <FormField label="售價" type="number" value={product.price} onChange={(e) => onChange({...product, price: parseInt(e.target.value) || 0})} />
                <FormField label="描述內容" type="textarea" value={product.content} spanFull onChange={(e) => onChange({...product, content: e.target.value})} />
              </div>
            </div>

            {/* 右側圖片預覽區 */}
            <div className="space-y-6">
              <div className="aspect-video bg-slate-100 dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" alt="Main" /> : <ImageIcon size={40} className="text-slate-300 dark:text-slate-700" />}
              </div>
              <FormField label="主圖網址" value={product.imageUrl} onChange={(e) => onChange({...product, imageUrl: e.target.value})} />

              {/* 副圖集 */}
              <div className="space-y-4 pt-4 border-t dark:border-slate-800">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-200 uppercase flex items-center gap-2"><Layers size={14} /> 副圖集與即時預覽</label>
                <div className="grid grid-cols-5 gap-2">
                  {[0, 1, 2, 3, 4].map((i) => {
                    const imgUrl = product.imagesUrl && product.imagesUrl[i];
                    return (
                      <div key={i} className="aspect-square bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden">
                        {imgUrl ? <img src={imgUrl} className="w-full h-full object-cover" alt={`sub-${i}`} /> : <span className="text-[10px] font-black text-slate-300 dark:text-slate-700">{i + 1}</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <input 
                      key={i} 
                      value={(product.imagesUrl && product.imagesUrl[i]) || ""} 
                      onChange={(e) => handleSubImgChange(i, e.target.value)} 
                      placeholder={`副圖連結 ${i + 1}`} 
                      className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t dark:border-slate-700 flex justify-end gap-4 bg-slate-50 dark:bg-slate-950/50">
          <button onClick={onClose} className="px-8 py-3 font-black text-slate-500 dark:text-slate-200 hover:text-slate-800 dark:hover:text-white">取消</button>
          <button onClick={onSave} className="px-12 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-xl flex items-center gap-2 active:scale-95 transition-all"><Save size={18} /> 儲存商品內容</button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;