import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup"
import {
    Button,
    Box,
    TextField,
    Paper,
    Typography,
    Divider,
    Grid2,
} from "@mui/material";
import CustomReactSelect from "../../components/CustomReactSelect";
import { useGetAllMasterProductQuery, usePostMasterProductDataMutation } from "../../features/MasterProductService/MasterProductApi";
import { useGetCategoryQuery } from "../../features/CategoryService/CategoryApi";
import {
    useGetProductsByCategoryIdQuery,
    useGetProductsQuery,
} from "../../features/ProductService/ProductApi";
import { useGetModelsQuery } from "../../features/ModelApi/ModelApi";
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const initialValues = {
    category: null,
    product: null,
    model: null,
    hsnCode: "",
    tax: "",
    description: "",
};

const validationSchema = Yup.object().shape({
    category: Yup.object()
        .shape({
            label: Yup.string().required("Category is required"),
            value: Yup.string().required("Category is required"),
        })
        .nullable()
        .required("Category is required"),
    product: Yup.object()
        .shape({
            label: Yup.string().required("Product is required"),
            value: Yup.string().required("Product is required"),
        })
        .nullable()
        .required("Product is required"),
    model: Yup.object()
        .shape({
            label: Yup.string().required("Model is required"),
            value: Yup.string().required("Model is required"),
        })
        .nullable()
        .required("Model is required"),
    hsnCode: Yup.string().required("HSN/CODE required"),
    tax: Yup.string().required("Tax value required"),
})

const AddProduct = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [
        postMasterProduct,
        {
            isLoading: postMasterProductLoading,
            isError: postMasterProductError,
            data: masterProduct,
        },
    ] = usePostMasterProductDataMutation();

    console.log(masterProduct);
    

    const handleSubmit = async (values: any) => {
        const data = {
            category: values.category?.label.toUpperCase(),
            product: values.product?.label,
            model: values.model?.label,
            tax: Number(values.tax),
            hsnCode: values.hsnCode,
            description: values.description,
        };

        console.log('Final Submitted Data:', data);
        await postMasterProduct(data).then(res => {
            if(res?.error){
                toast.error("Product already exists ");
            } 
            if(res?.data){
                toast.success("Product added successfully");
                // setShowProductList(true);
                navigate(-1)
            }
        });
    //    await refetch(); 
         // Simulate navigation
    };

    const {
        data: categories,
        error: categoriesError,
        isLoading: categoriesIsLoading,
    } = useGetCategoryQuery({});
    const {
        data: products,
        error: productsError,
        isLoading: productsIsLoading,
    } = useGetProductsQuery({});
    const {
        data: models,
        error: modelsError,
        isLoading: modelsIsLoading,
    } = useGetModelsQuery({});

    const {
        data: productByCategoryIdData,
        error: productByCategoryIdError,
        isLoading: productByCategoryIdIsLoading,
    } = useGetProductsByCategoryIdQuery({});


    console.log(productByCategoryIdData);
    
    // const handleBack = () => {
    //     setShowProductList(true);
    // };

    // const handlebackClick = () => {
    //     setShowProductList(true);
    // };
    

    return (
        <Box mt={3} mx={5} width={"80%"}>
            <Paper elevation={2} sx={{ borderRadius: 3 }}>
                <Typography sx={{ fontWeight: 700, p: 2 }}>
                    Product information:
                </Typography>
                <Divider />

                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ values, setFieldValue, handleChange, handleBlur, errors, touched }) => (
                        <Form>
                            <Grid2 container px={3} columnSpacing={8}>
                                <Grid2 size={12}>
                                    <Box mt={3}>
                                        <Typography my={1}>Category</Typography>

                                        <CustomReactSelect
                                            setFieldValue={setFieldValue}
                                            setFieldValueLabel={"category"}
                                            options={
                                                categories
                                                    ? categories.map((category: any) => ({
                                                        label: category.name,
                                                        value: category.id,
                                                    }))
                                                    : []
                                            }
                                            placeholder={
                                                categoriesIsLoading ? "Loading Categories..." : "Select Category"
                                            }
                                        />
                                    </Box>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Box>
                                        <Typography my={1}>Product</Typography>

                                        <CustomReactSelect
                                            setFieldValue={setFieldValue}
                                            setFieldValueLabel={"product"}
                                            options={
                                                products
                                                    ? products.map((product: any) => ({
                                                        label: product.name,
                                                        value: product.id,
                                                    }))
                                                    : []
                                            }
                                            placeholder={
                                                productsIsLoading ? "Loading Products..." : "Select Product"
                                            }
                                        />
                                    </Box>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Box>
                                        <Typography my={1}>Model</Typography>

                                        <CustomReactSelect
                                            setFieldValue={setFieldValue}
                                            setFieldValueLabel={"model"}
                                            options={
                                                models
                                                    ? models.map((model: any) => ({
                                                        label: model.name,
                                                        value: model.id,
                                                    }))
                                                    : []
                                            }
                                            placeholder={
                                                modelsIsLoading ? "Loading Models..." : "Select Model"
                                            }
                                        />
                                    </Box>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Box>
                                        <Typography my={1}>HSN/ACS</Typography>

                                        <TextField
                                            // label={"HSN/ACS"}
                                            name="hsnCode"
                                            type={"text"}
                                            value={values.hsnCode}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            size="small"
                                            fullWidth
                                            placeholder="HSN/ACS"
                                        />
                                        {
                                            errors.hsnCode && touched.hsnCode && (
                                                <Box sx={{color:"red"}}>{errors.hsnCode}</Box>
                                            )
                                        }
                                    </Box>
                                </Grid2>
                                <Grid2 size={6}>
                                    <Box>
                                        <Typography my={1}>Tax</Typography>

                                        <TextField
                                            // label={"Tax (%)"}
                                            name="tax"
                                            type={"text"}
                                            value={values.tax}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            size="small"
                                            fullWidth
                                            placeholder="Tax"
                                        />
                                        {
                                            errors.tax && touched.tax && (
                                                <Box sx={{color:"red"}}>{errors.tax}</Box>
                                            )
                                        }
                                    </Box>
                                </Grid2>
                                <Grid2 size={12}>
                                    <Box>
                                        <Typography my={2}>Description <Box component="span" color="#C0C0C0">(Optional)</Box></Typography>
                                        <TextField
                                            name="description"
                                            id="description"
                                            // label="Description"
                                            value={values.description}
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            fullWidth
                                        />
                                    </Box>
                                </Grid2>
                                <Grid2 size={12} display={"flex"} justifyContent={"end"}>
                                    <Box my={2}>
                                        <Button
                                            type="button"
                                            variant="contained"
                                            sx={{ bgcolor: "grey", mr: 3 }}
                                            onClick={() => navigate(-1)}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            sx={{ bgcolor: "red" }}
                                        >
                                            Submit
                                        </Button>

                                    </Box>
                                </Grid2>
                            </Grid2>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Box>
    );
};

export default AddProduct;
