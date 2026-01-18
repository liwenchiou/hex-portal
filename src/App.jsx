import React, { useEffect, useState } from "react";
import axiosInstance from "./api/axiosInstance";

// Layout & Features
import MainLayout from "./components/layout/MainLayout";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import LoginContent from "./features/auth/LoginContent";
import RegisterContent from "./features/auth/RegisterContent";
import PathConfigContent from "./features/config/PathConfigContent";
import ProductListContent from "./features/products/ProductListContent";
import JsonUploadContent from "./features/json-parser/JsonUploadContent";
import DocsContent from "./features/docs/DocsContent";

// Modals
import ProductModal from "./features/products/ProductModal";
import DeleteConfirmModal from "./features/products/DeleteConfirmModal";
import AlertModal from "./components/common/AlertModal";

const EMPTY_PRODUCT = { title: "", category: "", origin_price: 0, price: 0, unit: "", description: "", content: "", is_enabled: 0, imageUrl: "", imagesUrl: ["", "", "", "", ""] };

function App() {
  const [activeTab, setActiveTab] = useState("register");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tokenData, setTokenData] = useState("");
  const [apiPath, setApiPath] = useState("");
  const [isPathConfirmed, setIsPathConfirmed] = useState(false);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [tempProduct, setTempProduct] = useState(EMPTY_PRODUCT);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", password: "" });

  useEffect(() => {
    const match = document.cookie.match(/(^|;)\s*hexToken\s*=\s*([^;]+)/);
    const token = match ? match[2] : null;
    if (token) {
      setTokenData(token);
      setActiveTab("path");
    }

    const handleResize = () => {
      // 桌面版預設開啟，行動版預設關閉
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getProducts = async (page = 1) => {
    if (!apiPath) return false;
    try {
      const res = await axiosInstance.get(`/api/${apiPath}/admin/products?page=${page}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
      setIsPathConfirmed(true);
      return true;
    } catch (err) {
      setIsPathConfirmed(false);
      showAlert("Path 驗證失敗");
      return false;
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axiosInstance.post("/admin/signin", loginData);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;
      setTokenData(token);
      setActiveTab("path");
      showAlert("登入成功");
    } catch (err) { showAlert("登入失敗"); }
  };

  const handleRegister = async () => {
    try {
      await axiosInstance.post("/signup", registerData);
      showAlert("註冊成功");
      setActiveTab("login");
    } catch (err) { showAlert("註冊失敗"); }
  };

  const saveProduct = async () => {
    const isEdit = !!tempProduct.id;
    const url = isEdit ? `/api/${apiPath}/admin/product/${tempProduct.id}` : `/api/${apiPath}/admin/product`;
    try {
      await axiosInstance[isEdit ? "put" : "post"](url, { data: tempProduct });
      setIsProductModalOpen(false);
      getProducts(pagination.current_page || 1);
      showAlert("儲存成功");
    } catch (err) { showAlert("儲存失敗"); }
  };

  const deleteProduct = async () => {
    try {
      await axiosInstance.delete(`/api/${apiPath}/admin/product/${tempProduct.id}`);
      setIsDeleteModalOpen(false);
      getProducts(1);
      showAlert("已刪除");
    } catch (err) { showAlert("失敗"); }
  };

  const showAlert = (msg) => { setAlertMsg(msg); setIsAlertOpen(true); };

  const renderContent = () => {
    switch (activeTab) {
      case "register": return <RegisterContent registerData={registerData} onChange={(e) => setRegisterData({...registerData, [e.target.name]: e.target.value})} onRegister={handleRegister} />;
      case "login": return <LoginContent loginData={loginData} onChange={(e) => setLoginData({...loginData, [e.target.name]: e.target.value})} onLogin={handleLogin} />;
      case "path": return <PathConfigContent apiPath={apiPath} onChange={setApiPath} onCheckPath={async () => { if(await getProducts()){ setActiveTab("productList"); } }} />;
      case "productList": return <ProductListContent products={products} pagination={pagination} onPageChange={getProducts} onEdit={(p) => { setTempProduct(p); setIsProductModalOpen(true); }} onDelete={(p) => { setTempProduct(p); setIsDeleteModalOpen(true); }} onAddNew={() => { setTempProduct(EMPTY_PRODUCT); setIsProductModalOpen(true); }} />;
      case "jsonUpload": return <JsonUploadContent apiPath={apiPath} onBulkUpload={async (data) => {
        showAlert("批量上傳中...");
        for (const item of data) { await axiosInstance.post(`/api/${apiPath}/admin/product`, { data: item }); }
        showAlert("上傳完成");
        getProducts();
        setActiveTab("productList");
      }} />;
      case "docs": return <DocsContent />;
      default: return null;
    }
  };

  return (
    <MainLayout
      sidebar={<Sidebar activeTab={activeTab} onTabChange={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} hasToken={!!tokenData} isPathConfirmed={isPathConfirmed} apiPath={apiPath} />}
      header={
        <Header 
          activeTab={activeTab} 
          hasToken={!!tokenData} 
          apiPath={apiPath} 
          isPathConfirmed={isPathConfirmed} 
          isSidebarOpen={isSidebarOpen} 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          onLogout={() => { document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; window.location.reload(); }} 
        />
      }
    >
      {renderContent()}
      <ProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} product={tempProduct} onChange={setTempProduct} onSave={saveProduct} isEdit={!!tempProduct.id} />
      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={deleteProduct} productTitle={tempProduct.title} />
      <AlertModal isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} message={alertMsg} />
    </MainLayout>
  );
}

export default App;