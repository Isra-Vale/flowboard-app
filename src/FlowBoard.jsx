import { useState, useRef, useEffect, useCallback } from "react";
import "./FlowBoard.css";

// ─── Icons ─────────────────────────────────────────────────────
const Icon = {
  Grid:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Calendar:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Clock:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Palette:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  Code:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Megaphone: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 19-9-9 19-2-8-8-2z"/></svg>,
  Plus:      (p) => <svg width={p?.size||16} height={p?.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Search:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Moon:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Sun:       () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Filter:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  SortDesc:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="11" y1="5" x2="17" y2="5"/><line x1="11" y1="9" x2="17" y2="9"/><line x1="11" y1="13" x2="17" y2="13"/><polyline points="7 15 3 19 7 23"/><line x1="3" y1="19" x2="17" y2="19"/></svg>,
  Check:     () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Trash:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  X:         () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Grip:      () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>,
  CalSm:     () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  ChevD:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Edit:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Chart:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Folder:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Columns:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="18" rx="1"/><rect x="13" y="3" width="8" height="18" rx="1"/></svg>,
  RadioOn:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>,
  RadioOff:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>,
};

// ─── Helpers ───────────────────────────────────────────────────
let _id = 100;
const uid = () => String(++_id);

const today   = new Date(); today.setHours(0,0,0,0);
const fmtDate = d => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const isOver  = d => new Date(d) < today;

const dtOffset = (offset) => {
  const d = new Date(); d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
};

// localStorage helpers
const LS = "taskflow_v1";
const lsSave = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };
const lsLoad = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };

const ASSIGNEES = [
  { name: "Alex",   initials: "AX", color: 0 },
  { name: "Jamie",  initials: "JM", color: 1 },
  { name: "Sam",    initials: "SM", color: 2 },
  { name: "Taylor", initials: "TY", color: 3 },
  { name: "Morgan", initials: "MO", color: 4 },
];

const DEFAULT_TASKS = [
  { id: uid(), title: "Design system update",  desc: "Refresh typography, spacing tokens, and component variants across the entire design system.",  priority: "high",   status: "todo",       project: "Design",      dueDate: dtOffset(0),  assignee: 0 },
  { id: uid(), title: "Fix navigation bug",    desc: "Dropdown menu flickers on Safari when hovering between items. Reproduce on iOS as well.",       priority: "medium", status: "inprogress", project: "Development", dueDate: dtOffset(1),  assignee: 1 },
  { id: uid(), title: "Write documentation",   desc: "Cover API endpoints, authentication flow, and error handling in the developer portal.",          priority: "low",    status: "todo",       project: "Development", dueDate: dtOffset(4),  assignee: 2 },
  { id: uid(), title: "User testing session",  desc: "Coordinate with 5 testers to evaluate the new onboarding flow. Record sessions with Loom.",     priority: "high",   status: "inprogress", project: "Design",      dueDate: dtOffset(-1), assignee: 3 },
  { id: uid(), title: "Q3 campaign brief",     desc: "Draft copy for email newsletter, social posts, and landing page for the autumn product launch.", priority: "medium", status: "todo",       project: "Marketing",   dueDate: dtOffset(3),  assignee: 4 },
  { id: uid(), title: "Homepage redesign",     desc: "Implement approved Figma mockups. Pixel-perfect across breakpoints.",                            priority: "high",   status: "done",       project: "Design",      dueDate: dtOffset(-3), assignee: 0 },
  { id: uid(), title: "Refactor auth module",  desc: "Migrate from legacy JWT logic to the new OAuth 2.0 provider.",                                   priority: "medium", status: "done",       project: "Development", dueDate: dtOffset(-2), assignee: 1 },
  { id: uid(), title: "Set up analytics",      desc: "Integrate Posthog, configure funnels, and set up weekly digest emails.",                         priority: "low",    status: "todo",       project: "Marketing",   dueDate: dtOffset(6),  assignee: 2 },
];

const DEFAULT_PROJECTS = [
  { id: "Design",      icon: "Palette",   color: "#6366F1" },
  { id: "Development", icon: "Code",      color: "#3B82F6" },
  { id: "Marketing",   icon: "Megaphone", color: "#F59E0B" },
];

const DEFAULT_COLS = [
  { id: "todo",       label: "To Do",       dot: "#94A3B8" },
  { id: "inprogress", label: "In Progress", dot: "#F59E0B" },
  { id: "done",       label: "Done",        dot: "#10B981" },
];

const VIEWS = [
  { id: "all",      label: "All Tasks", icon: "Grid"     },
  { id: "today",    label: "Today",     icon: "Calendar" },
  { id: "upcoming", label: "Upcoming",  icon: "Clock"    },
];

const PRIORITY_LABELS = { high: "High", medium: "Medium", low: "Low" };
const PRIORITY_ORDER  = { high: 0, medium: 1, low: 2 };

const PROJECT_COLORS = ["#6366F1","#3B82F6","#F59E0B","#10B981","#EF4444","#EC4899","#8B5CF6","#14B8A6"];
const PROJECT_ICONS  = ["Palette","Code","Megaphone","Folder","Grid","Chart","Clock","Columns"];
const COL_COLORS     = ["#94A3B8","#F59E0B","#10B981","#6366F1","#EF4444","#3B82F6","#EC4899","#8B5CF6"];

const SORT_OPTIONS = [
  { value: "default",   label: "Default order" },
  { value: "dueDate",   label: "Due date (soonest)" },
  { value: "dueDateD",  label: "Due date (latest)" },
  { value: "priority",  label: "Priority (high → low)" },
  { value: "priorityR", label: "Priority (low → high)" },
  { value: "title",     label: "Title A → Z" },
  { value: "titleR",    label: "Title Z → A" },
];

// ─── Apply sort / filter ──────────────────────────────────────
function applySort(tasks, sort) {
  const t = [...tasks];
  switch (sort) {
    case "dueDate":   return t.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
    case "dueDateD":  return t.sort((a,b) => new Date(b.dueDate) - new Date(a.dueDate));
    case "priority":  return t.sort((a,b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    case "priorityR": return t.sort((a,b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]);
    case "title":     return t.sort((a,b) => a.title.localeCompare(b.title));
    case "titleR":    return t.sort((a,b) => b.title.localeCompare(a.title));
    default:          return t;
  }
}

function applyFilters(tasks, filters) {
  return tasks.filter(t => {
    if (filters.priority?.length && !filters.priority.includes(t.priority)) return false;
    if (filters.assignee?.length && !filters.assignee.includes(t.assignee)) return false;
    if (filters.project?.length  && !filters.project.includes(t.project))   return false;
    return true;
  });
}

// ─── Small shared atoms ───────────────────────────────────────
function Checkbox({ checked, onChange }) {
  return (
    <div className={`tf-checkbox${checked ? " checked" : ""}`}
      onClick={e => { e.stopPropagation(); onChange(); }}
      role="checkbox" aria-checked={checked}>
      {checked && <Icon.Check />}
    </div>
  );
}
function PriorityBadge({ p }) {
  return <span className={`tf-priority ${p}`}>{PRIORITY_LABELS[p]}</span>;
}
function DueChip({ date }) {
  return (
    <span className={`tf-due${isOver(date) ? " overdue" : ""}`}>
      <Icon.CalSm /> {fmtDate(date)}
    </span>
  );
}
function Avatar({ idx, size }) {
  const a = ASSIGNEES[idx] || ASSIGNEES[0];
  return (
    <div className={`tf-assignee tf-assignee-${a.color}`} style={size ? { width: size, height: size } : undefined}>
      {a.initials}
    </div>
  );
}

// ─── Generic click-outside dropdown ──────────────────────────
function Dropdown({ anchor, open, onClose, children, align = "right" }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const fn = e => {
      if (ref.current && !ref.current.contains(e.target) && !anchor?.current?.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open, onClose, anchor]);

  if (!open) return null;
  return (
    <div ref={ref} className={`tf-dropdown tf-dropdown-${align}`} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  );
}

// ─── Filter Dropdown ──────────────────────────────────────────
function FilterDropdown({ open, anchor, onClose, filters, onChange, projects }) {
  const toggle = (key, val) => {
    const cur  = filters[key] || [];
    const next = cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val];
    onChange({ ...filters, [key]: next });
  };
  const clearAll = () => onChange({ priority: [], assignee: [], project: [] });
  const activeCount = Object.values(filters).flat().length;

  const Section = ({ title, items, filterKey, renderLabel }) => (
    <div className="tf-dd-section">
      <div className="tf-dd-section-title">{title}</div>
      {items.map(item => {
        const active = (filters[filterKey] || []).includes(item.value);
        return (
          <div key={String(item.value)} className={`tf-dd-option${active ? " active" : ""}`} onClick={() => toggle(filterKey, item.value)}>
            <span className="tf-dd-check">{active ? <Icon.Check /> : null}</span>
            {renderLabel(item)}
          </div>
        );
      })}
    </div>
  );

  return (
    <Dropdown anchor={anchor} open={open} onClose={onClose} align="right">
      <div className="tf-dd-header">
        <span className="tf-dd-title">Filter</span>
        {activeCount > 0 && <button className="tf-dd-clear" onClick={clearAll}>Clear all ({activeCount})</button>}
      </div>
      <Section title="Priority" filterKey="priority"
        items={["high","medium","low"].map(v => ({ value: v }))}
        renderLabel={i => <PriorityBadge p={i.value} />}
      />
      <Section title="Assignee" filterKey="assignee"
        items={ASSIGNEES.map((a, idx) => ({ value: idx, label: a.name }))}
        renderLabel={i => <><Avatar idx={i.value} size={20} /><span style={{marginLeft:6}}>{i.label}</span></>}
      />
      <Section title="Project" filterKey="project"
        items={projects.map(p => ({ value: p.id, label: p.id }))}
        renderLabel={i => <span>{i.label}</span>}
      />
    </Dropdown>
  );
}

// ─── Sort Dropdown ────────────────────────────────────────────
function SortDropdown({ open, anchor, onClose, sort, onChange }) {
  return (
    <Dropdown anchor={anchor} open={open} onClose={onClose} align="right">
      <div className="tf-dd-header"><span className="tf-dd-title">Sort by</span></div>
      {SORT_OPTIONS.map(opt => (
        <div key={opt.value} className={`tf-dd-option${sort === opt.value ? " active" : ""}`}
          onClick={() => { onChange(opt.value); onClose(); }}>
          <span className="tf-dd-radio">{sort === opt.value ? <Icon.RadioOn /> : <Icon.RadioOff />}</span>
          {opt.label}
        </div>
      ))}
    </Dropdown>
  );
}

// ─── Filter Pills (active filter tags) ───────────────────────
function FilterPills({ filters, onChange }) {
  const pills = [];
  (filters.priority || []).forEach(p  => pills.push({ key: "priority", val: p,   label: PRIORITY_LABELS[p] }));
  (filters.assignee || []).forEach(i  => pills.push({ key: "assignee", val: i,   label: ASSIGNEES[i]?.name }));
  (filters.project  || []).forEach(pr => pills.push({ key: "project",  val: pr,  label: pr }));
  if (!pills.length) return null;

  const remove = (key, val) => onChange({ ...filters, [key]: filters[key].filter(x => x !== val) });

  return (
    <div className="tf-filter-pills">
      {pills.map((p, i) => (
        <span key={i} className="tf-filter-pill">
          {p.label}
          <button onClick={() => remove(p.key, p.val)}><Icon.X /></button>
        </span>
      ))}
    </div>
  );
}

// ─── New Project Modal ────────────────────────────────────────
function NewProjectModal({ open, onClose, onCreate, existingIds }) {
  const [name,  setName]  = useState("");
  const [icon,  setIcon]  = useState("Folder");
  const [color, setColor] = useState("#6366F1");
  const inputRef = useRef(null);

  useEffect(() => { if (open) { setName(""); setIcon("Folder"); setColor("#6366F1"); setTimeout(() => inputRef.current?.focus(), 50); } }, [open]);

  if (!open) return null;
  const taken     = existingIds.map(id => id.toLowerCase());
  const nameTaken = taken.includes(name.trim().toLowerCase());
  const valid     = name.trim().length > 0 && !nameTaken;
  const handle    = () => { if (!valid) return; onCreate({ id: name.trim(), icon, color }); onClose(); };

  return (
    <div className="tf-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="tf-modal" role="dialog" aria-modal="true">
        <div className="tf-modal-header">
          <span className="tf-modal-title">New Project</span>
          <button className="tf-modal-close" onClick={onClose}><Icon.X /></button>
        </div>
        <div className="tf-modal-body">
          <div className="tf-field">
            <label className="tf-label">Project name <span className="req">*</span></label>
            <input ref={inputRef} className="tf-input" placeholder="e.g. Backend, Design V2…"
              value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} />
            {nameTaken && <span className="tf-field-error">This name is already taken.</span>}
          </div>
          <div className="tf-field">
            <label className="tf-label">Icon</label>
            <div className="tf-icon-picker">
              {PROJECT_ICONS.map(ic => {
                const I = Icon[ic];
                return (
                  <button key={ic} className={`tf-icon-pick-btn${icon === ic ? " active" : ""}`} onClick={() => setIcon(ic)} title={ic}>
                    <I />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="tf-field">
            <label className="tf-label">Color</label>
            <div className="tf-color-picker">
              {PROJECT_COLORS.map(c => (
                <button key={c} className={`tf-color-swatch${color === c ? " active" : ""}`} style={{ background: c }} onClick={() => setColor(c)} />
              ))}
            </div>
          </div>
          <div className="tf-field">
            <label className="tf-label">Preview</label>
            <div className="tf-project-preview">
              <div className="tf-project-preview-icon" style={{ background: color + "22", color }}>
                {(() => { const I = Icon[icon] || Icon.Folder; return <I />; })()}
              </div>
              <span className="tf-project-preview-name">{name || "Project name"}</span>
            </div>
          </div>
        </div>
        <div className="tf-modal-footer">
          <button className="tf-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="tf-btn-primary" onClick={handle} disabled={!valid}><Icon.Folder /> Create Project</button>
        </div>
      </div>
    </div>
  );
}

// ─── New Column Modal ─────────────────────────────────────────
function NewColumnModal({ open, onClose, onCreate, existingIds }) {
  const [label, setLabel] = useState("");
  const [dot,   setDot]   = useState("#94A3B8");
  const inputRef = useRef(null);

  useEffect(() => { if (open) { setLabel(""); setDot("#94A3B8"); setTimeout(() => inputRef.current?.focus(), 50); } }, [open]);

  if (!open) return null;
  const slugify   = s => s.trim().toLowerCase().replace(/\s+/g, "-");
  const idVal     = slugify(label);
  const nameTaken = label.trim() && existingIds.map(x => x.toLowerCase()).includes(idVal);
  const valid     = label.trim().length > 0 && !nameTaken;
  const handle    = () => { if (!valid) return; onCreate({ id: idVal, label: label.trim(), dot }); onClose(); };

  return (
    <div className="tf-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="tf-modal" role="dialog" aria-modal="true">
        <div className="tf-modal-header">
          <span className="tf-modal-title">Add Column</span>
          <button className="tf-modal-close" onClick={onClose}><Icon.X /></button>
        </div>
        <div className="tf-modal-body">
          <div className="tf-field">
            <label className="tf-label">Column name <span className="req">*</span></label>
            <input ref={inputRef} className="tf-input" placeholder="e.g. Review, Blocked, QA…"
              value={label} onChange={e => setLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} />
            {nameTaken && <span className="tf-field-error">A column with this name already exists.</span>}
          </div>
          <div className="tf-field">
            <label className="tf-label">Dot color</label>
            <div className="tf-color-picker">
              {COL_COLORS.map(c => (
                <button key={c} className={`tf-color-swatch${dot === c ? " active" : ""}`} style={{ background: c }} onClick={() => setDot(c)} />
              ))}
            </div>
          </div>
          <div className="tf-field">
            <label className="tf-label">Preview</label>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:10, height:10, borderRadius:"50%", background:dot, display:"inline-block", flexShrink:0 }} />
              <span style={{ fontSize:12, fontWeight:600, letterSpacing:".06em", textTransform:"uppercase", color:"var(--text-2)" }}>
                {label || "COLUMN NAME"}
              </span>
            </div>
          </div>
        </div>
        <div className="tf-modal-footer">
          <button className="tf-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="tf-btn-primary" onClick={handle} disabled={!valid}><Icon.Columns /> Add Column</button>
        </div>
      </div>
    </div>
  );
}

// ─── Task Card ────────────────────────────────────────────────
function TaskCard({ task, onToggle, onClick, onDragStart }) {
  return (
    <div className="tf-card" draggable
      onDragStart={e => { onDragStart(e, task.id); e.currentTarget.classList.add("dragging"); }}
      onDragEnd={e => e.currentTarget.classList.remove("dragging")}
      onClick={() => onClick(task)}>
      <span className="tf-card-drag-handle"><Icon.Grip /></span>
      <div className="tf-card-top">
        <Checkbox checked={task.status === "done"} onChange={() => onToggle(task.id)} />
        <span className={`tf-card-title${task.status === "done" ? " done" : ""}`}>{task.title}</span>
      </div>
      {task.desc && <p className="tf-card-desc">{task.desc}</p>}
      <div className="tf-card-footer">
        <PriorityBadge p={task.priority} />
        <DueChip date={task.dueDate} />
        <Avatar idx={task.assignee} />
      </div>
    </div>
  );
}

// ─── Board Column ─────────────────────────────────────────────
function BoardColumn({ col, tasks, onToggle, onCardClick, onDragStart, onDrop }) {
  const [over, setOver] = useState(false);
  return (
    <div className="tf-col">
      <div className="tf-col-header">
        <span className="tf-col-dot" style={{ background: col.dot }} />
        <span className="tf-col-title">{col.label}</span>
        <span className="tf-col-count">{tasks.length}</span>
        <button className="tf-col-add" title="Add task" onClick={() => onCardClick(null, col.id)}>
          <Icon.Plus />
        </button>
      </div>
      <div className={`tf-col-body${over ? " drag-over" : ""}`}
        onDragOver={e => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={e => { setOver(false); onDrop(e, col.id); }}>
        {tasks.map(t => (
          <TaskCard key={t.id} task={t} onToggle={onToggle} onClick={onCardClick} onDragStart={onDragStart} />
        ))}
      </div>
    </div>
  );
}

// ─── Add Task Modal ───────────────────────────────────────────
function TaskModal({ open, onClose, onCreate, defaultStatus, projects, cols }) {
  const [form, setForm] = useState({ title:"", desc:"", priority:"medium", status:"todo", dueDate: dtOffset(1), project:"Design", assignee:0 });
  const titleRef = useRef(null);

  useEffect(() => {
    if (open) {
      setForm(f => ({ ...f, status: defaultStatus || "todo", project: projects[0]?.id || "Design" }));
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [open, defaultStatus, projects]);

  if (!open) return null;
  const set    = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const handle = () => { if (!form.title.trim()) return; onCreate({ ...form, id: uid(), assignee: Number(form.assignee) }); onClose(); };

  return (
    <div className="tf-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="tf-modal" role="dialog" aria-modal="true">
        <div className="tf-modal-header">
          <span className="tf-modal-title">Create New Task</span>
          <button className="tf-modal-close" onClick={onClose}><Icon.X /></button>
        </div>
        <div className="tf-modal-body">
          <div className="tf-field">
            <label className="tf-label">Task title <span className="req">*</span></label>
            <input ref={titleRef} className="tf-input" placeholder="What needs to get done?"
              value={form.title} onChange={set("title")} onKeyDown={e => e.key === "Enter" && handle()} />
          </div>
          <div className="tf-field">
            <label className="tf-label">Description</label>
            <textarea className="tf-textarea" placeholder="Add more context..." value={form.desc} onChange={set("desc")} rows={3} />
          </div>
          <div className="tf-fields-row">
            <div className="tf-field">
              <label className="tf-label">Priority</label>
              <select className="tf-select" value={form.priority} onChange={set("priority")}>
                <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
            </div>
            <div className="tf-field">
              <label className="tf-label">Status</label>
              <select className="tf-select" value={form.status} onChange={set("status")}>
                {cols.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="tf-fields-row">
            <div className="tf-field">
              <label className="tf-label">Due date</label>
              <input type="date" className="tf-input" value={form.dueDate} onChange={set("dueDate")} />
            </div>
            <div className="tf-field">
              <label className="tf-label">Project</label>
              <select className="tf-select" value={form.project} onChange={set("project")}>
                {projects.map(p => <option key={p.id} value={p.id}>{p.id}</option>)}
              </select>
            </div>
          </div>
          <div className="tf-field">
            <label className="tf-label">Assignee</label>
            <select className="tf-select" value={form.assignee} onChange={set("assignee")}>
              {ASSIGNEES.map((a,i) => <option key={i} value={i}>{a.name}</option>)}
            </select>
          </div>
        </div>
        <div className="tf-modal-footer">
          <button className="tf-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="tf-btn-primary" onClick={handle} disabled={!form.title.trim()}><Icon.Plus /> Create Task</button>
        </div>
      </div>
    </div>
  );
}

// ─── Task Detail Sidebar ──────────────────────────────────────
function TaskDetail({ task, cols, projects, onClose, onUpdate, onDelete }) {
  const [local, setLocal] = useState(task);
  useEffect(() => setLocal(task), [task]);
  if (!task) return null;

  const set    = k => e => { const u = { ...local, [k]: e.target.value };         setLocal(u); onUpdate(u); };
  const setNum = k => e => { const u = { ...local, [k]: Number(e.target.value) }; setLocal(u); onUpdate(u); };

  return (
    <div className="tf-detail" role="complementary">
      <div className="tf-detail-header">
        <input className="tf-detail-title-input" value={local.title} onChange={set("title")} onBlur={() => onUpdate(local)} />
        <button className="tf-icon-btn" onClick={onClose}><Icon.X /></button>
      </div>
      <div className="tf-detail-body">
        <div className="tf-detail-field">
          <span className="tf-detail-label">Description</span>
          <textarea className="tf-textarea" value={local.desc} onChange={set("desc")} rows={4} />
        </div>
        <div className="tf-fields-row">
          <div className="tf-detail-field">
            <span className="tf-detail-label">Priority</span>
            <select className="tf-select" value={local.priority} onChange={set("priority")}>
              <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
            </select>
          </div>
          <div className="tf-detail-field">
            <span className="tf-detail-label">Status</span>
            <select className="tf-select" value={local.status} onChange={set("status")}>
              {cols.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
        </div>
        <div className="tf-fields-row">
          <div className="tf-detail-field">
            <span className="tf-detail-label">Due Date</span>
            <input type="date" className="tf-input" value={local.dueDate} onChange={set("dueDate")} />
          </div>
          <div className="tf-detail-field">
            <span className="tf-detail-label">Project</span>
            <select className="tf-select" value={local.project} onChange={set("project")}>
              {projects.map(p => <option key={p.id} value={p.id}>{p.id}</option>)}
            </select>
          </div>
        </div>
        <div className="tf-detail-field">
          <span className="tf-detail-label">Assignee</span>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Avatar idx={local.assignee} size={30} />
            <select className="tf-select" value={local.assignee} onChange={setNum("assignee")} style={{ flex:1 }}>
              {ASSIGNEES.map((a,i) => <option key={i} value={i}>{a.name}</option>)}
            </select>
          </div>
        </div>
        <div className="tf-detail-field">
          <span className="tf-detail-label">Activity</span>
          <div className="tf-activity-log">
            <div className="tf-activity-item">
              <div className="tf-activity-dot" />
              <span className="tf-activity-text"><strong>{ASSIGNEES[local.assignee]?.name}</strong> created this task</span>
            </div>
            {local.status === "inprogress" && (
              <div className="tf-activity-item">
                <div className="tf-activity-dot" style={{ background:"#F59E0B" }} />
                <span className="tf-activity-text">Status changed to <strong>In Progress</strong></span>
              </div>
            )}
            {local.status === "done" && (
              <div className="tf-activity-item">
                <div className="tf-activity-dot" style={{ background:"#10B981" }} />
                <span className="tf-activity-text">Task marked as <strong>Done</strong> ✓</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="tf-detail-footer">
        <button className="tf-btn-danger" onClick={() => onDelete(task.id)}><Icon.Trash /> Delete task</button>
        <button className="tf-btn-ghost" onClick={onClose}><Icon.Edit /> Done editing</button>
      </div>
    </div>
  );
}

// ─── Stats Banner ─────────────────────────────────────────────
function StatsBanner({ tasks }) {
  const done    = tasks.filter(t => t.status === "done").length;
  const pending = tasks.filter(t => t.status !== "done").length;
  const pct     = tasks.length ? Math.round(done / tasks.length * 100) : 0;
  return (
    <div className="tf-stats">
      <Icon.Chart />
      <div className="tf-stat-item"><strong>This week:</strong></div>
      <div className="tf-stat-item"><strong>{done}</strong> completed</div>
      <div className="tf-stat-sep" />
      <div className="tf-stat-item"><strong>{pending}</strong> pending</div>
      <div className="tf-stat-sep" />
      <div className="tf-stat-item"><strong>{pct}%</strong> completion rate</div>
      <div className="tf-progress-wrap">
        <div className="tf-progress-bar">
          <div className="tf-progress-fill" style={{ width:`${pct}%` }} />
        </div>
        <span className="tf-progress-pct">{pct}%</span>
      </div>
    </div>
  );
}

// ─── Search Dropdown ──────────────────────────────────────────
function SearchDropdown({ query, tasks, onSelect }) {
  if (!query.trim()) return null;
  const results = tasks.filter(t =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.desc.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);
  if (!results.length) return (
    <div className="tf-search-dropdown">
      <div className="tf-search-item" style={{ color:"var(--text-2)" }}>No tasks found</div>
    </div>
  );
  return (
    <div className="tf-search-dropdown">
      {results.map(t => (
        <div key={t.id} className="tf-search-item" onClick={() => onSelect(t)}>
          <PriorityBadge p={t.priority} />
          {t.title}
          <span className="tf-search-item-badge">
            {t.status === "todo" ? "To Do" : t.status === "inprogress" ? "In Progress" : "Done"}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────
export default function FlowBoard() {
  // Persisted state (localStorage)
  const [tasks,    setTasks]    = useState(() => lsLoad(LS + "_tasks",    DEFAULT_TASKS));
  const [projects, setProjects] = useState(() => lsLoad(LS + "_projects", DEFAULT_PROJECTS));
  const [cols,     setCols]     = useState(() => lsLoad(LS + "_cols",     DEFAULT_COLS));
  const [dark,     setDark]     = useState(() => lsLoad(LS + "_dark",     false));

  // UI-only state
  const [view,           setView]           = useState("all");
  const [searchQ,        setSearchQ]        = useState("");
  const [showSearch,     setShowSearch]     = useState(false);
  const [modalOpen,      setModalOpen]      = useState(false);
  const [modalStatus,    setModalStatus]    = useState("todo");
  const [detail,         setDetail]         = useState(null);
  const [dragId,         setDragId]         = useState(null);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newColOpen,     setNewColOpen]     = useState(false);
  const [filterOpen,     setFilterOpen]     = useState(false);
  const [sortOpen,       setSortOpen]       = useState(false);
  const [filters,        setFilters]        = useState({ priority:[], assignee:[], project:[] });
  const [sort,           setSort]           = useState("default");

  const searchRef    = useRef(null);
  const filterBtnRef = useRef(null);
  const sortBtnRef   = useRef(null);

  // Persist changes
  useEffect(() => lsSave(LS + "_tasks",    tasks),    [tasks]);
  useEffect(() => lsSave(LS + "_projects", projects), [projects]);
  useEffect(() => lsSave(LS + "_cols",     cols),     [cols]);
  useEffect(() => lsSave(LS + "_dark",     dark),     [dark]);

  // Dark mode
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);

  // Close search on outside click
  useEffect(() => {
    const fn = e => { if (!searchRef.current?.contains(e.target)) setShowSearch(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // ── Derived task list ──
  const viewFiltered = tasks.filter(t => {
    if (view === "today")    return t.dueDate === dtOffset(0);
    if (view === "upcoming") return t.dueDate > dtOffset(0);
    if (VIEWS.find(v => v.id === view)) return true; // "all"
    return t.project === view; // project view
  });
  const visibleTasks = applySort(applyFilters(viewFiltered, filters), sort);

  // ── Sidebar counts ──
  const countFor = v => {
    if (v === "all")      return tasks.length;
    if (v === "today")    return tasks.filter(t => t.dueDate === dtOffset(0)).length;
    if (v === "upcoming") return tasks.filter(t => t.dueDate > dtOffset(0)).length;
    return tasks.filter(t => t.project === v).length;
  };

  const activeFilterCount = Object.values(filters).flat().length;

  // ── Mutations ──
  const addTask    = useCallback(t => setTasks(ts => [...ts, t]), []);
  const toggleTask = useCallback(id => setTasks(ts => ts.map(t => t.id === id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t)), []);
  const updateTask = useCallback(u  => setTasks(ts => ts.map(t => t.id === u.id ? u : t)), []);
  const deleteTask = useCallback(id => { setTasks(ts => ts.filter(t => t.id !== id)); setDetail(null); }, []);
  const addProject = useCallback(p  => setProjects(ps => [...ps, p]), []);
  const addCol     = useCallback(c  => setCols(cs => [...cs, c]), []);

  // ── Drag & Drop ──
  const onDragStart = (e, id) => { setDragId(id); e.dataTransfer.effectAllowed = "move"; };
  const onDrop = (e, colId) => {
    e.preventDefault();
    if (!dragId) return;
    setTasks(ts => ts.map(t => t.id === dragId ? { ...t, status: colId } : t));
    setDragId(null);
  };

  // ── Card / modal open ──
  const onCardClick = (task, defaultStatus) => {
    if (task) setDetail(task);
    else { setModalStatus(defaultStatus || "todo"); setModalOpen(true); }
  };

  const viewTitle = VIEWS.find(v => v.id === view)?.label
    || projects.find(p => p.id === view)?.id
    || "Tasks";

  return (
    <div className="tf-shell">

      {/* ── Header ── */}
      <header className="tf-header">
        <a className="tf-logo" href="#" aria-label="TaskFlow">
          <div className="tf-logo-mark"><Icon.Grid /></div>
          <span className="tf-logo-name">FlowBoard</span>
        </a>

        <div className="tf-search-wrap" ref={searchRef}>
          <Icon.Search />
          <input className="tf-search" placeholder="Search tasks…" value={searchQ}
            onChange={e => { setSearchQ(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)} />
          {showSearch && (
            <SearchDropdown query={searchQ} tasks={tasks} onSelect={t => { setDetail(t); setShowSearch(false); setSearchQ(""); }} />
          )}
        </div>

        <div className="tf-header-actions">
          <button className="tf-icon-btn" onClick={() => setDark(d => !d)} title="Toggle theme">
            {dark ? <Icon.Sun /> : <Icon.Moon />}
          </button>
          <div className="tf-avatar" title="Your profile">ME</div>
        </div>
      </header>

      {/* ── Sidebar ── */}
      <nav className="tf-sidebar" aria-label="Navigation">
        <div className="tf-nav-section">
          <div className="tf-nav-label">Menu</div>
          {VIEWS.map(v => {
            const I = Icon[v.icon];
            return (
              <div key={v.id} className={`tf-nav-item${view === v.id ? " active" : ""}`}
                onClick={() => setView(v.id)} role="button" tabIndex={0}>
                <I />
                <span className="tf-nav-item-label">{v.label}</span>
                <span className="tf-badge">{countFor(v.id)}</span>
              </div>
            );
          })}
        </div>

        <div className="tf-nav-section">
          <div className="tf-nav-label">Projects</div>
          {projects.map(p => {
            const I = Icon[p.icon] || Icon.Folder;
            return (
              <div key={p.id} className={`tf-nav-item${view === p.id ? " active" : ""}`}
                onClick={() => setView(p.id)} role="button" tabIndex={0}>
                <I />
                <span className="tf-nav-item-label">{p.id}</span>
                <span className="tf-badge">{countFor(p.id)}</span>
              </div>
            );
          })}
        </div>

        <div className="tf-sidebar-footer">
          {/* ✅ New Project — wired */}
          <button className="tf-new-project-btn" onClick={() => setNewProjectOpen(true)}>
            <Icon.Plus /><span>New Project</span>
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="tf-main">
        <StatsBanner tasks={tasks} />

        <div className="tf-board-header">
          <span className="tf-board-title">{viewTitle}</span>
          <button className="tf-btn-primary" onClick={() => { setModalStatus("todo"); setModalOpen(true); }}>
            <Icon.Plus /> Add Task
          </button>

          <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
            {/* ✅ Filter — wired */}
            <div style={{ position:"relative" }}>
              <button ref={filterBtnRef}
                className={`tf-btn-ghost${activeFilterCount > 0 ? " tf-btn-ghost-active" : ""}`}
                onClick={() => { setFilterOpen(o => !o); setSortOpen(false); }}>
                <Icon.Filter />
                Filter
                {activeFilterCount > 0 && <span className="tf-btn-badge">{activeFilterCount}</span>}
                <Icon.ChevD />
              </button>
              <FilterDropdown open={filterOpen} anchor={filterBtnRef}
                onClose={() => setFilterOpen(false)}
                filters={filters} onChange={setFilters} projects={projects} />
            </div>

            {/* ✅ Sort — wired */}
            <div style={{ position:"relative" }}>
              <button ref={sortBtnRef}
                className={`tf-btn-ghost${sort !== "default" ? " tf-btn-ghost-active" : ""}`}
                onClick={() => { setSortOpen(o => !o); setFilterOpen(false); }}>
                <Icon.SortDesc />
                {sort !== "default"
                  ? SORT_OPTIONS.find(o => o.value === sort)?.label.split(" ").slice(0,2).join(" ")
                  : "Sort"}
                <Icon.ChevD />
              </button>
              <SortDropdown open={sortOpen} anchor={sortBtnRef}
                onClose={() => setSortOpen(false)}
                sort={sort} onChange={setSort} />
            </div>
          </div>
        </div>

        {/* Active filter pills */}
        {activeFilterCount > 0 && (
          <div style={{ padding:"0 28px 6px" }}>
            <FilterPills filters={filters} onChange={setFilters} />
          </div>
        )}

        <div className="tf-board-scroll">
          <div className="tf-board">
            {cols.map(col => (
              <BoardColumn key={col.id} col={col}
                tasks={visibleTasks.filter(t => t.status === col.id)}
                onToggle={toggleTask} onCardClick={onCardClick}
                onDragStart={onDragStart} onDrop={onDrop} />
            ))}

            {/* ✅ Add Column — wired */}
            <div className="tf-col-placeholder" onClick={() => setNewColOpen(true)}>
              <div className="tf-col-placeholder-inner">
                <Icon.Plus size={20} /><span>Add Column</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Modals ── */}
      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)}
        onCreate={addTask} defaultStatus={modalStatus} projects={projects} cols={cols} />

      <NewProjectModal open={newProjectOpen} onClose={() => setNewProjectOpen(false)}
        onCreate={addProject} existingIds={projects.map(p => p.id)} />

      <NewColumnModal open={newColOpen} onClose={() => setNewColOpen(false)}
        onCreate={addCol} existingIds={cols.map(c => c.id)} />

      {/* ── Task Detail ── */}
      {detail && (
        <TaskDetail
          task={tasks.find(t => t.id === detail.id) || detail}
          cols={cols} projects={projects}
          onClose={() => setDetail(null)}
          onUpdate={updateTask} onDelete={deleteTask} />
      )}
    </div>
  );
}