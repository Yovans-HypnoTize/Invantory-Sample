import { Box, Button, IconButton, Typography } from "@mui/material";
import CustomTable from "../../components/CustomTable";
import { useDeleteMasterProductMutation, useGetAllMasterProductQuery, useGetMasterProductListQuery } from "../../features/MasterProductService/MasterProductApi";
import CustomSearchInput from "../../components/CustomSearchInput";
import { Delete } from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

const ProductsList = () => {
  const navigate = useNavigate();
  const [pageNo, setPageNo] = useState<number>(1);
  const [perPageValue, setPerPageValue] = useState<number>(10)
  const [searchInput, setSearchInput] = useState("")
  // Fetch the product data from the backend
  const { data: masterProductList, refetch } = useGetMasterProductListQuery({ pageNo, perPageValue, searchInput }, { refetchOnMountOrArgChange: true });
  const [deleteMasterProduct] = useDeleteMasterProductMutation()

  const handleEdit = (id: number) => {
    navigate(`edit/${id}`)
  }
  const handleDelete = (id: number) => {
    console.log(id);
    deleteMasterProduct([id]).then(res => {
      if (res?.error) {
        toast.error("Unable to delete");
      }
      if (res?.data) {
        toast.success("Product deleted successfully");
        refetch();
      }
    })

  }

  console.log(masterProductList?.length);


  // Map the data to extract categoryName, productName, and modelName dynamically
  const productRows = masterProductList?.data?.map((item: any) => ({
    id: item.id,
    categoryName: item.category.name,
    productName: item.product.name,
    modelName: item.model.name,
    // hsnCode: item.hsnAcs,
    tax: item.tax,
    update: item.lastModifiedAt,
    action: <Box><IconButton size="small" onClick={() => handleEdit(item.id)}><EditIcon /></IconButton><IconButton size="small" sx={{ color: "red" }} onClick={() => handleDelete(item.id)}><Delete /></IconButton></Box>
  })) || [];

  // Define the columns dynamically
  const columns = [
    { id: 'categoryName', label: 'Category Name' },
    { id: 'productName', label: 'Product Name' },
    { id: 'modelName', label: 'Model Name' },
    // { id: 'hsnCode', label: 'HSN' },
    { id: 'tax', label: 'Tax' },
    { id: 'update', label: 'Updated' },
    { id: 'action', label: 'Action' },
  ];



  const filterOptions = [
    { label: 'Created', value: "created" },
    { label: 'Date', value: "date" },
    { label: 'Bill Date', value: "bill date" },
    { label: 'Purchase Date', value: "purchase date" },
  ]



  const handleSearchInput = (e: any) => {
    setSearchInput(e.target.value)
    console.log(e.target.value);

  }

  return (
    <Box>
      {/* Pass the columns and rows dynamically to the CustomTable */}
      <Box display={"flex"} justifyContent={"space-between"}>
        {masterProductList?.data?.length ? <Typography sx={{ fontWeight: 600, fontSize: 20 }}>Products ({masterProductList?.data?.length})</Typography> : <Typography sx={{ fontWeight: 600, fontSize: 20 }}>Products</Typography>}

        <Box display={"flex"} justifyContent={"end"}>

          <CustomSearchInput value={searchInput} handleChange={handleSearchInput} />

          <Button onClick={() => navigate("new-product")} variant="contained" sx={{ bgcolor: "#014", height: 45 }}>
            Add Product
          </Button>
        </Box>
      </Box>
      <CustomTable columns={columns} rows={productRows} />
      <Typography sx={{ color: "grey", mt: 2 }}>Total available items : {masterProductList?.data?.length}</Typography>
    </Box>
  );
};

export default ProductsList;
