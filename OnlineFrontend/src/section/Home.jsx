import React from 'react'
import BG from '../assets/bg.png'
import Cards from './Cards'
import BestSelling from './BestSelling'
import Footer from './Footer'

const Home = () => {
  return (
    <>
      <section id='home' className="max-w-[1240px] mx-auto px-6 lg:px-8 pt-10 lg:pt-20 pb-12">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-[11px] font-semibold tracking-widest uppercase text-zinc-600">Free delivery for first order</span>
            </div>
            <h1 className="text-[42px] lg:text-[64px] font-extrabold tracking-tight leading-[0.9] text-zinc-900">
              Delicious Food<br />
              <span className="font-light italic">Delivered To</span><br />
              Your Door
            </h1>
            <p className="mt-6 text-[16px] text-zinc-500 max-w-[420px]">
              Experience gourmet flavors crafted by top chefs, delivered hot and fresh in under 30 minutes.
            </p>
            <div className="mt-8 flex items-center gap-3"><a href="/#menu">
              <button className="h-[48px] px-7 rounded-full bg-zinc-900 text-white text-[14px] font-medium">Order Now →</button>
              <button className="h-[48px] px-7 rounded-full border border-zinc-200 text-[14px] font-medium">View Menu</button>
            </a> </div>
            <div className="mt-10 flex items-center gap-5">

              <div>
                <p className="text-[14px] font-semibold">4.9/5.0 ★★★★★</p>
                <p className="text-[12px] text-zinc-500">from 2k+ reviews</p>
              </div>
            </div>
          </div>
          {/* Right */}
          <div className="relative">
            <div className="rounded-[32px] bg-[#F6F5F1] p-4 shadow-xl">
              <div className="rounded-[24px] overflow-hidden aspect-square relative bg-white">
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000" className="w-full h-full object-cover" />
                <div className="absolute top-5 left-5 bg-white rounded-2xl px-4 py-3 shadow-lg">
                  <p className="text-[10px] font-bold uppercase text-zinc-400">Price</p>
                  <p className="text-[18px] font-bold">PKR 1000</p>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-[20px] p-4 flex justify-between">
                  <div  ><a href="#menu"><p className="text-[13px] font-semibold">Fast Delivery</p><p className="text-[11px] text-zinc-500">25-30 min • Free</p></a></div>
                  <div className="w-9 h-9 rounded-full bg-zinc-50 flex items-center justify-center"><a href="#menu" className="text-[14px] font-bold">→</a></div>
               
                </div>
              </div><div id='menu'></div>
            </div>
          </div>
        </div>
      </section>
      <Cards />
      <BestSelling />
      <Footer />
    </>
  )
}

export default Home