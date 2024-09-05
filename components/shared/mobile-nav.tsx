import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Separator } from "../ui/separator";
import NavItems from "./nav-items";

export default function MobileNav() {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="align-middle">
          <Image
            src="/assets/icons/menu.svg"
            alt="menu"
            width={24}
            height={24}
            className="h-[24px] w-[24px] cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent className="bg-white">
          <SheetHeader>
            <SheetTitle>
              <Image
                priority
                src="/assets/images/logo.svg"
                alt="eventify logo"
                height={38}
                width={128}
                className="mt-1 h-[38px] w-[128px] object-contain md:mt-0"
              />
            </SheetTitle>
            <Separator />
            <SheetDescription>{/* for accessiblity */}</SheetDescription>
            <NavItems />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
