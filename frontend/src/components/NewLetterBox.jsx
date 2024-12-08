import React from 'react';

const NewLetterBox = () => {

  const handleSubmit = (e) => {
    e.preventDefault();
    // newsletter submit logic here
  };

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto text-center bg-white rounded-2xl shadow-sm p-8 sm:p-12 transition hover:shadow-md">

        <h2 className="text-2xl sm:text-3xl font-semibold mb-3 text-gray-800">
          Subscribe to our Newsletter
        </h2>

        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Get the latest updates, exclusive offers, and special discounts straight to your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            required
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black focus:border-black transition"
          />

          <button
            type="submit"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 active:scale-95 transition"
          >
            Subscribe
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-4">
          We respect your privacy. Unsubscribe anytime.
        </p>

      </div>
    </div>
  );
};

export default NewLetterBox;
