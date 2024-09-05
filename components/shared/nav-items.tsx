"use client";

import { navLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItems() {
  const pathname = usePathname();

  return (
    <ul className="flex w-full flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      {navLinks.map((item) => {
        const isActiveLink = pathname === item.url;
        return (
          <li
            key={item.id}
            className={`${isActiveLink && "text-primary-500"} p-medium-16 whitespace-nowrap`}
          >
            <Link href={item.url}>{item.name}</Link>
          </li>
        );
      })}
    </ul>
  );
}
