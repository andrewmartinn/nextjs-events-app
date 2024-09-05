import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="nav-wrapper sm:flex-between flex flex-col items-center gap-2 text-center sm:flex-row">
        <Link href="/">
          <Image
            priority
            src="/assets/images/logo.svg"
            alt="eventify logo"
            height={30}
            width={124}
            className="mt-1 h-[30px] w-[124px] object-contain"
          />
        </Link>
        <p className="text-sm">&copy; Eventify 2024. All Rights Reseved</p>
      </div>
    </footer>
  );
}
