import axios from "axios";
import { useState, useEffect } from "react";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showCancel, setShowCancel] = useState(false);

  const getLatest = async () => {
    const saved = localStorage.getItem("currentOrder");
    if (!saved) return;
    const oldOrder = JSON.parse(saved);
    const res = await axios.get("http://localhost:3000/orders");
    const fresh = res.data.orders.find(o => o.orderId === oldOrder.orderId);
    if (fresh && fresh.status!== oldOrder.status) {
      setCurrentOrder(fresh);
      localStorage.setItem("currentOrder", JSON.stringify(fresh));
    }
  };

  useEffect(() => {
    const cart = localStorage.getItem("cartItems");
    if (cart) setItems(JSON.parse(cart));

    const order = localStorage.getItem("currentOrder");
    if (order) setCurrentOrder(JSON.parse(order));
  }, []);

  useEffect(() => {
    if (!currentOrder) return;
    if (currentOrder.status === "delivered" || currentOrder.status === "cancelled") return;

    const timer = setInterval(() => {
      getLatest();
    }, 2000);

    return () => clearInterval(timer);
  }, [currentOrder]);

  const subtotal = items.reduce((a, b) => a + Number(b.foodPrice) * Number(b.quantity), 0);
  const delivery = 120;
  const total = subtotal + delivery;

  const removeItem = (i) => {
    const data = items.filter((_, index) => index!== i);
    setItems(data);
    localStorage.setItem("cartItems", JSON.stringify(data));
  };

  const qty = (i, type) => {
    const data = items.map((item, index) => {
      if (index === i) {
        return {...item, quantity: type === "add"? item.quantity + 1 : Math.max(1, item.quantity - 1) };
      }
      return item;
    });
    setItems(data);
    localStorage.setItem("cartItems", JSON.stringify(data));
  };

  const cancelOrder = () => {
    axios.patch(`http://localhost:3000/orders/${currentOrder.orderId}`, {
      status: "cancelled"
    }).then(res => {
      setCurrentOrder(res.data);
      localStorage.setItem("currentOrder", JSON.stringify(res.data));
      setShowCancel(false);
    });
  };

  const delivered = () => {
    axios.patch(`http://localhost:3000/orders/${currentOrder.orderId}`, {
      status: "delivered"
    }).then(() => {
      getLatest();
    });
  };

  const clearOrder = () => {
    localStorage.removeItem("currentOrder");
    setCurrentOrder(null);
    setShowCancel(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:mt-12">

      {currentOrder && (
        <div className={`mb-6 border rounded-2xl p-5 ${currentOrder.status === "cancelled"? "bg-zinc-50" : currentOrder.status === "pending"? "bg-red-50 border-red-200" : currentOrder.status === "preparing"? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"}`}>
          <div className="flex justify-between items-center">
            <h2 className="font-bold">
              {currentOrder.status === "cancelled"? "Order Cancelled" : currentOrder.status === "pending"? "Current Order - Pending" : currentOrder.status === "preparing"? "Current Order - Preparing" : "Order Delivered"}
            </h2>
            <span className="text-xs px-3 py-1 rounded-full font-bold bg-zinc-900 text-white">
              {currentOrder.status}
            </span>
          </div>

          <div className="mt-3 text-sm">
            <p className="text-zinc-500">Order ID: <span className="text-zinc-900 font-medium">{currentOrder.orderId}</span></p>
            <p className="text-zinc-500 mt-1">{currentOrder.customer?.name} - {currentOrder.customer?.phone}</p>

            <div className="mt-3 space-y-1">
              {currentOrder.items?.map((it, idx) => (
                <div key={idx} className="flex justify-between bg-white rounded-full px-3 py-1 border text-xs">
                  <span>{it.foodName} {it.size? `(${it.size})` : ""} x{it.quantity}</span>
                  <span className="font-bold">{Number(it.foodPrice) * Number(it.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold mt-3 border-t pt-2">
              <span>Total</span>
              <span>{currentOrder.billing?.total?? currentOrder.total}</span>
            </div>

            {showCancel && (
              <div className="mt-4 bg-white border rounded-2xl p-4">
                <p className="text-sm font-bold">Order cancel karna hai?</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={cancelOrder} className="bg-red-600 text-white px-5 h-9 rounded-full text-xs font-bold">Confirm</button>
                  <button onClick={() => setShowCancel(false)} className="bg-zinc-100 px-5 h-9 rounded-full text-xs font-bold">Cancel</button>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              {currentOrder.status === "pending" &&!showCancel && (
                <button onClick={() => setShowCancel(true)} className="bg-white border text-red-600 px-4 h-9 rounded-full text-xs font-bold">Cancel Order</button>
              )}
              {(currentOrder.status === "pending" || currentOrder.status === "preparing") && (
                <button onClick={delivered} className="bg-green-200 text-green-800 px-4 h-9 rounded-full text-xs font-bold">Received</button>
              )}
              {(currentOrder.status === "delivered" || currentOrder.status === "cancelled") && (
                <button onClick={clearOrder} className="bg-zinc-900 text-white px-5 h-9 rounded-full text-xs font-bold">Remove</button>
              )}
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!items.length) return;

          const f = new FormData(e.target);
          const payload = {
            orderId: `TAS-${Date.now()}`,
            items: items.map(it => ({
              foodId: it.foodId,
              foodName: it.foodName,
              foodImage: it.foodImage,
              foodCategory: it.foodCategory,
              foodPrice: Number(it.foodPrice),
              size: it.size || "Regular",
              quantity: Number(it.quantity),
              subtotal: Number(it.foodPrice) * Number(it.quantity),
            })),
            customer: { name: f.get("customerName"), phone: f.get("phone"), address: f.get("address") },
            billing: { subtotal, delivery, total },
            total,
            status: "pending",
            createdAt: new Date().toLocaleString(),
          };

          setCurrentOrder(payload);
          localStorage.setItem("currentOrder", JSON.stringify(payload));
          setItems([]);
          localStorage.removeItem("cartItems");
          axios.post("http://localhost:3000/orders", payload);
          e.target.reset();
        }}
        className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6"
      >
        <div>
          <h1 className="font-bold">Your Cart ({items.length})</h1>
          {items.length === 0 &&!currentOrder && <p className="mt-6 text-zinc-400 text-sm">Cart is empty</p>}

          {items.map((it, i) => (
            <div key={i} className="mt-4 bg-white rounded-xl border p-3 flex gap-4 relative">
              <img src={it.foodImage} className="w-20 h-20 rounded-2xl object-cover" alt="" />
              <div className="flex-1">
                <p className="font-semibold text-sm">{it.foodName}</p>
                <p className="text-xs text-zinc-500 mt-1">{it.foodCategory} {it.size && <span className="bg-zinc-900 text-white px-2 py-0.5 rounded-full ml-1">{it.size}</span>}</p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-2 border rounded-full px-2 py-1">
                    <button type="button" onClick={() => qty(i, "minus")} className="w-6 h-6">-</button>
                    <span className="text-sm font-bold w-4 text-center">{it.quantity}</span>
                    <button type="button" onClick={() => qty(i, "add")} className="w-6 h-6">+</button>
                  </div>
                  <span className="font-bold text-sm">{Number(it.foodPrice) * it.quantity}</span>
                </div>
              </div>
              <button type="button" onClick={() => removeItem(i)} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-zinc-100 text-xs">✕</button>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 p-4 rounded-3xl h-fit sticky top-24 space-y-4">
          <div className="bg-white rounded-2xl border p-5">
            <h3 className="font-bold text-sm">Delivery Details</h3>
            <div className="mt-3 grid gap-3">
              <input name="customerName" required placeholder="Full Name" className="h-10 rounded-full border bg-zinc-50 px-4 text-sm outline-none" />
              <input name="phone" required placeholder="Phone Number" className="h-10 rounded-full border bg-zinc-50 px-4 text-sm outline-none" />
              <input name="address" required placeholder="Address" className="h-10 rounded-full border bg-zinc-50 px-4 text-sm outline-none" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-5">
            <h3 className="font-bold text-sm">Order Summary</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{subtotal}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{delivery}</span></div>
              <div className="flex justify-between font-bold border-t pt-2 mt-2"><span>Total</span><span>{total}</span></div>
            </div>
            <button disabled={!items.length} className="w-full mt-5 h-11 rounded-full bg-zinc-900 text-white text-sm font-bold disabled:bg-zinc-300">Proceed to Checkout</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Cart;