import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import get from "lodash/get";

export const apiCaller = (
  url: string,
  data: AxiosRequestConfig["data"] | AxiosRequestConfig["params"],
  method: Method = "get",
  options = {},
  module = "auth"
): Promise<AxiosResponse["data"]> => {
  return axios({
    url: `${process.env.REACT_APP_BASE_API}/${module}${url}`,
    method,
    [method.toLowerCase() === "get" ? "params" : "data"]: data,
    ...options,
    headers: { Authorization: localStorage.getItem("authToken") || "" },
  });
};

export const PythonApiCaller = async (
  url: string,
  method: Method = "GET",
  params: AxiosRequestConfig["params"] | AxiosRequestConfig["data"] = {},
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse["data"]> => {
  const userData = localStorage.getItem("userDetails");
  const config: AxiosRequestConfig = {
    ...options,
    baseURL: options.baseURL || process.env.REACT_APP_BASE_API,
    method,
    headers: {
      "ngrok-skip-browser-warning": true,
      Authorization: localStorage.getItem("authToken") || "",
      orgId: get(JSON.parse(userData || ""), "organisationId"),
    },
    data: method !== "GET" ? params : undefined,
    params: method === "GET" ? params : undefined,
  };

  try {
    const { data } = await axios(url, config);
    return data;
  } catch (error) {
    throw get(error, "response", error);
  }
};
