import { baseApi } from "../baseApi";

const expenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExpenseSettings: builder.query({
      query: () => "/common/get-variable",
      providesTags: [{ type: "Variable", id: "LIST" }],
    }),

    updateExpenseSettings: builder.mutation({
      query: (data) => ({
        url: "/common/upsert-variable",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Variable", id: "LIST" }],
    }),

    createMileageLog: builder.mutation({
      query: (data) => ({
        url: "/expenses/mileage",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Expense", id: "LIST" }],
    }),

    getAllMileageLogs: builder.query({
      query: (options = {}) => {
        const { page = 1, limit = 10, search, sort, filters = {} } = options;

        const params = new URLSearchParams();

        params.set("page", page);
        params.set("limit", limit);

        if (search) params.set("search", search);
        if (sort) params.set("sort", sort);

        // 🔥 Dynamic filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            params.set(key, value);
          }
        });

        return `/expenses/all-mileage?${params.toString()}`;
      },
      providesTags: (result) => {
        const logs = result?.data || [];
        return [
          { type: "Expense", id: "LIST" },
          ...logs.map((log) => ({ type: "Expense", id: log._id || log.id })),
        ];
      },
    }),

    updateMileageLogStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/expenses/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Expense", id },
        { type: "Expense", id: "LIST" },
      ],
    }),

    getMileageLogById: builder.query({
      query: (id) => `/expenses/mileage/${id}`,
      providesTags: (result, error, id) => [{ type: "Expense", id }],
    }),
  }),
});

export const {
  useCreateMileageLogMutation,
  useGetAllMileageLogsQuery,
  useUpdateMileageLogStatusMutation,
  useGetMileageLogByIdQuery,
  useGetExpenseSettingsQuery,
  useUpdateExpenseSettingsMutation,
} = expenseApi;
export default expenseApi;
