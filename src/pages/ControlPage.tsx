import Icon from "@/components/ui/icon";

const kpiEmployees = [
  { name: "Иванов Дмитрий", dept: "Технический", done: 24, inwork: 3, overdue: 0, kpi: 97, trend: "+4%" },
  { name: "Смирнова Анна", dept: "Продажи", done: 21, inwork: 4, overdue: 1, kpi: 94, trend: "+2%" },
  { name: "Козлов Павел", dept: "Разработка", done: 19, inwork: 2, overdue: 0, kpi: 91, trend: "-1%" },
  { name: "Петрова Ольга", dept: "Маркетинг", done: 17, inwork: 5, overdue: 2, kpi: 88, trend: "+6%" },
  { name: "Новиков Сергей", dept: "Продажи", done: 15, inwork: 3, overdue: 1, kpi: 85, trend: "+1%" },
  { name: "Фёдорова Мария", dept: "HR", done: 12, inwork: 4, overdue: 0, kpi: 82, trend: "-3%" },
  { name: "Орлов Александр", dept: "Технический", done: 10, inwork: 2, overdue: 3, kpi: 78, trend: "-5%" },
  { name: "Лебедева Наталья", dept: "Бухгалтерия", done: 8, inwork: 2, overdue: 1, kpi: 75, trend: "+2%" },
];

const overdueRequests = [
  { id: "REQ-2490", title: "Восстановление данных после сбоя", assignee: "Орлов А.", overdueDays: 5, priority: "high" },
  { id: "REQ-2485", title: "Интеграция с CRM системой", assignee: "Петрова О.", overdueDays: 3, priority: "medium" },
  { id: "REQ-2480", title: "Обновление антивирусной защиты", assignee: "Новиков С.", overdueDays: 2, priority: "medium" },
  { id: "REQ-2476", title: "Настройка резервного копирования", assignee: "Орлов А.", overdueDays: 8, priority: "high" },
];

const deptStats = [
  { name: "Технический", total: 42, done: 35, overdue: 3, rate: 83 },
  { name: "Разработка", total: 31, done: 28, overdue: 0, rate: 90 },
  { name: "Продажи", total: 28, done: 23, overdue: 2, rate: 82 },
  { name: "Маркетинг", total: 19, done: 14, overdue: 2, rate: 74 },
  { name: "HR", total: 14, done: 13, overdue: 0, rate: 93 },
  { name: "Бухгалтерия", total: 10, done: 8, overdue: 1, rate: 80 },
];

const monthlyCompletion = [
  { month: "Сен", rate: 78 },
  { month: "Окт", rate: 74 },
  { month: "Ноя", rate: 82 },
  { month: "Дек", rate: 87 },
  { month: "Янв", rate: 84 },
  { month: "Фев", rate: 91 },
  { month: "Мар", rate: 89 },
];

export default function ControlPage() {
  return (
    <div className="space-y-5">
      {/* Top metrics */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Выполнение заявок", value: "87%", icon: "TrendingUp", color: "#22c55e", sub: "за март" },
          { label: "Просрочено", value: "7", icon: "AlertTriangle", color: "#dc2626", sub: "заявок" },
          { label: "В работе", value: "23", icon: "Clock", color: "#d4af37", sub: "сейчас" },
          { label: "Ср. время выполнения", value: "4.2д", icon: "Timer", color: "#f59e0b", sub: "на заявку" },
          { label: "Ср. KPI команды", value: "86%", icon: "Award", color: "#f59e0b", sub: "текущий месяц" },
        ].map(stat => (
          <div key={stat.label} className="rounded-lg border border-border p-4"
            style={{ background: "hsl(var(--card))" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded" style={{ background: `${stat.color}18` }}>
                <Icon name={stat.icon as any} size={14} style={{ color: stat.color }} />
              </div>
            </div>
            <div className="text-xl font-bold font-mono text-white">{stat.value}</div>
            <div className="text-xs font-medium text-white mt-0.5">{stat.label}</div>
            <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Completion trend */}
        <div className="rounded-lg border border-border p-5"
          style={{ background: "hsl(var(--card))" }}>
          <div className="text-white font-semibold text-sm mb-4">Процент выполнения</div>
          <div className="flex items-end gap-2 h-32">
            {monthlyCompletion.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs font-mono mb-1" style={{ color: "hsl(var(--primary))", fontSize: "10px" }}>
                  {d.rate}%
                </div>
                <div className="w-full rounded-t transition-all relative overflow-hidden"
                  style={{ height: `${d.rate}%`, background: "hsl(var(--primary))", opacity: 0.7 }}>
                </div>
                <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))", fontSize: "10px" }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department stats */}
        <div className="col-span-2 rounded-lg border border-border"
          style={{ background: "hsl(var(--card))" }}>
          <div className="px-5 py-4 border-b border-border">
            <span className="text-white font-semibold text-sm">Статистика по отделам</span>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                {["Отдел", "Всего", "Выполнено", "Просрочено", "Выполнение"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "hsl(var(--muted-foreground))" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {deptStats.map(dept => (
                <tr key={dept.name} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-white">{dept.name}</td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: "hsl(var(--foreground))" }}>{dept.total}</td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: "#22c55e" }}>{dept.done}</td>
                  <td className="px-4 py-3">
                    {dept.overdue > 0 ? (
                      <span className="text-xs font-mono font-bold" style={{ color: "#ef4444" }}>
                        {dept.overdue}
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: "#22c55e" }}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "hsl(var(--border))" }}>
                        <div className="h-full rounded-full"
                          style={{
                            width: `${dept.rate}%`,
                            background: dept.rate >= 90 ? "#22c55e" : dept.rate >= 80 ? "#d4af37" : "#f59e0b",
                          }} />
                      </div>
                      <span className="text-xs font-mono font-bold w-8 text-right"
                        style={{ color: dept.rate >= 90 ? "#22c55e" : dept.rate >= 80 ? "#d4af37" : "#f59e0b" }}>
                        {dept.rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Employee KPI table */}
        <div className="rounded-lg border border-border"
          style={{ background: "hsl(var(--card))" }}>
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <span className="text-white font-semibold text-sm">KPI сотрудников</span>
            <span className="text-xs px-2 py-0.5 rounded"
              style={{ background: "hsl(var(--muted) / 0.5)", color: "hsl(var(--muted-foreground))" }}>Март 2026</span>
          </div>
          <div className="divide-y divide-border">
            {kpiEmployees.map((emp, idx) => (
              <div key={emp.name} className="px-5 py-3 flex items-center gap-3 hover:bg-secondary/30 transition-colors">
                <span className="text-xs font-mono w-5 flex-shrink-0"
                  style={{ color: "hsl(var(--muted-foreground))" }}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{emp.name}</div>
                  <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{emp.dept}</div>
                </div>
                <div className="flex items-center gap-3 text-xs flex-shrink-0">
                  <div className="text-center">
                    <div className="font-mono text-white">{emp.done}</div>
                    <div style={{ color: "hsl(var(--muted-foreground))", fontSize: "10px" }}>выпол.</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono" style={{ color: emp.overdue > 0 ? "#ef4444" : "hsl(var(--muted-foreground))" }}>
                      {emp.overdue}
                    </div>
                    <div style={{ color: "hsl(var(--muted-foreground))", fontSize: "10px" }}>просроч.</div>
                  </div>
                  <div>
                    <div className="w-20 h-1.5 rounded-full" style={{ background: "hsl(var(--border))" }}>
                      <div className="h-full rounded-full"
                        style={{
                          width: `${emp.kpi}%`,
                          background: emp.kpi >= 90 ? "#22c55e" : emp.kpi >= 80 ? "#d4af37" : "#f59e0b",
                        }} />
                    </div>
                    <div className="flex justify-between items-center mt-0.5">
                      <span style={{ color: "hsl(var(--muted-foreground))", fontSize: "10px" }}>KPI</span>
                      <span className="font-mono font-bold"
                        style={{ color: emp.kpi >= 90 ? "#22c55e" : emp.kpi >= 80 ? "#d4af37" : "#f59e0b", fontSize: "11px" }}>
                        {emp.kpi}%
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs"
                    style={{ color: emp.trend.startsWith("+") ? "#22c55e" : "#ef4444" }}>
                    {emp.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue requests */}
        <div className="rounded-lg border border-border"
          style={{ background: "hsl(var(--card))" }}>
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <span className="text-white font-semibold text-sm">Просроченные заявки</span>
            <span className="text-xs px-2 py-0.5 rounded font-mono font-bold"
              style={{ background: "#ef444418", color: "#ef4444" }}>
              {overdueRequests.length}
            </span>
          </div>
          <div className="divide-y divide-border">
            {overdueRequests.map(req => (
              <div key={req.id} className="px-5 py-4 flex items-start gap-3 hover:bg-secondary/30 transition-colors">
                <div className="mt-0.5 flex-shrink-0">
                  <Icon name="AlertTriangle" size={14} style={{ color: "#ef4444" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{req.title}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-mono" style={{ color: "hsl(var(--primary))" }}>{req.id}</span>
                    <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>→ {req.assignee}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-bold font-mono" style={{ color: "#ef4444" }}>
                    +{req.overdueDays}д
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>просрочено</div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-border">
            <div className="rounded-lg p-3 flex items-center gap-3"
              style={{ background: "#ef444410", border: "1px solid #ef444430" }}>
              <Icon name="Info" size={14} style={{ color: "#ef4444" }} />
              <span className="text-xs" style={{ color: "#ef4444" }}>
                Просроченные задачи влияют на общий KPI отдела
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}