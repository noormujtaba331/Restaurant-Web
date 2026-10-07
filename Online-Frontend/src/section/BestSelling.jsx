import React, { useState } from 'react'

const BestSelling = () => {
  const [qty, setQty] = useState(1);

  const product = {
    id: 101,
    name: "Crispy Zinger Burger - Extra Cheese",
    price: 550,
    oldPrice: 750,
    category: "Burger",
    type: "Fast Food",
    image: "https://media.istockphoto.com/id/1490923055/photo/vegan-burger.webp?a=1&b=1&s=612x612&w=0&k=20&c=Lr-7tUJoiyzPVw2WRu-GfpZRb_D3GKEa7VrkexWxn34=",
    rating: 4.9
  };

  const handleAddToCart = (e) => {
    e.preventDefault();

    const newItem = {
      foodId: product.id,
      foodImage: product.image,
      foodName: product.name,
      foodCategory: product.category,
      foodPrice: product.price,
      size: "Regular",
      quantity: qty
    };

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingIndex = cartItems.findIndex(item => item.foodId === newItem.foodId);

    if (existingIndex!== -1) {
      cartItems[existingIndex].quantity += qty;
    } else {
      cartItems.push(newItem);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    alert(`${product.name} x${qty} Added`);
  };

  return (
    <div id='popular'>
      <form onSubmit={handleAddToCart} className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-20">

        <div className="mb-8 flex items-center gap-3">
          <div className="h-px w-12 bg-zinc-200"></div>
          <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">Most Loved - Fast Food</span>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-16">

          <div>
            <div className="rounded- bg-[#FFF3E0] p-3 shadow-lg border">
              <div className="rounded- overflow-hidden aspect-[4/3] relative bg-white">
                <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-white rounded-full px-3 py-1.5 text-xs font-bold shadow">Best Seller</span>
                  <span className="bg-red-600 text-white rounded-full px-3 py-1.5 text-xs font-bold shadow">20% OFF</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-green-50 border border-green-200 text-xs font-bold text-green-700">● IN STOCK</span>
              <span className="px-3 py-1 rounded-full bg-zinc-50 border text-xs font-medium">{product.category} • {product.type}</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">{product.name}</h1>

            <div className="mt-3 flex items-center gap-3">
              <span className="text-sm font-bold">{product.rating}</span>
              <span className="text-yellow-500 text-sm">★★★★★</span>
              <span className="text-xs text-zinc-500">(2,412 reviews)</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-zinc-900">{product.price}</span>
              <span className="text-lg line-through text-zinc-400">{product.oldPrice}</span>
            </div>

            <p className="mt-5 text-sm leading-6 text-zinc-500">
              Full crispy zinger fillet, extra cheese, fresh lettuce,
              secret mayo sauce aur soft bun me. Lahore ka asli fast food taste,
              garam garam serve hota hai.
            </p>

            <div className="mt-8">
              <p className="text- font-bold uppercase text-zinc-400">Quantity</p>
              <div className="mt-2 flex items-center gap-2 border rounded-full px-2 py-1 w-fit">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center">−</button>
                <span className="w-8 text-center text-sm font-bold">{String(qty).padStart(2, '0')}</span>
                <button type="button" onClick={() => setQty(qty + 1)} className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center">+</button>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button type="submit" className="flex-1 h-12 rounded-full bg-zinc-900 text-white text-sm font-bold hover:bg-black transition">
                Add to Cart — {product.price} x {qty}
              </button>
            </div>

           
          </div>
        </div>
      </form>
    </div>
  )
}

export default BestSelling