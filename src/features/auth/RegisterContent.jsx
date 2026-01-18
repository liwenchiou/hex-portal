import React from "react";
import { UserPlus, Sparkles } from "lucide-react";
import FormField from "../../components/common/FormField";

const RegisterContent = ({ registerData, onChange, onRegister }) => (
  <div className="max-w-xl mx-auto space-y-8">
    <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
      <div className="flex items-center gap-3 mb-8">
        <UserPlus size={32} className="text-blue-600" />
        <h2 className="text-2xl font-black">註冊新帳號</h2>
      </div>
      <div className="space-y-6">
        <FormField label="Email" name="username" value={registerData.username} onChange={onChange} placeholder="example@mail.com" />
        <FormField label="密碼" name="password" type="password" value={registerData.password} onChange={onChange} />
        <button 
          onClick={onRegister}
          className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Sparkles size={20} /> 立即註冊
        </button>
      </div>
    </div>
  </div>
);

export default RegisterContent;