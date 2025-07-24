import { Box, Button, Modal, Typography } from "@mui/material";
import CustomTable from "../../components/CustomTable";
import CustomSearchInput from "../../components/CustomSearchInput";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { useGetVendorListQuery } from "../../features/VendorService/vendorApi";
import AddVendor from "./AddVendor";

const VendorList = () => {
    const navigate = useNavigate();
    const [pageNo, setPageNo] = useState<number>(1);
     const [perPageValue, setPerPageValue] = useState<number>(10)
     const [searchInput, setSearchInput] = useState("")
    const [openAddVendorModal, setOpenAddVendorModal] = useState<boolean>(false)
    // Fetch the product data from the backend
    const { data: vendorList, refetch } = useGetVendorListQuery({pageNo, perPageValue, searchInput}, { refetchOnMountOrArgChange: true });

    const handleClose = () => {
        setOpenAddVendorModal(false)
    }

    const handleAddVendorClick = () => {
        setOpenAddVendorModal(true)
    }

    console.log(vendorList);


    // Map the data to extract categoryName, productName, and modelName dynamically
    const productRows = vendorList?.data?.map((item: any) => ({
        id: item.id,
        name: item.name,
        phoneNo: item.phoneNo,
        city: item.city,
        bank: item.bank.name,
        bankBranch: item.bankBranch,
        createdAt: new Date(item.createdAt).toLocaleDateString('en-US'),
        // action: <Box><IconButton size="small" onClick={() => handleEdit(item.id)}><EditIcon /></IconButton><IconButton size="small" sx={{ color: "red" }} onClick={() => handleDelete(item.id)}><Delete /></IconButton></Box>
    })) || [];

    // Define the columns dynamically
    const columns = [
        { id: 'name', label: 'Name' },
        // { id: 'Logo', label: 'Logo' },
        { id: 'phoneNo', label: 'Phone' },
        { id: 'city', label: 'City' },
        { id: 'bank', label: 'Bank' },
        { id: 'bankBranch', label: 'Bank Branch' },
        { id: 'createdAt', label: 'Created Date' },
    ];


    const handleSearchInput = (e: any) => {
        setSearchInput(e.target.value)
        console.log(e.target.value);

    }

    const handleCloseVendorModal = () => {
        setOpenAddVendorModal(false);
        refetch();
    }

    return (
        <>
            <Box >
                {/* Pass the columns and rows dynamically to the CustomTable */}
                <Box display={"flex"} justifyContent={"space-between"}>
                            {vendorList?.data?.length ? <Typography sx={{ fontWeight: 600, fontSize: 20 }}>Vendors ({vendorList?.data?.length})</Typography> : <Typography sx={{ fontWeight: 600, fontSize: 20 }}>Vendors</Typography>}
                    
                    <Box display={"flex"} justifyContent={"end"}>

                        <CustomSearchInput value={searchInput} handleChange={handleSearchInput} />

                        <Button onClick={handleAddVendorClick} variant="contained" sx={{ bgcolor: "#014", height: 45 }}>
                            Add Vendor
                        </Button>
                    </Box>
                </Box>
                <CustomTable columns={columns} rows={productRows} />
                <Typography sx={{ color: "grey", mt: 2 }}>Total available items : {vendorList?.data?.length}</Typography>
            </Box>
            <Modal open={openAddVendorModal} onClose={handleClose}>
                <AddVendor handleClose={handleClose} handleCloseVendorModal={handleCloseVendorModal} />
            </Modal>
        </>
    );
};

export default VendorList;
