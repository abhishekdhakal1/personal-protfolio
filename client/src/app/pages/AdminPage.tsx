import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, User, FolderKanban, Wrench, Briefcase,
  MessageSquare, LogOut, Menu, X, Plus, Pencil, Trash2,
  CheckCircle, Star, Search, Upload, Eye, EyeOff,
  ChevronLeft, ChevronRight, AlertCircle, Save
} from "lucide-react";
import { apiClient } from "@/utils/api";
import { ThemeToggle } from "../components/theme-toggle";

// ── Types ──────────────────────────────────────────────────
interface Project {
  _id: string; title: string; description: string; category: string;
  tags: string[]; githubUrl?: string; demoUrl?: string;
  imageUrl?: string; featured: boolean; status: string;
}
interface Skill {
  _id: string; name: string; category: string; level: number;
  icon: string; description?: string; visible: boolean;
}
interface Experience {
  _id: string; role: string; company: string; location?: string;
  type: string; startDate: string; endDate?: string;
  current: boolean; description: string; skills: string[];
}
interface Message {
  _id: string; name: string; email: string; subject?: string;
  message: string; read: boolean; important: boolean; createdAt: string;
}
interface Profile {
  name: string; bio: string; title: string; email: string;
  phone: string; location: string; profileImage: string;
  socialLinks: { github?: string; linkedin?: string; twitter?: string };
  stats: { projectsCompleted: number; technicalSkills: number; yearsExperience: number; hoursOfCode: number };
}

// ── Helpers ────────────────────────────────────────────────
const API_BASE = (import.meta.env.VITE_API_URL?.replace("/api", "") ?? "http://localhost:5000");

function isAdminAuthenticated() {
  const token = localStorage.getItem("admin_token");
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp > Date.now() / 1000;
  } catch { return false; }
}

// ── Input component ─────────────────────────────────────────
const inputClass = "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition";

// ── Sidebar nav items ────────────────────────────────────────
const NAV_ITEMS = [
  { id: "overview",    label: "Overview",    icon: LayoutDashboard },
  { id: "profile",     label: "Profile",     icon: User },
  { id: "projects",    label: "Projects",    icon: FolderKanban },
  { id: "skills",      label: "Skills",      icon: Wrench },
  { id: "experience",  label: "Experience",  icon: Briefcase },
  { id: "messages",    label: "Messages",    icon: MessageSquare },
];

// ═══════════════════════════════════════════════════════════
// OVERVIEW
// ═══════════════════════════════════════════════════════════
function Overview({ stats }: { stats: { projects: number; skills: number; messages: number; unread: number } }) {
  const cards = [
    { label: "Projects", value: stats.projects, icon: FolderKanban, color: "text-blue-500" },
    { label: "Skills", value: stats.skills, icon: Wrench, color: "text-violet-500" },
    { label: "Messages", value: stats.messages, icon: MessageSquare, color: "text-green-500" },
    { label: "Unread", value: stats.unread, icon: MessageSquare, color: "text-amber-500" },
  ];
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-6">Dashboard Overview</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="p-5 rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon size={18} className={c.color} />
            </div>
            <div className="text-3xl font-bold text-foreground">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PROFILE EDITOR
// ═══════════════════════════════════════════════════════════
function ProfileEditor() {
  const [profile, setProfile] = useState<Profile>({
    name: "", bio: "", title: "", email: "", phone: "",
    location: "", profileImage: "",
    socialLinks: { github: "", linkedin: "", twitter: "" },
    stats: { projectsCompleted: 0, technicalSkills: 0, yearsExperience: 0, hoursOfCode: 0 },
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    apiClient.get("/profile").then((r) => setProfile(r.data.profile ?? profile)).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true); setMsg(null);
    try {
      const fd = new FormData();
      Object.entries(profile).forEach(([k, v]) => {
        if (k === "socialLinks" || k === "stats") fd.append(k, JSON.stringify(v));
        else if (k !== "profileImage") fd.append(k, String(v));
      });
      if (imageFile) fd.append("profileImage", imageFile);
      const res = await apiClient.put("/profile", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setProfile(res.data.profile);
      setMsg({ type: "success", text: "Profile saved successfully!" });
    } catch { setMsg({ type: "error", text: "Failed to save profile." }); }
    finally { setSaving(false); }
  };

  const imgSrc = imageFile
    ? URL.createObjectURL(imageFile)
    : profile.profileImage
      ? (profile.profileImage.startsWith("http") ? profile.profileImage : `${API_BASE}${profile.profileImage}`)
      : null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-6">Edit Profile</h2>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Image upload */}
        <div className="lg:col-span-1">
          <div className="p-5 rounded-2xl border border-border bg-card">
            <div className="relative w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden bg-secondary">
              {imgSrc ? <img src={imgSrc} alt="Profile" className="w-full h-full object-cover" /> : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-border">
                  {profile.name?.[0] ?? "?"}
                </div>
              )}
            </div>
            <label className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer">
              <Upload size={16} />
              Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>
        </div>

        {/* Fields */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Basic Info</h3>
            {[
              { label: "Full Name", key: "name", type: "text" },
              { label: "Title / Role", key: "title", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Phone", key: "phone", type: "text" },
              { label: "Location", key: "location", type: "text" },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
                <input
                  type={type}
                  value={(profile as any)[key] ?? ""}
                  onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                  className={inputClass}
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Bio</label>
              <textarea
                rows={4}
                value={profile.bio ?? ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Social Links</h3>
            {["github", "linkedin", "twitter"].map((soc) => (
              <div key={soc}>
                <label className="block text-xs font-medium text-muted-foreground mb-1 capitalize">{soc}</label>
                <input
                  type="url"
                  value={(profile.socialLinks as any)[soc] ?? ""}
                  onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, [soc]: e.target.value } })}
                  placeholder={`https://${soc}.com/username`}
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Projects Completed", key: "projectsCompleted" },
                { label: "Technical Skills", key: "technicalSkills" },
                { label: "Years Experience", key: "yearsExperience" },
                { label: "Hours of Code", key: "hoursOfCode" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
                  <input
                    type="number"
                    value={(profile.stats as any)[key] ?? 0}
                    onChange={(e) => setProfile({ ...profile, stats: { ...profile.stats, [key]: Number(e.target.value) } })}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>

          {msg && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
              msg.type === "success" ? "bg-success/10 border border-success/20 text-success" : "bg-destructive/10 border border-destructive/20 text-destructive"
            }`}>
              {msg.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {msg.text}
            </div>
          )}

          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-60"
          >
            {saving ? <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" /> : <Save size={16} />}
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PROJECTS MANAGER
// ═══════════════════════════════════════════════════════════
const EMPTY_PROJECT: Omit<Project, "_id"> = {
  title: "", description: "", category: "Web", tags: [],
  githubUrl: "", demoUrl: "", featured: false, status: "Completed",
};

function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => { load(); }, []);

  const load = () =>
    apiClient.get("/projects?limit=100").then((r) => setProjects(r.data.projects)).catch(() => {});

  const openNew = () => { setEditing({ ...EMPTY_PROJECT }); setIsNew(true); setMsg(null); };
  const openEdit = (p: Project) => { setEditing({ ...p }); setIsNew(false); setMsg(null); };
  const closeEdit = () => { setEditing(null); setImageFile(null); };

  const save = async () => {
    if (!editing?.title) { setMsg("Title is required."); return; }
    setSaving(true); setMsg(null);
    try {
      const fd = new FormData();
      const tags = Array.isArray(editing.tags) ? editing.tags : (editing.tags as any as string).split(",").map((t: string) => t.trim()).filter(Boolean);
      Object.entries({ ...editing, tags: JSON.stringify(tags) }).forEach(([k, v]) => {
        if (k !== "_id" && k !== "imageUrl") fd.append(k, String(v ?? ""));
      });
      if (imageFile) fd.append("image", imageFile);

      if (isNew) await apiClient.post("/projects", fd, { headers: { "Content-Type": "multipart/form-data" } });
      else await apiClient.put(`/projects/${editing._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });

      await load(); closeEdit();
    } catch { setMsg("Failed to save project."); }
    finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await apiClient.delete(`/projects/${id}`).catch(() => {});
    load();
  };

  if (editing) {
    const tagsValue = Array.isArray(editing.tags) ? editing.tags.join(", ") : (editing.tags ?? "");
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={closeEdit} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-xl font-semibold text-foreground">{isNew ? "New Project" : "Edit Project"}</h2>
        </div>
        <div className="max-w-2xl space-y-4">
          {[
            { label: "Title *", key: "title", type: "text" },
            { label: "GitHub URL", key: "githubUrl", type: "url" },
            { label: "Demo URL", key: "demoUrl", type: "url" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
              <input type={type} value={(editing as any)[key] ?? ""} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} className={inputClass} />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Description *</label>
            <textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={`${inputClass} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
              <select value={editing.category ?? "Web"} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={inputClass}>
                {["Web", "Embedded", "IoT", "VLSI", "AI", "Other"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
              <select value={editing.status ?? "Completed"} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className={inputClass}>
                {["Completed", "In Progress", "Planning"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Tags (comma-separated)</label>
            <input type="text" value={tagsValue} onChange={(e) => setEditing({ ...editing, tags: e.target.value as any })} placeholder="React, Node.js, MongoDB" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Project Image</label>
            <label className="flex items-center gap-2 w-full py-2 px-3 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer">
              <Upload size={16} />
              {imageFile ? imageFile.name : "Choose image…"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input type="checkbox" checked={editing.featured ?? false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="rounded" />
            Featured project
          </label>
          {msg && <p className="text-sm text-destructive">{msg}</p>}
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-60">
              {saving ? <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" /> : <Save size={16} />}
              Save
            </button>
            <button onClick={closeEdit} className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Projects</h2>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus size={16} /> Add Project
        </button>
      </div>
      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p._id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              {p.featured && <Star size={14} className="text-amber-500 shrink-0" />}
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.category} · {p.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"><Pencil size={15} /></button>
              <button onClick={() => remove(p._id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="text-center text-sm text-muted-foreground py-12">No projects yet. Add your first one.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SKILLS MANAGER
// ═══════════════════════════════════════════════════════════
const EMPTY_SKILL: Omit<Skill, "_id"> = {
  name: "", category: "Web Development", level: 80, icon: "Code", visible: true
};

function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Partial<Skill> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => { load(); }, []);
  const load = () => apiClient.get("/skills").then((r) => setSkills(r.data.allSkills ?? [])).catch(() => {});
  const openNew = () => { setEditing({ ...EMPTY_SKILL }); setIsNew(true); setMsg(null); };
  const closeEdit = () => { setEditing(null); };

  const save = async () => {
    if (!editing?.name) { setMsg("Name is required."); return; }
    setSaving(true); setMsg(null);
    try {
      if (isNew) await apiClient.post("/skills", editing);
      else await apiClient.put(`/skills/${editing._id}`, editing);
      await load(); closeEdit();
    } catch { setMsg("Failed to save skill."); }
    finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    await apiClient.delete(`/skills/${id}`).catch(() => {});
    load();
  };

  const CATEGORIES = ["Web Development", "Embedded Systems", "VLSI & FPGA", "AI & ML", "IoT & Networks", "Cloud & DevOps"];

  if (editing) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={closeEdit} className="p-2 rounded-lg hover:bg-secondary transition-colors"><ChevronLeft size={18} /></button>
          <h2 className="text-xl font-semibold text-foreground">{isNew ? "New Skill" : "Edit Skill"}</h2>
        </div>
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Name *</label>
            <input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
            <select value={editing.category ?? "Web Development"} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={inputClass}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Level: {editing.level ?? 80}%</label>
            <input type="range" min={1} max={100} value={editing.level ?? 80} onChange={(e) => setEditing({ ...editing, level: Number(e.target.value) })} className="w-full accent-primary" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
            <textarea rows={2} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={`${inputClass} resize-none`} />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={editing.visible ?? true} onChange={(e) => setEditing({ ...editing, visible: e.target.checked })} />
            Visible on portfolio
          </label>
          {msg && <p className="text-sm text-destructive">{msg}</p>}
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-60">
              {saving ? <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" /> : <Save size={16} />}
              Save
            </button>
            <button onClick={closeEdit} className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Skills</h2>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus size={16} /> Add Skill
        </button>
      </div>
      <div className="space-y-3">
        {skills.map((s) => (
          <div key={s._id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              {!s.visible && <EyeOff size={14} className="text-muted-foreground shrink-0" />}
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.category} · {s.level}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              <button onClick={() => { setEditing({ ...s }); setIsNew(false); setMsg(null); }} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"><Pencil size={15} /></button>
              <button onClick={() => remove(s._id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {skills.length === 0 && <p className="text-center text-sm text-muted-foreground py-12">No skills yet.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EXPERIENCE MANAGER
// ═══════════════════════════════════════════════════════════
const EMPTY_EXP: Omit<Experience, "_id"> = {
  role: "", company: "", location: "", type: "Full-time",
  startDate: "", current: false, description: "", skills: [],
};

function ExperienceManager() {
  const [items, setItems] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => { load(); }, []);
  const load = () => apiClient.get("/experience").then((r) => setItems(r.data.experiences ?? r.data)).catch(() => {});
  const openNew = () => { setEditing({ ...EMPTY_EXP }); setIsNew(true); setMsg(null); };
  const closeEdit = () => setEditing(null);

  const save = async () => {
    if (!editing?.role || !editing?.company) { setMsg("Role and company are required."); return; }
    setSaving(true); setMsg(null);
    try {
      const skillsArr = Array.isArray(editing.skills)
        ? editing.skills
        : (editing.skills as any as string).split(",").map((s: string) => s.trim()).filter(Boolean);
      const data = { ...editing, skills: skillsArr };
      if (isNew) await apiClient.post("/experience", data);
      else await apiClient.put(`/experience/${editing._id}`, data);
      await load(); closeEdit();
    } catch { setMsg("Failed to save."); }
    finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    await apiClient.delete(`/experience/${id}`).catch(() => {});
    load();
  };

  if (editing) {
    const skillsValue = Array.isArray(editing.skills) ? editing.skills.join(", ") : (editing.skills ?? "");
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={closeEdit} className="p-2 rounded-lg hover:bg-secondary transition-colors"><ChevronLeft size={18} /></button>
          <h2 className="text-xl font-semibold text-foreground">{isNew ? "New Experience" : "Edit Experience"}</h2>
        </div>
        <div className="max-w-2xl space-y-4">
          {[
            { label: "Role / Position *", key: "role" },
            { label: "Company *", key: "company" },
            { label: "Location", key: "location" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
              <input value={(editing as any)[key] ?? ""} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} className={inputClass} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
              <select value={editing.type ?? "Full-time"} onChange={(e) => setEditing({ ...editing, type: e.target.value })} className={inputClass}>
                {["Full-time", "Part-time", "Internship", "Freelance", "Contract"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Start Date</label>
              <input type="date" value={editing.startDate?.split("T")[0] ?? ""} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} className={inputClass} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={editing.current ?? false} onChange={(e) => setEditing({ ...editing, current: e.target.checked })} />
            Currently working here
          </label>
          {!editing.current && (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">End Date</label>
              <input type="date" value={editing.endDate?.split("T")[0] ?? ""} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} className={inputClass} />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
            <textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Skills Used (comma-separated)</label>
            <input value={skillsValue} onChange={(e) => setEditing({ ...editing, skills: e.target.value as any })} placeholder="React, Node.js, AWS" className={inputClass} />
          </div>
          {msg && <p className="text-sm text-destructive">{msg}</p>}
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-60">
              {saving ? <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" /> : <Save size={16} />}
              Save
            </button>
            <button onClick={closeEdit} className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Experience</h2>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus size={16} /> Add Experience
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
            <div className="min-w-0">
              <p className="font-medium text-foreground text-sm">{item.role}</p>
              <p className="text-xs text-muted-foreground">{item.company} · {item.type} {item.current ? "· Current" : ""}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              <button onClick={() => { setEditing({ ...item }); setIsNew(false); setMsg(null); }} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"><Pencil size={15} /></button>
              <button onClick={() => remove(item._id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-sm text-muted-foreground py-12">No experience entries yet.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MESSAGES MANAGER
// ═══════════════════════════════════════════════════════════
function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const params: Record<string, any> = { page, limit: 15 };
    if (filter === "unread") params.read = "false";
    if (search) params.search = search;
    apiClient.get("/messages", { params })
      .then((r) => { setMessages(r.data.messages); setTotalPages(r.data.pagination.pages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, filter, search]);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id: string) => {
    await apiClient.put(`/messages/${id}`, { read: true }).catch(() => {});
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete message?")) return;
    await apiClient.delete(`/messages/${id}`).catch(() => {});
    if (selected?._id === id) setSelected(null);
    load();
  };

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ChevronLeft size={16} /> Back to messages
        </button>
        <div className="max-w-2xl p-6 rounded-2xl border border-border bg-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">{selected.name}</h3>
              <p className="text-sm text-muted-foreground">{selected.email}</p>
            </div>
            <div className="flex gap-2">
              {!selected.read && (
                <button onClick={() => markRead(selected._id)} className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-secondary transition-colors">
                  Mark Read
                </button>
              )}
              <button onClick={() => remove(selected._id)} className="px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive text-xs font-medium hover:bg-destructive/10 transition-colors">
                Delete
              </button>
            </div>
          </div>
          {selected.subject && <p className="text-sm font-medium text-foreground mb-3">Re: {selected.subject}</p>}
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{selected.message}</p>
          <p className="text-xs text-muted-foreground mt-4">{new Date(selected.createdAt).toLocaleString()}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-6">Messages</h2>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className={`${inputClass} pl-9`} />
        </div>
        <div className="flex gap-2">
          {(["all", "unread"] as const).map((f) => (
            <button key={f} onClick={() => { setFilter(f); setPage(1); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filter === f ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-secondary animate-pulse" />)}</div>
      ) : messages.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">No messages found.</p>
      ) : (
        <div className="space-y-2">
          {messages.map((m) => (
            <div
              key={m._id}
              onClick={() => { setSelected(m); if (!m.read) markRead(m._id); }}
              className={`flex items-start justify-between p-4 rounded-xl border bg-card cursor-pointer hover:border-primary/30 transition-colors ${!m.read ? "border-primary/40 bg-accent/30" : "border-border"}`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {!m.read && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                  <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                </div>
                <p className="text-xs text-muted-foreground truncate">{m.subject ?? m.message.slice(0, 60)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleDateString()}</span>
                <button onClick={(e) => { e.stopPropagation(); remove(m._id); }} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-40 transition-colors"><ChevronLeft size={16} /></button>
          <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-40 transition-colors"><ChevronRight size={16} /></button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN ADMIN PAGE
// ═══════════════════════════════════════════════════════════
export function AdminPage() {
  const navigate = useNavigate();
  const [section, setSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ projects: 0, skills: 0, messages: 0, unread: 0 });
  const [unreadBadge, setUnreadBadge] = useState(0);

  useEffect(() => {
    if (!isAdminAuthenticated()) { navigate("/admin-login"); return; }
    // Load stats
    Promise.all([
      apiClient.get("/projects?limit=1").catch(() => ({ data: { pagination: { total: 0 } } })),
      apiClient.get("/skills").catch(() => ({ data: { allSkills: [] } })),
      apiClient.get("/messages?limit=1").catch(() => ({ data: { stats: { total: 0, unread: 0 } } })),
    ]).then(([proj, skill, msg]) => {
      setStats({
        projects: proj.data.pagination?.total ?? 0,
        skills: skill.data.allSkills?.length ?? 0,
        messages: msg.data.stats?.total ?? 0,
        unread: msg.data.stats?.unread ?? 0,
      });
      setUnreadBadge(msg.data.stats?.unread ?? 0);
    });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin-login");
  };

  const sectionContent: Record<string, React.ReactNode> = {
    overview: <Overview stats={stats} />,
    profile: <ProfileEditor />,
    projects: <ProjectsManager />,
    skills: <SkillsManager />,
    experience: <ExperienceManager />,
    messages: <MessagesManager />,
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar backdrop (mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">A</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Admin Panel</p>
              <p className="text-xs text-muted-foreground">Portfolio Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setSection(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                section === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon size={18} />
              {label}
              {id === "messages" && unreadBadge > 0 && (
                <span className="ml-auto text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                  {unreadBadge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors mb-1">
            <Eye size={18} />
            View Site
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-4 gap-3 shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="font-semibold text-foreground capitalize text-sm">
            {NAV_ITEMS.find((n) => n.id === section)?.label ?? "Dashboard"}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 sm:p-7 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {sectionContent[section]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
