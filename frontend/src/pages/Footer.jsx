import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/frontend_assets/assets';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-14 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-12">

        {/* Logo & About */}
        <div>
          <Link to="/">
            <img
              src={assets.logo}
              alt="Logo"
              className="w-32 mb-4 cursor-pointer"
            />
          </Link>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your one-stop destination for premium products. Quality, style,
            and customer satisfaction are our top priorities.
          </p>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-base font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link to="/about" className="hover:text-black transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/careers" className="hover:text-black transition">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-black transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-black transition">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer */}
        <div>
          <h4 className="text-base font-semibold mb-4">Customer</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link to="/account" className="hover:text-black transition">
                My Account
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-black transition">
                Orders
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-black transition">
                Wishlist
              </Link>
            </li>
            <li>
              <Link to="/help" className="hover:text-black transition">
                Help Center
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-base font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Email: support@shop.com</li>
            <li>Phone: +1 234 567 890</li>
            <li>Mon – Fri: 9AM – 6PM</li>
          </ul>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <img src={assets.facebook_icon} alt="Facebook" className="w-5 cursor-pointer" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <img src={assets.twitter_icon} alt="Twitter" className="w-5 cursor-pointer" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <img src={assets.instagram_icon} alt="Instagram" className="w-5 cursor-pointer" />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} YourStore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
