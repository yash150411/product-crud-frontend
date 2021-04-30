import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Button, InputAdornment, makeStyles, Paper, TableBody, TableCell, TableRow, Toolbar} from '@material-ui/core'
import useTable from '../../../components/useTable';
import LayoutWrapper from '../layout-wrapper';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Controls from '../../../components/controls/Controls';
import { Search } from '@material-ui/icons';
import * as productService from '../../../services/products';

const useStyles = makeStyles(theme => ({
  pageContent: {
      margin: theme.spacing(5),
      padding: theme.spacing(3)
  },
  searchInput: {
      width: '75%'
  }
}))

const headCells = [
  {id: 'image', label: 'Product', disableSorting: true},
  {id: 'productName', label: 'Product Name'},
  {id: 'description', label: 'Description'},
  {id: 'price', label: 'Price'},
  {id: 'quantity', label: 'Quantity'},
  {id: 'actions', label: 'Actions', disableSorting: true}
]

function FinalProducts({initialRecords, totalProductsCount, startEditProduct}) {
  const classes = useStyles();
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const [records,setRecords] = useState(initialRecords);
  const [totalCount, setTotalCount] = useState(totalProductsCount);
  const {TableContainer, TblHead, TblPagination, recordsAfterPagingAndSorting, deleteProduct} = useTable(records, headCells, filterFn, totalCount);

  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
      fn: items => {
        if (target.value === "")
            return items;
        else
            return items.filter(x => x.productName.toLowerCase().includes(target.value))
      }
    })
  }

  const deleteProductFromDb = productId => {
    return new Promise(async(resolve,reject) => {
      try{
        const deleteResp = await productService.deleteProduct(productId);
        if(deleteResp.data.status === true){
          deleteProduct(productId);
          const newProducts = records.filter(x => x._id !== productId);
          setRecords(newProducts);
          setTotalCount(totalCount - 1);
        }
      }catch(e){
        console.log(e)
      }
      
    })
  }

  useEffect(() => {
  },[totalProductsCount,initialRecords,records, filterFn])

  return (
    <LayoutWrapper title='Products'>
      <Paper style={{overflow:'scroll'}}>
        <Toolbar>
          <Controls.Input 
            label="Search Products" 
            className={classes.searchInput}
            onChange={handleSearch}
            InputProps={{
              startAdornment: 
              (<InputAdornment position="start">
                <Search />
               </InputAdornment>
              )
            }}
          />
        </Toolbar>
        <TableContainer>
          <TblHead/>
          <TableBody>
            {recordsAfterPagingAndSorting().map((product, index) => (
              <TableRow key={index}>
                <TableCell><img src={`${process.env.REACT_APP_API_URL}/image/show/${product.productImage}`} alt={product._id} height="100px" width="100px"/></TableCell>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <Button onClick={() => {window.scrollTo(0,0);startEditProduct(product)}} startIcon={<EditIcon/>} color="primary"/>
                  <Button onClick={() => deleteProductFromDb(product._id)} startIcon={<DeleteIcon/>} color="secondary"/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
        <TblPagination/>
      </Paper>
    </LayoutWrapper>
  )
}


function Loading() {
  return(
    <p>Loading please wait ..................</p>
  )
}

const Products = React.forwardRef(({startEditProduct},ref) => {
  const [loading,setLoading] = useState(true);
  const [records, setRecords] = useState();
  const [totalCount, setTotalCount ] = useState();

  useImperativeHandle(ref, () => ({
    addProduct(data) {
      const newRecords = [data, ...records];
      setLoading(true);
      setRecords(newRecords);
      setTotalCount(totalCount + 1);
      setLoading(false);
    },
    editProduct(data) {
      const removeProduct = records.filter(p => {
        return p._id !== data._id;
      });
      const newRecords = [data, ...removeProduct];
      setLoading(true);
      setRecords(newRecords);
      setLoading(false);
    },
  }));

  const getProducts = async () => {
    try{
      const resp = await productService.getAllProducts('get-all-products');
      setLoading(true);
      setRecords(resp.data.products);
      setTotalCount(resp.data.totalCount);
      setLoading(false);
    }catch(e){
      console.log(e);
    } 
  }

  useEffect(() => {
    getProducts();
  },[totalCount]);

  return(
    <>
      {loading ? <Loading/> : <FinalProducts initialRecords={records} totalProductsCount={totalCount} startEditProduct={startEditProduct}/>}
    </>
  )
  
})

export default Products
