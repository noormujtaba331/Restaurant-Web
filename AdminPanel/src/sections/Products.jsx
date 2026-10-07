import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://restaurant-web-zeta-five.vercel.app";

const Products = () => {
  const [foodData, setFoodData] = useState([]);
  const [categorise] = useState(["All", "Pizza", "Burger", "Pasta", "Healthy", "Grill", "Desserts", "Drinks"]);
  const [showForm, setShowForm] = useState(false);
  const [showForm2, setShowForm2] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedSizes, setSelectedSizes] = useState({});

  const initialFormState = {
    _id: "", name: "", category: "Pizza", details: "", price: "", imageFile: null,
    hasSize: false, sizes: "S,M,L", SPrice: "", MPrice: "", LPrice: ""
  };
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    axios.get(`${API_URL}/products`)
    .then((response) => {
        const products = response.data.products || [];
        setFoodData(products);
        const init = {};
        products.forEach(p => {
          const id = p._id || p.id;
          if (p.sizes && String(p.sizes)!== "Regular") { init[id] = "S"; }
        });
        setSelectedSizes(init);
      }).catch((error) => { console.error("Error:", error); });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Only image files allowed"); return; }
    setForm(prev => ({...prev, imageFile: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure?")) return;
    axios.delete(`${API_URL}/products/${id}`)
    .then(() => { setFoodData(prev => prev.filter(p => (p._id || p.id)!== id)); })
    .catch(err => { alert("Delete failed!"); });
  };

  const getDisplayPrice = (p) => {
    const id = p._id || p.id;
    const active = selectedSizes[id] || "S";
    if (String(p.sizes) === "Regular" ||!p.sizes) return p.price;
    if (active === "S" && p.SPrice) return p.SPrice;
    if (active === "M" && p.MPrice) return p.MPrice;
    if (active === "L" && p.LPrice) return p.LPrice;
    return p.price;
  };

  const submitProduct = (isEdit) => {
    if (!form.name ||!form.category) return alert("Name required");
    if (!isEdit &&!form.imageFile) return alert("Image select karo");
    const fd = new FormData();
    fd.append("name", form.name); fd.append("category", form.category);
    fd.append("details", form.details || ""); fd.append("price", String(form.price || 0));
    if (form.imageFile) fd.append("image", form.imageFile);
    if (form.hasSize) {
      fd.append("sizes", "S,M,L"); fd.append("SPrice", form.SPrice);
      fd.append("MPrice", form.MPrice); fd.append("LPrice", form.LPrice);
    } else { fd.append("sizes", "Regular"); fd.append("SPrice", "0"); fd.append("MPrice", "0"); fd.append("LPrice", "0"); }
    const url = isEdit? `${API_URL}/products/${form._id}` : `${API_URL}/products`;
    const req = isEdit? axios.patch(url, fd) : axios.post(url, fd);
    req.then(response => {
      const product = response.data.product || response.data;
      if (isEdit) { setFoodData(prev => prev.map(item => (item._id || item.id) === form._id? {...item,...product } : item)); setShowForm2(false); }
      else { setFoodData(prev => [product,...prev]); setShowForm(false); }
      setImagePreview(""); setForm(initialFormState);
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">Products</h1><p className="text-sm text-zinc-500">Vercel Live</p></div>
        <button onClick={() => { setForm(initialFormState); setImagePreview(""); setShowForm(true); }} className="h-11 px-6 rounded-full bg-zinc-900 text-white text-sm font-bold">+ Add Product</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {foodData.map(p => {
          const id = p._id || p.id;
          const activeSize = selectedSizes[id] || "S";
          const displayPrice = getDisplayPrice(p);
          const hasSizes = p.sizes && String(p.sizes)!== "Regular";
          return (
            <div key={id} className="group bg-white rounded-xl border p-2.5">
              <div className="relative rounded-lg overflow-hidden aspect-[1.1/1] bg-zinc-50">
                <img src={p.image} className="w-full h-full object-cover" alt="" />
                <div className="absolute top-2 left-2 bg-white/90 rounded-full px-2.5 py-1 text-xs font-bold">{p.category}</div>
                <div className="absolute top-2 right-2 bg-zinc-900 text-white rounded-full px-2.5 py-1 text-xs font-bold">{displayPrice}</div>
              </div>
              <div className="p-2.5">
                <p className="font-bold truncate">{p.name}</p>
                <p className="text-xs text-zinc-500 line-clamp-1">{p.details}</p>
                {hasSizes && (
                  <div className="flex gap-1 mt-2">
                    {["S", "M", "L"].map(sz => (
                      <span key={sz} onClick={() => setSelectedSizes(prev => ({...prev, [id]: sz }))} className={`px-3 h-6 rounded-full text-xs font-bold flex items-center cursor-pointer border ${activeSize===sz? "bg-blue-600 text-white" : "bg-zinc-100"}`}>{sz}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => { setForm({ _id: id, name: p.name, category: p.category, details: p.details, price: p.price, imageFile: null, hasSize: hasSizes, SPrice: p.SPrice, MPrice: p.MPrice, LPrice: p.LPrice }); setImagePreview(p.image); setShowForm2(true); }} className="flex-1 h-8 rounded-full bg-zinc-100 text-xs font-bold">Edit</button>
                  <button onClick={() => handleDelete(id)} className="flex-1 h-8 rounded-full bg-zinc-100 text-xs font-bold">Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Products;