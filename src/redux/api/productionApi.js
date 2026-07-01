import { baseApi } from "../baseApi";

const productionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductionCalendarSchedule: builder.query({
      query: ({ viewMode, startDate, endDate, crewId } = {}) => ({
        url: "/production-calendar",
        params: { viewMode, startDate, endDate, crewId },
      }),
      providesTags: (result) => {
        const items = result?.data?.items || result?.data?.schedule || [];
        return [
          { type: "ProductionSchedule", id: "LIST" },
          ...items.map((item) => ({
            type: "ProductionSchedule",
            id: item._id || item.id,
          })),
        ];
      },
    }),

    getAvailableJobsForScheduling: builder.query({
      query: () => "/production-calendar/available-jobs",
      providesTags: [{ type: "Job", id: "LIST" }],
    }),

    createScheduleItem: builder.mutation({
      query: (body) => ({
        url: "/production-calendar/schedule",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "ProductionSchedule", id: "LIST" },
        { type: "Job", id: "LIST" },
      ],
    }),

    updateScheduleItem: builder.mutation({
      query: ({ scheduleId, ...body }) => ({
        url: `/production-calendar/${scheduleId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { scheduleId }) => [
        { type: "ProductionSchedule", id: scheduleId },
        { type: "ProductionSchedule", id: "LIST" },
      ],
    }),

    updateScheduleStatus: builder.mutation({
      query: ({ scheduleId, status }) => ({
        url: `/production-calendar/${scheduleId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { scheduleId }) => [
        { type: "ProductionSchedule", id: scheduleId },
        { type: "ProductionSchedule", id: "LIST" },
      ],
    }),

    applyRainDelay: builder.mutation({
      query: ({ scheduleId, delayDays, affectedFromDate, reason }) => ({
        url: `/production-calendar/${scheduleId}/rain-delay`,
        method: "POST",
        body: { delayDays, affectedFromDate, reason },
      }),
      invalidatesTags: (result, error, { scheduleId }) => [
        { type: "ProductionSchedule", id: scheduleId },
        { type: "ProductionSchedule", id: "LIST" },
      ],
    }),

    getCrews: builder.query({
      query: () => "/crews",
      providesTags: (result) => {
        const crews = result?.data || [];
        return [
          { type: "Crew", id: "LIST" },
          ...crews.map((crew) => ({ type: "Crew", id: crew._id || crew.id })),
        ];
      },
    }),

    createCrew: builder.mutation({
      query: (body) => ({
        url: "/crews",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Crew", id: "LIST" }],
    }),

    updateCrew: builder.mutation({
      query: ({ crewId, ...body }) => ({
        url: `/crews/${crewId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { crewId }) => [
        { type: "Crew", id: crewId },
        { type: "Crew", id: "LIST" },
      ],
    }),

    assignPainterToCrew: builder.mutation({
      query: ({ crewId, painterId }) => ({
        url: `/crews/${crewId}/painters`,
        method: "POST",
        body: { painterId },
      }),
      invalidatesTags: [
        { type: "Crew", id: "LIST" },
        { type: "Painter", id: "LIST" },
      ],
    }),

    removePainterFromCrew: builder.mutation({
      query: ({ crewId, painterId }) => ({
        url: `/crews/${crewId}/painters/${painterId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Crew", id: "LIST" },
        { type: "Painter", id: "LIST" },
      ],
    }),

    getPainters: builder.query({
      query: () => "/painters",
      providesTags: (result) => {
        const painters = result?.data || [];
        return [
          { type: "Painter", id: "LIST" },
          ...painters.map((painter) => ({
            type: "Painter",
            id: painter._id || painter.id,
          })),
        ];
      },
    }),

    createPainter: builder.mutation({
      query: (body) => ({
        url: "/painters",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Painter", id: "LIST" }],
    }),

    updatePainter: builder.mutation({
      query: ({ painterId, ...body }) => ({
        url: `/painters/${painterId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { painterId }) => [
        { type: "Painter", id: painterId },
        { type: "Painter", id: "LIST" },
      ],
    }),

    getPainterOwnCrew: builder.query({
      query: () => "/painters/me/crew",
      providesTags: [{ type: "Crew", id: "ME" }],
    }),

    getPainterOwnSchedule: builder.query({
      query: ({ viewMode, startDate, endDate } = {}) => ({
        url: "/painters/me/schedule",
        params: { viewMode, startDate, endDate },
      }),
      providesTags: [{ type: "ProductionSchedule", id: "ME" }],
    }),
  }),
});

export const {
  useGetProductionCalendarScheduleQuery,
  useGetAvailableJobsForSchedulingQuery,
  useCreateScheduleItemMutation,
  useUpdateScheduleItemMutation,
  useUpdateScheduleStatusMutation,
  useApplyRainDelayMutation,
  useGetCrewsQuery,
  useCreateCrewMutation,
  useUpdateCrewMutation,
  useAssignPainterToCrewMutation,
  useRemovePainterFromCrewMutation,
  useGetPaintersQuery,
  useCreatePainterMutation,
  useUpdatePainterMutation,
  useGetPainterOwnCrewQuery,
  useGetPainterOwnScheduleQuery,
} = productionApi;

export default productionApi;
