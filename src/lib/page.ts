import { useEffect } from "react";

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export async function fetchJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`请求失败（${response.status}）`);
  return response.json() as Promise<T>;
}
