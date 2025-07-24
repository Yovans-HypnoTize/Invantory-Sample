import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import CustomTable from "../../components/CustomTable";
import CustomSearchInput from "../../components/CustomSearchInput";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddCustomer from "./AddCustomer";
import { useGetCustomerListQuery } from "../../features/CustomerService.ts/customerApi";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const CustomerList = () => {
    const [pageNo, setPageNo] = useState<number>(1);
    const [perPageValue, setPerPageValue] = useState<number>(10)
    const [searchInput, setSearchInput] = useState("")
    const [openAddCustomerModal, setOpenAddCustomerModal] = useState<boolean>(false)
    const { data: customerList, refetch } = useGetCustomerListQuery({ pageNo, perPageValue, searchInput }, { refetchOnMountOrArgChange: true });

    const handleClose = () => {
        setOpenAddCustomerModal(false)
    }

    const handleAddCustomerClick = () => {
        setOpenAddCustomerModal(true)
    }

    const productRows = customerList?.map((item: any) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phoneNo: item.phoneNo[0].phoneNo,
        city: item.city,
        action: <>
            <IconButton sx={{bgcolor:"#F0F8FF", mr:2}} size="small"><EditIcon sx={{color:"#A9A9A9"}}/></IconButton>
            <IconButton sx={{bgcolor:"#F0F8FF"}} size="small"><DeleteIcon sx={{color:"#EE4B2B"}}/></IconButton>
        </>
    })) || [];

    const columns = [
        { id: 'name', label: 'Name' },
        { id: 'email', label: 'Email' },
        { id: 'phoneNo', label: 'Phone' },
        { id: 'city', label: 'City' },
        { id: 'action', label: 'Action' },
    ];


    const handleSearchInput = (e: any) => {
        setSearchInput(e.target.value)
        console.log(e.target.value);

    }

    const handleCloseCustomerModal = () => {
        setOpenAddCustomerModal(false)
        refetch();
    }

    return (
        <>
            <Box>
                {/* Pass the columns and rows dynamically to the CustomTable */}
                <Box display={"flex"} justifyContent={"space-between"}>
                    {customerList?.length ? <Typography sx={{ fontWeight: 600, fontSize: 20 }}>Customers ({customerList?.length})</Typography> : <Typography sx={{ fontWeight: 600, fontSize: 20 }}>Customers</Typography>}
                    <Box display={"flex"} justifyContent={"end"}>

                        <CustomSearchInput value={searchInput} handleChange={handleSearchInput} />

                        <Button onClick={handleAddCustomerClick} variant="contained" sx={{ bgcolor: "#014", height: 45 }}>
                            Add Customer
                        </Button>
                    </Box>
                </Box>
                <CustomTable columns={columns} rows={productRows} />
                <Typography sx={{ color: "grey", mt: 2 }}>Total available items : {customerList?.length}</Typography>
            </Box>
            <Modal open={openAddCustomerModal} onClose={handleClose} sx={{height: 520}}>
                <AddCustomer handleClose={handleClose} handleCloseCustomerModal={handleCloseCustomerModal} />
            </Modal>
        </>
    );
};

export default CustomerList;
