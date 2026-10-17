import Image from "next/image";
import Link from "next/link";

const links = [
  { label: "Home", href: "/" },
  { label: "Our Content", href: "/content" },
  { label: "Playlists", href: "/playlists" },
  { label: "Watch Live", href: "https://watch.hillview.tv/", external: true },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-neutral-150 border-t bg-white">
      <div className="mx-auto w-full max-w-(--breakpoint-xl) px-6 py-12 md:py-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="group flex items-center gap-2.5">
              <Image
                src="/assets/logos/sun.png"
                alt="HillviewTV"
                width={36}
                height={36}
                className="h-8 w-8 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-header-100 text-lg font-semibold tracking-[-0.01em]">
                Hillview<span className="text-primary-100">TV</span>
              </span>
            </Link>
            <p className="max-w-[220px] text-sm leading-relaxed text-neutral-400">
              Hillview Middle School&apos;s student-run broadcast network.
            </p>
          </div>

          {/* Sitemap */}
          <div className="flex flex-col gap-3">
            <span className="text-[0.65rem] font-bold tracking-[0.12em] text-neutral-400 uppercase">
              Navigate
            </span>
            <ul className="flex flex-col gap-2.5">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    {...(l.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="hover:text-header-100 text-sm text-neutral-500 transition-colors duration-150"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-neutral-150 mt-12 flex flex-col gap-1 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-neutral-400">
            © {year} HillviewTV. All rights reserved.
          </span>
          <span className="text-xs text-neutral-400">
            Hillview Middle School · Menlo Park, CA
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
