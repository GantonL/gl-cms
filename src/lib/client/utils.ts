import { goto } from "$app/navigation";

export function addSearchParamToUrl(searchParams: URLSearchParams, paramName: string, value: string) {
  searchParams.set(paramName, value);
  goto(`?${searchParams.toString()}`);
}
