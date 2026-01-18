import React from "react";
import { PackageSearch, List, PlusCircle } from "lucide-react";
import PageTitle from "../../components/layout/PageTitle";
import Pagination from "../../components/common/Pagination";
import ProductRow from "./ProductRow";

const ProductListContent = ({ products, pagination, onPageChange, onEdit, onDelete, onAddNew }) => {
  return (
    <>
      <PageTitle 
        title="商品列表管理" 
        subtitle="Data Inventory" 
        icon={List} 
        extra={
          // 將新增按鈕放在標題右側
          <button 
            onClick={onAddNew}
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
          >
            <PlusCircle size={20} />
            <span>建立新商品</span>
          </button>
        }
      />

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="py-6 px-6 text-[10px] font-black uppercase text-slate-500 dark:text-slate-300 tracking-widest">商品細節</th>
                <th className="py-6 px-4 text-[10px] font-black uppercase text-slate-500 dark:text-slate-300 tracking-widest w-40">價格</th>
                <th className="py-6 px-4 text-[10px] font-black uppercase text-slate-500 dark:text-slate-300 tracking-widest w-32 text-center">狀態</th>
                <th className="py-6 px-6 text-[10px] font-black uppercase text-slate-500 dark:text-slate-300 tracking-widest w-32 text-right">管理操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {products.length > 0 ? (
                products.map((p) => (
                  <ProductRow key={p.id} product={p} onEdit={onEdit} onDelete={onDelete} />
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <PackageSearch size={64} className="text-slate-200 dark:text-slate-800" />
                      <p className="font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        目前沒有任何商品，點擊右上方按鈕新增。
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </>
  );
};

export default ProductListContent;