// sneakerApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Sneaker {
  id: string;
  name: string;
  brand: string;
  image: {
    small: string;
    original: string;
  };
  releaseDate: string;
  retailPrice: number;
  description: string;
  colorway: string;
  gender?: string;
  silhouette?: string;
  sku?: string;
}

// *** Add 'search' to SneakerFilters ***
export interface SneakerFilters {
  name?: string;
  brand?: string;
  gender?: string;
  silhouette?: string;
  colorway?: string;
  releaseYear?: string;
  releaseDate?: string;
  sku?: string;
  sort?: string;
  page: number;
  limit: number;
  search?: string; // Add the search property, make it optional
}

export const sneakerApi = createApi({
  reducerPath: 'sneakerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://the-sneaker-database.p.rapidapi.com',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      headers.set('X-RapidAPI-Key', '3994476323msh5c44554dbcaa3dep1fe015jsn1d064306e239'); // Your API Key
      headers.set('X-RapidAPI-Host', 'the-sneaker-database.p.rapidapi.com');
      return headers;
    },
  }),
  tagTypes: ['Sneakers', 'Closet'], // Define the tag types
  endpoints: (builder) => ({
    getSneakers: builder.query<{ results: Sneaker[], count: number }, SneakerFilters>({ // Use the interface
      query: (filters) => {
        // Build the query string dynamically
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '' && value !== null) { // Important: Only add non-empty filters
            params.append(key, String(value));
          }
        });

        return `/sneakers?${params.toString()}`;
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, {arg}) => { //Need to add arg
        if(arg.page === 1){
            currentCache.results = newItems.results; //Clear cache
            return;
        }
        currentCache.results.push(...newItems.results);

      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    searchSneakers: builder.query<{ results: Sneaker[], count: number }, { query: string; page: number; limit: number }>({ // New endpoint
      query: ({ query, page, limit }) => `/search?page=${page}&limit=${limit}&query=${query}`,
       providesTags: ['Sneakers'],
        serializeQueryArgs: ({ endpointName, queryArgs }) => {
        //  return endpointName; //Cache all searches together
        //Better: cache searches separately
        return endpointName + queryArgs.query
      },
      // Merge incoming data to the cache entry
      merge: (currentCache, newItems, {arg}) => { //Need to add arg
        if(arg.page === 1){
            currentCache.results = newItems.results; //Clear cache
            return;
        }
        currentCache.results.push(...newItems.results);

      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    getSneakerById: builder.query<Sneaker, string>({
      query: (id) => `/sneakers/${id}`,
      transformResponse: (response: { results: Sneaker[] }) => response.results[0],
    }),
    getSneakerByUpc: builder.query<Sneaker[], string>({ // New endpoint!
      query: (upc) => `/sneakers?upc=${upc}`, // Adjust endpoint if necessary
      //  transformResponse: (response: { results: Sneaker[] }) => response.results[0], Use this if you are returning a single sneaker
   }),
  }),
});

export const { useGetSneakersQuery, useGetSneakerByIdQuery, useGetSneakerByUpcQuery, useLazySearchSneakersQuery } = sneakerApi;