import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Employee {
  id: number;
  name: string;
  position: string;
  dept: string;
  email: string;
  phone: string;
  status: "active" | "vacation" | "sick";
  certified: boolean;
  certExpiry: string;
  avatar: string;
  tasks: number;
  kpi: number;
}

const DEPARTMENTS = ["Центр", "1 группа", "2 группа", "3 группа", "4 группа", "5 группа" , "6 отдел"];

const EMPLOYEES: Employee[] = [
  { id: 1, name: "Дритатун", position: "психолог", dept: "5 группа", email: "ivanov@company.ru", phone: "+7 999 123-45-67", status: "active", certified: true, certExpiry: "2027-06-15", avatar: "ИД", tasks: 24, kpi: 97 },
  { id: 2, name: "Босс", position: "самая главная", dept: "5 группа", email: "smirnova@company.ru", phone: "+7 999 234-56-78", status: "active", certified: true, certExpiry: "2026-11-30", avatar: "СА", tasks: 21, kpi: 94 },
  { id: 3, name: "Таракан архивариус", position: "мини босс", dept: "5 группа", email: "kozlov@company.ru", phone: "+7 999 345-67-89", status: "active", certified: true,
];

const statusConfig = {
  active:  { label: "Активен",    color: "#22c55e", bg: "#22c55e18" },
  vacation:{ label: "Отпуск",     color: "#f59e0b", bg: "#f59e0b18" },
  sick:    { label: "Болничный",  color: "#ef4444", bg: "#ef444418" },
};

function isCertExpired(expiry: string) {
  if (!expiry) return false;
  return new Date(expiry) < new Date();
}

function isCertExpiringSoon(expiry: string) {
  if (!expiry) return false;
  const d = new Date(expiry);
  const now = new Date();
  const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff > 0 && diff < 90;
}

export default function EmployeesPage() {
  const [dept, setDept] = useState("Все отделы");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Employee | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [view, setView] = useState<"list" | "grid">("list");

  const filtered = EMPLOYEES.filter(e => {
    const matchDept = dept === "Все отделы" || e.dept === dept;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap flex-1">
          {DEPARTMENTS.map(d => (
            <button key={d}
              onClick={() => setDept(d)}
              className="px-3 py-1.5 rounded text-xs font-medium transition-all"
              style={{
                background: dept === d ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                color: dept === d ? "#fff" : "hsl(var(--muted-foreground))",
              }}>
              {d}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Icon name="Search" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2"
              style={{ color: "hsl(var(--muted-foreground))" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Поиск сотрудников..."
              className="pl-8 pr-3 py-1.5 text-xs rounded border border-border outline-none w-44"
              style={{ background: "hsl(var(--secondary))", color: "hsl(var(--foreground))" }} />
          </div>
          <div className="flex rounded border border-border overflow-hidden">
            {(["list", "grid"] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className="p-1.5 transition-colors"
                style={{ background: view === v ? "hsl(var(--primary))" : "hsl(var(--secondary))" }}>
                <Icon name={v === "list" ? "List" : "LayoutGrid"} size={14}
                  style={{ color: view === v ? "#fff" : "hsl(var(--muted-foreground))" }} />
              </button>
            ))}
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded text-xs font-semibold text-white hover:opacity-90"
            style={{ background: "hsl(var(--primary))" }}>
            <Icon name="UserPlus" size={14} />
            Добавить
          </button>
        </div>
      </div>

      {view === "list" ? (
        <div className="rounded-lg border border-border overflow-hidden"
          style={{ background: "hsl(var(--card))" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                {["Сотрудник", "Отдел", "Статус", "Допуск к оружию", "KPI", "Задач", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "hsl(var(--muted-foreground))" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(emp => {
                const expired = isCertExpired(emp.certExpiry);
                const soon = isCertExpiringSoon(emp.certExpiry);
                return (
                  <tr key={emp.id} className="hover:bg-secondary/30 transition-colors cursor-pointer group"
                    onClick={() => setSelected(emp)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: "hsl(var(--primary))" }}>{emp.avatar}</div>
                        <div>
                          <div className="text-sm font-medium text-white">{emp.name}</div>
                          <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{emp.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "hsl(var(--foreground))" }}>{emp.dept}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded"
                        style={{ background: statusConfig[emp.status].bg, color: statusConfig[emp.status].color }}>
                        {statusConfig[emp.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {emp.certified ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded flex items-center gap-1"
                            style={{
                              background: expired ? "#ef444418" : soon ? "#f59e0b18" : "#22c55e18",
                              color: expired ? "#ef4444" : soon ? "#f59e0b" : "#22c55e",
                            }}>
                            <Icon name={expired ? "AlertCircle" : "BadgeCheck"} size={11} />
                            {expired ? "Истекла" : soon ? "Скоро истекает" : "Действует"}
                          </span>
                          {emp.certExpiry && (
                            <span className="text-xs font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
                              до {new Date(emp.certExpiry).toLocaleDateString("ru-RU")}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Нет сертификата</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-bold"
                        style={{ color: emp.kpi >= 90 ? "#22c55e" : emp.kpi >= 80 ? "#f59e0b" : "#ef4444" }}>
                        {emp.kpi}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: "hsl(var(--foreground))" }}>
                      {emp.tasks}
                    </td>
                    <td className="px-4 py-3">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-secondary"
                        style={{ color: "hsl(var(--muted-foreground))" }}>
                        <Icon name="ChevronRight" size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {filtered.map(emp => {
            const expired = isCertExpired(emp.certExpiry);
            const soon = isCertExpiringSoon(emp.certExpiry);
            return (
              <div key={emp.id} className="rounded-lg border border-border p-4 cursor-pointer hover:border-primary/50 transition-all"
                style={{ background: "hsl(var(--card))" }}
                onClick={() => setSelected(emp)}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: "hsl(var(--primary))" }}>{emp.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{emp.name}</div>
                    <div className="text-xs truncate" style={{ color: "hsl(var(--muted-foreground))" }}>{emp.position}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Статус</span>
                    <span className="text-xs px-2 py-0.5 rounded"
                      style={{ background: statusConfig[emp.status].bg, color: statusConfig[emp.status].color }}>
                      {statusConfig[emp.status].label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>KPI</span>
                    <span className="font-mono text-sm font-bold"
                      style={{ color: emp.kpi >= 90 ? "#22c55e" : emp.kpi >= 80 ? "#f59e0b" : "#ef4444" }}>
                      {emp.kpi}%
                    </span>
                  </div>
                  {emp.certified && (
                    <div className="flex items-center gap-1.5 text-xs px-2 py-1 rounded"
                      style={{
                        background: expired ? "#ef444418" : soon ? "#f59e0b18" : "#22c55e18",
                        color: expired ? "#ef4444" : soon ? "#f59e0b" : "#22c55e",
                      }}>
                      <Icon name="BadgeCheck" size={11} />
                      Допуск {expired ? "истёк" : soon ? "скоро истекает" : "действует"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Employee detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-end"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="h-full w-96 border-l border-border overflow-y-auto animate-slide-in-right"
            style={{ background: "hsl(var(--card))" }}>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold"
                  style={{ color: "hsl(var(--muted-foreground))" }}>Карточка сотрудника</span>
                <button onClick={() => setSelected(null)} style={{ color: "hsl(var(--muted-foreground))" }}>
                  <Icon name="X" size={18} />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: "hsl(var(--primary))" }}>{selected.avatar}</div>
                <div>
                  <div className="text-lg font-bold text-white">{selected.name}</div>
                  <div className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{selected.position}</div>
                  <span className="text-xs px-2 py-0.5 rounded mt-1 inline-block"
                    style={{ background: statusConfig[selected.status].bg, color: statusConfig[selected.status].color }}>
                    {statusConfig[selected.status].label}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { icon: "Building2", label: "Отдел", value: selected.dept },
                  { icon: "Mail", label: "Email", value: selected.email },
                  { icon: "Phone", label: "Телефон", value: selected.phone },
                ].map(row => (
                  <div key={row.label} className="flex items-center gap-3 px-3 py-2.5 rounded"
                    style={{ background: "hsl(var(--secondary))" }}>
                    <Icon name={row.icon as any} size={14} style={{ color: "hsl(var(--muted-foreground))" }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{row.label}</div>
                      <div className="text-sm text-white truncate">{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-border p-4"
                style={{ background: "hsl(var(--secondary))" }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: "hsl(var(--muted-foreground))" }}>Допуск к оружию</div>
                {selected.certified ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon name="BadgeCheck" size={16}
                        style={{ color: isCertExpired(selected.certExpiry) ? "#ef4444" : "#22c55e" }} />
                      <span className="text-sm text-white">
                        {isCertExpired(selected.certExpiry) ? "Допуск истёк" : "Допуск действителен"}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                      Действителен до: <span className="text-white font-mono">
                        {new Date(selected.certExpiry).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                    <button className="text-xs text-white mt-2 px-3 py-1.5 rounded transition-all hover:opacity-90 w-full text-center"
                      style={{ background: "hsl(var(--primary))" }}>
                      Прикрепить документ
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <Icon name="AlertCircle" size={24} className="mx-auto mb-1" style={{ color: "#f59e0b" }} />
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Допуск не оформлен</p>
                    <button className="text-xs text-white mt-2 px-3 py-1.5 rounded transition-all hover:opacity-90"
                      style={{ background: "hsl(var(--primary))" }}>
                      Оформить допуск
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg p-3 text-center"
                  style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))" }}>
                  <div className="text-2xl font-bold font-mono"
                    style={{ color: selected.kpi >= 90 ? "#22c55e" : selected.kpi >= 80 ? "#f59e0b" : "#ef4444" }}>
                    {selected.kpi}%
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>KPI</div>
                </div>
                <div className="rounded-lg p-3 text-center"
                  style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))" }}>
                  <div className="text-2xl font-bold font-mono text-white">{selected.tasks}</div>
                  <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>Задач</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "hsl(var(--muted-foreground))" }}>Документы</div>
                <div className="rounded-lg border-2 border-dashed border-border p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Icon name="Upload" size={20} className="mx-auto mb-2" style={{ color: "hsl(var(--muted-foreground))" }} />
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Перетащите файлы или нажмите для загрузки</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add employee modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }}>
          <div className="rounded-xl border border-border w-full max-w-lg p-6 space-y-4 animate-slide-up"
            style={{ background: "hsl(var(--card))" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">Добавить сотрудника</h2>
              <button onClick={() => setShowAdd(false)} style={{ color: "hsl(var(--muted-foreground))" }}>
                <Icon name="X" size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input className="col-span-2 w-full px-3 py-2 text-sm rounded border border-border outline-none text-white"
                style={{ background: "hsl(var(--secondary))" }} placeholder="ФИО" />
              <input className="w-full px-3 py-2 text-sm rounded border border-border outline-none text-white"
                style={{ background: "hsl(var(--secondary))" }} placeholder="Должность" />
              <select className="w-full px-3 py-2 text-sm rounded border border-border outline-none text-white"
                style={{ background: "hsl(var(--secondary))", colorScheme: "dark" }}>
                {DEPARTMENTS.slice(1).map(d => <option key={d}>{d}</option>)}
              </select>
              <input className="w-full px-3 py-2 text-sm rounded border border-border outline-none text-white"
                style={{ background: "hsl(var(--secondary))" }} placeholder="Email" />
              <input className="w-full px-3 py-2 text-sm rounded border border-border outline-none text-white"
                style={{ background: "hsl(var(--secondary))" }} placeholder="Телефон" />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-2 rounded text-sm border border-border hover:bg-secondary transition-colors"
                style={{ color: "hsl(var(--muted-foreground))" }}>Отмена</button>
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-2 rounded text-sm text-white font-medium hover:opacity-90"
                style={{ background: "hsl(var(--primary))" }}>Добавить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}