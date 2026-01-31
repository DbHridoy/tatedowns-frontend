import { baseApi } from "../baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCluster: builder.mutation({
      query: (clusterName) => ({
        url: "/common/cluster",
        method: "POST",
        body: { clusterName },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    getAllClusters: builder.query({
      query: () => `/common/cluster`,
      providesTags: [{ type: "User", id: "LIST" }],
    }),

    getMe: builder.query({
      query: () => `/users/me`,
      providesTags: [{ type: "User", id: "ME" }],
    }),

    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    getAllUsers: builder.query({
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

        return `/users/?${params.toString()}`;
      },
      providesTags: (result) => {
        const users = result?.data || [];
        return [
          { type: "User", id: "LIST" },
          ...users.map((user) => ({ type: "User", id: user._id || user.id })),
        ];
      },
    }),

    getUserStats: builder.query({
      query: ({ userId, periodType, date } = {}) => {
        if (!userId) return "";
        const params = new URLSearchParams();
        if (periodType) params.set("periodType", periodType);
        if (date) params.set("date", date);
        const query = params.toString();
        return query
          ? `/common/admin/users-stats/${userId}?${query}`
          : `/common/admin/users-stats/${userId}`;
      },
      providesTags: (result, error, { userId } = {}) =>
        userId ? [{ type: "User", id: userId }] : [{ type: "User", id: "LIST" }],
    }),

    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    updateMe: builder.mutation({
      query: (payload) => ({
        url: `/users/me`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: [{ type: "User", id: "ME" }, { type: "User", id: "LIST" }],
    }),

    creatUser: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, userId) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
      ],
    }),

  }),
});

export const {
  useCreateClusterMutation,
  useGetAllClustersQuery,
  useGetMeQuery,
  useGetUserQuery,
  useGetUserStatsQuery,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useUpdateMeMutation,
  useCreatUserMutation,
  useDeleteUserMutation,
  useGetAllSalesRepQuery,
} = userApi;
