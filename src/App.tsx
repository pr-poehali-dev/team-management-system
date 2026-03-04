import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Icon from "@/components/ui/icon";
import DashboardPage from "@/pages/DashboardPage";
import RequestsPage from "@/pages/RequestsPage";
import CalendarPage from "@/pages/CalendarPage";
import EmployeesPage from "@/pages/EmployeesPage";
import ClientsPage from "@/pages/ClientsPage";
import ControlPage from "@/pages/ControlPage";

type Page = "dashboard" | "requests" | "calendar" | "employees" | "clients" | "control";

const NAV_ITEMS: { id: Page; label: string; icon: string; badge?: number }[] = [
  { id: "dashboard", label: "Аналитика", icon: "LayoutDashboard" },
  { id: "requests", label: "Заявки", icon: "FileText", badge: 5 },
  { id: "calendar", label: "Календарь", icon: "CalendarDays" },
  { id: "employees", label: "Сотрудники", icon: "Users" },
  { id: "clients", label: "Воинские части", icon: "Building2" },
  { id: "control", label: "Контроль", icon: "BarChart3" },
];

export default function App() {
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <DashboardPage />;
      case "requests": return <RequestsPage />;
      case "calendar": return <CalendarPage />;
      case "employees": return <EmployeesPage />;
      case "clients": return <ClientsPage />;
      case "control": return <ControlPage />;
    }
  };

  return (
    <TooltipProvider>
      <Toaster />
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        {/* Sidebar */}
        <aside
          className={`flex flex-col border-r border-border transition-all duration-300 ${
            collapsed ? "w-16" : "w-60"
          }`}
          style={{ background: "hsl(var(--sidebar-background))" }}
        >
          {/* Logo */}
          <div className={`flex items-center gap-3 px-4 py-5 border-b border-border ${collapsed ? "justify-center" : ""}`}>
            <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: "hsl(var(--primary))" }}>
              <span className="text-white font-bold text-sm font-mono">N</span>
            </div>
            {!collapsed && (
              <div>
                <div className="text-white font-bold text-base tracking-wider">NEXUS</div>
                <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Enterprise Suite</div>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const active = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-150 relative group ${
                    collapsed ? "justify-center" : ""
                  }`}
                  style={{
                    background: active ? "hsl(var(--primary) / 0.12)" : "transparent",
                    borderLeft: active ? "2px solid hsl(var(--primary))" : "2px solid transparent",
                    color: active ? "hsl(210 85% 72%)" : "hsl(var(--sidebar-foreground))",
                  }}
                >
                  <Icon
                    name={item.icon as any}
                    size={18}
                    className="flex-shrink-0"
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="text-xs px-1.5 py-0.5 rounded font-mono"
                      style={{ background: "hsl(var(--primary) / 0.2)", color: "hsl(var(--primary))" }}>
                      {item.badge}
                    </span>
                  )}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none"
                      style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom user */}
          <div className="border-t border-border p-3 space-y-2">
            {!collapsed && (
              <div className="flex items-center gap-2 px-2 py-2 rounded"
                style={{ background: "hsl(var(--sidebar-accent))" }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "hsl(var(--primary))" }}>
                  АД
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">Алексей Данилов</div>
                  <div className="text-xs truncate" style={{ color: "hsl(var(--muted-foreground))" }}>Администратор</div>
                </div>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded transition-colors hover:text-white"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <Icon name={collapsed ? "ChevronRight" : "ChevronLeft"} size={15} />
              {!collapsed && <span className="text-xs">Свернуть</span>}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="flex items-center justify-between px-6 py-3.5 border-b border-border flex-shrink-0"
            style={{ background: "hsl(var(--card))" }}>
            <div>
              <h1 className="text-white font-semibold text-base">
                {NAV_ITEMS.find(n => n.id === activePage)?.label}
              </h1>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                {new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded transition-colors hover:bg-secondary"
                style={{ color: "hsl(var(--muted-foreground))" }}>
                <Icon name="Bell" size={16} />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                  style={{ background: "hsl(var(--primary))" }}></span>
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-border text-xs"
                style={{ color: "hsl(var(--muted-foreground))" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                Система активна
              </div>
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            {renderPage()}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}