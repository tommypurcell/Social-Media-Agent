import { Sparkles, Zap, Target } from 'lucide-react';


const WelcomeStep = () => {
  return (
    <div className="text-center space-y-8 py-4">
      <div className="flex justify-center">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-white font-bold text-5xl tracking-tighter">C</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Welcome to Connectivity
        </h3>
        <p className="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
          Your autonomous AI marketing agent is ready to scale your presence using data-driven strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {[
          { icon: Sparkles, title: "AI Content", desc: "Generates tailored posts instantly", color: "text-indigo-600", bg: "bg-indigo-50" },
          { icon: Zap, title: "Auto-Pilot", desc: "Schedules and publishes 24/7", color: "text-violet-600", bg: "bg-violet-50" },
          { icon: Target, title: "Strategy", desc: "Optimizes for maximum reach", color: "text-fuchsia-600", bg: "bg-fuchsia-50" }
        ].map((item, i) => (
          <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className={`w-14 h-14 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
              <item.icon className={`w-7 h-7 ${item.color}`} />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-400 font-medium pt-4">
        Setup takes less than 2 minutes
      </p>
    </div>
  );
};

export default WelcomeStep;
