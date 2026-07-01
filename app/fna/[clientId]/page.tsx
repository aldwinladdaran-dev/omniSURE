"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSupabaseClient } from "@/lib/supabaseClient";
import Nav from "@/components/Nav";
import { useParams, useRouter } from "next/navigation";
export default function FnaCalculator() {
  const { clientId } = useParams<{ clientId: string }>();
  const { user } = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [form, setForm] = useState({ annual_income:0, monthly_expenses:0, existing_coverage:0, outstanding_debt:0, dependents:0, years_to_protect:10 });
  const [saving, setSaving] = useState(false);
  const coverageGap = Math.max(0, form.monthly_expenses * 12 * form.years_to_protect + form.outstanding_debt - form.existing_coverage);
  function update(field: string, value: number) { setForm({ ...form, [field]: value }); }
  async function save() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("fna_records").insert({ advisor_id: user.id, client_id: clientId, ...form, coverage_gap: coverageGap });
    setSaving(false);
    if (error) { alert(error.message); return; }
    router.push(`/clients/${clientId}`);
  }
  return (
    <>
      <Nav />
      <div className="container">
        <h1>FNA Calculator</h1>
        <div className="card">
          <label>Annual Income</label>
          <input type="number" value={form.annual_income} onChange={(e) => update("annual_income", Number(e.target.value))} />
          <label>Monthly Expenses</label>
          <input type="number" value={form.monthly_expenses} onChange={(e) => update("monthly_expenses", Number(e.target.value))} />
          <label>Existing Coverage</label>
          <input type="number" value={form.existing_coverage} onChange={(e) => update("existing_coverage", Number(e.target.value))} />
          <label>Outstanding Debt</label>
          <input type="number" value={form.outstanding_debt} onChange={(e) => update("outstanding_debt", Number(e.target.value))} />
          <label>Dependents</label>
          <input type="number" value={form.dependents} onChange={(e) => update("dependents", Number(e.target.value))} />
          <label>Years to Protect</label>
          <input type="number" value={form.years_to_protect} onChange={(e) => update("years_to_protect", Number(e.target.value))} />
        </div>
        <div className="card" style={{background:"#eef2ff"}}>
          <div className="muted">Estimated Coverage Gap</div>
          <h1>₱{coverageGap.toLocaleString()}</h1>
        </div>
        <button className="btn" disabled={saving} onClick={save}>{saving ? "Saving..." : "Save FNA & Return to Client"}</button>
      </div>
    </>
  );
}
