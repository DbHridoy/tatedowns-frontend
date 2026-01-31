import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { logout } from "./slice/authSlice";


const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include",
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions
    );
    //console.log(refreshResult);
    if (refreshResult && refreshResult.data) {
      api.dispatch(
        setCredentials({
          accessToken: refreshResult.data.accessToken,
          refreshToken: refreshResult.data.refreshToken,
          user: api.getState().auth.user,
        })
      );
    } else {
      //console.log("Refresh token failed, logging out...");
      api.dispatch(logout());
    }
    result = await baseQuery(args, api, extraOptions);
  }

  return result;
};
