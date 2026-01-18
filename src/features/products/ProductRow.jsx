import React from "react";
import { Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";

const ProductRow = ({ product, onEdit, onDelete }) => {
  return (
    <tr className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-b dark:border-slate-800">
      <td className="py-6 px-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border dark:border-slate-700 shrink-0">
            {product.imageUrl ? (
              <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.title} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px]">No Img</div>
            )}
          </div>
          <div>
            <div className="font-black text-slate-800 dark:text-slate-200 line-clamp-1">{product.title}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-tighter font-bold">{product.category}</div>
          </div>
        </div>
      </td>
      <td className="py-6 px-4">
        <div className="text-xs text-slate-400 line-through">NT$ {product.origin_price?.toLocaleString()}</div>
        <div className="text-sm font-black text-blue-600">NT$ {product.price?.toLocaleString()}</div>
      </td>
      <td className="py-6 px-4">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
          product.is_enabled ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
        }`}>
          {product.is_enabled ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          {product.is_enabled ? "Active" : "Disabled"}
        </div>
      </td>
      <td className="py-6 px-4">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-blue-600 hover:border-blue-600 shadow-sm transition-all"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-red-600 hover:border-red-600 shadow-sm transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;