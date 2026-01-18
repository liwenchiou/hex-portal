import React from "react";

const MainLayout = ({ sidebar, header, children }) => {
  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 flex font-sans antialiased overflow-hidden text-slate-900 dark:text-slate-100">
      {sidebar}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {header}
        <section className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainLayout;