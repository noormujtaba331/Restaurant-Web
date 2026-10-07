import { useState, useEffect } from "react";
import axios from "axios";

const Products = () => {
  const [foodData, setFoodData] = useState([]);
  const [categorise] = useState(["All", "Pizza", "Burger", "Pasta", "Healthy", "Grill", "Desserts", "Drinks"]);
  const [showForm, setShowForm] = useState(false);
  const [showForm2, setShowForm2] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedSizes, setSelectedSizes] = useState({});

  const initialFormState = {
    _id: "",
    name: "",
    category: "Pizza",
    details: "",
    price: "",
    imageFile: null,
    hasSize: false,
    sizes: "S,M,L",
    SPrice: "",
    MPrice: "",
    LPrice: ""
  };

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    axios.get("http://localhost:3000/products")
     .then((response) => {
        const products = response.data.products || [];
        setFoodData(products);
        const init = {};
        products.forEach(p => {
          const id = p._id || p.id;
          if (p.sizes && String(p.sizes)!== "Regular") {
            init[id] = "S";
          }
        });
        setSelectedSizes(init);
      })
     .catch((error) => {
        console.error("Error fetching food data:", error);
      });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }
    setForm(prev => ({...prev, imageFile: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    axios.delete(`http://localhost:3000/products/${id}`)
     .then(() => {
        setFoodData(prev => prev.filter(p => (p._id || p.id)!== id));
      })
     .catch(err => {
        console.error("Error deleting product:", err);
        alert("Delete failed!");
      });
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
    if (!form.name ||!form.category) return alert("Name, Category required");
    if (!isEdit &&!form.imageFile) return alert("Image select karo bro");
    if (!form.hasSize &&!form.price) return alert("Base Price required");
    if (form.hasSize && (!form.SPrice ||!form.MPrice ||!form.LPrice)) return alert("S, M, L prices required");

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("category", form.category);
    fd.append("details", form.details || "");
    fd.append("price", String(form.price || 0));
    if (form.imageFile) fd.append("image", form.imageFile);

    if (form.hasSize) {
      fd.append("sizes", "S,M,L");
      fd.append("SPrice", String(form.SPrice));
      fd.append("MPrice", String(form.MPrice));
      fd.append("LPrice", String(form.LPrice));
    } else {
      fd.append("sizes", "Regular");
      fd.append("SPrice", "0");
      fd.append("MPrice", "0");
      fd.append("LPrice", "0");
    }

    const url = isEdit? `http://localhost:3000/products/${form._id}` : "http://localhost:3000/products";
    const req = isEdit? axios.patch(url, fd) : axios.post(url, fd);

    req.then(response => {
      const product = response.data.product || response.data;
      if (isEdit) {
        setFoodData(prev => prev.map(item => (item._id || item.id) === form._id? {...item,...product } : item));
        setShowForm2(false);
      } else {
        setFoodData(prev => [product,...prev]);
        const nid = product._id || product.id;
        if (String(product.sizes)!== "Regular") {
          setSelectedSizes(prev => ({...prev, [nid]: "S" }));
        }
        setShowForm(false);
      }
      setImagePreview("");
      setForm(initialFormState);
    }).catch(error => {
      console.error("Error saving:", error.response?.data || error);
      alert("Error saving product: " + (error.response?.data?.message || ""));
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-zinc-500">Manage your store menu</p>
        </div>
        <button
          onClick={() => {
            setForm(initialFormState);
            setImagePreview("");
            setShowForm(true);
          }}
          className="h-11 px-6 rounded-full bg-zinc-900 text-white text-sm font-bold shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
        >
          + Add Product
        </button>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {foodData.map(p => {
          const id = p._id || p.id;
          const activeSize = selectedSizes[id] || "S";
          const displayPrice = getDisplayPrice(p);
          const hasSizes = p.sizes && String(p.sizes)!== "Regular";
          return (
            <div key={id} className="group bg-white rounded-xl border border-zinc-100 p-2.5 shadow-sm hover:shadow-xl transition">
              <div className="relative rounded-lg overflow-hidden aspect-[1.1/1] bg-zinc-50">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt={p.name} />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur rounded-full px-2.5 py-1 text-xs font-bold shadow">{p.category}</div>
                <div className="absolute top-2 right-2 bg-zinc-900 text-white rounded-full px-2.5 py-1 text-xs font-bold">{displayPrice}</div>
              </div>
              <div className="p-2.5">
                <p className="font-bold text-base truncate">{p.name}</p>
                <p className="text-xs text-zinc-500 line-clamp-1">{p.details}</p>

                {hasSizes && (
                  <div className="flex gap-1 mt-2 overflow-x-auto">
                    {["S", "M", "L"].map(sz => {
                      const isActive = activeSize === sz;
                      return (
                        <span
                          key={sz}
                          onClick={() => setSelectedSizes(prev => ({...prev, [id]: sz }))}
                          className={`w-fit px-3 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 cursor-pointer transition-all border
                          ${isActive? "bg-blue-600 text-white border-blue-600 scale-105 shadow" : "bg-zinc-100 text-zinc-700 border-zinc-100 hover:bg-zinc-200"}`}
                        >
                          {sz}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setForm({
                        _id: id,
                        name: p.name || "",
                        category: p.category || "Pizza",
                        details: p.details || "",
                        price: p.price || "",
                        imageFile: null,
                        hasSize: hasSizes,
                        sizes: Array.isArray(p.sizes)? p.sizes.join(",") : (p.sizes || "S,M,L"),
                        SPrice: p.SPrice || "",
                        MPrice: p.MPrice || "",
                        LPrice: p.LPrice || ""
                      });
                      setImagePreview(p.image || "");
                      setShowForm2(true);
                    }}
                    className="flex-1 h-8 rounded-full bg-[#F8F7F4] border text-xs font-bold hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(id)}
                    className="flex-1 h-8 rounded-full bg-[#F8F7F4] border text-xs font-bold hover:bg-red-50 hover:text-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {foodData.length === 0 && (
          <p className="col-span-full text-center text-zinc-400 text-sm mt-10">No products yet — Add Product</p>
        )}
      </div>

      {/* EDIT MODAL */}
      {showForm2 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div onClick={() => { setShowForm2(false); setImagePreview(""); }} className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>
          <form onSubmit={(e) => { e.preventDefault(); submitProduct(true); }} className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl max-h- overflow-auto z-10">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Edit Product</h3>
              <button type="button" onClick={() => { setShowForm2(false); setImagePreview(""); }} className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">✕</button>
            </div>
            <div className="mt-5 grid gap-3">
              <div className="rounded-xl border-2 border-dashed border-zinc-200 p-3 bg-[#F8F7F4] flex items-center justify-between">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="imgFileEdit" />
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white border flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview? <img src={imagePreview} className="w-full h-full object-cover" alt="preview" /> : <span>🖼</span>}
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-bold">{imagePreview? "Image Loaded" : "Upload Image"}</p>
                    <p className="text-xs text-zinc-400">PNG, JPG only</p>
                  </div>
                </div>
                <label htmlFor="imgFileEdit" className="h-8 px-4 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center cursor-pointer">Change</label>
              </div>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value })} placeholder="Name" className="h-11 rounded-full bg-[#F8F7F4] border px-5 text-sm outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value })} className="h-11 rounded-full bg-[#F8F7F4] border px-5 text-sm outline-none">
                  {categorise.filter(c => c!== "All").map(c => <option key={c}>{c}</option>)}
                </select>
                <input value={form.price} onChange={e => setForm({...form, price: e.target.value })} type="number" placeholder="Base Price" className="h-11 rounded-full bg-[#F8F7F4] border px-5 text-sm outline-none" />
              </div>
              <textarea value={form.details} onChange={e => setForm({...form, details: e.target.value })} placeholder="Details" className="min-h- rounded-2xl bg-[#F8F7F4] border p-4 text-sm outline-none resize-none" />
              <label className="flex items-center gap-2 bg-zinc-50 border rounded-full px-4 h-11 cursor-pointer">
                <input type="checkbox" checked={form.hasSize} onChange={e => setForm({...form, hasSize: e.target.checked })} className="w-4 h-4" />
                <span className="text-sm font-bold">Have sizes?</span>
              </label>
              {form.hasSize && (
                <div className="space-y-3 bg-zinc-50 p-3 rounded-2xl border">
                  <div className="grid grid-cols-3 gap-2">
                    <input value={form.SPrice} onChange={e => setForm({...form, SPrice: e.target.value })} type="number" placeholder="S Price" className="h-11 rounded-full bg-white border px-3 text-sm text-center outline-none" />
                    <input value={form.MPrice} onChange={e => setForm({...form, MPrice: e.target.value })} type="number" placeholder="M Price" className="h-11 rounded-full bg-white border px-3 text-sm text-center outline-none" />
                    <input value={form.LPrice} onChange={e => setForm({...form, LPrice: e.target.value })} type="number" placeholder="L Price" className="h-11 rounded-full bg-white border px-3 text-sm text-center outline-none" />
                  </div>
                </div>
              )}
              <button type="submit" className="mt-2 h-12 rounded-full bg-zinc-900 text-white font-bold text-sm">Update Product</button>
            </div>
          </form>
        </div>
      )}

      {/* ADD MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div onClick={() => { setShowForm(false); setImagePreview(""); }} className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>
          <form onSubmit={(e) => { e.preventDefault(); submitProduct(false); }} className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl max-h- overflow-auto z-10">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Add Product</h3>
              <button type="button" onClick={() => { setShowForm(false); setImagePreview(""); }} className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">✕</button>
            </div>
            <div className="mt-5 grid gap-3">
              <div className="rounded-xl border-2 border-dashed border-zinc-200 p-3 bg-[#F8F7F4] flex items-center justify-between">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="imgFileAdd" />
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white border flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview? <img src={imagePreview} className="w-full h-full object-cover" alt="preview" /> : <span>🖼</span>}
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-bold">{imagePreview? "Image Selected" : "Upload Image"}</p>
                    <p className="text-xs text-zinc-400">PNG, JPG only</p>
                  </div>
                </div>
                <label htmlFor="imgFileAdd" className="h-8 px-4 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center cursor-pointer">Browse</label>
              </div>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value })} placeholder="Name" className="h-11 rounded-full bg-[#F8F7F4] border px-5 text-sm outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value })} className="h-11 rounded-full bg-[#F8F7F4] border px-5 text-sm outline-none">
                  {categorise.filter(c => c!== "All").map(c => <option key={c}>{c}</option>)}
                </select>
                <input value={form.price} onChange={e => setForm({...form, price: e.target.value })} type="number" placeholder="Base Price" className="h-11 rounded-full bg-[#F8F7F4] border px-5 text-sm outline-none" />
              </div>
              <textarea value={form.details} onChange={e => setForm({...form, details: e.target.value })} placeholder="Details" className="min-h- rounded-2xl bg-[#F8F7F4] border p-4 text-sm outline-none resize-none" />
              <label className="flex items-center gap-2 bg-zinc-50 border rounded-full px-4 h-11 cursor-pointer">
                <input type="checkbox" checked={form.hasSize} onChange={e => setForm({...form, hasSize: e.target.checked })} className="w-4 h-4" />
                <span className="text-sm font-bold">Have sizes?</span>
              </label>
              {form.hasSize && (
                <div className="space-y-3 bg-zinc-50 p-3 rounded-2xl border">
                  <div className="grid grid-cols-3 gap-2">
                    <input value={form.SPrice} onChange={e => setForm({...form, SPrice: e.target.value })} type="number" placeholder="S Price" className="h-11 rounded-full bg-white border px-3 text-sm text-center outline-none" />
                    <input value={form.MPrice} onChange={e => setForm({...form, MPrice: e.target.value })} type="number" placeholder="M Price" className="h-11 rounded-full bg-white border px-3 text-sm text-center outline-none" />
                    <input value={form.LPrice} onChange={e => setForm({...form, LPrice: e.target.value })} type="number" placeholder="L Price" className="h-11 rounded-full bg-white border px-3 text-sm text-center outline-none" />
                  </div>
                </div>
              )}
              <button type="submit" className="mt-2 h-12 rounded-full bg-zinc-900 text-white font-bold text-sm">Save Product →</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Products;