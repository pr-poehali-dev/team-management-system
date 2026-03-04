import { useState } from "react";
import Icon from "@/components/ui/icon";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

interface Task {
  id: number;
  title: string;
  date: number;
  type: "meeting" | "task" | "deadline";
  assignee: string;
  time: string;
}

const TASKS: Task[] = [
  { id: 1, title: "Встреча с ПАО Газпром", date: 4, type: "meeting", assignee: "ИД", time: "10:00" },
  { id: 2, title: "Сдача аудита Q1", date: 7, type: "deadline", assignee: "НС", time: "18:00" },
  { id: 3, title: "Планёрка технического отдела", date: 10, type: "meeting", assignee: "Все", time: "09:30" },
  { id: 4, title: "Установка оборудования REQ-2501", date: 10, type: "task", assignee: "ИД", time: "14:00" },
  { id: 5, title: "Демо VPN для воинской части", date: 15, type: "meeting", assignee: "КП", time: "11:00" },
  { id: 6, title: "Дедлайн REQ-2500", date: 7, type: "deadline", assignee: "КП", time: "17:00" },
  { id: 7, title: "Оплата лицензий MS Office", date: 20, type: "task", assignee: "СА", time: "12:00" },
  { id: 8, title: "Квартальная отчётность", date: 25, type: "deadline", assignee: "АД", time: "15:00" },
  { id: 9, title: "Инструктаж новых сотрудников", date: 12, type: "task", assignee: "ПО", time: "10:00" },
];

const typeConfig = {
  meeting: { color: "#3b82f6", bg: "#3b82f620", label: "Встреча" },
  task:    { color: "#8b5cf6", bg: "#8b5cf620", label: "Задача" },
  deadline:{ color: "#ef4444", bg: "#ef444420", label: "Дедлайн" },
};

export default function CalendarPage() {
  const [year] = useState(2026);
  const [month, setMonth] = useState(2); // March (0-indexed)
  const [selectedDay, setSelectedDay] = useState<number | null>(4);
  const [showAddTask, setShowAddTask] = useState(false);

  // First day of month (0=Sun, need Mon-based)
  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = 4; // March 4, 2026

  const cells = Array.from({ length: startOffset + daysInMonth }, (_, i) => {
    const day = i < startOffset ? null : i - startOffset + 1;
    return day;
  });

  const selectedTasks = TASKS.filter(t => t.date === selectedDay);
  const allDates = TASKS.map(t => t.date);

  return (
    <div className="flex gap-4 h-full">
      {/* Calendar */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Month nav */}
        <div className="flex items-center justify-between rounded-lg border border-border px-5 py-3"
          style={{ background: "hsl(var(--card))" }}>
          <button onClick={() => setMonth(m => Math.max(0, m - 1))}
            className="p-1.5 rounded hover:bg-secondary transition-colors"
            style={{ color: "hsl(var(--muted-foreground))" }}>
            <Icon name="ChevronLeft" size={16} />
          </button>
          <div className="text-center">
            <div className="text-white font-semibold">{MONTHS[month]} {year}</div>
          </div>
          <button onClick={() => setMonth(m => Math.min(11, m + 1))}
            className="p-1.5 rounded hover:bg-secondary transition-colors"
            style={{ color: "hsl(var(--muted-foreground))" }}>
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>

        {/* Grid */}
        <div className="rounded-lg border border-border overflow-hidden"
          style={{ background: "hsl(var(--card))" }}>
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {DAYS.map((d) => (
              <div key={d} className="py-2.5 text-center text-xs font-semibold uppercase tracking-wider"
                style={{ color: "hsl(var(--muted-foreground))" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, idx) => {
              const isToday = day === today && month === 2;
              const isSelected = day === selectedDay;
              const hasTasks = day !== null && allDates.includes(day);
              const dayTasks = TASKS.filter(t => t.date === day);

              return (
                <div
                  key={idx}
                  onClick={() => day && setSelectedDay(day)}
                  className={`min-h-20 p-2 border-b border-r border-border transition-colors cursor-pointer ${
                    day ? "hover:bg-secondary/40" : ""
                  } ${isSelected ? "bg-primary/10" : ""}`}
                >
                  {day && (
                    <>
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium mb-1 ${
                        isToday ? "text-white" : isSelected ? "" : ""
                      }`}
                        style={{
                          background: isToday ? "hsl(var(--primary))" : "transparent",
                          color: isToday ? "#fff" : isSelected ? "hsl(var(--primary))" : "hsl(var(--foreground))",
                          fontWeight: isToday || isSelected ? 700 : 400,
                        }}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayTasks.slice(0, 2).map(t => (
                          <div key={t.id}
                            className="text-xs px-1 py-0.5 rounded truncate"
                            style={{ background: typeConfig[t.type].bg, color: typeConfig[t.type].color }}>
                            {t.title}
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                            +{dayTasks.length - 2} ещё
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4">
          {Object.entries(typeConfig).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs"
              style={{ color: "hsl(var(--muted-foreground))" }}>
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: val.color }}></span>
              {val.label}
            </div>
          ))}
        </div>
      </div>

      {/* Side panel */}
      <div className="w-72 flex flex-col gap-4">
        {/* Selected day tasks */}
        <div className="rounded-lg border border-border overflow-hidden"
          style={{ background: "hsl(var(--card))" }}>
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="text-white font-semibold text-sm">
              {selectedDay ? `${selectedDay} ${MONTHS[month]}` : "Выберите день"}
            </span>
            <button
              onClick={() => setShowAddTask(true)}
              className="p-1.5 rounded transition-colors text-white"
              style={{ background: "hsl(var(--primary))" }}>
              <Icon name="Plus" size={13} />
            </button>
          </div>
          <div className="divide-y divide-border max-h-80 overflow-y-auto">
            {selectedTasks.length === 0 ? (
              <div className="py-8 text-center">
                <Icon name="Calendar" size={24} className="mx-auto mb-2 opacity-30" />
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Нет событий</p>
              </div>
            ) : (
              selectedTasks.map(task => (
                <div key={task.id} className="px-4 py-3">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-full rounded mt-1 flex-shrink-0 self-stretch"
                      style={{ background: typeConfig[task.type].color, minHeight: "40px" }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white">{task.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
                          {task.time}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: typeConfig[task.type].bg, color: typeConfig[task.type].color }}>
                          {typeConfig[task.type].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: "hsl(var(--primary))", fontSize: "9px" }}>
                          {task.assignee.slice(0, 2)}
                        </div>
                        <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                          {task.assignee}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming */}
        <div className="rounded-lg border border-border"
          style={{ background: "hsl(var(--card))" }}>
          <div className="px-4 py-3 border-b border-border">
            <span className="text-white font-semibold text-sm">Ближайшие события</span>
          </div>
          <div className="divide-y divide-border">
            {TASKS.filter(t => t.date >= today).sort((a, b) => a.date - b.date).slice(0, 5).map(task => (
              <div key={task.id} className="px-4 py-2.5 flex items-center gap-3 hover:bg-secondary/30 transition-colors cursor-pointer"
                onClick={() => setSelectedDay(task.date)}>
                <div className="text-center w-8 flex-shrink-0">
                  <div className="text-lg font-bold font-mono leading-none"
                    style={{ color: "hsl(var(--primary))" }}>{task.date}</div>
                  <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>мар</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{task.title}</div>
                  <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{task.time}</div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: typeConfig[task.type].color }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add task modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowAddTask(false); }}>
          <div className="rounded-xl border border-border w-full max-w-md p-6 space-y-4 animate-slide-up"
            style={{ background: "hsl(var(--card))" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">Добавить событие</h2>
              <button onClick={() => setShowAddTask(false)} style={{ color: "hsl(var(--muted-foreground))" }}>
                <Icon name="X" size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <input className="w-full px-3 py-2 text-sm rounded border border-border outline-none text-white"
                style={{ background: "hsl(var(--secondary))" }} placeholder="Название события" />
              <div className="grid grid-cols-2 gap-3">
                <select className="w-full px-3 py-2 text-sm rounded border border-border outline-none text-white"
                  style={{ background: "hsl(var(--secondary))", colorScheme: "dark" }}>
                  <option value="meeting">Встреча</option>
                  <option value="task">Задача</option>
                  <option value="deadline">Дедлайн</option>
                </select>
                <input type="time" className="w-full px-3 py-2 text-sm rounded border border-border outline-none text-white"
                  style={{ background: "hsl(var(--secondary))", colorScheme: "dark" }} />
              </div>
              <input className="w-full px-3 py-2 text-sm rounded border border-border outline-none text-white"
                style={{ background: "hsl(var(--secondary))" }} placeholder="Исполнитель" />
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowAddTask(false)}
                className="flex-1 py-2 rounded text-sm border border-border hover:bg-secondary transition-colors"
                style={{ color: "hsl(var(--muted-foreground))" }}>Отмена</button>
              <button onClick={() => setShowAddTask(false)}
                className="flex-1 py-2 rounded text-sm text-white font-medium hover:opacity-90"
                style={{ background: "hsl(var(--primary))" }}>Добавить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}