import React, { useEffect, useRef } from 'react'
import AddProduct from './add-product'
import Products from './products'

function Dashboard() {

  const productRef = useRef();

  const productAdded = (data) => {
    productRef.current.addProduct(data);
  }

  useEffect(() => {
    document.title = 'Products CRUD Application';
  },[])

  return (
    <div>
      <AddProduct productAdded={productAdded}/>
      <Products ref={productRef}/>
    </div>
  )
}

export default Dashboard
