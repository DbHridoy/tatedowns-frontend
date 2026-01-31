import { baseApi } from "../baseApi";

const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createClient: builder.mutation({
      query: (newClient) => ({
        url: "/clients",
        method: "POST",
        body: newClient,
      }),
      invalidatesTags: [
        { type: "Client", id: "LIST" },
        { type: "User", id: "LIST" },
        { type: "MyStats", id: "LIST" },
      ],
    }),

    addCallLog: builder.mutation({
      query: ({ clientId, callAt, status, reason, note }) => ({
        url: `/clients/${clientId}/call-log`,
        method: "POST",
        body: { callAt, status, reason, note },
      }),
      invalidatesTags: (result, error, { clientId }) => [
        { type: "Client", id: clientId },
        { type: "Client", id: "LIST" },
      ],
    }),

    addNote: builder.mutation({
      query: ({ clientId, formData }) => ({
        url: `/clients/${clientId}/client-note`,
        method: "POST",
        body: formData, // ✅ FormData
      }),
      invalidatesTags: (result, error, { clientId, formData }) => {
        const jobId =
          typeof formData?.get === "function" ? formData.get("jobId") : null;
        const tags = [
          { type: "Client", id: clientId },
          { type: "Client", id: "LIST" },
        ];
        if (jobId) {
          tags.push({ type: "Job", id: jobId }, { type: "Job", id: "LIST" });
        }
        return tags;
      },
    }),

    getAllClients: builder.query({
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

        console.log(params.toString());

        return `/clients?${params.toString()}`;
      },
      providesTags: (result) => {
        const clients = result?.data || [];
        return [
          { type: "Client", id: "LIST" },
          ...clients.map((client) => ({
            type: "Client",
            id: client._id || client.id,
          })),
        ];
      },
    }),

    getClientById: builder.query({
      query: (id) => `/clients/${id}`,
      providesTags: (result, error, id) => [{ type: "Client", id }],
    }),

    updateClient: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/clients/${id}`,
        method: "PATCH",
        body: updateData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Client", id },
        { type: "Client", id: "LIST" },
      ],
    }),

    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Client", id },
        { type: "Client", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateClientMutation,
  useGetAllClientsQuery,
  useGetClientByIdQuery,
  useUpdateClientMutation,
  useAddCallLogMutation,
  useAddNoteMutation,
  useDeleteClientMutation,
} = clientApi;
export default clientApi;
