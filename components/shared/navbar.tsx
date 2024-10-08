import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import NavItems from "./nav-items";
import MobileNav from "./mobile-nav";

export default function Navbar() {
  return (
    <header className="w-full shadow-md">
      <div className="nav-wrapper flex items-center justify-between">
        <Link href="/">
          <Image
            priority
            src="/assets/images/logo.svg"
            alt="eventify logo"
            height={38}
            width={128}
            className="mt-1 h-[38px] w-[128px] object-contain md:mt-0"
          />
        </Link>
        <SignedIn>
          <nav className="md:flex-between hidden w-full max-w-xs">
            <NavItems />
          </nav>
        </SignedIn>
        <div className="flex justify-end gap-5">
          <SignedIn>
            <UserButton />
            <MobileNav />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button className="rounded-full px-8">Login</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
