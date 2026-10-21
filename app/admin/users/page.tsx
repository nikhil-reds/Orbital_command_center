"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Card, Header, Metric } from "../_components";

type User = { id: string; name: string; email: string; role: string; createdAt: string; updatedAt: string };
type ApiResponse = { error?: string; users?: User[] };

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

async function readApiResponse(response: Response): Promise<ApiResponse> {
  const text = await response.text();
  try { return JSON.parse(text) as ApiResponse; }
  catch { return { error: response.status === 401 ? "Your session has expired. Please sign in again." : "The server returned an unexpected response." }; }
}

export default function Page() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadUsers = () => {
    fetch("/api/users", { cache: "no-store" })
      .then(async (response) => {
        const payload = await readApiResponse(response);
        if (response.status === 401) { router.replace("/signin"); return; }
        if (!response.ok) throw new Error(payload.error ?? "Unable to load users");
        setUsers(payload.users ?? []);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  function generatePassword() {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*";
    const random = new Uint32Array(16);
    crypto.getRandomValues(random);
    setPassword(Array.from(random, (value) => characters[value % characters.length]).join(""));
  }

  async function addUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const response = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const payload = await readApiResponse(response);
      if (response.status === 401) { router.replace("/signin"); return; }
      if (!response.ok) throw new Error(payload.error ?? "Unable to add user");
      setModalOpen(false);
      setEmail("");
      setPassword("");
      setLoading(true);
      loadUsers();
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : "Unable to add user");
    } finally {
      setSaving(false);
    }
  }

  return <><Header title="Users" description="Registered accounts in this workspace." action={<button className="admin-button" onClick={() => { setFormError(null); setModalOpen(true); }}>Add user</button>} /><div className="admin-grid metrics"><Metric label="TOTAL USERS" value={String(users.length)} /></div><Card title="User directory">{loading ? <p>Loading users…</p> : error ? <p>{error}</p> : users.length === 0 ? <p>No registered users yet.</p> : <table className="admin-table"><thead><tr><th>USER</th><th>EMAIL</th><th>ROLE</th><th>REGISTERED</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><b>{user.name}</b></td><td>{user.email}</td><td><Badge tone={user.role === "ADMIN" ? "good" : "neutral"}>{user.role}</Badge></td><td>{formatDate(user.createdAt)}</td></tr>)}</tbody></table>}</Card>{modalOpen && <div className="user-modal-backdrop" role="presentation"><form className="user-modal" onSubmit={addUser}><div><h2>Add user</h2><button type="button" className="user-modal-close" onClick={() => setModalOpen(false)} aria-label="Close">×</button></div><p>Create an account with an email and password.</p><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoFocus /></label><label>Password<div className="user-password-field"><input type="text" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /><button type="button" onClick={generatePassword}>Generate random password</button></div></label>{formError && <p className="user-form-error">{formError}</p>}<div className="user-modal-actions"><button type="button" className="admin-button secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="admin-button" disabled={saving}>{saving ? "Saving…" : "Save user"}</button></div></form></div>}</>;
}
