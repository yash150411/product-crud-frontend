import React, { useState } from 'react';
import LayoutWrapper from '../layout-wrapper';
import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import * as productService from '../../../services/products';
import useTable from '../../../components/useTable';
import '../add-product/style.css';

function EditProduct({productEdited, product}) {

  const {register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState();

  const {editProduct} = useTable();

  const submitForm = async (data) => {
    try{
      setLoading(true);
      if(data.productImage.length === 0){
        data._id = product._id;
        // User has not changed the image
        const saveResp = await productService.editProduct(data);
          if(saveResp.data.status === true){
            const newData = {
              _id: product._id,
              productName: data.productName,
              description: data.description,
              price: data.price,
              quantity: data.quantity,
              isDeleted: 0,
              productImage: product.productImage,
              createdAt: product.createdAt
            }
            reset();
            setLoading(false);
            productEdited(newData);
            editProduct(newData);
          }
      }else{
        const imgSaveResp = await productService.saveProductImage(data);
        if(imgSaveResp.data.status === true){
          // Now we save the product
          const imageName = imgSaveResp.data.file_name;
          data.productImage = imageName;
          const saveResp = await productService.editProduct(data);
          if(saveResp.data.status === true){
            const newData = {
              _id: product._id,
              productName: data.productName,
              description: data.description,
              price: data.price,
              quantity: data.quantity,
              isDeleted: 0,
              productImage: imageName,
              createdAt: product.createdAt
            }
            reset();
            setLoading(false);
            productEdited(newData);
            editProduct(newData);
          }
        }
      }
      
    }catch(e){
      console.log(e);
    }
  }

  return (
    <LayoutWrapper title='Edit Product'>
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="form-fields-wrapper">

          <div className="field-group-wrapper">
            <div>
              <input type="text" name="productName" 
                defaultValue={product.productName} placeholder="Product Name" 
                {...register('productName', { required: true, minLength: 4 })}
              />
              {errors.productName && <p className="error-message"> Product name is required.</p>}
            </div>
            <div>
              <input type="text" name="description" 
                defaultValue={product.description} placeholder="Description" 
                {...register('description', {required: true, minLength: 4})}
              />
              {errors.description && <p className="error-message">Description is required.</p>}
            </div>
          </div>

          <div className="field-group-wrapper">
            <div>
              <input type="number" name="price" 
                defaultValue={product.price} placeholder="Price" min="0" 
                {...register('price', {required: true})}
              />
              {errors.price && <p className="error-message">Price is required.</p>}
            </div>
            <div>
              <input type="number" name="quantity" 
                defaultValue={product.quantity} placeholder="Quantity" min="0" 
                {...register('quantity', {required: true})}
              />
              {errors.quantity && <p className="error-message">Quantity is required.</p>}
            </div>
          </div>

          <div className="field-group-wrapper">
            <input name="productImage" type="file" 
              placeholder="Product Image" accept="image/x-png,image/jpeg" 
              {...register('productImage', {required: false})}
            />
            {errors.productImage && <p className="error-message"> Product image is required.</p>}
          </div>

        </div>

        <div style={{display:'flex', justifyContent: 'center'}}>
          {loading 
            ? <Button startIcon={<SaveIcon/>} variant="contained" color="secondary" disabled>
                Edit Product
              </Button>
            : <Button startIcon={<SaveIcon/>} variant="contained" color="primary" type="submit">
                Edit Product
              </Button>
          }
        </div>
      </form>
    </LayoutWrapper>
  )
}

export default EditProduct
