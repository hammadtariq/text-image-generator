import { fetcher } from "../api/fetcher";
import useSWR from "swr";

export function useProductMockup(id) {
  const { data, error } = useSWR(`/products/store/mockup/${id}`, (url) =>
    fetcher(url)
  );

  return {
    product: data?.result,
    isLoading: id && !error && !data,
    isError: error,
  };
}
