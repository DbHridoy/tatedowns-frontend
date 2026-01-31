import { baseApi } from "../baseApi";


const quoteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createQuote: builder.mutation({
      query: (newQuote) => ({
        url: "/quotes",
        method: "POST",
        body: newQuote,
      }),
      invalidatesTags: [
        { type: "Quote", id: "LIST" },
        { type: "User", id: "LIST" },
        { type: "Client", id: "LIST" },
      ],
    }),

    getAllQuotes: builder.query({
      query: (options = {}) => {
        const { page = 1, limit = 0, search, sort, filters = {} } = options;

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

        return `/quotes?${params.toString()}`;
      },
      providesTags: (result) => {
        const quotes = result?.data || [];
        return [
          { type: "Quote", id: "LIST" },
          ...quotes.map((quote) => ({ type: "Quote", id: quote._id || quote.id })),
        ];
      },
    }),

    getQuoteById: builder.query({
      query: (id) => `/quotes/${id}`,
      providesTags: (result, error, id) => [{ type: "Quote", id }],
    }),

    updateQuote: builder.mutation({
      query: ({ id, body }) => ({
        url: `/quotes/${id}`,
        method: "PATCH",
        body, // send FormData directly, no wrapping
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Quote", id },
        { type: "Quote", id: "LIST" },
      ],
    }),

    deleteQuote: builder.mutation({
      query: (id) => ({
        url: `/quotes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Quote", id },
        { type: "Quote", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateQuoteMutation,
  useGetAllQuotesQuery,
  useGetQuoteByIdQuery,
  useUpdateQuoteMutation,
  useDeleteQuoteMutation,
} = quoteApi;
export default quoteApi;
