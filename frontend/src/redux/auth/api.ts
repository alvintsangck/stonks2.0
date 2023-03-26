import { LoginFormState } from "../../components/login/LoginForm";
import { RegisterFormState } from "../../components/login/RegisterForm";
import { emptyApi } from "../api";
import { Balance } from "./state";

export const authApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<string, LoginFormState>({
      query: (body) => ({ url: "/user/login", method: "POST", body }),
      transformResponse: (res: { token: string }) => res.token,
    }),
    register: build.mutation<string, RegisterFormState>({
      query: (body) => ({ url: "/user/register", method: "POST", body }),
      transformResponse: (res: { token: string }) => res.token,
    }),
    getBalance: build.query<Balance, void>({
      query: () => ({ url: `/user/balance` }),
    }),
    loginFacebook: build.mutation<string, string>({
      query: (accessToken) => ({ url: "/user/login/facebook", method: "POST", body: { accessToken } }),
      transformResponse: (res: { token: string }) => res.token,
    }),
  }),
  overrideExisting: false,
});

export const { useGetBalanceQuery, useLoginMutation, useRegisterMutation, useLoginFacebookMutation } = authApi;
