"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSupabaseClient } from "@/lib/supabaseClient";
import Nav from "@/components/Nav";
export default function FollowUps() {
  const { user } = useUser();
  const supabase = useSupabaseClient();
  const [items, setItems] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [form, setForm] = useState({ client_id:"", scheduled_date:"", contact_method:"call", notes:"" });
  async function load() {
    const { data: f } = await supabase.from("follow_ups").select("*, clients(full_name)").order("scheduled_date", { ascending: true });
    setItems(f ?? []);
    const { data: c } = await supabase.from("clients").select("id, full_name");
    setClients(c ?? []);
  }
  useEffect(() => { if (user) load(); }, [user]);
  async function addFollowUp() {
    if (!user || !form.client_id || !form.scheduled_date) return;
    await supabase.from("follow_ups").insert({ advisor_id: user.id, ...form });
    setForm({ client_id:"", scheduled_date:"", contact_method:"call", notes:"" });
    load();
  }
  async function markComplete(id: string) {
    await supabase.from("follow_ups").update({ status: "completed" }).eq("id", id);
    load();
  }
  return (
    <>
      <Nav />
      <div className="container">
        <h1>Follow-Up Tracker</h1>
        <div className="card">
          <h2>Schedule</h2>
          <label>Client</label>
          <select value={form.client_id} onChange={(e) => setForm({...form, client_id: e.target.value})}>
            <option value="">-- Select client --</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
          </select>
          <label>Date</label>
          <input type="date" value={form.scheduled_date} onChange={(e) => setForm({...form, scheduled_date: e.target.value})} />
          <label>Contact Method</label>
          <select value={form.contact_method} onChange={(e) => setForm({...form, contact_method: e.target.value})}>
            <option value="call">Call</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
            <option value="in_person">In Person</option>
          </select>
          <label>Notes</label>
          <textarea rows={2} value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} />
          <button className="btn" onClick={addFollowUp}>Schedule Follow-Up</button>
        </div>
        <div className="card">
          <h2>All Follow-Ups</h2>
          {items.length === 0 && <p className="muted">No follow-ups yet.</p>}
          {items.map((f) => (
            <div className="list-row" key={f.id}>
              <div>
                <strong>{f.clients?.full_name ?? "Unknown"}</strong>
                <div className="muted">{f.scheduled_date} · {f.contact_method}</div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <span className="badge">{f.status}</span>
                {f.status === "pending" && <button className="btn btn-secondary" onClick={() => markComplete(f.id)}>Done</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
