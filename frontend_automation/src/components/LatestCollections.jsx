import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductsItems from './ProductsItems';

const LatestCollections = () => {

    const {products} = useContext(ShopContext);

    const[latestProducts, setLatestProducts] = useState([]);

    useEffect(()=>{

     setLatestProducts(products.slice(30,40));

    },[products]);

    


  return (
    <div className='my-10'>
      <div className="text-center py-8 text-3xl">
          <Title text1={'Latest'} text2={'Collections'}/>
          <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit, sapiente?

          </p>
      </div>


      {/* products rendering */}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">

        {
          latestProducts.map((item, index)=>(
            <ProductsItems key={index} id={item._id}image={item.image} name={item.name} price={item.price}/>

          ))
        }

      </div>




      





        
    </div>
  )
}

export default LatestCollections