import React from 'react';
import { assets } from '../assets/frontend_assets/assets';

const OurPolicy = () => {
  return (
    <div className="py-16 px-4 sm:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">

        {/* Policy 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <img
            src={assets.exchange_icon}
            alt="Easy Exchange"
            className="w-12 mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">Easy Exchange</h3>
          <p className="text-sm text-gray-600">
            Hassle-free exchange policy within 7 days of purchase.
          </p>
        </div>

        {/* Policy 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <img
            src={assets.quality_icon}
            alt="Best Quality"
            className="w-12 mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">Best Quality</h3>
          <p className="text-sm text-gray-600">
            Premium quality products guaranteed for every order.
          </p>
        </div>

        {/* Policy 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <img
            src={assets.support_img}
            alt="24/7 Support"
            className="w-12 mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
          <p className="text-sm text-gray-600">
            Our support team is available anytime you need help.
          </p>
        </div>

      </div>
    </div>
  );
};

export default OurPolicy;
