"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSupabaseClient } from "@/lib/supabaseClient";
import Nav from "@/components/Nav";
import Link from "next/link";
export default function Dashboard() {
  const { user } = useUser();
  const supabase = useSupabaseClient();
  const [counts, setCounts] = useState({ prospects: 0, clients: 0, followUps: 0 });
  useEffect(() => {
    if (!user) return;
    (async () => {
      const [p, c, f] = await Promise.all([
        supabase.from("prospects").select("id", { count: "exact", head: true }),
        supabase.from("clients").select("id", { count: "exact", head: true }),
        supabase.from("follow_ups").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      setCounts({ prospects: p.count ?? 0, clients: c.count ?? 0, followUps: f.count ?? 0 });
    })();
  }, [user]);
  return (
    <>
      <Nav />
      <div className="container">
        <h1>Welcome{user ? `, ${user.firstName ?? ""}` : ""}</h1>
        <p className="muted">Here's where things stand today.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:20}}>
          <div className="card"><div className="muted">Prospects</div><h2>{counts.prospects}</h2></div>
          <div className="card"><div className="muted">Clients</div><h2>{counts.clients}</h2></div>
          <div className="card"><div className="muted">Pending Follow-Ups</div><h2>{counts.followUps}</h2></div>
        </div>
        <div className="card" style={{marginTop:20}}>
          <h2>Quick Actions</h2>
          <Link href="/prospects/new" className="btn" style={{marginRight:10}}>+ Add Prospect</Link>
          <Link href="/follow-ups" className="btn btn-secondary">View Follow-Ups</Link>
        </div>
      </div>
    </>
  );
}
