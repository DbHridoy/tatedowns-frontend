import { baseApi } from "../baseApi";

const commonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    upsertVariable: builder.mutation({
      query: (newVariable) => ({
        url: "/common/upsert-variable",
        method: "POST",
        body: newVariable,
      }),
      invalidatesTags: [{ type: "Variable", id: "LIST" }],
    }),

    getMyStats: builder.query({
      query: ({ periodType, date } = {}) => {
        const params = new URLSearchParams();
        if (periodType) params.set("periodType", periodType);
        if (date) params.set("date", date);
        const query = params.toString();
        return query ? `/common/my-stats?${query}` : "/common/my-stats";
      },
      providesTags: [{ type: "MyStats", id: "ME" }, { type: "User", id: "ME" }],
    }),

    getVariables: builder.query({
      query: () => "/common/get-variable",
      providesTags: [{ type: "Variable", id: "LIST" }],
    }),

    getLeaderBoard: builder.query({
      query: ({ periodType, date } = {}) => {
        const params = new URLSearchParams();
        if (periodType) params.set("periodType", periodType);
        if (date) params.set("date", date);
        const query = params.toString();
        return query
          ? `/common/salesrep-leaderboard?${query}`
          : "/common/salesrep-leaderboard";
      },
      providesTags: [{ type: "LeaderBoard", id: "LIST" }],
    }),

    getSummaryStats: builder.query({
      query: ({ periodType, date } = {}) => {
        const params = new URLSearchParams();
        if (periodType) params.set("periodType", periodType);
        if (date) params.set("date", date);
        const query = params.toString();
        return query
          ? `/common/summary-stats?${query}`
          : "/common/summary-stats";
      },
      providesTags: [{ type: "Stats", id: "LIST" }],
    }),

    getNotifications: builder.query({
      query: () => "/common/my-notifications",
      providesTags: [{ type: "User", id: "ME" }],
    }),

    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `/common/notification/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "User", id: "ME" }],
    }),

    createPayment: builder.mutation({
      query: (payload) => ({
        url: "/common/payments",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "Payment", id: "LIST" },
        { type: "User", id: "LIST" },
      ],
    }),

    getPayments: builder.query({
      query: (salesRepId) => ({
        url: "/common/payments",
        params: { salesRepId },
      }),
      providesTags: (result) => {
        const payments = result?.data || [];
        return [
          { type: "Payment", id: "LIST" },
          ...payments.map((payment) => ({
            type: "Payment",
            id: payment._id || payment.id,
          })),
        ];
      },
    }),

    updatePayment: builder.mutation({
      query: ({ paymentId, ...body }) => ({
        url: `/common/payments/${paymentId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { paymentId }) => [
        { type: "Payment", id: paymentId },
        { type: "Payment", id: "LIST" },
      ],
    }),

    deletePayment: builder.mutation({
      query: (paymentId) => ({
        url: `/common/payments/${paymentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, paymentId) => [
        { type: "Payment", id: paymentId },
        { type: "Payment", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useUpsertVariableMutation,
  useGetVariablesQuery,
  useGetLeaderBoardQuery,
  useGetSummaryStatsQuery,
  useCreateFiscalYearMutation,
  useGetFiscalYearQuery,
  useGetMyStatsQuery,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useCreatePaymentMutation,
  useGetPaymentsQuery,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = commonApi;
export default commonApi;
