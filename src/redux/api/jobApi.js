import { baseApi } from "../baseApi";

const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNewJob: builder.mutation({
      query: (newJob) => ({
        url: "/jobs",
        method: "POST",
        body: newJob,
      }),
      invalidatesTags: [{ type: "Job", id: "LIST" }, { type: "User", id: "LIST" }],
    }),

    createDesignConsultation: builder.mutation({
      query: (dc) => ({
        url: `/jobs/design-consultation`,
        body: dc,
        method: "POST",
      }),
      invalidatesTags: (result, error, dc) => {
        const jobId =
          typeof dc?.get === "function" ? dc.get("jobId") : dc?.jobId;
        return jobId
          ? [{ type: "Job", id: jobId }, { type: "Job", id: "LIST" }]
          : [{ type: "Job", id: "LIST" }];
      },
    }),

    getAllJobs: builder.query({
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

        return `/jobs?${params.toString()}`;
      },
      providesTags: (result) => {
        const jobs = result?.data || [];
        return [
          { type: "Job", id: "LIST" },
          ...jobs.map((job) => ({ type: "Job", id: job._id || job.id })),
        ];
      },
    }),

    getJobById: builder.query({
      query: (id) => `/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: "Job", id }],
    }),

    updateJob: builder.mutation({
      query: ({ id, data }) => ({
        url: `/jobs/${id}`,
        method: "PATCH",
        body: data, // ✅ send the fields directly
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Job", id }, { type: "Job", id: "LIST" },{type:"MyStats",id:"ME"}],
    }), 

    deleteJob: builder.mutation({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Job", id },
        { type: "Job", id: "LIST" },
      ],
    })
  }),
});

export const {
  useCreateNewJobMutation,
  useGetAllJobsQuery,
  useGetJobByIdQuery,
  useCreateDesignConsultationMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobApi;
export default jobApi;
