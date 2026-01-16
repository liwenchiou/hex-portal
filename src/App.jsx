import React, { useEffect, useState } from "react";
import {
  UserPlus,
  LogIn,
  LogOut,
  PlusSquare,
  Package,
  List,
  BookOpen,
  Layout,
  Menu,
  X,
  ChevronRight,
  Info,
  Copy,
  CheckCircle2,
  Database,
  Image as ImageIcon,
  Layers,
  ImageOff,
  Edit3,
  Trash2,
  Search,
  Save,
  Type,
  AlertTriangle,
  FileJson,
  UploadCloud,
  Code,
  Globe,
  ExternalLink as LinkIcon,
} from "lucide-react";
import axios from "axios";
/**
 * 六角學院 API 威力加強版 - 整合式開發者門戶
 * * 本程式碼整合了：
 * 1. 完整的 RWD 佈局與側邊欄對稱校正
 * 2. 符合官方規範之商品 $data 物件結構 (含 5 張副圖)
 * 3. 統一全站 PageTitle 風格
 * 4. 受控元件狀態管理，解決 React Uncontrolled Warning
 */

// --- 模擬資料與靜態內容 ---
const MOCK_PRODUCTS = [
  {
    id: "p001",
    title: "[賣]動物園造型衣服3",
    category: "衣服2",
    origin_price: 100,
    price: 300,
    unit: "個",
    description: "Sit down please 名設計師設計",
    content: "這是一件非常有設計感的衣服，穿上它你就是焦點。",
    is_enabled: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1535573350713-b5a1ec45f2b3?auto=format&fit=crop&q=80&w=400",
    imagesUrl: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200",
      "",
      "",
      "",
      "",
    ],
  },
  {
    id: "p002",
    title: "特製拿鐵咖啡",
    category: "飲品",
    origin_price: 150,
    price: 120,
    unit: "杯",
    description: "香醇濃郁的義式咖啡",
    content: "選用衣索比亞精品咖啡豆，職人烘焙。",
    is_enabled: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400",
    imagesUrl: ["", "", "", "", ""],
  },
];

const JSON_EXAMPLE_DATA = [
  {
  title: "[賣]動物園造型衣服3",
  category: "衣服2",
  origin_price: 100,
  price: 300,
  unit: "個",
  description: "Sit down please 名設計師設計",
  content: "這是內容",
  is_enabled: 1,
  imageUrl: "主圖網址",
  imagesUrl: ["網址一", "網址二", "網址三", "網址四", "網址五"],
}
];

// --- 子組件與 UI 元件 ---

// 1. 彈窗封裝容器
const ModalWrapper = ({ title, icon, children, onClose }) => (
  <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      onClick={onClose}
    ></div>
    <div className="relative bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border dark:border-slate-700 animate-modal flex flex-col text-slate-800 dark:text-white">
      <div className="p-8 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 shrink-0">
        <h4 className="text-xl font-black flex items-center gap-3">
          {icon} {title}
        </h4>
        <button type="button"
          onClick={onClose}
          className="p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all"
        >
          <X size={24} />
        </button>
      </div>
      <div className="p-10 overflow-y-auto">{children}</div>
      <div className="p-8 border-t dark:border-slate-700 flex justify-end bg-slate-50 dark:bg-slate-900/50 shrink-0">
        <button type="button"
          onClick={onClose}
          className="px-10 py-3.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black rounded-2xl active:scale-95 transition-all"
        >
          關閉視窗
        </button>
      </div>
    </div>
  </div>
);

// 2. 側邊欄導覽項目
const NavItem = ({
  active,
  onClick,
  icon: Icon,
  label,
  expanded,
  disabled,
}) => (
  <button type="button"
    // HTML 原生屬性，當為 true 時會自動攔截 onClick
    disabled={disabled}
    onClick={onClick}
    className={`w-full flex items-center transition-all duration-300 group rounded-2xl
      ${expanded ? "px-6 py-4 gap-4" : "p-4 justify-center"}
      ${
        active
          ? "bg-blue-600 text-white shadow-xl translate-x-1"
          : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
      }
      ${
        disabled
          ? "opacity-30 cursor-not-allowed grayscale" // 禁用時：極低透明度、禁止符號、去色
          : active
          ? "bg-blue-600 text-white shadow-xl translate-x-1"
          : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
  >
    <Icon
      size={22}
      className={`${
        active ? "text-white" : "text-slate-400 group-hover:text-blue-500"
      } shrink-0`}
    />
    {expanded && (
      <span className="font-black text-sm whitespace-nowrap overflow-hidden">
        {label}
      </span>
    )}
    {active && expanded && (
      <ChevronRight size={16} className="ml-auto opacity-50" />
    )}
  </button>
);

// 3. 表單輸入欄位
const FormField = ({
  label,
  value,
  onChange,
  type = "text",
  spanFull = false,
  name,
}) => (
  <div className={`${spanFull ? "md:col-span-2" : ""} space-y-2`}>
    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 px-1 tracking-tight">
      {label}
    </label>
    <input
      type={type}
      value={value ?? ""}
      onChange={onChange ?? ""}
      name={name ?? ""}
      className="w-full p-4 rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold text-slate-800 dark:text-slate-200 shadow-sm"
    />
  </div>
);

// 4. 區塊小標題
const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest border-b pb-3">
    {icon} <span>{title}</span>
  </div>
);

// 5. 統一的分頁標題
const PageTitle = ({ icon: Icon, title, subtitle, extra }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b dark:border-slate-700 pb-6 gap-6">
    <div>
      <h3 className="text-3xl font-black text-blue-600 flex items-center gap-3">
        <Icon size={32} /> {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-slate-400 mt-2 uppercase font-bold tracking-widest bg-slate-50 dark:bg-slate-900 w-fit px-2 py-1 rounded">
          {subtitle}
        </p>
      )}
    </div>
    {extra && <div>{extra}</div>}
  </div>
);

// --- 主應用程式組件 ---

function App() {
  const [registerData, setRegisterData] = useState({}); //儲存註冊表單
  const [loginData, setLoginData] = useState({}); //儲存登入表單
  const [tokenData, setTokenData] = useState(""); //儲存token
  // const [uid, setUid] = useState(""); //儲存uid
  const [activeTab, setActiveTab] = useState("register");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 模態框顯示控制
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [isExModalOpen, setIsExModalOpen] = useState(false);

  // 初始化商品資料模板
  const emptyProductTemplate = {
    title: "",
    category: "",
    origin_price: 0,
    price: 0,
    unit: "",
    description: "",
    content: "",
    is_enabled: 0,
    imageUrl: "",
    imagesUrl: ["", "", "", "", ""],
  };

  // 資料狀態管理
  const [tempProduct, setTempProduct] = useState(emptyProductTemplate);
  const [productData, setProductData] = useState({
    ...emptyProductTemplate,
    origin_price: 0,
    price: 0,
  });
  const [products, setProducts] = useState([]);

  const [jsonInput, setJsonInput] = useState([]);
  // const [addPath, setAddPath] = useState(""); //新增Path
  const [selectPath, setSelectPath] = useState(""); //選定Path
  const [isPath, setIsPath] = useState(false); //Path 確認狀態
  const [selectPathData, setSelectPathData] = useState(""); //已確認的Path
  const [pageInfo, setPageInfo] = useState({}); //設定選定頁數
  // 事件處理程序
  const handleLogout = () => {
    setActiveTab("login");
    setTokenData("");
    document.cookie = `hexToken=; expires=; uid= `;
    document.cookie = `hexUid=; `;
    setIsPath(false);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setIsDelModalOpen(false);
    setIsExModalOpen(false);
  };

  const openEditModal = (p) => {
    const images =
      p.imagesUrl && p.imagesUrl.length === 5
        ? [...p.imagesUrl]
        : ["", "", "", "", ""];
    setTempProduct({ ...emptyProductTemplate, ...p, imagesUrl: images });
    setIsModalOpen(true);
  };

  const openDelModal = (p) => {
    setTempProduct({ ...emptyProductTemplate, ...p });
    setIsDelModalOpen(true);
  };

  const handleInputChange = (setter, state, field, value) => {
    setter({ ...state, [field]: value });
    console.log(field+" -> "+value);
  };

  // const handleCreateProdustInputChange=(e)=>{
  //   // const{name,value}=e.target;
  //   console.log(e.value);
  // }

  const handleSubImgChange = (setter, state, idx, val) => {
    const arr = [...state.imagesUrl];
    arr[idx] = val;
    setter({ ...state, imagesUrl: arr });
  };

  //撰寫區塊

  //註冊

  //註冊輸入框
  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };
  const registerSubmit = async () => {
    try {
      const response = await axios.post(
        "https://ec-course-api.hexschool.io/signup",
        registerData
      );
      console.log("註冊成功:", response.data);
      alert("註冊成功！");
    } catch (error) {
      console.error("註冊失敗:", error.response?.data || error.message);
      alert("註冊失敗，請稍後再試");
    }
  };

  //登入
  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const loginSubmit = async () => {
    try {
      const response = await axios.post(
        "https://ec-course-api.hexschool.io/v2/admin/signin",
        loginData
      );
      console.log("登入成功:", response.data);
      alert("登入成功！");
      //把token 記錄起來
      const { token, expired, uid } = response.data;
      //測試抓取 token expired
      //把 token 跟 expired 存到 cookie中
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
      // document.cookie = `hexUid=${uid}; expires=${new Date(expired)}`;
      //請求前先帶上 token
      axios.defaults.headers.common["Authorization"] = response.data.token;
      setTokenData(response.data.token);
      // setUid(response.data.uid);
    } catch (error) {
      console.error("登入失敗:", error.response?.data || error.message);
      alert("登入失敗，請稍後再試");
    }
  };

  //path
  const selectPathSubmit = async () => {
    console.log("我要確認path");
    try {
      const response = await axios.get(
        `https://ec-course-api.hexschool.io/v2/api/${selectPath}/admin/products?page=1`
      );
      console.log(`${selectPath} 存在，可以使用:`, response.data);
      alert(`${selectPath} 存在，可以使用`);
      setIsPath(true);
      setSelectPathData(selectPath);
      setSelectPath("");
      getProducts(selectPath);
    } catch (error) {
      console.error(
        `${selectPath} 不存在:`,
        error.response?.data || error.message
      );
      alert(`${selectPath} 不存在或非該帳號所申請的 Path，請至六角 API 確認`);
      setIsPath(false);
    }
  };

  //新增商品
  const produstCreateSubmit = async () => {
    console.log("我要新增產品");
    try {
      const response = await axios.post(
        `https://ec-course-api.hexschool.io/v2/api/${selectPathData}/admin/product`,
        {
          data: productData,
        }
      );
      console.log("新增商品成功:", response.data);
      alert("新增商品成功！");
      getProducts(selectPathData);
    } catch (error) {
      console.error("新增商品失敗:", error.response?.data || error.message);
      alert("新增商品失敗，請稍後再試");
    }
  };

  //取得產品清單
  const getProducts = async (pathData,page=1) => {
    console.log("我要取得產品清單");
    try {
      const response = await axios.get(
        `https://ec-course-api.hexschool.io/v2/api/${pathData}/admin/products?page=${page}`
      );
      setPageInfo(response.data.pagination);
      setProducts(response.data.products);
      console.log("取得產品列表成功", response.data);
    } catch (error) {
      console.error("取得產品列表失敗", error.response?.data || error.message);
    }
  };

    //點擊換頁
  const handleChangePage = (page) => {
    console.log(page);
    getProducts(selectPathData,page);
  };

  //更新產品
  const produstUpdateSubmit = async () => {
    console.log("我要更新產品");

    try {
      const response = await axios.put(
        `https://ec-course-api.hexschool.io/v2/api/${selectPathData}/admin/product/${tempProduct.id}`,
        {
          data: tempProduct,
        }
      );
      console.log("更新商品成功:", response.data);
      alert("更新商品成功！");
      getProducts(selectPathData);
      closeModals();
    } catch (error) {
      console.error("更新商品失敗:", error.response?.data || error.message);
      alert("更新商品失敗，請稍後再試");
    }
  };

  //刪除產品
  const produstDeleteSubmit = async () => {
    console.log("我要刪除產品");

    try {
      const response = await axios.delete(
        `https://ec-course-api.hexschool.io/v2/api/${selectPathData}/admin/product/${tempProduct.id}`
      );
      console.log("刪除商品成功:", response.data);
      alert("刪除商品成功！");
      getProducts(selectPathData);
      closeModals();
    } catch (error) {
      console.error("刪除商品失敗:", error.response?.data || error.message);
      alert("刪除商品失敗，請稍後再試");
    }
  };

  //JSON匯入
  const jsonInputSubmit=async()=>{
    console.log("我要匯入JSON囉!!");
    await JSON.parse(jsonInput).forEach(async(item) => {
      try {
        const response = await axios.post(
          `https://ec-course-api.hexschool.io/v2/api/${selectPathData}/admin/product`,
          {
            data: item,
          }
        );
        console.log("新增商品成功:", response.data);
      } catch (error) {
        console.error("新增商品失敗:", error.response?.data || error.message);
      }
    });
    alert("JSON 匯入完成!!");
    setJsonInput('');
    getProducts(selectPathData);
  }

  useEffect(() => {
    //抓cookie裡面的token
    const token = document.cookie
      .match(/(^|;)\s*hexToken\s*=\s*([^;]+)/)
      ?.at(2);
    // const uid = document.cookie.match(/(^|;)\s*hexUid\s*=\s*([^;]+)/)?.at(2);

    //請求前先帶上 token
    axios.defaults.headers.common["Authorization"] = token;
    setTokenData(token);
    // setUid(uid);
  }, []);

  
  //撰寫區塊

  // --- 分頁內容渲染器 ---
  const renderContent = () => {
    switch (activeTab) {
      case "register":
        return (
          <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white">
            <PageTitle
              icon={UserPlus}
              title="1. 帳號註冊"
              subtitle="Developer Onboarding"
            />
            <div className="space-y-4 mt-6">
              <FormField
                label="Email Address"
                name="username"
                onChange={(e) => handleRegisterInputChange(e)}
                value={registerData.username}
              />
              <FormField
                label="Password"
                type="password"
                name="password"
                onChange={(e) => handleRegisterInputChange(e)}
                value={registerData.password}
              />
              <FormField
                label="Confirm Password"
                type="password"
                name="confirm_password"
                onChange={(e) => handleRegisterInputChange(e)}
                value={registerData.confirm_password}
              />
              <button type="button"
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                onClick={() => {
                  registerSubmit();
                }}
              >
                註冊帳號
              </button>
            </div>
          </div>
        );

      case "login":
        return (
          <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm text-slate-800 dark:text-white">
            <PageTitle
              icon={LogIn}
              title="2. 帳號登入"
              subtitle="Secure Authorization"
            />
            <div className="space-y-4 mt-6">
              <FormField
                label="Email"
                name="username"
                value={loginData.username}
                onChange={handleLoginInputChange}
              />
              <FormField
                label="Password"
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginInputChange}
              />
              <button type="button"
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                onClick={() => {
                  loginSubmit();
                }}
              >
                帳號登入
              </button>
            </div>
          </div>
        );

      case "path":
        return (
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm text-slate-800 dark:text-white">
            <PageTitle
              icon={Globe}
              title="3. Path 申請 / 設定"
              subtitle={`Database Environment ${
                isPath ? `| 已指定 Path: ${selectPathData}` : ""
              }`}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6">
              {/* 建議外層加 gap 分開左右兩大區塊 */}
              {/* 左側：修正為與右側一致或加上間距 */}
              <div>
                <h3 className="text-2xl font-black text-red-400 flex items-center gap-3">
                  1. 我還沒有 Path
                </h3>
                {/* 加上 flex-col 與 gap 讓 Input 和 Button 不會黏在一起 */}
                <div className="mt-6 flex flex-col gap-4">
                  {/* <input
                    value={addPath}
                    onChange={(e) => setAddPath(e.target.value)}
                    type="text"
                    placeholder="請輸入 Path"
                    className="p-4 border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  /> */}
                  <button type="button"
                    className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all"
                    onClick={() => {
                      // 組合你的目標網址
                      const targetUrl = `https://ec-course-api.hexschool.io/`;

                      // 使用 window.open，第二個參數 '_blank' 代表另開分頁
                      window.open(targetUrl, "_blank");
                    }}
                  >
                    點我進入六角API 申請 Path
                  </button>
                </div>
              </div>
              {/* 右側：這部分的寫法很好，建議保留 */}
              <div>
                <h3 className="text-2xl font-black text-red-400 flex items-center gap-3">
                  2. 我已經有 Path 了
                </h3>
                <div className="flex flex-col gap-4 mt-6">
                  <input
                    value={selectPath}
                    onChange={(e) => setSelectPath(e.target.value)}
                    type="text"
                    placeholder="請輸入你的 Path"
                    className="flex-1 p-4 border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <button type="button"
                    className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all whitespace-nowrap"
                    onClick={() => {
                      selectPathSubmit();
                    }}
                  >
                    確認 Path
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "product":
        return (
          <div className="max-w-6xl mx-auto space-y-6 pb-10 text-slate-800 dark:text-white">
            <div className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700">
              <PageTitle
                icon={Package}
                title="4. 商品資訊新增"
                subtitle={`Full Payload Entry ${
                  isPath ? `| 已指定 Path: ${selectPathData}` : ""
                }`}
                extra={
                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 px-6 py-3 rounded-2xl border dark:border-slate-700 text-slate-800 dark:text-white">
                    <span className="text-sm font-black">產品啟用</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={productData.is_enabled === 1}
                        onChange={(e) =>
                          handleInputChange(
                            setProductData,
                            productData,
                            "is_enabled",
                            e.target.checked ? 1 : 0
                          )
                        }
                      />

                      <div className="w-12 h-6 bg-slate-200 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                }
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-6">
                <div className="lg:col-span-2 space-y-10">
                  <SectionTitle
                    icon={<Info size={16} />}
                    title="核心資料管理 (Product Specs)"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-800 dark:text-white">
                    <FormField
                      label="商品標題 (title)"
                      value={productData.title}
                      onChange={(e) =>
                        handleInputChange(
                          setProductData,
                          productData,
                          "title",
                          e.target.value
                        )
                      }
                      spanFull
                    />
                    <FormField
                      label="分類 (category)"
                      value={productData.category}
                      onChange={(v) =>
                        handleInputChange(
                          setProductData,
                          productData,
                          "category",
                          v.target.value
                        )
                      }
                    />
                    <FormField
                      label="單位 (unit)"
                      value={productData.unit}
                      onChange={(v) =>
                        handleInputChange(
                          setProductData,
                          productData,
                          "unit",
                          v.target.value
                        )
                      }
                    />
                    <FormField
                      label="原價 (origin_price)"
                      type="number"
                      value={productData.origin_price}
                      onChange={(v) =>
                        handleInputChange(
                          setProductData,
                          productData,
                          "origin_price",
                          parseInt(v.target.value) || 0
                        )
                      }
                    />
                    <FormField
                      label="售價 (price)"
                      type="number"
                      value={productData.price}
                      onChange={(v) =>
                        handleInputChange(
                          setProductData,
                          productData,
                          "price",
                          parseInt(v.target.value) || 0
                        )
                      }
                    />
                    <FormField
                      label="商品描述 (description)"
                      value={productData.description}
                      onChange={(v) =>
                        handleInputChange(
                          setProductData,
                          productData,
                          "description",
                          v.target.value
                        )
                      }
                      spanFull
                    />
                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-[10px] font-black uppercase text-slate-400 px-1">
                        說明內容 (content)
                      </label>
                      <textarea
                        rows="4"
                        value={productData.content || ""}
                        onChange={(e) =>
                          handleInputChange(
                            setProductData,
                            productData,
                            "content",
                            e.target.value
                          )
                        }
                        className="w-full p-4 rounded-2xl border dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <SectionTitle
                    icon={<ImageIcon size={16} />}
                    title="影像資產與預覽"
                  />
                  <div className="space-y-6">
                    <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border dark:border-slate-700 flex items-center justify-center relative shadow-inner">
                      {productData.imageUrl ? (
                        <img
                          src={productData.imageUrl}
                          className="w-full h-full object-cover"
                          alt="Main"
                          onError={(e) =>
                            (e.target.src =
                              "https://placehold.co/400x300?text=Invalid")
                          }
                        />
                      ) : (
                        <ImageIcon size={40} className="text-slate-300" />
                      )}
                    </div>
                    <FormField
                      label="主圖網址 (imageUrl)"
                      value={productData.imageUrl}
                      onChange={(v) =>
                        handleInputChange(
                          setProductData,
                          productData,
                          "imageUrl",
                          v.target.value
                        )
                      }
                    />

                    <div className="pt-8 border-t dark:border-slate-700 text-slate-800 dark:text-white">
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-4 flex items-center gap-2">
                        <Layers size={14} /> 副圖列表 (imagesUrl x 5)
                      </label>
                      <div className="grid grid-cols-5 gap-2 mb-4">
                        {productData.imagesUrl.map((u, i) => (
                          <div
                            key={i}
                            className="aspect-square bg-slate-50 dark:bg-slate-900 rounded-xl border flex items-center justify-center overflow-hidden shadow-sm"
                          >
                            {u ? (
                              <img
                                src={u}
                                className="w-full h-full object-cover"
                                alt={`Sub ${i}`}
                              />
                            ) : (
                              <span className="text-[10px] text-slate-300 font-bold">
                                {i + 1}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {productData.imagesUrl.map((u, i) => (
                          <input
                            key={i}
                            value={u || ""}
                            onChange={(e) =>
                              handleSubImgChange(
                                setProductData,
                                productData,
                                i,
                                e.target.value
                              )
                            }
                            placeholder={`副圖連結 ${i + 1}`}
                            className="w-full p-2.5 text-[10px] rounded-xl border dark:bg-slate-900 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all shadow-sm"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-end gap-4 border-t dark:border-slate-700 pt-8">
                <button type="button"
                  onClick={() =>
                    setProductData({
                      ...emptyProductTemplate,
                      origin_price: 0,
                      price: 0,
                    })
                  }
                  className="px-10 py-4 font-black text-slate-400 hover:text-slate-600 transition-colors"
                >
                  重置表單
                </button>
                <button type="button"
                  className="px-14 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 active:scale-95 shadow-blue-500/30"
                  onClick={() => {
                    produstCreateSubmit();
                  }}
                >
                  確認儲存商品
                </button>
              </div>
            </div>
          </div>
        );

      case "productList":
        return (
          <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden text-slate-800 dark:text-white">
            <div className="p-8 border-b dark:border-slate-700 text-slate-800 dark:text-white">
              <PageTitle
                icon={List}
                title="5. 商品列表編輯"
                subtitle={`Data Maintenance ${
                  isPath ? `| 已指定 Path: ${selectPathData}` : ""
                }`}
                extra={
                  <div className="relative w-full md:w-80">
                    {/* <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    /> 
                     <input
                      placeholder="搜尋現有商品..."
                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm text-sm"
                    /> */}
                  </div>
                }
              />
            </div>
            <div className="overflow-x-auto text-slate-800 dark:text-slate-200">
              <table className="w-full text-center min-w-[950px]">
                <thead className="bg-slate-50 dark:bg-slate-900 text-[10px] uppercase font-black text-slate-500 tracking-widest border-b dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-5 text-slate-800 dark:text-white">
                      縮圖
                    </th>
                    <th className="px-6 py-5 text-slate-800 dark:text-white">
                      分類
                    </th>
                    <th className="px-6 py-5 text-left text-slate-800 dark:text-white">
                      產品名稱
                    </th>
                    <th className="px-6 py-5 text-slate-800 dark:text-white">
                      價格
                    </th>
                    <th className="px-6 py-5 text-slate-800 dark:text-white">
                      狀態
                    </th>
                    <th className="px-6 py-5 text-right text-slate-800 dark:text-white">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-700 text-sm font-bold text-slate-800 dark:text-white">
                  {products.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 flex justify-center">
                        <img
                          src={p.imageUrl}
                          className="w-14 h-14 rounded-xl object-cover border dark:border-slate-600 shadow-sm"
                          alt={p.title}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-[10px]">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-left font-black">
                        {p.title}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 line-through">
                            ${p.origin_price}
                          </span>
                          <span className="font-black text-blue-600">
                            ${p.price}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-xs">
                        <span
                          className={`px-4 py-1.5 rounded-full font-black ${
                            p.is_enabled
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {p.is_enabled ? "ON SALE" : "OFFLINE"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button type="button"
                            onClick={() => openEditModal(p)}
                            className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button type="button"
                            onClick={() => {
                              setTempProduct(p);
                              setIsDelModalOpen(true);
                            }}
                            className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* 分頁 */}
            <div className="flex justify-center mt-8 mb-3">
              <nav aria-label="Page navigation">
                <ul className="flex items-center gap-2">
                  {/* 上一頁 */}
                  <li>
                    <button type="button"
                      onClick={() =>
                        handleChangePage(pageInfo.current_page - 1)
                      }
                      disabled={!pageInfo.has_pre}
                      className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all
            ${
              !pageInfo.has_pre
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 active:scale-95 border-gray-300"
            }`}
                    >
                      <span className="text-lg">&laquo;</span>
                    </button>
                  </li>

                  {/* 頁碼 */}
                  {Array.from({ length: pageInfo.total_pages }).map(
                    (_, index) => {
                      const pageNum = index + 1;
                      const isActive = pageInfo.current_page === pageNum;

                      return (
                        <li key={pageNum}>
                          <button type="button"
                            onClick={() => handleChangePage(pageNum)}
                            className={`flex items-center justify-center w-10 h-10 rounded-lg border font-bold transition-all
                ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-500 active:scale-95"
                }`}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    }
                  )}

                  {/* 下一頁 */}
                  <li>
                    <button type="button"
                      onClick={() =>
                        handleChangePage(pageInfo.current_page + 1)
                      }
                      disabled={!pageInfo.has_next}
                      className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all
            ${
              !pageInfo.has_next
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 active:scale-95 border-gray-300"
            }`}
                    >
                      <span className="text-lg">&raquo;</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        );

      case "jsonUpload":
        return (
          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm text-slate-800 dark:text-white overflow-hidden">
            <PageTitle
              icon={FileJson}
              title="6. JSON 格式上傳"
              subtitle="Bulk Operations"
            />
            <div className="mb-10 p-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30 text-blue-600 font-bold mt-4">
              <label className="block text-[10px] font-black uppercase mb-2 flex items-center gap-2">
                <Globe size={14} /> 您的 API Path 
              </label>
              <input
                value={selectPathData || ""}
                // onChange={(e) => setPath(e.target.value)}
                placeholder="your-unique-path"
                className="w-full py-4 px-5 bg-white dark:bg-slate-900 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-sm"
              />
            </div>
            <div className="flex justify-between items-center mb-3 px-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                JSON Source Code
              </span>
              <button type="button"
                onClick={() => setIsExModalOpen(true)}
                className="text-xs font-black text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
              >
                <Code size={14} /> JSON 範例格式
              </button>
            </div>
            <textarea
              value={jsonInput || ""}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="在此貼上您的 JSON 資料..."
              className="w-full h-[350px] p-6 font-mono text-sm bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-blue-600 transition-all shadow-inner"
            />
            <button type="button" className="mt-8 px-14 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-3" onClick={()=>{jsonInputSubmit()}}>
              <UploadCloud size={22} /> 執行批量上傳
            </button>
          </div>
        );

      case "docs":
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <PageTitle
              icon={BookOpen}
              title="7. 文件資源中心"
              subtitle="API Specifications"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative">
                <div className="relative z-10">
                  <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 mb-8 w-fit shadow-inner group-hover:scale-110 transition-transform">
                    <BookOpen className="text-blue-600" size={32} />
                  </div>
                  <h4 className="text-3xl font-black mb-3 text-slate-800 dark:text-white">
                    課程 API 文件
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-12 leading-relaxed font-bold">
                    官方提供的 Swagger UI 資源，包含 Admin 端所有資料管理功能與
                    API 回傳結構說明。
                  </p>
                  <a
                    href="https://hexschool.github.io/ec-courses-api-swaggerDoc/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-2xl font-black transition-all shadow-lg active:scale-95"
                  >
                    立即前往查看 <LinkIcon size={18} />
                  </a>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative">
                <div className="relative z-10">
                  <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 mb-8 w-fit shadow-inner group-hover:scale-110 transition-transform">
                    <Globe className="text-indigo-600" size={32} />
                  </div>
                  <h4 className="text-3xl font-black mb-3 text-slate-800 dark:text-white">
                    API 申請平台
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-12 leading-relaxed font-bold">
                    前往六角學院官方系統申請您的專屬 Path
                    ID，並隨時管理個人練習用資料庫。
                  </p>
                  <a
                    href="https://course-api.hexschool.io/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-5 bg-blue-600 text-white rounded-2xl font-black transition-all shadow-lg active:scale-95 shadow-blue-500/20"
                  >
                    前往申請帳號 <LinkIcon size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // --- 分頁內容渲染器 ---

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans antialiased overflow-x-hidden text-slate-800 dark:text-white">
      {/* Sidebar - Final Symmetry Fix */}
      <aside
        className={`
        ${
          isSidebarOpen
            ? "w-72 translate-x-0"
            : "w-20 -translate-x-full md:translate-x-0"
        } 
        bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-500 fixed md:relative h-full z-50 flex flex-col
      `}
      >
        <div
          className={`p-6 flex items-center transition-all duration-300 ${
            isSidebarOpen ? "gap-4" : "justify-center px-0"
          }`}
        >
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-2xl shadow-xl shrink-0 text-white">
            <Layout size={24} />
          </div>
          {isSidebarOpen && (
            <span className="font-black text-2xl tracking-tighter uppercase whitespace-nowrap dark:text-white">
              Hex Portal
            </span>
          )}
        </div>

        <nav className="flex-1 px-3 mt-6 space-y-2 overflow-y-auto scrollbar-hide">
          <NavItem
            active={activeTab === "register"}
            onClick={() => setActiveTab("register")}
            icon={UserPlus}
            label="1. 帳號註冊"
            expanded={isSidebarOpen}
          />
          <NavItem
            active={activeTab === "login"}
            onClick={() => setActiveTab("login")}
            icon={LogIn}
            label="2. 帳號登入"
            expanded={isSidebarOpen}
          />

          <NavItem
            // 當 tokenData 為空字串時，!tokenData 為 true，按鈕會被禁用
            disabled={!tokenData}
            active={activeTab === "path"}
            onClick={() => setActiveTab("path")}
            icon={PlusSquare}
            label="3. Path 申請 / 設定"
            expanded={isSidebarOpen}
          />
          <NavItem
            // 當 tokenData 為空字串時，!tokenData 為 true，按鈕會被禁用
            disabled={!tokenData}
            active={activeTab === "product"}
            onClick={() => setActiveTab("product")}
            icon={Package}
            label="4. 商品資訊新增"
            expanded={isSidebarOpen}
          />
          <NavItem
            // 當 tokenData 為空字串時，!tokenData 為 true，按鈕會被禁用
            disabled={!tokenData}
            active={activeTab === "productList"}
            onClick={() => setActiveTab("productList")}
            icon={List}
            label="5. 商品列表編輯"
            expanded={isSidebarOpen}
          />
          <div className="mx-4 my-6 border-t border-slate-100 dark:border-slate-800 opacity-50"></div>
          <NavItem
            // 當 tokenData 為空字串時，!tokenData 為 true，按鈕會被禁用
            disabled={!tokenData}
            active={activeTab === "jsonUpload"}
            onClick={() => setActiveTab("jsonUpload")}
            icon={FileJson}
            label="6. JSON 上傳"
            expanded={isSidebarOpen}
          />
          <div className="mx-4 my-6 border-t border-slate-100 dark:border-slate-800 opacity-50"></div>

          <NavItem
            active={activeTab === "docs"}
            onClick={() => setActiveTab("docs")}
            icon={BookOpen}
            label="7. 文件資源"
            expanded={isSidebarOpen}
          />
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-inner text-slate-500"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 md:px-10 flex items-center justify-between z-10 shrink-0 text-slate-800 dark:text-white">
          <div className="flex items-center gap-6">
            <button type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-3 bg-slate-100 dark:bg-slate-800 rounded-xl transition-all shadow-sm"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-black uppercase tracking-widest hidden sm:block truncate">
              {activeTab === "productList"
                ? "Management"
                : activeTab === "jsonUpload"
                ? "JSON Parser"
                : activeTab}
            </h2>
          </div>
          {tokenData ? (
            <button type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-600 border border-slate-200 dark:border-slate-700 rounded-2xl font-black shadow-sm group active:scale-95 transition-all text-slate-800 dark:text-white"
            >
              <LogOut
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
              <span className="hidden sm:inline font-black tracking-tight text-slate-800 dark:text-white">
                登出系統
              </span>
            </button>
          ) : (
            <span>未登入</span>
          )}
        </header>

        {/* Content Area */}
        <section className="flex-1 overflow-y-auto p-4 md:p-10 bg-slate-50 dark:bg-slate-950/50 scroll-smooth">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </section>
      </main>

      {/* --- MODALS --- */}
      {isExModalOpen && (
        <ModalWrapper
          title="JSON 範例格式結構"
          icon={<FileJson className="text-blue-500" />}
          onClose={closeModals}
        >
          <pre className="bg-slate-900 text-blue-400 p-6 md:p-8 rounded-3xl font-mono text-xs md:text-sm overflow-x-auto shadow-inner leading-relaxed">
            {JSON.stringify(JSON_EXAMPLE_DATA, null, 2)}
          </pre>
        </ModalWrapper>
      )}

      {/* Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 text-slate-800 dark:text-white">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={closeModals}
          ></div>
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border dark:border-slate-700 animate-modal text-slate-800 dark:text-white">
            <div className="p-6 md:p-8 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30 shrink-0 text-slate-800 dark:text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 text-white">
                  <Edit3 size={24} />
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-black">
                    編輯商品詳細資訊
                  </h4>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">
                    ID: {tempProduct.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border dark:border-slate-700 text-sm font-black text-slate-800 dark:text-white">
                  啟用
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={tempProduct.is_enabled === 1}
                      onChange={(e) =>
                        handleInputChange(
                          setTempProduct,
                          tempProduct,
                          "is_enabled",
                          e.target.checked ? 1 : 0
                        )
                      }
                    />
                    <div className="w-10 h-5 bg-slate-200 rounded-full peer dark:bg-slate-700 peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
                <button type="button"
                  onClick={closeModals}
                  className="p-3 bg-slate-100 dark:bg-slate-700 rounded-2xl text-slate-500 hover:bg-slate-200 transition-all"
                >
                  <X />
                </button>
              </div>
            </div>

            <div className="p-6 md:p-10 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-slate-800 dark:text-white">
                <div className="lg:col-span-2 space-y-10">
                  <SectionTitle
                    icon={<Type size={18} />}
                    title="核心資料管理"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-800 dark:text-white">
                    <FormField
                      label="商品標題 (title)"
                      value={tempProduct.title}
                      onChange={(val) =>
                        handleInputChange(
                          setTempProduct,
                          tempProduct,
                          "title",
                          val.target.value
                        )
                      }
                      spanFull
                    />
                    <FormField
                      label="分類"
                      value={tempProduct.category}
                      onChange={(val) =>
                        handleInputChange(
                          setTempProduct,
                          tempProduct,
                          "category",
                          val.target.value
                        )
                      }
                    />
                    <FormField
                      label="單位"
                      value={tempProduct.unit}
                      onChange={(val) =>
                        handleInputChange(
                          setTempProduct,
                          tempProduct,
                          "unit",
                          val.target.value
                        )
                      }
                    />
                    <FormField
                      label="原價"
                      type="number"
                      value={tempProduct.origin_price}
                      onChange={(val) =>
                        handleInputChange(
                          setTempProduct,
                          tempProduct,
                          "origin_price",
                          parseInt(val.target.value) || 0
                        )
                      }
                    />
                    <FormField
                      label="售價"
                      type="number"
                      value={tempProduct.price}
                      onChange={(val) =>
                        handleInputChange(
                          setTempProduct,
                          tempProduct,
                          "price",
                          parseInt(val.target.value) || 0
                        )
                      }
                    />
                    <FormField
                      label="商品描述 (description)"
                      value={tempProduct.description}
                      onChange={(val) =>
                        handleInputChange(
                          setTempProduct,
                          tempProduct,
                          "description",
                          val.target.value
                        )
                      }
                      spanFull
                    />
                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-[10px] font-black uppercase text-slate-400 px-1">
                        說明內容 (content)
                      </label>
                      <textarea
                        rows="4"
                        value={tempProduct.content || ""}
                        onChange={(e) =>
                          handleInputChange(
                            setTempProduct,
                            tempProduct,
                            "content",
                            e.target.value
                          )
                        }
                        className="w-full p-4 border rounded-2xl dark:bg-slate-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all shadow-inner text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <SectionTitle
                    icon={<ImageIcon size={18} />}
                    title="影像資產維護"
                  />
                  <div className="space-y-6">
                    <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border dark:border-slate-700 flex items-center justify-center relative shadow-inner">
                      {tempProduct.imageUrl ? (
                        <img
                          src={tempProduct.imageUrl}
                          className="w-full h-full object-cover"
                          alt="Main"
                          onError={(e) =>
                            (e.target.src =
                              "https://placehold.co/400x300?text=Invalid")
                          }
                        />
                      ) : (
                        <ImageIcon size={32} className="text-slate-300" />
                      )}
                    </div>
                    <FormField
                      label="主圖網址 (imageUrl)"
                      value={tempProduct.imageUrl}
                      onChange={(val) =>
                        handleInputChange(
                          setTempProduct,
                          tempProduct,
                          "imageUrl",
                          val.target.value
                        )
                      }
                    />

                    <div className="pt-8 border-t dark:border-slate-700">
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-4 flex items-center gap-2">
                        <Layers size={14} /> 副圖集 (imagesUrl x 5)
                      </label>
                      <div className="grid grid-cols-5 gap-2 mb-4">
                        {tempProduct.imagesUrl?.map((u, i) => (
                          <div
                            key={i}
                            className="aspect-square bg-slate-50 dark:bg-slate-900 rounded-xl border flex items-center justify-center overflow-hidden shadow-sm"
                          >
                            {u ? (
                              <img
                                src={u}
                                className="w-full h-full object-cover"
                                alt={`Sub ${i}`}
                              />
                            ) : (
                              <span className="text-[10px] text-slate-300 font-black">
                                {i + 1}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {tempProduct.imagesUrl?.map((u, i) => (
                          <input
                            key={i}
                            value={u || ""}
                            onChange={(e) =>
                              handleSubImgChange(
                                setTempProduct,
                                tempProduct,
                                i,
                                e.target.value
                              )
                            }
                            placeholder={`副圖連結 ${i + 1}`}
                            className="w-full p-2.5 text-[10px] rounded-xl border dark:bg-slate-900 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all shadow-sm text-slate-800 dark:text-white"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 border-t dark:border-slate-700 flex flex-col md:flex-row justify-end gap-4 bg-slate-50/50 dark:bg-slate-900/30 shrink-0">
              <button type="button"
                onClick={closeModals}
                className="px-10 py-4 font-black text-slate-500 hover:text-slate-600 transition-colors"
              >
                放棄修改
              </button>
              <button type="button"
                onClick={() => {
                  produstUpdateSubmit();
                }}
                className="px-14 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-blue-500/20"
              >
                <Save size={18} /> 儲存並更新商品
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDelModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={closeModals}
          ></div>
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 border dark:border-slate-700 animate-modal text-slate-800 dark:text-white">
            <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-8 shadow-inner">
              <AlertTriangle size={40} strokeWidth={2.5} />
            </div>
            <h4 className="text-2xl font-black mb-3 text-center">
              確定刪除商品？
            </h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 text-center leading-relaxed px-4 font-medium">
              您確定要永久刪除 「
              <span className="font-black text-slate-900 dark:text-white underline">
                {tempProduct.title}
              </span>
              」 嗎？
            </p>
            <div className="flex flex-col gap-4 text-slate-800 dark:text-white">
              <button type="button"
                onClick={() => {
                  produstDeleteSubmit();
                }}
                className="w-full py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg active:scale-95"
              >
                確認刪除
              </button>
              <button type="button"
                onClick={closeModals}
                className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-2xl font-bold"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 最終匯出 ---
export default App;
