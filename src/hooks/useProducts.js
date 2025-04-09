import { fetcher } from "../api/fetcher";
import useSWR from "swr";

export function useProducts(params) {
  const { data, error } = useSWR(`/products`, params, (url) =>
    fetcher(url, params)
  );

  return {
    products: data?.length ? data : [],
    isLoading: !error && !data,
    isError: error,
  };
}

export function useProductByStore(syncId) {
  const { data, error } = useSWR(`/products/store/${syncId}`, (url) =>
    fetcher(url)
  );

  return {
    storeProduct: data?.result,
    isStoreProductLoading: !error && !data,
    isStoreProductError: error,
  };
}

export function useProductById(id) {
  const { data, error } = useSWR(`/products/${id}`, (url) => fetcher(url));

  return {
    product: data?.result,
    isLoading: !error && !data,
    isError: error,
  };
}
