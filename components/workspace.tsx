"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Sparkles,
  Heart,
  Settings,
  Plus,
  ArrowUpRight,
  ArrowRight,
  Check,
  Pencil,
  Trash2,
  X,
  Menu,
  LogOut,
  Download,
  ShieldCheck,
  LoaderCircle,
  MessageSquare,
} from "lucide-react";
import { Brand } from "./brand";
import { Assistant } from "./assistant";
import { authConfigured, browserDB } from "@/lib/supabase";
import {
  emptyWorkspace,
  sampleWorkspace,
  displayDate,
  type WorkspaceData,
  type Person,
  type Reminder,
} from "@/lib/workspace-types";
import { personInput, reminderInput } from "@/lib/validation";
const sections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "people", label: "Your people", icon: Users },
  { id: "reminders", label: "Reminders", icon: CalendarDays },
  { id: "ai-assistant", label: "AI companion", icon: Sparkles },
  { id: "insights", label: "Connection insights", icon: Heart },
  { id: "settings", label: "Settings & privacy", icon: Settings },
];
type Editor =
  | { kind: "person"; value?: Person }
  | { kind: "reminder"; value?: Reminder }
  | {
      kind: "delete";
      table: "relationships" | "reminders" | "ai_generations";
      id: string;
      title: string;
    }
  | { kind: "account" };
export function Workspace({ section }: { section: string }) {
  const params = useSearchParams();
  const demo = params.get("demo") === "1";
  const router = useRouter();
  const [data, setData] = useState<WorkspaceData>(emptyWorkspace);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [menu, setMenu] = useState(false);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [editingError, setEditingError] = useState("");
  const initialized = useRef(false);
  const href = (id: string) =>
    `/dashboard${id === "overview" ? "" : `/${id}`}${demo ? "?demo=1" : ""}`;
  const notify = (message: string) => setToast(message);
  const request = useCallback(
    async (path: string, method = "GET", value?: unknown) => {
      const {
        data: { session },
      } = await browserDB().auth.getSession();
      if (!session)
        throw new Error("Your session has expired. Please sign in again.");
      const res = await fetch(path, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: value ? JSON.stringify(value) : undefined,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    [],
  );
  const refresh = useCallback(async () => {
    const result = await request("/api/workspace");
    setData(result);
  }, [request]);
  useEffect(() => {
    let mounted = true;
    initialized.current = false;
    setLoading(true);
    setError("");
    async function load() {
      try {
        if (demo) {
          const stored = localStorage.getItem("emakings-demo-v1");
          const local = stored ? JSON.parse(stored) : sampleWorkspace();
          if (
            !local ||
            !Array.isArray(local.relationships) ||
            !Array.isArray(local.reminders) ||
            !Array.isArray(local.ai_generations) ||
            !Array.isArray(local.user_preferences)
          )
            throw new Error(
              "The local demo data could not be read. Clear this site’s browser storage and reopen the demo.",
            );
          if (mounted) {
            setData(local);
            setEmail("alex@example.com");
            initialized.current = true;
          }
        } else {
          if (!authConfigured()) {
            router.replace("/login");
            return;
          }
          const {
            data: { user },
            error,
          } = await browserDB().auth.getUser();
          if (error || !user) {
            router.replace("/login");
            return;
          }
          const result = await request("/api/workspace");
          if (mounted) {
            setData(result);
            setEmail(user.email || "");
          }
        }
      } catch (e) {
        if (mounted)
          setError(
            e instanceof Error ? e.message : "Could not load your workspace.",
          );
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, [demo, request, router]);
  useEffect(() => {
    if (!demo || !initialized.current || loading) return;
    try {
      localStorage.setItem("emakings-demo-v1", JSON.stringify(data));
    } catch {
      setError(
        "Browser storage is full or unavailable. Changes cannot be saved on this device.",
      );
    }
  }, [data, demo, loading]);
  useEffect(() => {
    if (!demo && authConfigured()) {
      const {
        data: { subscription },
      } = browserDB().auth.onAuthStateChange((event) => {
        if (event === "SIGNED_OUT") {
          setData(emptyWorkspace);
          router.replace("/login");
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [demo, router]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 5000);
    return () => clearTimeout(timer);
  }, [toast]);
  function openEditor(value: Editor) {
    setEditingError("");
    setEditor(value);
  }
  async function save(
    table: "relationships" | "reminders",
    record: Record<string, unknown>,
    id?: string,
  ) {
    if (demo) {
      const saved = {
        ...record,
        id: id || crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };
      setData(
        (old) =>
          ({
            ...old,
            [table]: id
              ? old[table].map((row) => (row.id === id ? saved : row))
              : [saved, ...old[table]],
          }) as WorkspaceData,
      );
    } else {
      await request("/api/workspace", "POST", { table, record, id });
      await refresh();
    }
    notify(id ? "Changes saved." : "A little thought, safely saved.");
  }
  async function submitEditor(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editor) return;
    setBusy(true);
    setEditingError("");
    const form = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (editor.kind === "person") {
        const record = personInput.parse({
          ...form,
          important_date: form.important_date || null,
        });
        await save("relationships", record, editor.value?.id);
      } else if (editor.kind === "reminder") {
        const record = reminderInput.parse({
          ...form,
          completed: editor.value?.completed || false,
        });
        await save("reminders", record, editor.value?.id);
      } else if (editor.kind === "delete") {
        if (demo)
          setData((old) => ({
            ...old,
            [editor.table]: old[editor.table].filter(
              (row) => row.id !== editor.id,
            ),
          }));
        else {
          await request("/api/workspace", "DELETE", {
            table: editor.table,
            id: editor.id,
          });
          await refresh();
        }
        notify("Item deleted.");
      } else if (editor.kind === "account") {
        if (form.confirmation !== "DELETE")
          throw new Error("Type DELETE to confirm.");
        if (demo) {
          localStorage.removeItem("emakings-demo-v1");
          initialized.current = false;
          router.push("/");
        } else {
          await request("/api/account", "DELETE", form);
          await browserDB().auth.signOut();
          router.push("/");
        }
      }
      setEditor(null);
    } catch (e) {
      setEditingError(
        e instanceof Error && !("issues" in e)
          ? e.message
          : "Please check your fields and enter a valid date and time.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function complete(reminder: Reminder) {
    if (busy) return;
    setBusy(true);
    try {
      await save(
        "reminders",
        {
          title: reminder.title,
          date: reminder.date,
          time: reminder.time,
          description: reminder.description,
          completed: !reminder.completed,
        },
        reminder.id,
      );
    } catch (e) {
      notify(e instanceof Error ? e.message : "Could not update reminder.");
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    if (!demo) await browserDB().auth.signOut();
    router.push("/");
  }
  async function settings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const record = {
      display_name: String(form.get("display_name")).trim(),
      save_generations: form.get("save_generations") === "on",
    };
    try {
      if (!record.display_name) throw new Error("Please enter your name.");
      if (demo) setData((old) => ({ ...old, user_preferences: [record] }));
      else {
        await request("/api/workspace", "POST", {
          table: "user_preferences",
          record,
        });
        await refresh();
      }
      notify("Your preferences are saved.");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Could not save preferences.");
    } finally {
      setBusy(false);
    }
  }
  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "emakings-workspace.json";
    a.click();
    URL.revokeObjectURL(url);
    notify("Workspace exported.");
  }
  function resetDemo() {
    const fresh = sampleWorkspace();
    setData(fresh);
    notify("Demo restored to its sample data.");
  }
  const name = data.user_preferences[0]?.display_name || "there";
  const upcoming = data.reminders
    .filter((r) => !r.completed)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  const occasions = data.relationships
    .filter((p) => p.important_date)
    .sort((a, b) => a.important_date!.localeCompare(b.important_date!));
  if (loading)
    return (
      <main id="main" className="workspace-loading">
        <LoaderCircle size={21} className="spin" />
        Opening your thoughtful space…
      </main>
    );
  return (
    <div className="workspace">
      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <Brand />
        <nav aria-label="Workspace">
          {sections.map(({ id, label, icon: Icon }) => (
            <Link
              key={id}
              className={section === id ? "active" : ""}
              href={href(id)}
              onClick={() => setMenu(false)}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <Link className="button small secondary" href="/#waitlist">
            Make a little room for more <Heart size={12} />
          </Link>
          <p>Your people. Your thoughtful space.</p>
        </div>
      </aside>
      <main id="main" className="workspace-main">
        <header className="workspace-topbar">
          <div>
            <button
              className="workspace-mobile-menu icon-button"
              aria-label="Toggle workspace navigation"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              <Menu size={19} />
            </button>
            <span>
              Your space / {sections.find((s) => s.id === section)?.label}
            </span>
          </div>
          <div>
            <span className="tiny">{demo ? "Sample workspace" : email}</span>
            <span className="user-avatar">{name[0]?.toUpperCase()}</span>
            <button
              className="icon-button"
              onClick={() => void logout()}
              aria-label={demo ? "Leave demo" : "Sign out"}
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>
        {demo && (
          <div className="demo-banner">
            <span>
              <Sparkles size={13} /> <strong>Demo workspace.</strong> Sample
              people and reminders. Changes stay in this browser; no account or
              notifications.
            </span>
            <Link href="/signup">
              Create your own space <ArrowUpRight size={11} />
            </Link>
          </div>
        )}
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}
        {section === "overview" && (
          <>
            <div className="workspace-heading">
              <div>
                <span className="eyebrow">
                  A LITTLE THOUGHT GOES A LONG WAY
                </span>
                <h1>
                  Hello, {name}. <span className="pink-text">✳</span>
                </h1>
                <p>Here’s a little space for the people who matter.</p>
              </div>
              <Link className="button" href={href("ai-assistant")}>
                <Sparkles size={15} />
                Find a little inspiration
              </Link>
            </div>
            <div className="stat-grid">
              {[
                {
                  icon: Users,
                  n: data.relationships.length,
                  label: "People in your circle",
                },
                {
                  icon: CalendarDays,
                  n: upcoming.length,
                  label: "Reminders to look forward to",
                },
                {
                  icon: MessageSquare,
                  n: data.ai_generations.length,
                  label: "Saved AI suggestions",
                },
              ].map(({ icon: Icon, n, label }) => (
                <div className="stat-card" key={label}>
                  <Icon size={24} />
                  <div>
                    <strong>{n}</strong>
                    <span>{label}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="dashboard-grid">
              <section className="workspace-card">
                <div className="card-heading">
                  <h2>Your next thoughtful moments</h2>
                  <Link href={href("reminders")}>
                    View all <ArrowRight size={12} />
                  </Link>
                </div>
                {upcoming.length ? (
                  upcoming.slice(0, 4).map((r) => (
                    <div className="workspace-list-item" key={r.id}>
                      <span className="date-tile">
                        <b>{Number(r.date.split("-")[2])}</b>
                        <small>
                          {new Date(`${r.date}T12:00:00`)
                            .toLocaleDateString("en-US", { month: "short" })
                            .toUpperCase()}
                        </small>
                      </span>
                      <div>
                        <strong>{r.title}</strong>
                        <p>
                          {displayDate(r.date)} · {r.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <SmallEmpty
                    text="Add a reminder for a little moment worth remembering."
                    onClick={() => openEditor({ kind: "reminder" })}
                  />
                )}
              </section>
              <section className="workspace-card quick-card">
                <span className="sparkle-box">
                  <Sparkles size={23} />
                </span>
                <h2>Someone on your mind?</h2>
                <p>
                  The right words. A thoughtful gift. A little moment together.
                  Let’s find something that feels like you.
                </p>
                <Link href={href("ai-assistant")} className="button small">
                  Meet your AI companion <ArrowUpRight size={15} />
                </Link>
              </section>
              <section className="workspace-card">
                <div className="card-heading">
                  <h2>The people who matter</h2>
                  <Link href={href("people")}>
                    Your circle <ArrowRight size={12} />
                  </Link>
                </div>
                {data.relationships.length ? (
                  data.relationships.slice(0, 4).map((p) => (
                    <div className="workspace-list-item" key={p.id}>
                      <span className="user-avatar">{p.name[0]}</span>
                      <div>
                        <strong>{p.name}</strong>
                        <p>
                          {p.interests ||
                            "A little more context goes a long way."}
                        </p>
                      </div>
                      <span className="pill">{p.category}</span>
                    </div>
                  ))
                ) : (
                  <SmallEmpty
                    text="Start your circle with someone you care about."
                    onClick={() => openEditor({ kind: "person" })}
                  />
                )}
              </section>
              <section className="workspace-card">
                <div className="card-heading">
                  <h2>Dates worth keeping close</h2>
                  <CalendarDays size={16} className="muted" />
                </div>
                {occasions.length ? (
                  occasions.slice(0, 4).map((p) => (
                    <div className="workspace-list-item" key={p.id}>
                      <span className="float-icon pink">
                        <Heart size={17} />
                      </span>
                      <div>
                        <strong>
                          {p.name} · {p.occasion || "An important day"}
                        </strong>
                        <p>{displayDate(p.important_date!)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="tiny muted">
                    Add an important date to a person’s profile to see it here.
                  </p>
                )}
              </section>
            </div>
            {data.ai_generations.length > 0 && (
              <History
                data={data}
                onDelete={(id, title) =>
                  openEditor({
                    kind: "delete",
                    id,
                    title,
                    table: "ai_generations",
                  })
                }
              />
            )}
          </>
        )}
        {section === "people" && (
          <>
            <div className="workspace-heading">
              <div>
                <span className="eyebrow">KEEP YOUR PEOPLE CLOSE</span>
                <h1>Your circle, thoughtfully kept.</h1>
                <p>The little details that make them, them.</p>
              </div>
              <button
                className="button"
                onClick={() => openEditor({ kind: "person" })}
              >
                <Plus size={15} />
                Add a person
              </button>
            </div>
            <div className="people-grid">
              {data.relationships.length ? (
                data.relationships.map((p) => (
                  <article className="person-card" key={p.id}>
                    <div className="person-card-head">
                      <span className="person-avatar">{p.name[0]}</span>
                      <div>
                        <button
                          className="icon-button"
                          aria-label={`Edit ${p.name}`}
                          onClick={() =>
                            openEditor({ kind: "person", value: p })
                          }
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="icon-button"
                          aria-label={`Delete ${p.name}`}
                          onClick={() =>
                            openEditor({
                              kind: "delete",
                              table: "relationships",
                              id: p.id,
                              title: p.name,
                            })
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <h2>{p.name}</h2>
                    <span className="pill">{p.category}</span>
                    <p>{p.interests || "No interests added yet."}</p>
                    {p.notes && <p>{p.notes}</p>}
                    {p.important_date && (
                      <div className="person-date">
                        <CalendarDays size={13} />
                        {p.occasion || "Important date"} ·{" "}
                        {displayDate(p.important_date)}
                      </div>
                    )}
                  </article>
                ))
              ) : (
                <Empty
                  icon={<Users size={30} />}
                  title="Every circle starts with someone."
                  text="Add a person, a few favourite things, and a date worth remembering."
                  action="Add your first person"
                  onClick={() => openEditor({ kind: "person" })}
                />
              )}
            </div>
          </>
        )}
        {section === "reminders" && (
          <>
            <div className="workspace-heading">
              <div>
                <span className="eyebrow">THE LITTLE THINGS, REMEMBERED</span>
                <h1>Make time for what matters.</h1>
                <p>
                  Dates and times use your local timezone. Delivery
                  notifications are not configured.
                </p>
              </div>
              <button
                className="button"
                onClick={() => openEditor({ kind: "reminder" })}
              >
                <Plus size={15} />
                New reminder
              </button>
            </div>
            <div className="reminder-list">
              {data.reminders.length ? (
                [...data.reminders]
                  .sort(
                    (a, b) =>
                      Number(a.completed) - Number(b.completed) ||
                      a.date.localeCompare(b.date),
                  )
                  .map((r) => (
                    <article
                      key={r.id}
                      className={`reminder-row ${r.completed ? "completed" : ""}`}
                    >
                      <button
                        className={`checkbox-button ${r.completed ? "checked" : ""}`}
                        aria-label={`${r.completed ? "Reopen" : "Complete"} ${r.title}`}
                        aria-pressed={r.completed}
                        disabled={busy}
                        onClick={() => void complete(r)}
                      >
                        {r.completed && <Check size={14} />}
                      </button>
                      <div>
                        <h2>{r.title}</h2>
                        {r.description && <p>{r.description}</p>}
                      </div>
                      <span className="reminder-time">
                        {displayDate(r.date)} · {r.time}
                      </span>
                      <button
                        className="icon-button"
                        aria-label={`Edit ${r.title}`}
                        onClick={() =>
                          openEditor({ kind: "reminder", value: r })
                        }
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="icon-button"
                        aria-label={`Delete ${r.title}`}
                        onClick={() =>
                          openEditor({
                            kind: "delete",
                            table: "reminders",
                            id: r.id,
                            title: r.title,
                          })
                        }
                      >
                        <Trash2 size={14} />
                      </button>
                    </article>
                  ))
              ) : (
                <Empty
                  icon={<CalendarDays size={30} />}
                  title="Something to look forward to."
                  text="A birthday, a catch-up, a tiny surprise. Make a little room for it here."
                  action="Create a reminder"
                  onClick={() => openEditor({ kind: "reminder" })}
                />
              )}
            </div>
          </>
        )}
        {section === "ai-assistant" && (
          <>
            <div className="workspace-heading">
              <div>
                <span className="eyebrow">YOUR PERSONAL RELATIONSHIP AI</span>
                <h1>A little inspiration, just for you.</h1>
                <p>
                  {demo
                    ? "Template-based sample suggestions. No data is sent to an AI service."
                    : "Only the context entered below is sent to the configured model provider."}
                </p>
              </div>
            </div>
            <Assistant sample={demo} onGenerated={() => void refresh()} />
            <History
              data={data}
              onDelete={(id, title) =>
                openEditor({
                  kind: "delete",
                  id,
                  title,
                  table: "ai_generations",
                })
              }
            />
          </>
        )}
        {section === "insights" && (
          <>
            <div className="workspace-heading">
              <div>
                <span className="eyebrow">SMALL MOMENTS ADD UP</span>
                <h1>A little perspective on your circle.</h1>
                <p>
                  Simple workspace summaries. Advanced AI relationship insights
                  are planned.
                </p>
              </div>
              <span className="pill">Workspace summary</span>
            </div>
            <div className="insights-grid">
              <article>
                <Users size={25} />
                <h2>
                  {data.relationships.length}{" "}
                  {data.relationships.length === 1 ? "person" : "people"}.<br />
                  So many ways to connect.
                </h2>
                <p>
                  Your circle is a place to keep the little details close. Add
                  interests and notes to make your next gesture more personal.
                </p>
                <Link className="text-link" href={href("people")}>
                  Visit your circle <ArrowUpRight size={13} />
                </Link>
              </article>
              <article>
                <CalendarDays size={25} />
                <h2>
                  {upcoming.length} little{" "}
                  {upcoming.length === 1 ? "nudge" : "nudges"}
                  <br />
                  to be thoughtful.
                </h2>
                <p>
                  {upcoming.length
                    ? `Your next saved reminder: ${upcoming[0].title}, on ${displayDate(upcoming[0].date)}.`
                    : "A timely reminder can make all the difference. Start with a date or a simple check-in."}
                </p>
                <Link className="text-link" href={href("reminders")}>
                  See your reminders <ArrowUpRight size={13} />
                </Link>
              </article>
              <article>
                <Heart size={25} />
                <h2>
                  A conversation
                  <br />
                  is a good place to start.
                </h2>
                <p>
                  General suggestion: reach out and ask how someone is doing. No
                  relationship scoring or private conversation analysis is
                  performed.
                </p>
                <Link className="text-link" href={href("ai-assistant")}>
                  Find your words <ArrowUpRight size={13} />
                </Link>
              </article>
            </div>
            <section className="workspace-card history-card">
              <span className="pill">Planned · Advanced personalization</span>
              <h2 style={{ fontSize: 23, marginTop: 20 }}>
                Understanding, with your permission.
              </h2>
              <p style={{ fontSize: 12, marginTop: 15 }}>
                Future insights will explore consent-based context, retrieval of
                preferences, and relevant follow-up suggestions. These
                capabilities are not active today.
              </p>
            </section>
          </>
        )}
        {section === "settings" && (
          <>
            <div className="workspace-heading">
              <div>
                <span className="eyebrow">YOUR SPACE. YOUR CHOICE.</span>
                <h1>Make yourself at home.</h1>
                <p>
                  Manage your account and the information you choose to keep.
                </p>
              </div>
            </div>
            <div className="settings-grid">
              <form
                className="workspace-card settings-form"
                onSubmit={settings}
              >
                <h2>The essentials</h2>
                <p>
                  {demo
                    ? "You’re exploring a browser-local sample workspace."
                    : email}
                </p>
                <label>
                  Your name
                  <input
                    name="display_name"
                    required
                    maxLength={100}
                    defaultValue={name === "there" ? "" : name}
                  />
                </label>
                <label className="toggle-label">
                  Save future AI suggestions
                  <input
                    type="checkbox"
                    name="save_generations"
                    defaultChecked={
                      data.user_preferences[0]?.save_generations !== false
                    }
                  />
                </label>
                <p>
                  When switched off, new AI output is not stored in your
                  workspace. Existing saved suggestions remain until you delete
                  them.
                </p>
                <button disabled={busy} className="button small">
                  Save preferences <Check size={14} />
                </button>
              </form>
              <section className="workspace-card">
                <ShieldCheck
                  size={25}
                  style={{ color: "#b79ad5", marginBottom: 20 }}
                />
                <h2>Your information, in your hands.</h2>
                <p>
                  Download a JSON copy of your loaded workspace records. Remove
                  individual people, reminders, or suggestions from their pages.
                  Workspace lists currently load up to 500 records per category.
                </p>
                <button className="button secondary" onClick={exportData}>
                  <Download size={14} />
                  Export workspace
                </button>
                <p style={{ marginTop: 20 }}>
                  Inputs are sent to your AI provider only when you request live
                  generation. No private messages are connected or automatically
                  read.
                </p>
                <Link href="/privacy" className="text-link">
                  Read our privacy policy <ArrowUpRight size={13} />
                </Link>
              </section>
              {demo && (
                <section className="workspace-card">
                  <h2>A fresh start for the demo.</h2>
                  <p>
                    Restore the original sample profiles and reminders. This
                    replaces only your browser-local demo changes.
                  </p>
                  <button className="button secondary" onClick={resetDemo}>
                    Reset demo data
                  </button>
                </section>
              )}
              <section className="workspace-card danger-zone">
                <h2>
                  {demo ? "Clear this demo workspace." : "Delete your account."}
                </h2>
                <p>
                  {demo
                    ? "Remove the sample data saved in this browser and leave the demo."
                    : "Permanently delete your account and private workspace records. This cannot be undone. Waitlist records are separate; see Contact for removal requests."}
                </p>
                <button
                  className="button danger"
                  onClick={() => openEditor({ kind: "account" })}
                >
                  <Trash2 size={14} />
                  {demo ? "Clear demo data" : "Delete account"}
                </button>
              </section>
            </div>
          </>
        )}
      </main>
      {editor && (
        <EditorModal
          close={() => {
            if (!busy) setEditor(null);
          }}
        >
          <form className="editor-form" onSubmit={submitEditor}>
            <div className="modal-header">
              <h2>
                {editor.kind === "person"
                  ? editor.value
                    ? "A little update."
                    : "Someone who matters."
                  : editor.kind === "reminder"
                    ? editor.value
                      ? "Update this little nudge."
                      : "Remember a little moment."
                    : editor.kind === "delete"
                      ? "Let this one go?"
                      : "A final confirmation."}
              </h2>
              <button
                type="button"
                className="icon-button"
                aria-label="Close dialog"
                disabled={busy}
                onClick={() => setEditor(null)}
              >
                <X size={19} />
              </button>
            </div>
            {editor.kind === "person" && (
              <>
                <label>
                  Name
                  <input
                    name="name"
                    required
                    maxLength={100}
                    defaultValue={editor.value?.name}
                  />
                </label>
                <label>
                  Relationship
                  <select
                    name="category"
                    defaultValue={editor.value?.category || "Partner"}
                  >
                    {["Partner", "Friend", "Family", "Colleague", "Other"].map(
                      (v) => (
                        <option key={v}>{v}</option>
                      ),
                    )}
                  </select>
                </label>
                <label>
                  Interests & preferences
                  <textarea
                    name="interests"
                    maxLength={1000}
                    defaultValue={editor.value?.interests}
                    placeholder="The things that make them, them."
                  />
                </label>
                <div className="form-row">
                  <label>
                    Important date
                    <input
                      type="date"
                      name="important_date"
                      defaultValue={editor.value?.important_date || ""}
                    />
                  </label>
                  <label>
                    What’s the occasion?
                    <input
                      name="occasion"
                      maxLength={100}
                      defaultValue={editor.value?.occasion}
                      placeholder="Birthday, anniversary…"
                    />
                  </label>
                </div>
                <label>
                  A little note
                  <textarea
                    name="notes"
                    maxLength={2000}
                    defaultValue={editor.value?.notes}
                    placeholder="Only information you’re comfortable keeping."
                  />
                </label>
              </>
            )}
            {editor.kind === "reminder" && (
              <>
                <label>
                  What would you like to remember?
                  <input
                    name="title"
                    required
                    maxLength={150}
                    defaultValue={editor.value?.title}
                  />
                </label>
                <div className="form-row">
                  <label>
                    Date
                    <input
                      name="date"
                      type="date"
                      required
                      defaultValue={editor.value?.date}
                    />
                  </label>
                  <label>
                    Time
                    <input
                      name="time"
                      type="time"
                      required
                      defaultValue={editor.value?.time || "09:00"}
                    />
                  </label>
                </div>
                <label>
                  A little more detail
                  <textarea
                    name="description"
                    maxLength={1000}
                    defaultValue={editor.value?.description}
                  />
                </label>
                <p className="tiny muted">
                  Saved in your workspace. Notifications are not configured.
                </p>
              </>
            )}
            {editor.kind === "delete" && (
              <p className="tiny muted">
                Delete “{editor.title}”? This removes the saved record and
                cannot be undone.
              </p>
            )}
            {editor.kind === "account" && (
              <>
                <p className="tiny muted">
                  {demo
                    ? "This will clear sample data from this browser."
                    : "This permanently deletes your account and private workspace data."}
                </p>
                <label style={{ marginTop: 20 }}>
                  Type DELETE to confirm
                  <input
                    name="confirmation"
                    required
                    pattern="DELETE"
                    autoComplete="off"
                  />
                </label>
              </>
            )}
            {editingError && (
              <p className="error" role="alert">
                {editingError}
              </p>
            )}
            <div className="form-actions">
              <button
                type="button"
                className="button secondary small"
                disabled={busy}
                onClick={() => setEditor(null)}
              >
                Cancel
              </button>
              <button
                className={`button small ${["delete", "account"].includes(editor.kind) ? "danger" : ""}`}
                disabled={busy}
              >
                {busy ? (
                  <LoaderCircle size={15} className="spin" />
                ) : editor.kind === "delete" || editor.kind === "account" ? (
                  "Confirm deletion"
                ) : (
                  "Save this little thought"
                )}
              </button>
            </div>
          </form>
        </EditorModal>
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={16} />
          {toast}
          <button
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
function Empty({
  icon,
  title,
  text,
  action,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="empty-state">
      {icon}
      <h2>{title}</h2>
      <p>{text}</p>
      <button className="button small" onClick={onClick}>
        <Plus size={13} />
        {action}
      </button>
    </div>
  );
}
function SmallEmpty({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <div>
      <p className="tiny muted">{text}</p>
      <button
        className="button secondary small"
        style={{ marginTop: 20 }}
        onClick={onClick}
      >
        <Plus size={13} />
        Add a little thought
      </button>
    </div>
  );
}
function History({
  data,
  onDelete,
}: {
  data: WorkspaceData;
  onDelete: (id: string, title: string) => void;
}) {
  return (
    <section className="workspace-card history-card">
      <div className="card-heading">
        <h2>Saved inspiration</h2>
        <Sparkles size={16} />
      </div>
      {data.ai_generations.length ? (
        data.ai_generations.map((g) => (
          <article key={g.id}>
            <div>
              <h3>{g.occasion}</h3>
              <span className="tiny muted">
                {new Date(g.created_at).toLocaleDateString()} · {g.category}
              </span>
              <p>{g.result.message}</p>
              <details>
                <summary className="tiny text-link">
                  Gifts, gesture & follow-up
                </summary>
                {g.result.gifts.map((gift, i) => (
                  <p key={i}>
                    <strong>{gift.title}</strong> — {gift.reason}
                  </p>
                ))}
                <p>{g.result.gesture}</p>
                <p>{g.result.followUp}</p>
              </details>
            </div>
            <button
              className="icon-button"
              aria-label={`Delete suggestion for ${g.occasion}`}
              onClick={() => onDelete(g.id, g.occasion)}
            >
              <Trash2 size={14} />
            </button>
          </article>
        ))
      ) : (
        <p className="no-history muted">
          Your live AI suggestions appear here when history is enabled. Sample
          responses are not saved as AI generations.
        </p>
      )}
    </section>
  );
}
function EditorModal({
  children,
  close,
}: {
  children: React.ReactNode;
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    el?.showModal();
    return () => el?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      aria-label="Edit workspace item"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            close();
        }
      }}
    >
      {children}
    </dialog>
  );
}
