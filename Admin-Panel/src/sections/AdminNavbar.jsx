import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import axios from "axios";

const AdminNavbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
   const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('allOrders')) || []);
    const [filter, setFilter] = useState("all");
  
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/orders");
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
  
    useEffect(() => {
      fetchOrders();
    }, [orders]);

  const menu = [
    { name: "Dashboard", path: "/", icon: "◧", desc: "Overview" },
    { name: "Orders", path: "/orders", icon: "◫", desc: "Live orders" },
    { name: "Products", path: "/products", icon: "◍", desc: "Pizzas & Sizes" },
    { name: "Sales", path: "/sales", icon: "◍", desc: "Revenue" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* TOP PREMIUM NAV */}
      <div className="sticky top-0 z-40 w-full">
        <div className="bg-white/80 backdrop-blur-xl border-b border-zinc-100">
          <div className="max-w- mx-auto px-4 sm:px-6 h- flex items-center justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setOpen(true)}
                className="lg:hidden w-11 h-11 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-95 transition"
              >
                <div className="space-y-1.5">
                  <div className="w-4 h-0.5 bg-white rounded-full"></div>
                  <div className="w-4 h-0.5 bg-white rounded-full"></div>
                  <div className="w-3 h-0.5 bg-white rounded-full"></div>
                </div>
              </button>

              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text- shadow-lg">T</div>
                <div className="leading-none hidden sm:block">
                  <p className="font-bold text- tracking-tight">Demo</p>
                  <p className="text- tracking-[0.2em] text-zinc-400 font-bold -mt-0.5">ADMIN OS</p>
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-2 ml-8 bg-[#F6F5F1] p-1.5 rounded-full border border-zinc-100">
                {menu.map(m => (
                  <Link
                    key={m.path}
                    to={m.path}
                    className={`h-9 px-5 rounded-full flex items-center gap-2 text- font-medium transition-all ${
                      isActive(m.path)
                       ? "bg-zinc-900 text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-white"
                    }`}
                  >
                    <span className="text-">{m.icon}</span> {m.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex h-11 items-center gap-2 bg-white border border-zinc-100 rounded-full px-2 pl-3 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text- font-bold text-zinc-600 pr-2">Live Orders</span>
                <span className="h-7 px-3 rounded-full bg-zinc-900 text-white text- font-bold flex items-center">
                  {orders.filter(o => o.status !== 'cancelled' && o.status !== 'delivered').length}
                </span>
              </div>
              <div className="w-11 h-11 rounded-full bg-[#F6F5F1] border border-zinc-100 flex items-center justify-center text- font-bold">AD</div>
            </div>
          </div>
        </div>
      </div>

      {/* PREMIUM MOBILE SIDEBAR */}
      <div className={`fixed inset-0 z-[100] lg:hidden transition ${open? "visible" : "invisible"}`}>
        {/* Backdrop */}
        <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-zinc-900/20 backdrop-blur-md transition ${open? "opacity-100" : "opacity-0"}`}></div>

        {/* Drawer */}
        <div className={`absolute left-0 top-0 h-full w- bg-white rounded-r- shadow-[20px_0_60px_rgba(0,0,0,0.15)] p-6 flex flex-col transition-transform duration-300 ${open? "translate-x-0" : "-translate-x-full"}`}>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold">D</div>
              <div>
                <p className="font-bold text-">Demo Admin</p>
                <p className="text- tracking-widest text-zinc-400 font-bold">PREMIUM OS</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="w-10 h-10 rounded-full bg-zinc-50 border flex items-center justify-center hover:bg-zinc-900 hover:text-white transition">✕</button>
          </div>

          <div className="mt-8">
            <p className="text- tracking-[0.2em] font-bold text-zinc-400">MENU</p>
            <div className="mt-3 grid gap-2">
              {menu.map(m => (
                <Link
                  key={m.path}
                  to={m.path}
                  onClick={() => setOpen(false)}
                  className={`group h- rounded- px-4 flex items-center justify-between border transition-all ${
                    isActive(m.path)? "bg-zinc-900 border-zinc-900 text-white shadow-lg" : "bg-[#F6F5F1] border-zinc-100 hover:border-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text- ${isActive(m.path)? "bg-white/15" : "bg-white border"}`}>{m.icon}</div>
                    <div className="leading-tight">
                      <p className="text- font-bold">{m.name}</p>
                      <p className={`text- ${isActive(m.path)? "text-white/60" : "text-zinc-400"}`}>{m.desc}</p>
                    </div>
                  </div>
                  <span className="text- opacity-60 group-hover:translate-x-0.5 transition">→</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <div className="rounded- bg-zinc-900 text-white p-5 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full"></div>
              <p className="text- font-bold tracking-widest opacity-60">PRODUCTS</p>
              <p className="text- font-bold mt-2 leading-tight">Manage Pizza Sizes & Prices</p>
              <Link to="/products" onClick={() => setOpen(false)} className="mt-4 h-10 rounded-full bg-white text-zinc-900 text- font-bold flex items-center justify-center">Open Products →</Link>
            </div>
            <p className="text- text-zinc-400 text-center mt-4">© 2025 Demo OS • v2.1 Premium</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;