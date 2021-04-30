import axios from 'axios';

const apiUrl = `${process.env.REACT_APP_API_URL}/product`;

export async function insertProduct(data) {
  return new Promise(async(resolve,reject) => {
    try{
      const url = `${apiUrl}/add-product`;
      const insertResp = await axios({
        method: 'post', url, data
      })
      resolve(insertResp);
    }catch(e){
      console.log(e);
    }
  })
}

export async function saveProductImage(data) {
  return new Promise(async(resolve,reject) => {
    try{
      let form = new FormData();
      form.append('image', data.productImage[0]);
      const url = `${process.env.REACT_APP_API_URL}/image/upload`;
      const saveImgResp = await axios({
        method: "post",
        url: url,
        data: form,
        headers: { "Content-Type": "multipart/form-data" },
      })
      resolve(saveImgResp);
    }catch(e){
      console.log(e);
    }
  })
}

export function getAllProducts(urlQuery) {
  return new Promise(async(resolve,reject) => {
    try{
      const url = `${apiUrl}/${urlQuery}`;
      const products = await axios({
        method: 'get', url
      })
      resolve(products);
    }catch(e){
      console.log(e);
    }
  })
}

export async function deleteProduct(productId) {
  return new Promise(async(resolve,reject) => {
    try{
      const url = `${apiUrl}/delete-product`;
      const deleteResp = await axios({
        method: 'delete', url,
        data: {_id:productId}
      })
      resolve(deleteResp);
    }catch(e){
      console.log(e);
    }
  })
}

export async function editProduct(data) {
  return new Promise(async(resolve,reject) => {
    try{
      const url = `${apiUrl}/edit-product`;
      const editResp = await axios({
        method: 'patch', url,
        data
      })
      resolve(editResp);
    }catch(e){
      console.log(e);
    }
  })
  
}