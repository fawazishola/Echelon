import { Bell, Clock, Trophy, CheckCircle2 } from "lucide-react";

export default function AlertsPage() {
  const notifications = [
    {
      id: 1,
      title: "Application Deadline Approaching!",
      description: "Your application for the Women Techmakers Scholarship is due in 3 days. Complete your essay to submit.",
      time: "2 hours ago",
      icon: Clock,
      color: "text-amber-500 bg-amber-50",
      unread: true,
    },
    {
      id: 2,
      title: "New Match Found",
      description: "Based on your major update, we found an 85% match for the Microsoft SWE Scholarship.",
      time: "1 day ago",
      icon: Trophy,
      color: "text-emerald-500 bg-emerald-50",
      unread: true,
    },
    {
      id: 3,
      title: "Application in Review",
      description: "Great news! The Taco Bell Live Más Scholarship committee has started reviewing your video.",
      time: "3 days ago",
      icon: CheckCircle2,
      color: "text-indigo-500 bg-indigo-50",
      unread: false,
    },
    {
      id: 4,
      title: "Welcome to Echelon",
      description: "Your profile is set up! Start swiping to find your perfect scholarship matches.",
      time: "1 week ago",
      icon: Bell,
      color: "text-slate-500 bg-slate-100",
      unread: false,
    }
  ];

  return (
    <div className="flex flex-col min-h-full pb-8 max-w-3xl mx-auto w-full">
      <header className="pb-5 mb-2 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Alerts</h1>
          <p className="text-slate-400 text-xs font-medium mt-0.5">Deadlines, updates, and new matches</p>
        </div>
        <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
          Mark all read
        </button>
      </header>

      <div className="space-y-2">
        {notifications.map((note) => {
          const Icon = note.icon;
          return (
            <div
              key={note.id}
              className={`p-3.5 rounded-xl flex gap-3.5 transition-all ${note.unread ? "bg-white border border-slate-200/80 shadow-sm" : "bg-transparent border border-transparent opacity-70"
                }`}
            >
              <div className={`mt-0.5 p-2 rounded-lg h-9 w-9 flex items-center justify-center shrink-0 ${note.color}`}>
                <Icon size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className={`text-[13px] font-semibold leading-tight ${note.unread ? "text-slate-900" : "text-slate-600"}`}>
                    {note.title}
                  </h3>
                  {note.unread && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0 ml-2"></span>}
                </div>
                <p className="text-[12px] text-slate-500 leading-snug mb-1.5 line-clamp-2">
                  {note.description}
                </p>
                <span className="text-[11px] font-medium text-slate-300">
                  {note.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
