import { api } from './api'

type Itinerary = {
  id: string
  user_id?: string
  destination: string
  start_date: string
  end_date: string
  travelers_count: number
  travelers_type?: string
  budget: string
  pace: string
  interests?: string[]
  notes?: string
  constraints?: Record<string, unknown>
  itinerary_data?: any
  status?: string
  created_at?: string
  updated_at?: string
}

export const bookingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    list: builder.query<Itinerary[], void>({
      query: () => ({ url: '/itineraries' }),
      providesTags: ['Booking']
    }),
    create: builder.mutation<Itinerary, Partial<Itinerary>>({
      query: (body) => ({ url: '/itineraries', method: 'POST', body }),
      invalidatesTags: ['Booking']
    }),
    generate: builder.mutation<any, any>({
      query: (body) => ({ url: '/itineraries/generate', method: 'POST', body }),
      invalidatesTags: ['Booking']
    }),
    refine: builder.mutation<any, { id: string; instructions: string }>({
      query: (body) => ({ url: '/itineraries/refine', method: 'POST', body }),
      invalidatesTags: ['Booking']
    }),
    get: builder.query<Itinerary, string>({
      query: (id) => ({ url: `/itineraries/${id}` }),
      providesTags: ['Booking']
    }),
    update: builder.mutation<Itinerary, { id: string; data: Partial<Itinerary> }>({
      query: ({ id, data }) => ({ url: `/itineraries/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Booking']
    }),
    remove: builder.mutation<void, string>({
      query: (id) => ({ url: `/itineraries/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Booking']
    })
    ,
    normalizePreferences: builder.mutation<any, any>({
      query: (body) => ({ url: '/preferences', method: 'POST', body })
    }),
    aggregateSearch: builder.mutation<{ results: any[] }, any>({
      query: (body) => ({ url: '/search/aggregate', method: 'POST', body })
    })
  })
})

export const { useListQuery, useCreateMutation, useGenerateMutation, useRefineMutation, useGetQuery, useUpdateMutation, useRemoveMutation, useNormalizePreferencesMutation, useAggregateSearchMutation } = bookingApi
