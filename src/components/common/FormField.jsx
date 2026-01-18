import React from "react";

const FormField = ({ label, value, onChange, type = "text", spanFull = false, name, placeholder = "" }) => {
  const isTextArea = type === "textarea";
  // 提升文字對比度：text-slate-900 (淺) / dark:text-white (深)
  const inputClassName = "w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500";

  return (
    <div className={`${spanFull ? "md:col-span-2" : ""} space-y-2`}>
      <label className="block text-[10px] font-black uppercase text-slate-600 dark:text-slate-200 mb-1.5 px-1 tracking-tight">
        {label}
      </label>
      {isTextArea ? (
        <textarea rows="4" value={value || ""} onChange={onChange} name={name} className={inputClassName} />
      ) : (
        <input type={type} value={value || ""} onChange={onChange} name={name} placeholder={placeholder} className={inputClassName} />
      )}
    </div>
  );
};

export default FormField;