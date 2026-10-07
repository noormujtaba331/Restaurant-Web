import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://restaurant-web-zeta-five.vercel.app";

const Dashboard = () => {
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('allOrders')) || []);
 
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data.orders);
      localStorage.setItem('allOrders', JSON.stringify(response.data.orders));
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

  const pending = orders.filter(o => o.status === 'pending').length;
  const preparing = orders.filter(o => o.status === 'preparing').length;
  const out = orders.filter(o => o.status === 'out_for_delivery').length;
  const revenue = orders.filter(o => o.status!== 'cancelled' && o.status !== 'pending').reduce((a,o)=>a+Number(o.billing?.total||o.total||0),0);

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex justify-between items-end mt-2">
          <div><h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1><p className="text-sm text-zinc-500">Real-time kitchen status • 20s refresh</p></div>
          <div className="hidden sm:flex bg-white border rounded-full px-4 h-9 items-center text-xs font-bold">● {new Date().toLocaleDateString()}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="rounded-2xl p-[1.5px] bg-gradient-to-br from-red-200 to-red-100"><div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white relative overflow-hidden"><div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full blur-xl"></div><p className="text-xs tracking-[0.2em] font-bold opacity-80">PENDING</p><p className="text-4xl font-bold leading-none mt-3">{pending}</p><p className="text-sm opacity-80 mt-2">Waiting in queue</p><div className="mt-5 bg-black/10 backdrop-blur rounded-xl p-2"><p className="text-xs font-bold px-3">🔴 Needs attention</p></div></div></div>
          <div className="rounded-2xl p-[1.5px] bg-gradient-to-br from-yellow-200 to-amber-100"><div className="bg-gradient-to-br from-yellow-400 to-amber-400 rounded-2xl p-6 text-zinc-900 relative overflow-hidden"><div className="absolute -right-8 -top-8 w-32 h-32 bg-black/10 rounded-full"></div><p className="text-xs tracking-[0.2em] font-bold opacity-60">PREPARING</p><p className="text-4xl font-bold leading-none mt-3">{preparing}</p><p className="text-sm opacity-70 mt-2">In the kitchen</p><div className="mt-5 bg-white/50 backdrop-blur rounded-xl p-2"><p className="text-xs font-bold px-3">🟡 Cooking now</p></div></div></div>
          <div className="rounded-2xl p-[1.5px] bg-gradient-to-br from-green-200 to-emerald-100"><div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden"><div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full"></div><p className="text-xs tracking-[0.2em] font-bold opacity-80">OUT FOR DELIVERY</p><p className="text-4xl font-bold leading-none mt-3">{out}</p><p className="text-sm opacity-80 mt-2">On the way</p><div className="mt-5 bg-black/10 backdrop-blur rounded-xl p-2"><p className="text-xs font-bold px-3">🟢 Rider assigned</p></div></div></div>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5 mt-6">
          <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between"><h3 className="font-bold text-base">Recent Orders</h3><span className="text-xs bg-zinc-900 text-white px-3 h-7 rounded-full flex items-center">{orders.length} total</span></div>
            <div className="mt-5 grid gap-3">
              {orders.slice(0,5).map(o=>(
                <div key={o.orderId} className="group flex items-center justify-between bg-[#F8F7F4] hover:bg-white border border-transparent hover:border-zinc-100 rounded-xl p-3 transition">
                  <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center text-sm font-bold">{o.customer?.name?.[0]}</div><div><p className="font-bold text-sm">{o.orderId}</p><p className="text-xs text-zinc-500">{o.items?.map(i=>`${i.foodName}(${i.size})`).join(', ')}</p></div></div>
                  <div className="text-right"><p className="font-bold text-sm">{o.billing?.total||o.total}</p><p className={`text-xs px-2 py-0.5 rounded-full inline-block font-bold ${o.status==='pending'?'bg-red-50 text-red-600':'bg-green-50 text-green-600'}`}>{o.status}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-[0_20px_40px_rgba(0,0,0,0.2)] relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full"></div>
            <h3 className="font-bold text-base">Sales under Orders</h3>
            <p className="text-3xl font-bold mt-4">{revenue.toFixed(2)}</p>
            <p className="text-sm text-white/50">Total revenue from {orders.filter(o=>o.status!=='cancelled' && o.status!=='pending').length} paid orders</p>
            <div className="mt-6 grid gap-2">
              <div className="bg-white/10 rounded-xl p-3 flex justify-between"><span className="text-xs text-white/60">Pending value</span><span className="text-sm font-bold">{orders.filter(o=>o.status==='pending').reduce((a,o)=>a+Number(o.billing?.total||0),0).toFixed(2)}</span></div>
              <div className="bg-white/10 rounded-xl p-3 flex justify-between"><span className="text-xs text-white/60">Delivered</span><span className="text-sm font-bold">{orders.filter(o=>o.status==='delivered').length} orders</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;