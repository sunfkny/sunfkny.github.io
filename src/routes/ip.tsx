import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchJson, useTitle } from "../lib/page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/ip")({ component: IpPage });

function IpPage() {
  useTitle("IP 查询");
  const [initial] = useState(
    () => new URLSearchParams(window.location.search).get("ip")?.trim() ?? "",
  );
  const [input, setInput] = useState(initial);
  const [target, setTarget] = useState(initial);
  const [detect, setDetect] = useState(!initial);
  const ownIp = useQuery({
    queryKey: ["own-ip"],
    enabled: detect,
    queryFn: async ({ signal }) => {
      const response = await fetch("https://ip.zxinc.org/getip", { signal });
      if (!response.ok) throw new Error("无法获取当前 IP，请手动输入。");
      return (await response.text()).trim();
    },
  });
  useEffect(() => {
    if (detect && ownIp.data) {
      setInput(ownIp.data);
      setTarget(ownIp.data);
      setDetect(false);
    }
  }, [detect, ownIp.data]);
  const query = useQuery({
    queryKey: ["ip", target],
    enabled: Boolean(target),
    queryFn: async ({ signal }) => {
      const result = await fetchJson<{
        code: number;
        message?: string;
        data: { country: string; local: string };
      }>(`https://ip.zxinc.org/api.php?type=json&ip=${encodeURIComponent(target)}`, signal);
      if (result.code !== 0) throw new Error(result.message || "IP 查询失败，请检查输入。");
      return result.data;
    },
  });
  function submit(event: FormEvent) {
    event.preventDefault();
    setDetect(false);
    if (input.trim() === target) void query.refetch();
    else setTarget(input.trim());
  }
  const error = query.error ?? (detect ? ownIp.error : null);
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-neutral-800">
      <form onSubmit={submit} className="flex w-full max-w-sm flex-col gap-4">
        <Label htmlFor="ip" className="justify-center">
          IP 查询
        </Label>
        <Input
          id="ip"
          required
          autoFocus
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setDetect(false);
          }}
          placeholder="IPv4 / IPv6"
          className="h-10 text-center"
        />
        <div className="flex justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDetect(false);
              setInput("");
              setTarget("");
            }}
          >
            清除
          </Button>
          <Button type="submit" disabled={query.isFetching}>
            查询
          </Button>
        </div>
      </form>
      <div aria-live="polite" className="min-h-20 text-center">
        {(query.isFetching || (detect && ownIp.isFetching)) && <p role="status">正在查询…</p>}
        {error && <p role="alert">{error.message}</p>}
        {query.data && (
          <>
            <p className="font-medium">{query.data.country}</p>
            <p className="mt-2 text-neutral-500">{query.data.local}</p>
          </>
        )}
      </div>
    </main>
  );
}
