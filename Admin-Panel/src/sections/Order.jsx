import { useState, useEffect } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('allOrders')) || []);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/orders");
      setOrders(response.data.orders)
      console.log(orders)
      ;
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [orders]);

  const updateStatus = (id, status) => {
    setOrders(orders.map(o => o.orderId === id ? { ...o, status } : o));
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    out_for_delivery: orders.filter(o => o.status === 'out_for_delivery').length,
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-end">
        <div><h1 className="text-2xl font-bold tracking-tight">Orders</h1><p className="text-sm text-zinc-500">Manage live kitchen orders</p></div>
        <button 
          onClick={() => { 
            axios.delete("http://localhost:3000/orders")
              .then(response => {
                console.log("All orders deleted from server:", response.data);
                setOrders([]); 
              })
              .catch(error => {
                console.error("Error clearing orders from server:", error.response?.data || error);
              });
          }}
          className="hidden sm:flex h-9 px-4 rounded-full border bg-white text-sm font-bold items-center justify-center"
        >
          Clear All
        </button>
      </div>

      {/* FILTER PILLS */}
      <div className="mt-5 flex gap-2 overflow-auto pb-1">
        {[
          { key: "all", label: `All (${counts.all})`, },
          { key: "pending", label: `🔴 Pending (${counts.pending})` },
          { key: "preparing", label: `🟡 Preparing (${counts.preparing})` },
          { key: "out_for_delivery", label: `🟢 Out (${counts.out_for_delivery})` },
        ].map(f => (
          <button key={f.key} onClick={() => {
            axios.patch(`http://localhost:3000/orders/${f.key}`, { status: f.key });
            setFilter(f.key);
          }} className={`h-9 px-4 rounded-full border text-xs font-bold whitespace-nowrap transition ${filter === f.key ? "bg-zinc-900 text-white border-zinc-900 shadow" : "bg-white hover:border-zinc-900"}`}>{f.label}</button>
        ))}
      </div>

      {/* ORDERS LIST */}
      <div className="mt-6 grid gap-4">
        {filtered.length === 0 && <div className="bg-white rounded border p-10 text-center text-zinc-400 text-sm">No {filter} orders</div>}

        {filtered.map(order => (
          /* Changes 1: Added dynamic background for cancelled order status */
          <div key={order.orderId} className={`rounded border p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-300 ${order.status === 'cancelled' ? 'bg-zinc-100 border-zinc-200' : 'bg-white border-zinc-100'}`}>
            <div className="flex flex-wrap justify-between gap-3">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F8F7F4] border flex items-center justify-center font-bold text-sm">{order.customer?.name?.[0] || "U"}</div>
                <div>
                  <p className="font-bold text-sm flex items-center gap-2">
                    {order.orderId}{" "}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      order.status === 'cancelled' ? 'bg-zinc-300 text-zinc-700' :
                      order.status === 'pending' ? 'bg-red-50 text-red-600 border border-red-100' : 
                      order.status === 'preparing' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' : 
                      'bg-green-50 text-green-700 border border-green-100'
                    }`}>
                      {order.status?.replaceAll('_', ' ').toUpperCase()}
                    </span>
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">👤 {order.customer?.name} • 📞 {order.customer?.phone}</p>
                  <p className="text-xs text-zinc-400">📍 {order.customer?.address} • 🕒 {order.createdAt}</p>
                </div>
              </div>
              <div className="text-right"><p className="font-bold text-sm">{order.billing?.total || order.total}</p><p className="text-xs text-zinc-400">{order.billing?.paymentMethod || "COD"}</p></div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {order.items?.map((it, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#F8F7F4] border border-zinc-100 rounded-full pl-1 pr-3 h-8">
                  <img src={it.foodImage || it.image} className="w-6 h-6 rounded-full object-cover" alt="" />
                  <span className="text-sm font-medium">{it.foodName} {it.size && <span className="bg-zinc-900 text-white px-1.5 py-0.5 rounded-full text-xs ml-1">{it.size}</span>} x{it.quantity}</span>
                </div>
              ))}
            </div>

            
            {/* Changes 3: Hidden workflow buttons completely if the status matches cancelled */}
            {order.status !== 'cancelled' && (
              <div className="mt-4 flex gap-2 flex-wrap">
                <button 
                  onClick={async () => {
                    try {
                      const res = await axios.patch(`http://localhost:3000/orders/${order.orderId}`, {
                        status: 'pending'
                      });

                      if (res.status === 200) {
                        updateStatus(order.orderId, 'pending');
                        console.log("Order status updated to pending");
                      }
                    } catch (error) {
                      console.error("DB update error:", error.response?.data || error.message);
                    }
                  }}
                  className="h-8 px-4 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold"
                >
                  Pending
                </button>
                <button onClick={async () => {
                  try {
                    const res = await axios.patch(`http://localhost:3000/orders/${order.orderId}`, { status: 'preparing' });
                    if (res.status === 200) {
                      updateStatus(order.orderId, 'preparing');
                    }
                  } catch (error) {
                    console.error("DB update error:", error);
                    alert("Database me status change nahi ho saka!");
                  }
                }} className="h-8 px-4 rounded-full bg-yellow-400 text-zinc-900 text-sm font-bold">Preparing</button>
                <button onClick={async () => {
                  try {
                    const res = await axios.patch(`http://localhost:3000/orders/${order.orderId}`, { status: 'out_for_delivery' });
                    if (res.status === 200) {
                      updateStatus(order.orderId, 'out_for_delivery');
                    }
                  } catch (error) {
                    console.error("DB update error:", error);
                    alert("Database me status change nahi ho saka!");
                  }
                }} className="h-8 px-4 rounded-full bg-green-600 text-white text-sm font-bold">Out for Delivery</button>
                <button onClick={async () => {
                  try {
                    const res = await axios.patch(`http://localhost:3000/orders/${order.orderId}`, { status: 'delivered' });
                    if (res.status === 200) {
                      updateStatus(order.orderId, 'delivered');
                    }
                  } catch (error) {
                    console.error("DB update error:", error);
                    alert("Database me status change nahi ho saka!");
                  }
                }} className="h-8 px-4 rounded-full bg-zinc-900 text-white text-sm font-bold">✓ Delivered</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
