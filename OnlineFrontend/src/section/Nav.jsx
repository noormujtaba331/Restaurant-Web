import React from 'react'
import { Link } from 'react-router'

const Nav = () => {

  //  const cartData = localStorage.getItem('cartItems')
  //  const items= JSON.parse(cartData)
  //  console.log(items)

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-zinc-100">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-8 h-[72px] flex items-center justify-between">
        <a href="/"><div className="flex items-center gap-2">
           <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center">
            <span className="text-white font-bold text-[15px]">D</span>
          </div>
            <span className="text-[22px] font-bold tracking-tight text-zinc-900">Demo Store</span>
          
        </div></a>
        <div className="hidden md:flex items-center gap-8">
          <a href="/#home" className="text-[14px] font-medium text-zinc-500 hover:text-zinc-900 ">Home</a>
          <a href="/#menu" className="text-[14px] font-medium text-zinc-500 hover:text-zinc-900">Menu</a>
          <a href="/#popular" className="text-[14px] font-medium text-zinc-500 hover:text-zinc-900">Popular</a>
          <a href="/#details" className="text-[14px] font-medium text-zinc-500 hover:text-zinc-900">Details</a>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center relative">
            <span className="text-zinc-700"><Link to="/cart">🛒</Link></span>
          </div>
          <a href="/#menu" className="hidden sm:flex h-10 px-5 rounded-full bg-zinc-900 text-white text-[13.5px] font-medium items-center">Order Now</a>
        </div>
      </div>
    </nav>
  );
};

export default Nav