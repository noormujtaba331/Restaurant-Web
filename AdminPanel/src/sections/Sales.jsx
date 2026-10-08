import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://restaurant-web-zeta-five.vercel.app";

const Sales = () => {
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('allOrders')) || []);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data.orders);
      console.log(orders)
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') fetchOrders();
    }, 20000);
    return () => clearInterval(interval);
  }, []);





  const sales = orders.filter(o => o.status !== 'cancelled' && o.status !== 'pending');
  const total = sales.reduce((a, o) => a + Number(o.billing?.total || o.total || 0), 0);
  const totalItems = sales.reduce((a, o) => a + o.items.reduce((s, it) => s + Number(it.quantity), 0), 0);

  const sizeSales = { S: 0, M: 0, L: 0 };
  sales.forEach(o => o.items.forEach(it => { if (it.size) sizeSales[it.size] = (sizeSales[it.size] || 0) + Number(it.quantity); }));

  return (
    <div className="max-w- mx-auto p-4 sm:p-6">
      <h1 className="text- font-bold tracking-tight">Sales</h1>
      <p className="text- text-zinc-500">Revenue from kitchen</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="rounded- p- bg-gradient-to-br from-zinc-200 to-zinc-100"><div className="bg-white rounded- p-5"><p className="text- tracking-widest font-bold text-zinc-400">TOTAL REVENUE</p><p className="text- font-bold mt-2">{total.toFixed(2)}</p><p className="text- text-green-600 mt-1">● {sales.length} paid orders</p></div></div>
        <div className="bg-zinc-900 text-white rounded- p-5 shadow-[0_12px_30px_rgba(0,0,0,0.15)]"><p className="text- tracking-widest font-bold text-white/50">ITEMS SOLD</p><p className="text- font-bold mt-2">{totalItems}</p><p className="text- text-white/50 mt-1">Including size variants</p></div>
        <div className="bg-white rounded- border border-zinc-100 p-5 shadow-sm"><p className="text- tracking-widest font-bold text-zinc-400">AVG ORDER</p><p className="text- font-bold mt-2">
          {sales.length ? (total / sales.length).toFixed(2) : "0"}</p><p className="text- text-zinc-400 mt-1">Per paid order</p></div>
      </div>

      <div className="bg-white rounded- border border-zinc-100 mt-6 overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
        <div className="p-5 border-b flex justify-between items-center"><p className="font-bold text-">All Sales — Size + Category</p><span className="h-7 px-3 rounded-full bg-[#F8F7F4] border text- font-bold flex items-center">{sales.length} records</span></div>
        <div className="divide-y divide-zinc-50">
          {sales.map(o => (
            <div key={o.orderId} className="p-4 flex justify-between items-center hover:bg-[#F8F7F4] transition">
              <div>
                <p className="font-bold text-">{o.orderId} <span className="text- text-zinc-400 font-normal ml-2">{o.createdAt}</span></p>
                <p className="text- text-zinc-500 mt-1">{o.items.map(i => `${i.foodName}${i.category ? ` (${i.category})` : ''}${i.size ? ` [${i.size}]` : ''} x${i.quantity}`).join(' • ')}</p>
              </div>
              <p className="font-bold text-">{o.billing?.total || o.total}</p>
            </div>
          ))}
          {sales.length === 0 && <p className="p-10 text-center text-zinc-400 text-">No sales yet — Orders ko delivered karo</p>}
        </div>
      </div>
    </div>
  );
};

export default Sales;