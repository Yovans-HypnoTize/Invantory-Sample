import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const customerApi = createApi({
    reducerPath: "customerApi",
    baseQuery: fetchBaseQuery({
        baseUrl: apiBaseUrl,
        prepareHeaders: (headers) => {
            const token = Cookies.get("token");
            if (token) {
                headers.set("Authorization", `${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getCustomerList: builder.query({
            query: ({pageNo, perPageValue, searchInput}) => ({
                url: `customer/list?pageNo=${pageNo}&count=${perPageValue}&search=${searchInput}`,
                method: "GET",
            }),
        }),
        postCustomer: builder.mutation({
            query: (credentials) => ({
                url: "customer",
                method: "POST",
                body: credentials
            }),
        }),
        // updateVendor: builder.mutation({
        //     query: (credentials) => ({
        //         url: `vendor/${credentials}`,
        //         method: "PUT",
        //         body: credentials
        //     }),
        // }),
        // deleteVendor: builder.mutation({
        //     query: (credentials) => ({
        //         url: "vendor",
        //         method: "DELETE",
        //         body: credentials
        //     }),
        // }),
        // getVendorByCategoryId: builder.query({
        //     query: (arg) => ({
        //         url: `vendor/${arg}`,
        //         method: "GET",
        //     }),
        // }),
        // getAccountTypeList: builder.query({
        //     query: (arg) => ({
        //       url: `state/list`,
        //       method: "GET",
        //     }),
        //   }),
        //   getBankList: builder.query({
        //     query: (arg) => ({
        //       url: `common/banks`,
        //       method: "GET",
        //     }),
        //   }),
        //   getAccountTypes: builder.query({
        //     query: (arg) => ({
        //       url: `common/account-types`,
        //       method: "GET",
        //     }),
        //   }),
    })
})

export const { useGetCustomerListQuery, usePostCustomerMutation } = customerApi