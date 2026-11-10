import { createFileRoute } from "@tanstack/react-router";
import { siGithub, siBilibili } from "simple-icons";

export const Route = createFileRoute("/")({ component: Home });

const profiles = [
  { icon: siGithub, href: "https://github.com/sunfkny" },
  { icon: siBilibili, href: "https://space.bilibili.com/15405332" },
];

function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center overflow-hidden bg-white px-8 text-[#1f2328]">
      <section className="relative w-full max-w-md py-20">
        <h1 className="relative text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">
          Hi there 👋
        </h1>
        <p className="relative mt-6 text-xl tracking-tight text-neutral-500 sm:text-2xl">
          I’m{" "}
          <span className="font-medium text-[#1f2328] underline decoration-[#78afe0] decoration-3 underline-offset-4 [text-decoration-skip-ink:none]">
            sunfkny
          </span>
          .
        </p>
        <nav className="relative mt-10 flex items-center gap-5">
          {profiles.map(({ icon, href }) => (
            <a
              key={icon.slug}
              href={href}
              aria-label={icon.title}
              title={icon.title}
              className="flex size-11 items-center justify-center rounded-xl transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current motion-reduce:transform-none"
              style={{ color: `#${icon.hex}` }}
            >
              <svg
                role="img"
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d={icon.path} />
              </svg>
            </a>
          ))}
        </nav>
      </section>
    </main>
  );
}
