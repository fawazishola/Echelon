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
      <header className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 md:p-8 mb-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Alerts</h1>
          <p className="text-indigo-100 font-medium text-sm md:text-base">Stay on top of deadlines and updates.</p>
        </div>
        <button className="relative z-10 text-sm font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors backdrop-blur-sm self-start md:self-auto">
          Mark all read
        </button>
      </header>

      <div className="space-y-4">
        {notifications.map((note) => {
          const Icon = note.icon;
          return (
            <div
              key={note.id}
              className={`p-4 rounded-2xl border flex gap-4 transition-all hover:bg-slate-50 ${note.unread ? "bg-white border-slate-200 shadow-sm" : "bg-slate-50/50 border-transparent opacity-80"
                }`}
            >
              <div className={`mt-1 p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0 ${note.color}`}>
                <Icon size={20} />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-sm font-bold ${note.unread ? "text-slate-900" : "text-slate-700"}`}>
                    {note.title}
                  </h3>
                  {note.unread && <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>}
                </div>
                <p className="text-sm text-slate-600 leading-snug mb-2">
                  {note.description}
                </p>
                <span className="text-xs font-semibold text-slate-400">
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
