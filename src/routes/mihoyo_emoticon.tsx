import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchJson, useTitle } from "../lib/page";

export const Route = createFileRoute("/mihoyo_emoticon")({ component: EmoticonsPage });

type Emoticon = { id: number; name: string; icon: string; status: string };
type EmoticonSet = Emoticon & { list: Emoticon[] };

function EmoticonsPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const query = useQuery({
    queryKey: ["emoticon-sets"],
    queryFn: async ({ signal }) => {
      const result = await fetchJson<{
        retcode: number;
        message: string;
        data: { list: EmoticonSet[] };
      }>("https://bbs-api-static.mihoyo.com/misc/api/emoticon_set", signal);
      if (result.retcode !== 0) throw new Error(result.message || "表情包加载失败");
      return result.data.list.filter((item) => item.status === "published" && item.icon);
    },
  });
  const sets = query.data ?? [];
  const active = sets.find((item) => item.id === selected) ?? sets[0];
  useTitle(active?.name ?? "表情包");

  return (
    <main className="h-svh overflow-y-auto bg-white text-neutral-800 [&::-webkit-scrollbar]:w-0">
      {query.isPending && (
        <p role="status" className="p-6">
          正在加载表情包…
        </p>
      )}
      {query.isError && (
        <div role="alert" className="p-6">
          <p>{query.error.message}</p>
          <button className="mt-4 underline" onClick={() => void query.refetch()}>
            重试
          </button>
        </div>
      )}
      {query.isSuccess && sets.length === 0 && <p className="p-6">暂无可用表情包。</p>}
      <nav
        aria-label="表情包分类"
        className="flex overflow-x-auto overflow-y-hidden border-b border-neutral-100 [&::-webkit-scrollbar]:h-4 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track-piece]:bg-[#f8f8f8] [&::-webkit-scrollbar-thumb]:bg-[#ddd] [&::-webkit-scrollbar-thumb]:bg-clip-padding [&::-webkit-scrollbar-thumb:hover]:bg-[#bbb]"
      >
        {sets.map((set) => (
          <button
            key={set.id}
            aria-label={set.name}
            aria-pressed={active?.id === set.id}
            title={set.name}
            onClick={() => setSelected(set.id)}
            className="size-[20vw] shrink-0 border-b-2 border-transparent p-2 aria-pressed:border-neutral-800 focus-visible:outline-2 focus-visible:-outline-offset-4 min-[720px]:size-[10vw] min-[1440px]:size-[6.666vw] min-[2160px]:size-[5vw] min-[2880px]:size-[4vw]"
          >
            <img
              loading="lazy"
              src={set.icon}
              alt={set.name}
              className="size-full object-contain"
            />
          </button>
        ))}
      </nav>
      <section aria-label={active?.name ?? "表情"} className="flex flex-wrap">
        {active?.list
          .filter((item) => item.status === "published" && item.icon)
          .map((item, index) => (
            <img
              key={`${item.id}-${index}`}
              loading="lazy"
              src={item.icon}
              alt={item.name}
              title={item.name}
              className="size-[20vw] object-contain min-[720px]:size-[10vw] min-[1440px]:size-[6.666vw] min-[2160px]:size-[5vw] min-[2880px]:size-[4vw]"
            />
          ))}
      </section>
    </main>
  );
}
