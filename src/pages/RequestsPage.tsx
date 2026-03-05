import { useState } from "react";
import Icon from "@/components/ui/icon";

type Priority = "high" | "medium" | "low";
type Status = "new" | "inwork" | "done" | "rejected";

interface Request {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignee: string;
  client: string;
  created: string;
  deadline: string;
}

const MOCK_REQUESTS: Request[] = [
  {
    id: "175/45/115/24",
    title: "Плановое псих обследование",
    description: "25 контракт 15 призыв",
    priority: "high",
    status: "inwork",
    assignee: "Фарафонов.",
    client: "53168 - К",
    created: "01.03.2026",
    deadline: "10.03.2026",
  },
];

const priorityConfig = {
  high: { label: "Высокий", color: "#ef4444", bg: "#ef444418" },
  medium: { label: "Средний", color: "#f59e0b", bg: "#f59e0b18" },
  low: { label: "Низкий", color: "#22c55e", bg: "#22c55e18" },
};

const statusConfig = {
  new: { label: "Новая", color: "#d4af37", bg: "#d4af3718" },
  inwork: { label: "В работе", color: "#f59e0b", bg: "#f59e0b18" },
  done: { label: "Выполнено", color: "#22c55e", bg: "#22c55e18" },
  rejected: { label: "Отклонено", color: "#dc2626", bg: "#dc262618" },
};

export default function RequestsPage() {
  const [filter, setFilter] = useState<Status | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [newReq, setNewReq] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    client: "",
    deadline: "",
  });

  const filtered = MOCK_REQUESTS.filter((r) => {
    const matchStatus = filter === "all" || r.status === filter;
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all: MOCK_REQUESTS.length,
    new: MOCK_REQUESTS.filter((r) => r.status === "new").length,
    inwork: MOCK_REQUESTS.filter((r) => r.status === "inwork").length,
    done: MOCK_REQUESTS.filter((r) => r.status === "done").length,
    rejected: MOCK_REQUESTS.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="space-y-4">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(["all", "new", "inwork", "done", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-3 py-1.5 rounded text-xs font-medium transition-all"
              style={{
                background:
                  filter === s
                    ? "hsl(var(--primary))"
                    : "hsl(var(--secondary))",
                color: filter === s ? "#fff" : "hsl(var(--muted-foreground))",
              }}
            >
              {s === "all" ? "Все" : statusConfig[s].label}
              <span className="ml-1.5 font-mono opacity-70">{counts[s]}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Icon
              name="Search"
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2"
              style={{ color: "hsl(var(--muted-foreground))" }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск заявок..."
              className="pl-8 pr-3 py-1.5 text-xs rounded border border-border outline-none w-48 transition-all focus:w-64"
              style={{
                background: "hsl(var(--secondary))",
                color: "hsl(var(--foreground))",
              }}
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded text-xs font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "hsl(var(--primary))" }}
          >
            <Icon name="Plus" size={14} />
            Новая заявка
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-lg border border-border overflow-hidden"
        style={{ background: "hsl(var(--card))" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid hsl(var(--border))" }}>
              {[
                "№ Заявки",
                "Название",
                "Воинская часть",
                "Приоритет",
                "Статус",
                "Исполнитель",
                "Дедлайн",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((req) => (
              <tr
                key={req.id}
                className="hover:bg-secondary/30 transition-colors group"
              >
                <td className="px-4 py-3">
                  <span
                    className="font-mono text-xs"
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    {req.id}
                  </span>
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <div className="text-sm font-medium text-white truncate">
                    {req.title}
                  </div>
                  <div
                    className="text-xs mt-0.5 truncate"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {req.description}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    {req.client}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      background: priorityConfig[req.priority].bg,
                      color: priorityConfig[req.priority].color,
                    }}
                  >
                    {priorityConfig[req.priority].label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      background: statusConfig[req.status].bg,
                      color: statusConfig[req.status].color,
                    }}
                  >
                    {statusConfig[req.status].label}
                  </span>
                </td>
                <td
                  className="px-4 py-3 text-xs"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {req.assignee}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="font-mono text-xs"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {req.deadline}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-secondary"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    <Icon name="MoreHorizontal" size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div
            className="text-center py-12"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <Icon name="FileX" size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">Заявки не найдены</p>
          </div>
        )}
      </div>

      {/* New request modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <div
            className="rounded-xl border border-border w-full max-w-lg p-6 space-y-4 animate-slide-up"
            style={{ background: "hsl(var(--card))" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">Новая заявка</h2>
              <button
                onClick={() => setShowForm(false)}
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                <Icon name="X" size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label
                  className="text-xs mb-1 block"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Название
                </label>
                <input
                  value={newReq.title}
                  onChange={(e) =>
                    setNewReq({ ...newReq, title: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded border border-border outline-none focus:border-primary text-white"
                  style={{ background: "hsl(var(--secondary))" }}
                  placeholder="Опишите задачу кратко"
                />
              </div>
              <div>
                <label
                  className="text-xs mb-1 block"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Описание
                </label>
                <textarea
                  value={newReq.description}
                  onChange={(e) =>
                    setNewReq({ ...newReq, description: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded border border-border outline-none resize-none text-white"
                  style={{ background: "hsl(var(--secondary))" }}
                  rows={3}
                  placeholder="Подробное описание..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="text-xs mb-1 block"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    Клиент
                  </label>
                  <input
                    value={newReq.client}
                    onChange={(e) =>
                      setNewReq({ ...newReq, client: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm rounded border border-border outline-none text-white"
                    style={{ background: "hsl(var(--secondary))" }}
                    placeholder="Воинская часть"
                  />
                </div>
                <div>
                  <label
                    className="text-xs mb-1 block"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    Приоритет
                  </label>
                  <select
                    value={newReq.priority}
                    onChange={(e) =>
                      setNewReq({
                        ...newReq,
                        priority: e.target.value as Priority,
                      })
                    }
                    className="w-full px-3 py-2 text-sm rounded border border-border outline-none text-white"
                    style={{ background: "hsl(var(--secondary))" }}
                  >
                    <option value="high">Высокий</option>
                    <option value="medium">Средний</option>
                    <option value="low">Низкий</option>
                  </select>
                </div>
              </div>
              <div>
                <label
                  className="text-xs mb-1 block"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Дедлайн
                </label>
                <input
                  type="date"
                  value={newReq.deadline}
                  onChange={(e) =>
                    setNewReq({ ...newReq, deadline: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded border border-border outline-none text-white"
                  style={{
                    background: "hsl(var(--secondary))",
                    colorScheme: "dark",
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2 rounded text-sm border border-border transition-colors hover:bg-secondary"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Отмена
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2 rounded text-sm text-white font-medium transition-all hover:opacity-90"
                style={{ background: "hsl(var(--primary))" }}
              >
                Создать заявку
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
