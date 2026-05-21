import { useEffect, useMemo, useState } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const STATUSES = ["new", "contacted", "converted"];
const PRIORITIES = ["High", "Medium", "Low"];

const statusStyles = {
  new: "bg-sand text-ink border-dune",
  contacted: "bg-clay text-ink border-sunset",
  converted: "bg-tide/15 text-ink border-tide"
};

const priorityStyles = {
  High: "bg-sunset/15 text-sunset border-sunset",
  Medium: "bg-clay text-ink border-sunset/40",
  Low: "bg-sand text-ink border-dune",
  Unknown: "bg-white/70 text-mute border-dune"
};

const classNames = (...classes) => classes.filter(Boolean).join(" ");

const getLeadPriority = (lead) => {
  if (lead?.priority && PRIORITIES.includes(lead.priority)) {
    return lead.priority;
  }

  const message = lead?.message || "";
  const match = message.match(/Priority:\s*(High|Medium|Low)/i);

  if (!match) return "Unknown";

  return match[1][0].toUpperCase() + match[1].slice(1).toLowerCase();
};

const PageShell = ({ children }) => (
  <div className="min-h-screen px-4 pb-16 pt-10 md:px-10">
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-tide">Pulse CRM</p>
        <h1 className="section-title text-3xl font-semibold text-ink md:text-4xl">
          Calm control for every lead.
        </h1>
      </div>
      <nav className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-[0.2em] text-mute md:flex">
        <NavLink className="hover:text-ink" to="/">
          Contact
        </NavLink>
        <NavLink className="hover:text-ink" to="/login">
          Admin
        </NavLink>
        <NavLink className="hover:text-ink" to="/dashboard">
          Dashboard
        </NavLink>
      </nav>
    </header>
    <main className="mx-auto mt-10 w-full max-w-6xl">{children}</main>
  </div>
);

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "loading", message: "Submitting your message..." });

    try {
      const response = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("Unable to submit");
      }

      setForm({ name: "", email: "", message: "" });
      setStatus({ type: "success", message: "Thanks! We will reach out shortly." });
    } catch (err) {
      setStatus({ type: "error", message: "Submission failed. Please try again." });
    }
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="glass-card rounded-3xl p-8 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sunset">Lead intake</p>
        <h2 className="section-title mt-3 text-3xl font-semibold text-ink">Start a conversation.</h2>
        <p className="mt-3 text-base text-mute">
          This lightweight CRM keeps new inquiries organized, so you never lose the momentum.
        </p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold text-ink">
              Name
              <input
                className="mt-2 w-full rounded-2xl border border-dune bg-white/70 px-4 py-3 text-base outline-none focus:border-tide"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
            <label className="text-sm font-semibold text-ink">
              Email
              <input
                className="mt-2 w-full rounded-2xl border border-dune bg-white/70 px-4 py-3 text-base outline-none focus:border-tide"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <label className="text-sm font-semibold text-ink">
            Message
            <textarea
              className="mt-2 h-32 w-full rounded-2xl border border-dune bg-white/70 px-4 py-3 text-base outline-none focus:border-tide"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
            />
          </label>
          <button
            className="w-full rounded-2xl bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-cream shadow-glow transition hover:-translate-y-0.5"
            type="submit"
          >
            Submit lead
          </button>
          {status.type !== "idle" && (
            <p
              className={classNames(
                "text-sm font-semibold",
                status.type === "success" ? "text-tide" : "text-sunset"
              )}
            >
              {status.message}
            </p>
          )}
        </form>
      </div>
      <div className="space-y-6">
        <div className="glass-card rounded-3xl p-6 shadow-card">
          <h3 className="section-title text-2xl font-semibold">Live pulse</h3>
          <p className="mt-2 text-sm text-mute">
            Track every inquiry, add context, and move leads through a clear status rhythm.
          </p>
          <div className="mt-6 grid gap-4">
            {[
              { label: "New inquiries", value: "12" },
              { label: "Contacted today", value: "5" },
              { label: "Follow-ups pending", value: "3" }
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border border-dune/70 bg-white/60 px-5 py-4"
              >
                <span className="text-sm font-semibold text-mute">{item.label}</span>
                <span className="text-2xl font-semibold text-ink">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-3xl p-6 shadow-card">
          <h3 className="section-title text-2xl font-semibold">Designed for speed</h3>
          <ul className="mt-4 space-y-3 text-sm text-mute">
            <li>Instant lead capture with source tagging.</li>
            <li>Status updates in one click.</li>
            <li>Notes timeline for every follow-up.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

const LoginPage = ({ onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [setup, setSetup] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (setter) => (event) => {
    const { name, value } = event.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to login");
      }

      onLogin(payload.token);
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.message || "Login failed");
    }
  };

  const handleSetup = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setup)
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to create admin");
      }

      setMessage("Admin created. Login to continue.");
    } catch (err) {
      setMessage(err.message || "Setup failed");
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="glass-card rounded-3xl p-8 shadow-card">
        <h2 className="section-title text-3xl font-semibold">Admin login</h2>
        <p className="mt-2 text-sm text-mute">
          Access the dashboard to manage lead status and add notes.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <label className="text-sm font-semibold text-ink">
            Email
            <input
              className="mt-2 w-full rounded-2xl border border-dune bg-white/70 px-4 py-3 text-base outline-none focus:border-tide"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange(setForm)}
              required
            />
          </label>
          <label className="text-sm font-semibold text-ink">
            Password
            <input
              className="mt-2 w-full rounded-2xl border border-dune bg-white/70 px-4 py-3 text-base outline-none focus:border-tide"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange(setForm)}
              required
            />
          </label>
          <button
            className="w-full rounded-2xl bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-cream"
            type="submit"
          >
            Enter dashboard
          </button>
        </form>
        {message && <p className="mt-4 text-sm font-semibold text-sunset">{message}</p>}
      </div>
      <div className="glass-card rounded-3xl p-8 shadow-card">
        <h3 className="section-title text-2xl font-semibold">First time setup</h3>
        <p className="mt-2 text-sm text-mute">
          Create the initial admin account. This is only allowed once.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSetup}>
          <label className="text-sm font-semibold text-ink">
            Email
            <input
              className="mt-2 w-full rounded-2xl border border-dune bg-white/70 px-4 py-3 text-base outline-none focus:border-tide"
              type="email"
              name="email"
              value={setup.email}
              onChange={handleChange(setSetup)}
              required
            />
          </label>
          <label className="text-sm font-semibold text-ink">
            Password (8+ chars)
            <input
              className="mt-2 w-full rounded-2xl border border-dune bg-white/70 px-4 py-3 text-base outline-none focus:border-tide"
              type="password"
              name="password"
              value={setup.password}
              onChange={handleChange(setSetup)}
              required
            />
          </label>
          <button
            className="w-full rounded-2xl border border-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-ink"
            type="submit"
          >
            Create admin
          </button>
        </form>
      </div>
    </section>
  );
};

const DashboardPage = ({ token, onLogout }) => {
  const [leads, setLeads] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [activePriority, setActivePriority] = useState("High");

  const selectedLead = useMemo(
    () => leads.find((lead) => lead._id === selectedId) || leads[0] || null,
    [leads, selectedId]
  );

  const leadsByPriority = useMemo(() => {
    const buckets = {
      High: [],
      Medium: [],
      Low: [],
      Unknown: []
    };

    leads.forEach((lead) => {
      const priority = getLeadPriority(lead);
      const bucket = buckets[priority] ? priority : "Unknown";
      buckets[bucket].push({ ...lead, priority: bucket });
    });

    return buckets;
  }, [leads]);

  useEffect(() => {
    if (leadsByPriority[activePriority]?.length > 0) return;

    const nextPriority = ["High", "Medium", "Low", "Unknown"].find(
      (priority) => leadsByPriority[priority]?.length > 0
    );

    if (nextPriority && nextPriority !== activePriority) {
      setActivePriority(nextPriority);
    }
  }, [activePriority, leadsByPriority]);

  useEffect(() => {
    const fetchLeads = async () => {
      if (!token) return;
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/api/leads`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || "Unable to load leads");
        }

        setLeads(payload);
        if (payload.length > 0) {
          setSelectedId(payload[0]._id);
        }
      } catch (err) {
        setError(err.message || "Unable to load leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [token]);

  const updateStatus = async (leadId, status) => {
    try {
      const response = await fetch(`${API_URL}/api/leads/${leadId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to update status");
      }

      setLeads((prev) => prev.map((lead) => (lead._id === leadId ? payload : lead)));
    } catch (err) {
      setError(err.message || "Unable to update status");
    }
  };

  const addNote = async () => {
    if (!noteBody.trim() || !selectedLead) return;

    try {
      const response = await fetch(`${API_URL}/api/leads/${selectedLead._id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ body: noteBody.trim() })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to add note");
      }

      setLeads((prev) => prev.map((lead) => (lead._id === payload._id ? payload : lead)));
      setNoteBody("");
    } catch (err) {
      setError(err.message || "Unable to add note");
    }
  };

  if (!token) {
    return (
      <div className="glass-card rounded-3xl p-8 shadow-card">
        <h2 className="section-title text-2xl font-semibold">Dashboard locked</h2>
        <p className="mt-2 text-sm text-mute">
          Please login to view and manage leads.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="section-title text-3xl font-semibold">Lead dashboard</h2>
          <p className="text-sm text-mute">Keep your pipeline calm, clear, and current.</p>
        </div>
        <button
          className="rounded-full border border-ink px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-ink"
          onClick={onLogout}
          type="button"
        >
          Sign out
        </button>
      </div>
      {error && <p className="text-sm font-semibold text-sunset">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="section-title text-2xl font-semibold">Active leads</h3>
              <p className="text-sm text-mute">Grouped by urgency for faster triage.</p>
            </div>
            <span className="rounded-full border border-dune px-3 py-1 text-xs font-semibold text-mute">
              {leads.length} total
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRIORITIES.map((priority) => (
              <button
                key={priority}
                className={classNames(
                  "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition",
                  activePriority === priority
                    ? "border-ink bg-ink text-cream"
                    : "border-dune bg-white/70 text-mute hover:border-tide"
                )}
                onClick={() => setActivePriority(priority)}
                type="button"
              >
                {priority} ({leadsByPriority[priority].length})
              </button>
            ))}
            {leadsByPriority.Unknown.length > 0 && (
              <button
                className={classNames(
                  "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition",
                  activePriority === "Unknown"
                    ? "border-ink bg-ink text-cream"
                    : "border-dune bg-white/70 text-mute hover:border-tide"
                )}
                onClick={() => setActivePriority("Unknown")}
                type="button"
              >
                Unknown ({leadsByPriority.Unknown.length})
              </button>
            )}
          </div>
          {loading && <p className="text-sm text-mute">Loading leads...</p>}
          {!loading && leads.length === 0 && (
            <p className="text-sm text-mute">No leads yet. Submit a new inquiry.</p>
          )}
          <div className="glass-card rounded-3xl p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-mute">
                {activePriority} priority
              </h4>
              <span
                className={classNames(
                  "rounded-full border px-3 py-1 text-xs font-semibold",
                  priorityStyles[activePriority] || priorityStyles.Unknown
                )}
              >
                {leadsByPriority[activePriority]?.length || 0}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {leadsByPriority[activePriority]?.length === 0 && !loading && (
                <p className="text-xs text-mute">No {activePriority.toLowerCase()} priority leads.</p>
              )}
              {(leadsByPriority[activePriority] || []).map((lead) => (
                <button
                  key={lead._id}
                  className={classNames(
                    "w-full rounded-2xl border px-4 py-3 text-left transition",
                    selectedLead?._id === lead._id
                      ? "border-tide bg-tide/10"
                      : "border-dune bg-white/60 hover:border-tide/60"
                  )}
                  onClick={() => setSelectedId(lead._id)}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{lead.name}</p>
                      <p className="text-xs text-mute">{lead.email}</p>
                    </div>
                    <span
                      className={classNames(
                        "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase",
                        statusStyles[lead.status]
                      )}
                    >
                      {lead.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-mute">{lead.message}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="glass-card rounded-3xl p-6 shadow-card">
          {selectedLead ? (
            <div className="space-y-4">
              <div>
                <h3 className="section-title text-2xl font-semibold">Lead detail</h3>
                <p className="text-sm text-mute">{selectedLead.email}</p>
              </div>
              <div className="rounded-2xl border border-dune bg-white/60 p-4">
                <p className="text-sm text-ink">{selectedLead.message}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mute">Status</span>
                <select
                  className="rounded-full border border-dune bg-white/80 px-4 py-2 text-xs font-semibold uppercase"
                  onChange={(event) => updateStatus(selectedLead._id, event.target.value)}
                  value={selectedLead.status}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-mute">Notes</h4>
                <div className="mt-3 space-y-3">
                  {(selectedLead.notes || []).length === 0 && (
                    <p className="text-xs text-mute">No notes yet.</p>
                  )}
                  {(selectedLead.notes || []).map((note) => (
                    <div key={note._id || note.createdAt} className="rounded-2xl border border-dune bg-white/60 p-3">
                      <p className="text-xs text-ink">{note.body}</p>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-mute">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <textarea
                  className="h-24 w-full rounded-2xl border border-dune bg-white/80 px-4 py-3 text-sm outline-none focus:border-tide"
                  placeholder="Add a note for this lead..."
                  value={noteBody}
                  onChange={(event) => setNoteBody(event.target.value)}
                />
                <button
                  className="w-full rounded-2xl bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-cream"
                  onClick={addNote}
                  type="button"
                >
                  Save note
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="section-title text-2xl font-semibold">No lead selected</h3>
              <p className="mt-2 text-sm text-mute">Select a lead to view details.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("crm_token") || "");

  const handleLogin = (nextToken) => {
    localStorage.setItem("crm_token", nextToken);
    setToken(nextToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("crm_token");
    setToken("");
  };

  return (
    <PageShell>
      <Routes>
        <Route path="/" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<DashboardPage token={token} onLogout={handleLogout} />} />
      </Routes>
    </PageShell>
  );
}

export default App;
