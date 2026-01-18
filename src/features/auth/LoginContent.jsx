import React from "react";
import { LogIn, ShieldCheck } from "lucide-react";
import PageTitle from "../../components/layout/PageTitle";
import FormField from "../../components/common/FormField";

const LoginContent = ({ loginData, onChange, onLogin }) => {
  return (
    <div className="max-w-xl mx-auto">
      <PageTitle 
        title="管理者登入" 
        subtitle="Authentication" 
        icon={LogIn} 
      />
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
        <div className="space-y-6">
          <FormField 
            label="Email Address" 
            type="email" 
            name="username"
            value={loginData.username} 
            onChange={onChange} 
            placeholder="admin@example.com"
          />
          <FormField 
            label="Password" 
            type="password" 
            name="password"
            value={loginData.password} 
            onChange={onChange} 
            placeholder="••••••••"
          />
        </div>
        <button 
          onClick={onLogin}
          className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <ShieldCheck size={20} /> 登入帳號
        </button>
      </div>
    </div>
  );
};

export default LoginContent;