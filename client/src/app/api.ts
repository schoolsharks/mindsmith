import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query';

// Create the base query with auth headers and credentials
const baseQuery = fetchBaseQuery({
    baseUrl: "import.meta.env.VITE_BACKEND_BASE_URL",     
    credentials: 'include', // Include credentials for cross-origin requests
});

// Create the reauth wrapper
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    if (!args) {
        throw new Error("Arguments for baseQuery cannot be undefined");
    }

    let result = await baseQuery(args, api, extraOptions);

    // If the error is 401 Unauthorized, try to refresh the token
    if (result.error && result.error.status === 401) {
        // Try to get a new token
        const refreshResult = await baseQuery(
            { url: '/auth/refresh', method: 'POST' },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            // Store the new token
            api.dispatch({  
                type: 'auth/tokenRefreshed',
                payload: refreshResult.data,
            });

            // Retry the original query with new token
            result = await baseQuery(args, api, extraOptions);
        } else {
            // If refresh fails, log the user out
            // api.dispatch({ type: 'auth/logout' });
        }
    }

    return result;
};

// Create the base API
export const api = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Auth','DailyPulse','Learning'],
    endpoints: () => ({}),
});