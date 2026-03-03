import { useState } from "react";
import Icon from "@/components/ui/icon";

interface ClientEmployee {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  certified: boolean;
  certExpiry: string;
  docs: string[];
}

interface Client {
  id: number;
  name: string;
  type: string;
  inn: string;
  address: string;
  industry: string;
  status: "active" | "inactive" | "lead";
  manager: string;
  contracts: number;
  revenue: string;
  employees: ClientEmployee[];
}

const CLIENTS: Client[] = [
  {
    id: 1, name: "ПАО Газпром", type: "ПАО", inn: "7736050003", address: "Москва, ул. Наметкина, 16",
    industry: "Энергетика", status: "active", manager: "Смирнова А.", contracts: 12, revenue: "4.2 млн ₽",
    employees: [
      { id: 1, name: "Захаров Игорь", position: "CTO", email: "zakharov@gazprom.ru", phone: "+7 495 719-30-01", certified: true, certExpiry: "2027-04-15", docs: ["Договор_2025.pdf", "Акт_приёма.pdf"] },
      { id: 2, name: "Волкова Светлана", position: "IT-директор", email: "volkova@gazprom.ru", phone: "+7 495 719-30-02", certified: false, certExpiry: "", docs: [] },
    ]
  },
  {
    id: 2, name: "ООО Технострой", type: "ООО", inn: "7706123456", address: "Москва, ул. Тверская, 25",
    industry: "Строительство", status: "active", manager: "Иванов Д.", contracts: 5, revenue: "1.8 млн ₽",
    employees: [
      { id: 3, name: "Морозов Дмитрий", position: "Директор", email: "morozov@tehnostroy.ru", phone: "+7 495 321-10-01", certified: true, certExpiry: "2026-09-01", docs: ["Устав.pdf"] },
    ]
  },
  {
    id: 3, name: "АО РосТех", type: "АО", inn: "7710987654", address: "Москва, Ленинградский пр-т, 37",
    industry: "Производство", status: "active", manager: "Козлов П.", contracts: 8, revenue: "3.1 млн ₽",
    employees: [
      { id: 4, name: "Попова Елена", position: "Финансовый директор", email: "popova@rostech.ru", phone: "+7 495 555-20-01", certified: true, certExpiry: "2025-11-20", docs: ["Контракт_Q1.pdf", "NDA.pdf", "Акт.pdf"] },
      { id: 5, name: "Громов Артём", position: "Менеджер проектов", email: "gromov@rostech.ru", phone: "+7 495 555-20-02", certified: false, certExpiry: "", docs: [] },
    ]
  },
  {
    id: 4, name: "АО Сибнефть", type: "АО", inn: "7704567890", address: "Москва, ул. Пречистенка, 12",
    industry: "Нефтяная", status: "inactive", manager: "Новиков С.", contracts: 2, revenue: "0.4 млн ₽",
    employees: []
  },
  {
    id: 5, name: "ООО Альфа", type: "ООО", inn: "7705678901", address: "Москва, ул. Садовническая, 8",
    industry: "Финансы", status: "lead", manager: "Петрова О.", contracts: 0, revenue: "—",
    employees: []
  },
  {
    id: 6, name: "ООО Логистик", type: "ООО", inn: "7701234567", address: "Москва, ул. Профсоюзная, 65",
    industry: "Логистика", status: "active", manager: "Смирнова А.", contracts: 3, revenue: "0.9 млн ₽",
    employees: [
      { id: 6, name: "Степанов Виктор", position: "Начальник IT", email: "stepanov@logistic.ru", phone: "+7 495 444-50-01", certified: true, certExpiry: "2027-12-01", docs: ["Договор.pdf"] },
    ]
  },
];

const statusConfig = {
  active:   { label: "Активный", color: "#22c55e", bg: "#22c55e18" },
  inactive: { label: "Неактивный", color: "#6b7280", bg: "#6b728018" },
  lead:     { label: "Потенциальный", color: "#3b82f6", bg: "#3b82f618" },
};

function isCertExpired(expiry: string) {
  if (!expiry) return false;
  return new Date(expiry) < new Date();
}

export default function ClientsPage() {
  const [selected, setSelected] = useState<Client | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive" | "lead">("all");
  const [activeTab, setActiveTab] = useState<"info" | "employees">("info");

  const filtered = CLIENTS.filter(c => {
    const matchStatus = filter === "all" || c.status === filter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex gap-4 h-full">
      {/* Left: client list */}
      <div className="flex flex-col gap-4" style={{ width: selected ? "360px" : "100%", flexShrink: 0 }}>
        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["all", "active", "inactive", "lead"] as const).map(s => (
            <button key={s}
              onClick={() => setFilter(s)}
              className="px-3 py-1.5 rounded text-xs font-medium transition-all"
              style={{
                background: filter === s ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                color: filter === s ? "#fff" : "hsl(var(--muted-foreground))",
              }}>
              {s === "all" ? "Все" : statusConfig[s].label}
            </button>
          ))}
          <div className="relative ml-auto">
            <Icon name="Search" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2"
              style={{ color: "hsl(var(--muted-foreground))" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Поиск клиентов..."
              className="pl-8 pr-3 py-1.5 text-xs rounded border border-border outline-none w-44"
              style={{ background: "hsl(var(--secondary))", color: "hsl(var(--foreground))" }} />
          </div>
          <button className="flex items-center gap-2 px-4 py-1.5 rounded text-xs font-semibold text-white hover:opacity-90"
            style={{ background: "hsl(var(--primary))" }}>
            <Icon name="Plus" size={14} />
            Добавить
          </button>
        </div>

        {/* Grid cards */}
        <div className={`grid gap-3 ${selected ? "grid-cols-1" : "grid-cols-3"}`}>
          {filtered.map(client => (
            <div key={client.id}
              onClick={() => setSelected(client)}
              className="rounded-lg border p-4 cursor-pointer transition-all hover:border-primary/50"
              style={{
                background: "hsl(var(--card))",
                border: selected?.id === client.id
                  ? "1px solid hsl(var(--primary))"
                  : "1px solid hsl(var(--border))",
              }}>
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "hsl(var(--primary) / 0.2)", color: "hsl(var(--primary))" }}>
                  {client.name.slice(0, 2)}
                </div>
                <span className="text-xs px-2 py-0.5 rounded"
                  style={{ background: statusConfig[client.status].bg, color: statusConfig[client.status].color }}>
                  {statusConfig[client.status].label}
                </span>
              </div>
              <div className="text-sm font-semibold text-white mt-2">{client.name}</div>
              <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{client.industry}</div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="text-center">
                  <div className="text-xs font-bold font-mono text-white">{client.contracts}</div>
                  <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Контрактов</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold font-mono text-white">{client.employees.length}</div>
                  <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Контактов</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold font-mono" style={{ color: "#22c55e" }}>{client.revenue}</div>
                  <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Выручка</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: detail */}
      {selected && (
        <div className="flex-1 min-w-0 rounded-lg border border-border overflow-hidden animate-fade-in"
          style={{ background: "hsl(var(--card))" }}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between"
            style={{ background: "hsl(var(--secondary))" }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-base font-bold"
                style={{ background: "hsl(var(--primary) / 0.2)", color: "hsl(var(--primary))" }}>
                {selected.name.slice(0, 2)}
              </div>
              <div>
                <div className="text-white font-bold text-lg">{selected.name}</div>
                <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {selected.type} · {selected.industry}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded"
                style={{ background: statusConfig[selected.status].bg, color: statusConfig[selected.status].color }}>
                {statusConfig[selected.status].label}
              </span>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded hover:bg-background"
                style={{ color: "hsl(var(--muted-foreground))" }}>
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            {(["info", "employees"] as const).map(tab => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-3 text-sm font-medium transition-colors relative"
                style={{ color: activeTab === tab ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}>
                {tab === "info" ? "Информация" : `Сотрудники (${selected.employees.length})`}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: "hsl(var(--primary))" }} />
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "info" ? (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "Hash", label: "ИНН", value: selected.inn },
                  { icon: "MapPin", label: "Адрес", value: selected.address },
                  { icon: "User", label: "Менеджер", value: selected.manager },
                  { icon: "FileText", label: "Контрактов", value: selected.contracts.toString() },
                  { icon: "TrendingUp", label: "Выручка", value: selected.revenue },
                ].map(row => (
                  <div key={row.label} className="flex items-start gap-3 p-3 rounded"
                    style={{ background: "hsl(var(--secondary))" }}>
                    <Icon name={row.icon as any} size={14} className="mt-0.5 flex-shrink-0"
                      style={{ color: "hsl(var(--muted-foreground))" }} />
                    <div>
                      <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{row.label}</div>
                      <div className="text-sm text-white font-medium">{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {selected.employees.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="Users" size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Контакты не добавлены</p>
                    <button className="mt-3 text-xs text-white px-4 py-1.5 rounded hover:opacity-90"
                      style={{ background: "hsl(var(--primary))" }}>
                      Добавить контакт
                    </button>
                  </div>
                ) : (
                  selected.employees.map(emp => {
                    const expired = isCertExpired(emp.certExpiry);
                    return (
                      <div key={emp.id} className="rounded-lg border border-border p-4"
                        style={{ background: "hsl(var(--secondary))" }}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                              style={{ background: "hsl(var(--primary))" }}>
                              {emp.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-white">{emp.name}</div>
                              <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{emp.position}</div>
                            </div>
                          </div>
                          {emp.certified && (
                            <span className="text-xs px-2 py-0.5 rounded flex items-center gap-1"
                              style={{
                                background: expired ? "#ef444418" : "#22c55e18",
                                color: expired ? "#ef4444" : "#22c55e",
                              }}>
                              <Icon name={expired ? "AlertCircle" : "BadgeCheck"} size={11} />
                              {expired ? "Сертификат истёк" : "Сертифицирован"}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div className="flex items-center gap-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                            <Icon name="Mail" size={11} />
                            <span className="truncate">{emp.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                            <Icon name="Phone" size={11} />
                            <span>{emp.phone}</span>
                          </div>
                        </div>
                        {emp.certExpiry && (
                          <div className="text-xs mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
                            Сертификат до: <span className="font-mono text-white">
                              {new Date(emp.certExpiry).toLocaleDateString("ru-RU")}
                            </span>
                          </div>
                        )}
                        {emp.docs.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {emp.docs.map(doc => (
                              <span key={doc} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded cursor-pointer hover:opacity-80"
                                style={{ background: "hsl(var(--border))", color: "hsl(var(--foreground))" }}>
                                <Icon name="FileText" size={10} />
                                {doc}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <button className="w-full py-2 border-2 border-dashed border-border rounded text-xs text-center hover:border-primary/50 transition-colors"
                  style={{ color: "hsl(var(--muted-foreground))" }}>
                  + Добавить контакт
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
