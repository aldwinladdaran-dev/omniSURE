"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSupabaseClient } from "@/lib/supabaseClient";
import Nav from "@/components/Nav";
import { useRouter } from "next/navigation";
export default function NewProspect() {
  const { user } = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", notes: "" });
  const [saving, setSaving] = useState(false);
  async function save() {
    if (!user || !form.full_name) return;
    setSaving(true);
    const { error } = await supabase.from("prospects").insert({ advisor_id: user.id, ...form });
    setSaving(false);
    if (error) { alert(error.message); return; }
    router.push("/prospects");
  }
  return (
    <>
      <Nav />
      <div className="container">
        <h1>Add Prospect</h1>
        <div className="card">
          <label>Full Name</label>
          <input value={form.full_name} onChange={(e) => setForm({...form, full_name: e.target.value})} />
          <label>Phone</label>
          <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
          <label>Email</label>
          <input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
          <label>Notes</label>
          <textarea rows={3} value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} />
          <button className="btn" disabled={saving} onClick={save}>{saving ? "Saving..." : "Save Prospect"}</button>
        </div>
      </div>
    </>
  );
}
EOFmkdir -p "app/clients/[id]" "app/fna/[clientId]" app/follow-ups

cat > "app/clients/[id]/page.tsx" << 'EOF'
"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSupabaseClient } from "@/lib/supabaseClient";
import Nav from "@/components/Nav";
import Link from "next/link";
import { useParams } from "next/navigation";
const CONCEPTS = ["Life Concept","3 Stages of Life","88 Days Concept","Sanjay Tolani Concepts"];
export default function ClientProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const supabase = useSupabaseClient();
  const [client, setClient] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  async function load() {
    const { data } = await supabase.from("clients").select("*").eq("id", id).single();
    setClient(data);
  }
  useEffect(() => { if (user) load(); }, [user, id]);
  async function save(fields: Record<string, any>) {
    setSaving(true);
    await supabase.from("clients").update(fields).eq("id", id);
    setSaving(false);
    setClient({ ...client, ...fields });
  }
  if (!client) return <><Nav /><div className="container"><p className="muted">Loading...</p></div></>;
  return (
    <>
      <Nav />
      <div className="container">
        <h1>{client.full_name}</h1>
        <div className="card">
          <h2>1. Identification</h2>
          <label>Client Type</label>
          <select value={client.client_type} onChange={(e) => save({ client_type: e.target.value })}>
            <option value="individual">Individual</option>
            <option value="couple">Couple</option>
            <option value="family">Family</option>
          </select>
          <label>Profession</label>
          <input defaultValue={client.profession ?? ""} onBlur={(e) => save({ profession: e.target.value })} />
          <label>Annual Income</label>
          <input type="number" defaultValue={client.income ?? ""} onBlur={(e) => save({ income: Number(e.target.value) })} />
          <label>Birthdate</label>
          <input type="date" defaultValue={client.birthdate ?? ""} onBlur={(e) => save({ birthdate: e.target.value })} />
          <label>Dependents</label>
          <input type="number" defaultValue={client.dependents ?? 0} onBlur={(e) => save({ dependents: Number(e.target.value) })} />
        </div>
        <div className="card">
          <h2>2. Financial Needs Analysis</h2>
          <Link href={`/fna/${client.id}`} className="btn btn-secondary">Open FNA Calculator</Link>
        </div>
        <div className="card">
          <h2>3. Concept & Product</h2>
          <label>Selected Concept</label>
          <select value={client.selected_concept ?? ""} onChange={(e) => save({ selected_concept: e.target.value })}>
            <option value="">-- Select --</option>
            {CONCEPTS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <label>Product</label>
          <input defaultValue={client.selected_product ?? ""} onBlur={(e) => save({ selected_product: e.target.value })} placeholder="e.g. VUL, Term, Whole Life" />
          <label>Premium Amount</label>
          <input type="number" defaultValue={client.premium_amount ?? ""} onBlur={(e) => save({ premium_amount: Number(e.target.value) })} />
        </div>
        <div className="card">
          <h2>4. Decision</h2>
          <select value={client.decision_status} onChange={(e) => save({ decision_status: e.target.value })}>
            <option value="undecided">Undecided</option>
            <option value="sign_now">Sign & Pay Now</option>
            <option value="sign_later">Sign & Pay Later</option>
            <option value="declined">Declined</option>
          </select>
        </div>
        {saving && <p className="muted">Saving...</p>}
      </div>
    </>
  );
}
