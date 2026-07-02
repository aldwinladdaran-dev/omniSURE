import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
export default function Nav() {
  return (
    <div className="nav">
      <div>
        <Link href="/dashboard"><strong>Omnisure</strong></Link>
        <Link href="/prospects">Prospects</Link>
        <Link href="/follow-ups">Follow-Ups</Link>
      </div>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
