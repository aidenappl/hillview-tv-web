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
    <footer className="bg-[#1a2533]">
      <div className="h-px bg-gradient-to-r from-transparent via-[#197bff]/40 to-transparent" />
      <div className="mx-auto w-11/12 max-w-screen-2xl py-12 md:py-16">
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
              <span className="text-lg font-semibold tracking-[-0.01em] text-white">
                Hillview<span className="text-[#197bff]">TV</span>
              </span>
            </Link>
            <p className="max-w-[220px] text-sm leading-relaxed text-neutral-500">
              Hillview Middle School's student-run broadcast network.
            </p>
          </div>

          {/* Sitemap */}
          <div className="flex flex-col gap-3">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-neutral-600">
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
                    className="text-sm text-neutral-400 transition-colors duration-150 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-1 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-neutral-600">
            © {year} HillviewTV. All rights reserved.
          </span>
          <span className="text-xs text-neutral-700">
            Hillview Middle School · Menlo Park, CA
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
