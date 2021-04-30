import React, { useEffect, useRef, useState } from 'react'
import AddProduct from './add-product'
import EditProduct from './edit-product';
import Products from './products'

function Dashboard() {

  const [editProduct, setEditProduct] = useState()

  const productRef = useRef();

  const productAdded = (data) => {
    productRef.current.addProduct(data);
  }

  const productEdited = (data) => {
    productRef.current.editProduct(data);
    setEditProduct(false);
  }

  const startEditProduct = (data) => {
    setEditProduct(data);
  }

  useEffect(() => {
    document.title = 'Products CRUD Application';
  },[])

  return (
    <div>
      {!editProduct && <AddProduct productAdded={productAdded}/>}
      {editProduct && <EditProduct productEdited={productEdited} product={editProduct}/>}
      <Products ref={productRef} startEditProduct={startEditProduct}/>
    </div>
  )
}

export default Dashboard
