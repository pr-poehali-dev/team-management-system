import Icon from "@/components/ui/icon";

const kpiCards = [
  { label: "Активные заявки", value: "47", delta: "+12%", trend: "up", icon: "FileText", color: "#dc2626" },
  { label: "Выполнено за месяц", value: "124", delta: "+8%", trend: "up", icon: "CheckCircle2", color: "#f59e0b" },
  { label: "Сотрудников", value: "38", delta: "+2", trend: "up", icon: "Users", color: "#ffffff" },
  { label: "Воинских частей", value: "91", delta: "+5%", trend: "up", icon: "Building2", color: "#d4af37" },
];

const topEmployees = [
  { name: "Иванов Дмитрий", dept: "Технический отдел", tasks: 24, kpi: 97 },
  { name: "Смирнова Анна", dept: "Отдел взаимодействия", tasks: 21, kpi: 94 },
  { name: "Козлов Павел", dept: "Разработка", tasks: 19, kpi: 91 },
  { name: "Петрова Ольга", dept: "Маркетинг", tasks: 17, kpi: 88 },
  { name: "Новиков Сергей", dept: "Продажи", tasks: 15, kpi: 85 },
];

const recentRequests = [
  { id: "REQ-2501", title: "Замена оборудования в серверной", priority: "high", status: "В работе", assignee: "ИД" },
  { id: "REQ-2500", title: "Настройка VPN для удалённых сотрудников", priority: "medium", status: "Ожидает", assignee: "КП" },
  { id: "REQ-2499", title: "Обновление лицензий Microsoft Office", priority: "low", status: "Выполнено", assignee: "СА" },
  { id: "REQ-2498", title: "Аудит информационной безопасности", priority: "high", status: "В работе", assignee: "НС" },
];

const statusColors: Record<string, string> = {
  "В работе": "#d4af37",
  "Ожидает": "#f59e0b",
  "Выполнено": "#22c55e",
  "Отклонено": "#dc2626",
};

const priorityColors: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

const priorityLabels: Record<string, string> = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
};

const monthlyData = [
  { month: "Авг", done: 68, pending: 22 },
  { month: "Сен", done: 82, pending: 18 },
  { month: "Окт", done: 75, pending: 25 },
  { month: "Ноя", done: 91, pending: 14 },
  { month: "Дек", done: 87, pending: 20 },
  { month: "Янв", done: 95, pending: 11 },
  { month: "Фев", done: 110, pending: 19 },
  { month: "Мар", done: 124, pending: 47 },
];

const maxVal = Math.max(...monthlyData.map(d => d.done + d.pending));

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div key={card.label} className="rounded-lg border border-border p-5 relative overflow-hidden"
            style={{ background: "hsl(var(--card))" }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5"
              style={{ background: card.color, transform: "translate(30%, -30%)" }} />
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded"
                style={{ background: `${card.color}18` }}>
                <Icon name={card.icon as any} size={16} style={{ color: card.color }} />
              </div>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded"
                style={{ background: "#22c55e18", color: "#22c55e" }}>
                {card.delta}
              </span>
            </div>
            <div className="text-2xl font-bold text-white font-mono mb-1">{card.value}</div>
            <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="col-span-2 rounded-lg border border-border p-5"
          style={{ background: "hsl(var(--card))" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-white font-semibold text-sm">Динамика выполнения заявок</div>
              <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>Последние 8 месяцев</div>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded inline-block" style={{ background: "#d4af37" }}></span>Выполнено
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded inline-block" style={{ background: "#f59e0b" }}></span>В работе
              </span>
            </div>
          </div>
          <div className="flex items-end gap-3 h-40">
            {monthlyData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: "120px" }}>
                  <div className="w-full rounded-t transition-all"
                    style={{
                      height: `${(d.pending / maxVal) * 120}px`,
                      background: "#f59e0b55",
                    }} />
                  <div className="w-full rounded-t transition-all"
                    style={{
                      height: `${(d.done / maxVal) * 120}px`,
                      background: "hsl(var(--primary))",
                      opacity: 0.85,
                    }} />
                </div>
                <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department breakdown */}
        <div className="rounded-lg border border-border p-5"
          style={{ background: "hsl(var(--card))" }}>
          <div className="text-white font-semibold text-sm mb-4">Загрузка отделов</div>
          <div className="space-y-3">
            {[
              { name: "Технический", load: 89, tasks: 18 },
              { name: "Разработка", load: 75, tasks: 14 },
              { name: "Продажи", load: 62, tasks: 11 },
              { name: "Маркетинг", load: 45, tasks: 8 },
              { name: "HR", load: 38, tasks: 7 },
            ].map((dept) => (
              <div key={dept.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "hsl(var(--muted-foreground))" }}>{dept.name}</span>
                  <span className="font-mono text-white">{dept.tasks} задач</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "hsl(var(--border))" }}>
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${dept.load}%`,
                      background: dept.load > 80 ? "#dc2626" : dept.load > 60 ? "#f59e0b" : "#d4af37",
                    }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Recent Requests */}
        <div className="rounded-lg border border-border"
          style={{ background: "hsl(var(--card))" }}>
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <span className="text-white font-semibold text-sm">Последние заявки</span>
            <button className="text-xs" style={{ color: "hsl(var(--primary))" }}>Все заявки →</button>
          </div>
          <div className="divide-y divide-border">
            {recentRequests.map((req) => (
              <div key={req.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: priorityColors[req.priority] }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{req.title}</div>
                  <div className="text-xs font-mono mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{req.id}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded"
                    style={{ background: `${statusColors[req.status]}18`, color: statusColors[req.status] }}>
                    {req.status}
                  </span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "hsl(var(--primary))" }}>
                    {req.assignee}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top employees */}
        <div className="rounded-lg border border-border"
          style={{ background: "hsl(var(--card))" }}>
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <span className="text-white font-semibold text-sm">Топ сотрудников по KPI</span>
            <span className="text-xs px-2 py-0.5 rounded"
              style={{ background: "hsl(var(--muted) / 0.5)", color: "hsl(var(--muted-foreground))" }}>
              Март 2026
            </span>
          </div>
          <div className="divide-y divide-border">
            {topEmployees.map((emp, idx) => (
              <div key={emp.name} className="px-5 py-3 flex items-center gap-3">
                <div className="w-6 text-center font-mono text-xs font-bold"
                  style={{ color: idx === 0 ? "#f59e0b" : idx === 1 ? "#9ca3af" : idx === 2 ? "#b45309" : "hsl(var(--muted-foreground))" }}>
                  #{idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{emp.name}</div>
                  <div className="text-xs mt-0.5 truncate" style={{ color: "hsl(var(--muted-foreground))" }}>{emp.dept}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 text-xs">
                  <span style={{ color: "hsl(var(--muted-foreground))" }}>{emp.tasks} задач</span>
                  <span className="font-mono font-bold"
                    style={{ color: emp.kpi >= 90 ? "#22c55e" : emp.kpi >= 80 ? "#f59e0b" : "#ef4444" }}>
                    {emp.kpi}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}