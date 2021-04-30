import React, { useEffect, useState } from 'react'
import * as productService from '../services/products';
import { makeStyles, Table, TableCell, TableHead, TablePagination, TableRow, TableSortLabel } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  table: {
      marginTop: theme.spacing(3),
      '& thead th': {
          fontWeight: '600',
          color: theme.palette.primary.main,
          backgroundColor: '#dddee247',
      },
      '& tbody td': {
          fontWeight: '300',
      },
      '& tbody tr:hover': {
          backgroundColor: '#fffbf2',
          cursor: 'pointer',
      },
  },
}))

function useTable(records,headCells, filterFn, totalCount) {

  const classes = useStyles();
  const pages = [10];
  const [page,setPage] = useState(0);
  const [rowsPerPage,setRowsPerPage] = useState(pages[page]);
  const [order,setOrder] = useState();
  const [orderBy,setOrderBy] = useState();
  const [propsRecords,setPropsRecords] = useState([]);

  useEffect(() => {
  }, [page,order,orderBy])

  const TableContainer = props => {
    return(
      <Table className={classes.table}>
        {props.children}
      </Table>
    )
  }

  const TblHead = props => {

    const handleSortRequest = async (cellId) => {
      try{
        const isAsc = orderBy === cellId && order ===  "asc";
        const sortType = isAsc ? -1 : 1;
        const newProducts = await productService.getAllProducts(`get-all-products?sortField=${cellId}&&sort=${sortType}`);
        setPropsRecords(newProducts.data.products);
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(cellId);
      }catch(e){
        console.log(e);
      }
    }
    return(
      <TableHead>
        <TableRow>
          {
            headCells.map(headCell => (
              <TableCell 
                key={headCell.id} 
                sortDirection={orderBy === headCell.id ? order : false}
              >
                {headCell.disableSorting 
                ? headCell.label 
                : <TableSortLabel 
                    active={orderBy === headCell.id} 
                    direction={orderBy === headCell.id ? order : 'asc'} 
                    onClick={() => handleSortRequest(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                }
                
              </TableCell>
            ))
          }
        </TableRow>
      </TableHead>
    )
  }

  const handleChangePage = async (event, newPage) => {
    try{
      let url = `get-all-products?pageNo=${newPage}`;
      if(orderBy) url = `get-all-products?pageNo=${newPage}&&sortField=${orderBy}&&sort=${order === 'asc' ? 1 : -1}`;
      const newPageProducts = await productService.getAllProducts(url);
      if(newPageProducts.data.products){
        setPropsRecords(newPageProducts.data.products);
        setPage(newPage);
      }
    }catch(e){
      console.log(e);
    }
    
  }

  const handleChageRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value,10));
    setPage(0);
  }

  const TblPagination = () => {
    return(
      <TablePagination 
        component="div" 
        page={page}
        rowsPerPageOptions={pages}
        rowsPerPage={rowsPerPage}
        count={totalCount}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChageRowsPerPage}
      />
    )
  }

  const addProduct = (data) => {
    if(propsRecords.length > 0){
      const newproducts = [data, ...propsRecords];
      setPropsRecords(newproducts);
    }
  }
  const editProduct = (data) => {
    if(propsRecords.length > 0){
      const removeProduct = records.filter(p => {
        return p._id !== data._id;
      });
      const newProducts = [data, ...removeProduct];
      setPropsRecords(newProducts);
    }
  }

  const deleteProduct = (productId) => {
    const newProducts = propsRecords.filter((x) => {
      return x._id !== productId;
    });
    setPropsRecords(newProducts);
  }

  const recordsAfterPagingAndSorting = () => {
    if(propsRecords.length > 0){
      return filterFn.fn(propsRecords );
    }else{
      return filterFn.fn(records)
    }
  }

  return {
    TableContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting, deleteProduct, addProduct, editProduct
  }  
}

export default useTable;