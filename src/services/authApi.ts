import { api } from './api'

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ user: { id: string; email: string; name: string }; access_token: string }, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body })
    }),
    register: builder.mutation<{ user: { id: string; email: string; name: string }; access_token: string }, { email: string; password: string; name: string }>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body })
    }),
    forgotPassword: builder.mutation<{ ok: boolean }, { email: string }>({
      query: (body) => ({ url: '/auth/forgot', method: 'POST', body })
    })
  })
})

export const { useLoginMutation, useRegisterMutation, useForgotPasswordMutation } = authApi
