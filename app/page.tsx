import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
export default function Home() {
  const { userId } = auth();
  if (userId) redirect("/dashboard");
  return (
    <div className="container" style={{textAlign:"center",paddingTop:100}}>
      <h1>Omnisure</h1>
      <p className="muted">Your Insurance Advisory Operating System</p>
      <Link href="/sign-in" className="btn">Enter Omnisure</Link>
    </div>
  );
}
