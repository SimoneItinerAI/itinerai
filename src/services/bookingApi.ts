import { api } from './api'

type Itinerary = {
  id: string
  destination: string
  start_date: string
  end_date: string
  travelers_count: number
  budget: string
  pace: string
  interests?: string[]
  notes?: string
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
  })
})

export const { useListQuery, useCreateMutation, useGetQuery, useUpdateMutation, useRemoveMutation } = bookingApi
