import React, { useState } from 'react';
import LayoutWrapper from '../layout-wrapper';
import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import * as productService from '../../../services/products';
import useTable from '../../../components/useTable';
import './style.css';

function AddProduct({productAdded}) {

  const {register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState();

  const {addProduct} = useTable();

  const submitForm = async (data) => {
    try{
      setLoading(true);
      const imgSaveResp = await productService.saveProductImage(data);
      if(imgSaveResp.data.status === true){
        // Now we save the product
        const imageName = imgSaveResp.data.file_name;
        data.productImage = imageName;
        const saveResp = await productService.insertProduct(data);
        if(saveResp.data.status === true){
          data._id = saveResp.data.id;
          reset();
          setLoading(false);
          productAdded(data);
          addProduct(data);
        }
      }
    }catch(e){
      console.log(e);
    }
  }

  return (
    <LayoutWrapper title='Add Product'>
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="form-fields-wrapper">

          <div className="field-group-wrapper">
            <div>
              <input type="text" name="productName" 
                placeholder="Product Name" 
                {...register('productName', { required: true, minLength: 4 })}
              />
              {errors.productName && <p className="error-message"> Product name is required.</p>}
            </div>
            <div>
              <input type="text" name="description" 
                placeholder="Description" 
                {...register('description', {required: true, minLength: 4})}
              />
              {errors.description && <p className="error-message">Description is required.</p>}
            </div>
          </div>

          <div className="field-group-wrapper">
            <div>
              <input type="number" name="price" 
                placeholder="Price" min="0" 
                {...register('price', {required: true})}
              />
              {errors.price && <p className="error-message">Price is required.</p>}
            </div>
            <div>
              <input type="number" name="quantity" 
                placeholder="Quantity" min="0" 
                {...register('quantity', {required: true})}
              />
              {errors.quantity && <p className="error-message">Quantity is required.</p>}
            </div>
          </div>

          <div className="field-group-wrapper">
            <input name="productImage" type="file" 
              placeholder="Product Image" accept="image/x-png,image/jpeg" 
              {...register('productImage', { required: true })}
            />
            {errors.productImage && <p className="error-message"> Product image is required.</p>}
          </div>

        </div>

        <div style={{display:'flex', justifyContent: 'center'}}>
          {loading 
            ? <Button startIcon={<SaveIcon/>} variant="contained" color="secondary" disabled>
                Saving Product
              </Button>
            : <Button startIcon={<SaveIcon/>} variant="contained" color="primary" type="submit">
                Add Product
              </Button>
          }
        </div>
      </form>
    </LayoutWrapper>
  )
}

export default AddProduct
