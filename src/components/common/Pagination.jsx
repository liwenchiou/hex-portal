import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination) return null;

  return (
    <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
        Showing Page <span className="text-blue-600">{pagination.current_page}</span> of {pagination.total_pages}
      </p>
      
      <div className="flex items-center gap-2">
        <button
          disabled={!pagination.has_pre}
          onClick={() => onPageChange(pagination.current_page - 1)}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-20 hover:bg-slate-50 transition-all text-slate-600"
        >
          <ChevronLeft size={20} />
        </button>

        {[...Array(pagination.total_pages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            className={`w-12 h-12 rounded-xl font-black transition-all ${
              pagination.current_page === i + 1
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={!pagination.has_next}
          onClick={() => onPageChange(pagination.current_page + 1)}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-20 hover:bg-slate-50 transition-all text-slate-600"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;