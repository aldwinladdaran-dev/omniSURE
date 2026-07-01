import { SignUp } from "@clerk/nextjs";
export default function Page() {
  return <div style={{display:"flex",justifyContent:"center",paddingTop:60}}><SignUp /></div>;
}
EOFcat > components/Nav.tsx << 'EOF'
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
EOFcat > lib/supabaseClient.ts << 'EOF'
import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
export function useSupabaseClient() {
  const { session } = useSession();
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          const token = await session?.getToken();
          const headers = new Headers(options?.headers);
          if (token) headers.set("Authorization", `Bearer ${token}`);
          return fetch(url, { ...options, headers });
        },
      },
    }
  );
}
EOFmkdir -p app/dashboard
cat > app/dashboard/page.tsx << 'EOF'
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
EOFmkdir -p app/prospects/new
cat > app/prospects/page.tsx << 'EOF'
"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSupabaseClient } from "@/lib/supabaseClient";
import Nav from "@/components/Nav";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Prospects() {
  const { user } = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [prospects, setProspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  async function load() {
    const { data } = await supabase.from("prospects").select("*").order("created_at", { ascending: false });
    setProspects(data ?? []); setLoading(false);
  }
  useEffect(() => { if (user) load(); }, [user]);
  async function convertToClient(p: any) {
    if (!user) return;
    const { data: client, error } = await supabase.from("clients").insert({ advisor_id: user.id, prospect_id: p.id, full_name: p.full_name, phone: p.phone, email: p.email }).select().single();
    if (error) { alert("Error: " + error.message); return; }
    await supabase.from("prospects").update({ status: "converted" }).eq("id", p.id);
    router.push(`/clients/${client.id}`);
  }
  return (
    <>
      <Nav />
      <div className="container">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h1>Prospects</h1>
          <Link href="/prospects/new" className="btn">+ Add Prospect</Link>
        </div>
        <div className="card">
          {loading && <p className="muted">Loading...</p>}
          {!loading && prospects.length === 0 && <p className="muted">No prospects yet.</p>}
          {prospects.map((p) => (
            <div className="list-row" key={p.id}>
              <div><strong>{p.full_name}</strong><div className="muted">{p.phone || p.email || "No contact info"}</div></div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span className="badge">{p.status}</span>
                {p.status !== "converted" && <button className="btn btn-secondary" onClick={() => convertToClient(p)}>Convert to Client</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
