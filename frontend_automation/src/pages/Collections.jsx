import React, { useContext, useMemo, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductsItems from '../components/ProductsItems';
import Title from '../components/Title';

const CollectionsPage = () => {
  const { products } = useContext(ShopContext);

  // Filter state
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortOption, setSortOption] = useState('relevance');

  // Handle category change
  const handleCategoryChange = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  // Handle type change
  const handleTypeChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(p => selectedTypes.includes(p.type));
    }

    switch (sortOption) {
      case 'priceLowHigh':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'priceHighLow':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered = [...filtered].sort((a, b) => b._id - a._id);
        break;
      default:
        break; // relevance
    }

    return filtered;
  }, [products, selectedCategories, selectedTypes, sortOption]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16">

      {/* Page Title */}
      <div className="text-center mb-12">
        <Title text1="All" text2="Collections" />
        <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-gray-600">
          Browse our full range of products and filter by category or type.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sidebar Filters */}
        <aside className="lg:w-1/4 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-700">
            {['Men', 'Women', 'Kids'].map(cat => (
              <li key={cat} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                  className="w-4 h-4"
                />
                <span>{cat}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-4">Type</h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-700">
            {['Topwear', 'Bottomwear', 'Winterwear'].map(type => (
              <li key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeChange(type)}
                  className="w-4 h-4"
                />
                <span>{type}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-2">Sort By</h3>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="relevance">Relevance</option>
            <option value="newest">Newest</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
          </select>
        </aside>

        {/* Products Grid */}
        <div className="lg:w-3/4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5 gap-y-8">
          {filteredProducts.map(product => (
            <ProductsItems
              key={product._id}
              id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
            />
          ))}

          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 mt-10 lg:col-span-full">
              No products found for selected filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
