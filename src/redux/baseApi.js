
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: [
    "Client",
    "Variable",
    "LeaderBoard",
    "Expense",
    "Job",
    "Quote",
    "Stats",
    "User",
    "FiscalYear",
    "MyStats",
    "Payment",
  ],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
