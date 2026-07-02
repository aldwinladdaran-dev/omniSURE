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
