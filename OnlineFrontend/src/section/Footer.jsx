import React from 'react'

const Footer = () => {
  return (
    <footer id='details' className="bg-[#0A0A0A] text-zinc-400 rounded-t-[32px] lg:rounded-t-[48px]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 grid lg:grid-cols-[1.5fr_1fr_1fr_1.5fr] gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-white text-[22px] font-bold">Demo</h2>
          <p className="mt-3 text-[13px]">Delicious Food Delivered To Your Door</p>
          <div className="mt-5 flex gap-3">
            <span className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center">IG</span>
            <span className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center">FB</span>
            <span className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center">X</span>
            <span className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center">TT</span>
          </div>
          <p className="mt-3 text-[11px]">@demo.eats</p>
        </div>

        {/* Links */}
        <div>
          <p className="text-white text-[11px] font-bold tracking-widest uppercase">Explore</p>
          <ul className="mt-4 space-y-2 text-[13px]">
            <li><a href="/#home">Home</a></li>
            <li><a href="/#menu">Menu</a></li>
            <li><a href="/#popular">Popular</a></li>
            <li><a href="/#details">Details</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-white text-[11px] font-bold tracking-widest uppercase">Contact</p>
          <ul className="mt-4 space-y-2 text-[13px]">
            <li>+1 (123) 456-7890</li>
            <li>hello@demo.com</li>
            <li>support@demo.com</li>
            <li>WhatsApp: +1 (123) 456-7890</li>
          </ul>
        </div>

        {/* Location */}
        <div>
          <p className="text-white text-[11px] font-bold tracking-widest uppercase">Location</p>
          <p className="mt-4 text-[13px]">📍 fake Food Street, Downtown, id-city 10001</p>
          <p className="mt-2 text-[13px]">📍 fake Flavor Ave, Brooklyn, id-city 11201</p>
          <p className="mt-4 text-[11px]">Mon-Sun: 10AM - 11PM</p>
          
        </div>
      </div>

      <div className="border-t border-zinc-800 py-5 text-center text-[11px]">
        © 2026 Demo • Privacy • Terms • Made with ❤️ for food lovers
      </div>
    </footer>
  );
};
export default Footer;


