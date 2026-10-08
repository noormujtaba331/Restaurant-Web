import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = "https://restaurant-web-zeta-five.vercel.app";

const Cards = () => {
  const [foodData, setFoodData] = useState(() => JSON.parse(localStorage.getItem('allProducts')) || []);
  const [Categorise] = useState(["All", "Pizza", "Burger", "Pasta", "Grill", "Desserts", "Drinks"]);
  const [FilteredData, setfilteredData] = useState(() => JSON.parse(localStorage.getItem('allProducts')) || []);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState({});
  const scrollRef = useRef(null);

  useEffect(() => {
    axios.get(`${API_URL}/products`).then((res) => {
      const products = res.data.products || [];
      setFoodData(products);
      setfilteredData(products);
      localStorage.setItem('allProducts', JSON.stringify(products));

      const init = {};
      products.forEach(item => {
        const id = item._id || item.id;
        const sizes = typeof item.sizes === 'string'? item.sizes.split(',').map(s => s.trim()) : item.sizes;
        if (sizes && sizes[0]!== "Regular") {
          init[id] = sizes[0];
        }
      });
      setSelectedSizes(init);
    });
  }, []);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    const filtered = cat === "All"? foodData : foodData.filter(f => f.category?.toLowerCase() === cat.toLowerCase());
    setfilteredData(filtered);
  };

  const getPrice = (food, size) => {
    if (!size || String(food.sizes) === "Regular") return food.price;
    if (size === 'S') return food.SPrice || food.price;
    if (size === 'M') return food.MPrice || food.price;
    if (size === 'L') return food.LPrice || food.price;
    return food.price;
  };

  const getSizes = (food) => {
    if (!food.sizes) return [];
    if (Array.isArray(food.sizes)) return food.sizes.filter(s => s!== "Regular");
    return String(food.sizes).split(',').map(s => s.trim()).filter(s => s && s!== "Regular");
  };

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir === "left"? -200 : 200, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center gap-2 mb-5 sticky top-2 z-20 bg-white/90 backdrop-blur py-2">
        <button onClick={() => scroll("left")} className="w-8 h-8 rounded-full border bg-white flex items-center justify-center">{"<"}</button>
        <div ref={scrollRef} className="flex gap-2 overflow-x-auto flex-1 [&::-webkit-scrollbar]:hidden">
          {Categorise.map(cat => (
            <button key={cat} onClick={() => handleCategoryChange(cat)} className={`px-5 h-9 rounded-full border text-sm transition ${activeCategory === cat? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-600 hover:border-zinc-900"}`}>
              {cat}
            </button>
          ))}
        </div>
        <button onClick={() => scroll("right")} className="w-8 h-8 rounded-full border bg-white flex items-center justify-center">{">"}</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {FilteredData.map(food => {
          const id = food._id || food.id;
          const sizes = getSizes(food);
          const hasSizes = sizes.length > 0;
          const selected = selectedSizes[id] || (hasSizes? sizes[0] : "Regular");
          const price = getPrice(food, selected);

          return (
            <div key={id} className="bg-white rounded-2xl border border-zinc-100 p-2.5 shadow-sm hover:shadow-lg transition flex flex-col justify-between">
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-square bg-zinc-50">
                  <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-white/90 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow">
                    {food.category}
                  </div>
                </div>
                <div className="px-1 pt-3">
                  <h3 className="text-sm font-semibold text-zinc-900 line-clamp-1">{food.name}</h3>
                  <p className="mt-1 text-xs text-zinc-500 line-clamp-2 min-h-">
                    {food.details || food.description || "Fresh and tasty made for you"}
                  </p>
                  {hasSizes && (
                    <div className="flex items-center gap-2 mt-2.5">
                      <span className="text- tracking-widest text-zinc-400 font-bold">SIZE:</span>
                      <div className="flex gap-1.5">
                        {sizes.map(s => (
                          <button key={s} onClick={() => setSelectedSizes(prev => ({...prev, [id]: s }))}
                            className={`w-7 h-7 rounded-full text-xs font-bold border transition ${selected === s? "bg-blue-600 text-white border-blue-600" : "bg-white text-zinc-600 border-zinc-200"}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-1 pt-3 pb-1 flex items-center justify-between">
                <span className="text-base font-bold text-zinc-900">{price}</span>
                <button
                  onClick={() => {
                    const item = {
                      foodId: id,
                      _id: id,
                      foodImage: food.image,
                      foodName: food.name,
                      foodCategory: food.category,
                      foodPrice: Number(price),
                      size: selected,
                      selectedSize: selected,
                      quantity: 1
                    };
                    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
                    const idx = cart.findIndex(c => (c.foodId === item.foodId || c._id === item._id) && c.size === item.size);
                    if (idx!== -1) cart[idx].quantity += 1;
                    else cart.push(item);
                    localStorage.setItem('cartItems', JSON.stringify(cart));
                    window.dispatchEvent(new Event('cartUpdated'));
                  }}
                  className="h-8 px-4 rounded-full bg-zinc-900 text-white text-xs font-medium active:scale-95 transition"
                >
                  Add +
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {FilteredData.length === 0 && <p className="text-center mt-10 text-zinc-400 text-sm">No items in {activeCategory}</p>}
    </div>
  );
};

export default Cards;