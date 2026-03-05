import { useState } from "react";
import Icon from "@/components/ui/icon";

interface ReportRecord {
  id: number;
  unitId: number;
  unitName: string;
  reportType: string;
  period: string;
  receivedDate: string | null;
  receivedBy: string | null;
  status: "received" | "pending" | "overdue";
  notes: string;
}

const UNITS = [
  { id: 1, name: "53168-К" },
  { id: 2, name: "72154-Б" },
  { id: 3, name: "41203-А" },
  { id: 4, name: "88012-В" },
  { id: 5, name: "31076-Д" },
  { id: 6, name: "66543-Е" },
];

const REPORT_TYPES = ["ПР 35", "ПР 145", "ПР 67", "ПР 45", "ПР 878"];

const PERIODS = ["Январь 2026", "Февраль 2026", "Март 2026"];

const INITIAL_RECORDS: ReportRecord[] = [
  {
    id: 1,
    unitId: 1,
    unitName: "57862",
    reportType: "ПР 45",
    period: "Февраль 2026",
    receivedDate: "2026-03-02",
    receivedBy: "Фарафонов Н.",
    status: "received",
    notes: "",
  },
];

const statusConfig = {
  received: {
    label: "Получен",
    color: "#22c55e",
    bg: "#22c55e18",
    icon: "CheckCircle",
  },
  pending: {
    label: "Ожидается",
    color: "#f59e0b",
    bg: "#f59e0b18",
    icon: "Clock",
  },
  overdue: {
    label: "Просрочен",
    color: "#ef4444",
    bg: "#ef444418",
    icon: "AlertCircle",
  },
};

export default function ReportsPage() {
  const [records, setRecords] = useState<ReportRecord[]>(INITIAL_RECORDS);
  const [filterUnit, setFilterUnit] = useState<number | "all">("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "received" | "pending" | "overdue"
  >("all");
  const [filterPeriod, setFilterPeriod] = useState("Февраль 2026");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [markModal, setMarkModal] = useState<ReportRecord | null>(null);
  const [markBy, setMarkBy] = useState("Фарафонов Н.");
  const [markNotes, setMarkNotes] = useState("");
  const [newForm, setNewForm] = useState({
    unitId: UNITS[0].id,
    reportType: REPORT_TYPES[0],
    period: PERIODS[2],
  });

  const filtered = records.filter((r) => {
    const matchUnit = filterUnit === "all" || r.unitId === filterUnit;
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    const matchPeriod = r.period === filterPeriod;
    return matchUnit && matchStatus && matchPeriod;
  });

  const stats = {
    total: records.filter((r) => r.period === filterPeriod).length,
    received: records.filter(
      (r) => r.period === filterPeriod && r.status === "received",
    ).length,
    pending: records.filter(
      (r) => r.period === filterPeriod && r.status === "pending",
    ).length,
    overdue: records.filter(
      (r) => r.period === filterPeriod && r.status === "overdue",
    ).length,
  };

  const unitStats = UNITS.map((u) => {
    const uRecords = records.filter(
      (r) => r.unitId === u.id && r.period === filterPeriod,
    );
    const received = uRecords.filter((r) => r.status === "received").length;
    const total = uRecords.length;
    const pct = total > 0 ? Math.round((received / total) * 100) : 0;
    return {
      ...u,
      received,
      total,
      pct,
      overdue: uRecords.filter((r) => r.status === "overdue").length,
    };
  });

  function markReceived(record: ReportRecord) {
    setMarkModal(record);
    setMarkBy("Фарафонов Н.");
    setMarkNotes(record.notes);
  }

  function confirmMark() {
    if (!markModal) return;
    setRecords((prev) =>
      prev.map((r) =>
        r.id === markModal.id
          ? {
              ...r,
              status: "received",
              receivedDate: new Date().toISOString().slice(0, 10),
              receivedBy: markBy,
              notes: markNotes,
            }
          : r,
      ),
    );
    setMarkModal(null);
  }

  function addRecord() {
    const unit = UNITS.find((u) => u.id === newForm.unitId)!;
    const newRec: ReportRecord = {
      id: Math.max(0, ...records.map((r) => r.id)) + 1,
      unitId: newForm.unitId,
      unitName: unit.name,
      reportType: newForm.reportType,
      period: newForm.period,
      receivedDate: null,
      receivedBy: null,
      status: "pending",
      notes: "",
    };
    setRecords((prev) => [...prev, newRec]);
    setShowForm(false);
  }

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto pb-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            label: "Всего отчётов",
            value: stats.total,
            icon: "FileText",
            color: "hsl(var(--primary))",
            bg: "hsl(var(--primary) / 0.12)",
          },
          {
            label: "Получено",
            value: stats.received,
            icon: "CheckCircle",
            color: "#22c55e",
            bg: "#22c55e18",
          },
          {
            label: "Ожидается",
            value: stats.pending,
            icon: "Clock",
            color: "#f59e0b",
            bg: "#f59e0b18",
          },
          {
            label: "Просрочено",
            value: stats.overdue,
            icon: "AlertCircle",
            color: "#ef4444",
            bg: "#ef444418",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-border p-4"
            style={{ background: "hsl(var(--card))" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-xs"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {s.label}
              </span>
              <div
                className="w-7 h-7 rounded flex items-center justify-center"
                style={{ background: s.bg }}
              >
                <Icon
                  name={s.icon as Parameters<typeof Icon>[0]["name"]}
                  size={14}
                  style={{ color: s.color }}
                />
              </div>
            </div>
            <div
              className="text-2xl font-bold"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {s.value}
            </div>
            {stats.total > 0 && (
              <div
                className="text-xs mt-1"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {Math.round((s.value / stats.total) * 100)}% от общего числа
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4 flex-1">
        {/* Left: table */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="px-3 py-1.5 rounded border border-border text-xs outline-none"
              style={{
                background: "hsl(var(--secondary))",
                color: "hsl(var(--foreground))",
              }}
            >
              {PERIODS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <select
              value={filterUnit}
              onChange={(e) =>
                setFilterUnit(
                  e.target.value === "all" ? "all" : Number(e.target.value),
                )
              }
              className="px-3 py-1.5 rounded border border-border text-xs outline-none"
              style={{
                background: "hsl(var(--secondary))",
                color: "hsl(var(--foreground))",
              }}
            >
              <option value="all">Все части</option>
              {UNITS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            {(["all", "received", "pending", "overdue"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className="px-3 py-1.5 rounded text-xs font-medium transition-all"
                style={{
                  background:
                    filterStatus === s
                      ? "hsl(var(--primary))"
                      : "hsl(var(--secondary))",
                  color:
                    filterStatus === s
                      ? "#fff"
                      : "hsl(var(--muted-foreground))",
                }}
              >
                {s === "all" ? "Все" : statusConfig[s].label}
              </button>
            ))}
            <button
              onClick={() => setShowForm(true)}
              className="ml-auto flex items-center gap-2 px-4 py-1.5 rounded text-xs font-semibold text-white hover:opacity-90"
              style={{ background: "hsl(var(--primary))" }}
            >
              <Icon name="Plus" size={14} />
              Добавить отчёт
            </button>
          </div>

          {/* Table */}
          <div
            className="rounded-lg border border-border overflow-hidden"
            style={{ background: "hsl(var(--card))" }}
          >
            <table className="w-full text-xs">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid hsl(var(--border))",
                    background: "hsl(var(--secondary))",
                  }}
                >
                  {[
                    "Воинская часть",
                    "Тип отчёта",
                    "Период",
                    "Статус",
                    "Дата получения",
                    "Принял",
                    "Примечания",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left font-medium"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      Записей не найдено
                    </td>
                  </tr>
                )}
                {filtered.map((r) => {
                  const sc = statusConfig[r.status];
                  return (
                    <tr
                      key={r.id}
                      style={{ borderBottom: "1px solid hsl(var(--border))" }}
                      className="hover:bg-secondary/30 transition-colors"
                    >
                      <td
                        className="px-3 py-2.5 font-medium"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        {r.unitName}
                      </td>
                      <td
                        className="px-3 py-2.5"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        {r.reportType}
                      </td>
                      <td
                        className="px-3 py-2.5"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        {r.period}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className="px-2 py-0.5 rounded inline-flex items-center gap-1"
                          style={{ background: sc.bg, color: sc.color }}
                        >
                          <Icon
                            name={sc.icon as Parameters<typeof Icon>[0]["name"]}
                            size={11}
                          />
                          {sc.label}
                        </span>
                      </td>
                      <td
                        className="px-3 py-2.5"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        {r.receivedDate
                          ? new Date(r.receivedDate).toLocaleDateString("ru-RU")
                          : "—"}
                      </td>
                      <td
                        className="px-3 py-2.5"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        {r.receivedBy || "—"}
                      </td>
                      <td
                        className="px-3 py-2.5 max-w-[140px] truncate"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        {r.notes || "—"}
                      </td>
                      <td className="px-3 py-2.5">
                        {r.status !== "received" && (
                          <button
                            onClick={() => markReceived(r)}
                            className="px-2.5 py-1 rounded text-xs font-medium hover:opacity-90 transition-opacity"
                            style={{
                              background: "hsl(var(--primary) / 0.15)",
                              color: "hsl(var(--primary))",
                            }}
                          >
                            Отметить
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: unit stats */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-3">
          <div
            className="rounded-lg border border-border p-4"
            style={{ background: "hsl(var(--card))" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon
                name="BarChart2"
                size={15}
                style={{ color: "hsl(var(--primary))" }}
              />
              <span
                className="text-sm font-semibold"
                style={{ color: "hsl(var(--foreground))" }}
              >
                По воинским частям
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {unitStats.map((u) => (
                <div key={u.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-xs font-medium"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {u.name}
                    </span>
                    <span
                      className="text-xs font-mono"
                      style={{
                        color:
                          u.pct === 100
                            ? "#22c55e"
                            : u.overdue > 0
                              ? "#ef4444"
                              : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {u.received}/{u.total}
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "hsl(var(--secondary))" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${u.pct}%`,
                        background:
                          u.pct === 100
                            ? "#22c55e"
                            : u.overdue > 0
                              ? "#ef4444"
                              : "hsl(var(--primary))",
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span
                      className="text-xs"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {u.pct}%
                    </span>
                    {u.overdue > 0 && (
                      <span className="text-xs" style={{ color: "#ef4444" }}>
                        просроч.: {u.overdue}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div
            className="rounded-lg border border-border p-4"
            style={{ background: "hsl(var(--card))" }}
          >
            <div
              className="text-xs font-semibold mb-3"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Итого за период
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span style={{ color: "hsl(var(--muted-foreground))" }}>
                  Исполнение
                </span>
                <span
                  style={{
                    color:
                      stats.total > 0 && stats.received === stats.total
                        ? "#22c55e"
                        : "hsl(var(--foreground))",
                  }}
                  className="font-mono font-medium"
                >
                  {stats.total > 0
                    ? Math.round((stats.received / stats.total) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "hsl(var(--secondary))" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width:
                      stats.total > 0
                        ? `${Math.round((stats.received / stats.total) * 100)}%`
                        : "0%",
                    background: stats.overdue > 0 ? "#ef4444" : "#22c55e",
                  }}
                />
              </div>
              <div className="flex justify-between text-xs pt-1">
                <span style={{ color: "#22c55e" }}>
                  ✓ {stats.received} получено
                </span>
                <span style={{ color: "#ef4444" }}>
                  ✗ {stats.overdue} просроч.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mark received modal */}
      {markModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div
            className="rounded-xl border border-border p-6 w-96"
            style={{ background: "hsl(var(--card))" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon name="CheckCircle" size={18} style={{ color: "#22c55e" }} />
              <span className="font-semibold text-white">
                Отметить получение
              </span>
            </div>
            <div className="space-y-3 mb-5">
              <div>
                <div
                  className="text-xs mb-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Воинская часть
                </div>
                <div className="text-sm font-medium text-white">
                  {markModal.unitName}
                </div>
              </div>
              <div>
                <div
                  className="text-xs mb-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Тип отчёта
                </div>
                <div className="text-sm text-white">{markModal.reportType}</div>
              </div>
              <div>
                <label
                  className="text-xs block mb-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Принял
                </label>
                <input
                  value={markBy}
                  onChange={(e) => setMarkBy(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-border text-sm outline-none"
                  style={{
                    background: "hsl(var(--secondary))",
                    color: "hsl(var(--foreground))",
                  }}
                />
              </div>
              <div>
                <label
                  className="text-xs block mb-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Примечания
                </label>
                <textarea
                  value={markNotes}
                  onChange={(e) => setMarkNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded border border-border text-sm outline-none resize-none"
                  style={{
                    background: "hsl(var(--secondary))",
                    color: "hsl(var(--foreground))",
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={confirmMark}
                className="flex-1 py-2 rounded font-semibold text-sm text-white hover:opacity-90"
                style={{ background: "#22c55e" }}
              >
                Подтвердить получение
              </button>
              <button
                onClick={() => setMarkModal(null)}
                className="px-4 py-2 rounded text-sm"
                style={{
                  background: "hsl(var(--secondary))",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add report modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div
            className="rounded-xl border border-border p-6 w-96"
            style={{ background: "hsl(var(--card))" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon
                name="FilePlus"
                size={18}
                style={{ color: "hsl(var(--primary))" }}
              />
              <span className="font-semibold text-white">Добавить отчёт</span>
            </div>
            <div className="space-y-3 mb-5">
              <div>
                <label
                  className="text-xs block mb-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Воинская часть
                </label>
                <select
                  value={newForm.unitId}
                  onChange={(e) =>
                    setNewForm((f) => ({
                      ...f,
                      unitId: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 rounded border border-border text-sm outline-none"
                  style={{
                    background: "hsl(var(--secondary))",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  {UNITS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="text-xs block mb-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Тип отчёта
                </label>
                <select
                  value={newForm.reportType}
                  onChange={(e) =>
                    setNewForm((f) => ({ ...f, reportType: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded border border-border text-sm outline-none"
                  style={{
                    background: "hsl(var(--secondary))",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  {REPORT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="text-xs block mb-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Период
                </label>
                <select
                  value={newForm.period}
                  onChange={(e) =>
                    setNewForm((f) => ({ ...f, period: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded border border-border text-sm outline-none"
                  style={{
                    background: "hsl(var(--secondary))",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  {PERIODS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addRecord}
                className="flex-1 py-2 rounded font-semibold text-sm text-white hover:opacity-90"
                style={{ background: "hsl(var(--primary))" }}
              >
                Добавить
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded text-sm"
                style={{
                  background: "hsl(var(--secondary))",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
