import { useState } from "react";
import { assets } from "./../assets/frontend_assets/assets";
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <img src={assets.logo} className="w-36" alt="logo" />

      <ul className="hidden sm:flex gap-5 text-md text-gray-700 ">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>Home </p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700   hidden" />
        </NavLink>

        <NavLink to="/collections" className="flex flex-col items-center gap-1">
          <p>Collections </p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/about" className="flex flex-col items-center gap-2">
          <p>About</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>Contact </p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <img
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt="serch_icons"
        />

        <div className="group relative">
          <img
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt="profile_icons"
          />
          <div className="group-hover:block  hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col w-36 gap-2 py-3 px-5 bg-slate-100 text-gray-400 rounded">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p className="cursor-pointer hover:text-black">Orders</p>
              <p className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div>
        </div>

        <Link to="/cart" className="relative">
          <img
            src={assets.cart_icon}
            alt="cart_icons"
            className="w-5 min-w-5"
          />

          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {" "}
            10
          </p>
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          alt="menu_icons"
          className="w-5 cursor-pointer sm:hidden"
        />
      </div>

      {/* sidebar menu for smaller screen */}


      {/* Sidebar menu for small screens */}
<div
  className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all duration-300 ${
    visible ? 'w-64' : 'w-0'
  }`}
>
  <div className="flex flex-col text-gray-600 h-full">
    
    {/* Back button */}
    <div
      onClick={() => setVisible(false)}
      className="flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-100"
    >
      <img
        className="h-4 rotate-180"
        src={assets.dropdown_icon}
        alt="back_icon"
      />
      <p>Back</p>
    </div>

    {/* Sidebar links */}
    <ul className="flex flex-col gap-4 p-4 mt-2">
      <NavLink to="/" onClick={() => setVisible(false)}>
        Home
      </NavLink>
      <NavLink to="/collections" onClick={() => setVisible(false)}>
        Collections
      </NavLink>
      <NavLink to="/about" onClick={() => setVisible(false)}>
        About
      </NavLink>
      <NavLink to="/contact" onClick={() => setVisible(false)}>
        Contact
      </NavLink>
    </ul>
  </div>
</div>


     
    </div>
  );
};

export default NavBar;
