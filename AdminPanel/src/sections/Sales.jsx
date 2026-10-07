import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://restaurant-web-zeta-five.vercel.app";

const Sales = () => {
  const [orders, setOrders] = useState(
    () => JSON.parse(localStorage.getItem("allOrders")) || []
  );

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data.orders);
      localStorage.setItem("allOrders", JSON.stringify(response.data.orders));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchOrders();
      }
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const sales = orders.filter(
    (o) => o.status !== "cancelled" && o.status !== "pending"
  );

  const total = sales.reduce(
    (a, o) => a + Number(o.billing?.total || o.total || 0),
    0
  );

  const totalItems = sales.reduce(
    (a, o) => a + o.items.reduce((s, it) => s + Number(it.quantity), 0),
    0
  );

  const sizeSales = { S: 0, M: 0, L: 0 };
  sales.forEach((o) =>
    o.items.forEach((it) => {
      if (it.size) sizeSales[it.size] = (sizeSales[it.size] || 0) + Number(it.quantity);
    })
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Sales - 20s Auto Refresh</h1>
      <p className="text-sm text-zinc-500">
        Revenue from kitchen • S:{sizeSales.S} M:{sizeSales.M} L:{sizeSales.L}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-2xl border p-5">
          <p className="text-xs font-bold text-zinc-400">TOTAL REVENUE</p>
          <p className="text-2xl font-bold mt-2">{total.toFixed(2)}</p>
          <p className="text-sm text-green-600 mt-1">● {sales.length} paid orders</p>
        </div>
        <div className="bg-zinc-900 text-white rounded-2xl p-5">
          <p className="text-xs font-bold text-white/50">ITEMS SOLD</p>
          <p className="text-2xl font-bold mt-2">{totalItems}</p>
          <p className="text-sm text-white/50 mt-1">S:{sizeSales.S} M:{sizeSales.M} L:{sizeSales.L}</p>
        </div>
        <div className="bg-white rounded-2xl border p-5">
          <p className="text-xs font-bold text-zinc-400">SIZE S</p>
          <p className="text-2xl font-bold mt-2">{sizeSales.S}</p>
          <p className="text-sm text-zinc-400 mt-1">Small sold</p>
        </div>
        <div className="bg-white rounded-2xl border p-5">
          <p className="text-xs font-bold text-zinc-400">SIZE M/L</p>
          <p className="text-2xl font-bold mt-2">{sizeSales.M}/{sizeSales.L}</p>
          <p className="text-sm text-zinc-400 mt-1">M and L sold</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 mt-6 overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center">
          <p className="font-bold">All Sales — Size + Category</p>
          <span className="h-7 px-3 rounded-full bg-[#F8F7F4] border text-xs font-bold flex items-center">
            {sales.length} records • 20s refresh
          </span>
        </div>
        <div className="divide-y divide-zinc-100">
          {sales.map((o) => (
            <div key={o.orderId} className="p-4 flex justify-between items-center hover:bg-[#F8F7F4]">
              <div>
                <p className="font-bold text-sm">{o.orderId} <span className="text-xs text-zinc-400 ml-2">{o.createdAt}</span></p>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  {o.items.map((i) => `${i.foodName}${i.size ? ` [${i.size}]` : ""} x${i.quantity}`).join(" • ")}
                </p>
              </div>
              <p className="font-bold">{o.billing?.total || o.total}</p>
            </div>
          ))}
          {sales.length === 0 && <p className="p-10 text-center text-zinc-400 text-sm">No sales yet</p>}
        </div>
      </div>
    </div>
  );
};

export default Sales;