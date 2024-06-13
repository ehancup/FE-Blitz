import axios, { AxiosInstance } from "axios";

export const axiosClient: AxiosInstance = axios.create({
  baseURL: `http://${process.env.IP}`,
  headers: { "Content-Type": "application/json" },
});

export interface BaseResponsePagination {
  status: string;
  message: string;
  pagination: {
    page: number;
    // limit: number;
    pageSize: number;
    total: number;
  };
}