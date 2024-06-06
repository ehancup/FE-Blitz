import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../axios/axiosClient";
import useAxiosAuth from "./useAxiosAuth";
import { AddressResponse } from "../address/interface";

interface CatRes {
  data: {
    id: string;
    name: string;
  }[];
}

interface EtlRes {
  data: {
    id: string;
    name: string;
    avatar: string;
  }[];
}
const useOption = () => {
  const axiosAuthClient = useAxiosAuth();
  const getCat = async (): Promise<CatRes> =>
    await axiosClient.get("/category/list").then((response) => response.data);

  const getEtl = async (id: string): Promise<EtlRes> =>
    axiosClient.get(`/etalase/list/${id}`).then((response) => response.data);

  const getMyAddress = async (): Promise<AddressResponse> =>
    await axiosAuthClient
      .get("/address/my-address", { params: { pageSize: 100 } })
      .then((res) => res.data);

  const { data: optionCategory } = useQuery({
    queryKey: ["option/category"],
    queryFn: () => getCat(),
    select: (data) => {
      console.log("datad", data);

      const options = data?.data?.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });

      return options;
    },
  });

  const { data: optionAddress } = useQuery({
    queryKey: ["option/address"],
    queryFn: () => getMyAddress(),
    select: (data) => {
      console.log(data);

      const options = data?.data?.map((item) => {
        return {
          label: `${item.title} - ${item.name}`,
          value: item.id,
        };
      });

      return options;
    },
  });

  const useEtalaseStore = (id: string) => {
    const { data: optionEtalase } = useQuery({
      queryKey: ["option/etalase"],
      queryFn: () => getEtl(id),
      select: (data) => {
        console.log("datad", data);

        const options = data?.data?.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });

        return options;
      },
    });

    return { optionEtalase };
  };

  return { optionCategory, useEtalaseStore, optionAddress };
};

export default useOption;
