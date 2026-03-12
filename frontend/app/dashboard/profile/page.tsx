"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { fetchWithAuth } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";
import {
  LogOut,
  Edit2,
  CheckCircle2,
  X,
  TrendingUp,
  Sparkles,
} from "lucide-react";

interface ProfileStats {
  total_won: number;
  total_potential_value: number;
  applied_count: number;
  saved_count: number;
  won_count: number;
  lost_count: number;
  win_rate: number;
  profile_completeness: number;
  missing_fields: string[];
}

const FIELD_LABELS: Record<string, string> = {
  full_name: "Full Name",
  dob: "Date of Birth",
  gender: "Gender",
  ethnicity: "Ethnicity",
  education_level: "Education Level",
  institution: "Institution",
  major: "Major",
  gpa: "GPA",
  grad_year: "Graduation Year",
  extracurriculars: "Extracurriculars",
  awards: "Awards",
  volunteer_work: "Volunteer Work",
};

// --- SVG Progress Ring Component ---
function ProgressRing({
  percentage,
  size = 80,
  strokeWidth = 8,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100"
        />
        {/* Animated progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-indigo-600"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-xl font-black text-slate-900"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {percentage}%
        </motion.span>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    major: (user as any)?.major || "",
    gpa: (user as any)?.gpa || "",
  });

  // Fetch profile stats on mount
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetchWithAuth("/users/me/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error("Failed to fetch profile stats:", e);
      }
    }
    fetchStats();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth("/users/me", {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const token = localStorage.getItem("token");
        if (token) await login(token);
        setIsEditing(false);
        // Re-fetch stats since profile completeness may have changed
        const statsRes = await fetchWithAuth("/users/me/stats");
        if (statsRes.ok) setStats(await statsRes.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  // Determine which dollar metric to highlight
  const showTotalWon = stats && stats.total_won > 0;
  const heroLabel = showTotalWon ? "Total Won" : "Total Potential Value";
  const heroValue = showTotalWon
    ? stats?.total_won ?? 0
    : stats?.total_potential_value ?? 0;

  // Profile completeness CTA
  const firstMissing = stats?.missing_fields?.[0];
  const boostPercent =
    stats ? Math.round(100 / 12) : 0; // ~8% per field (12 fields)

  return (
    <div className="flex flex-col min-h-full pb-8 max-w-3xl mx-auto w-full">
      {/* ── Header ── */}
      <header className="flex items-center justify-between pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Profile
        </h1>
        {!isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-2 text-indigo-600 font-semibold"
          >
            <Edit2 size={16} /> Edit
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(false)}
            className="gap-2 text-slate-500 font-semibold text-sm"
          >
            <X size={16} /> Cancel
          </Button>
        )}
      </header>

      {/* ── Avatar Card ── */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center mb-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black mb-4 shadow-lg shadow-indigo-200">
          {formData.full_name
            ? formData.full_name.substring(0, 1).toUpperCase()
            : "U"}
        </div>

        {!isEditing ? (
          <>
            <h2 className="text-xl font-bold text-slate-900">
              {user.full_name}
            </h2>
            <p className="text-slate-500 font-medium mb-4">{user.email}</p>
            <div className="flex gap-2">
              <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-slate-400">
                  Major
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {(user as any).major || "Not set"}
                </span>
              </div>
              <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-slate-400">
                  GPA
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {(user as any).gpa || "N/A"}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full space-y-4 mt-2">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block pl-1">
                Name
              </label>
              <Input
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 mb-1 block pl-1">
                  Major
                </label>
                <Input
                  value={formData.major}
                  onChange={(e) =>
                    setFormData({ ...formData, major: e.target.value })
                  }
                />
              </div>
              <div className="w-24">
                <label className="text-xs font-bold text-slate-500 mb-1 block pl-1">
                  GPA
                </label>
                <Input
                  value={formData.gpa}
                  onChange={(e) =>
                    setFormData({ ...formData, gpa: e.target.value })
                  }
                />
              </div>
            </div>
            <Button
              className="w-full mt-2"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════
          NEW SECTION 1: Total Value Hero + Funnel Stats
          ══════════════════════════════════════════════ */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative overflow-hidden mb-4 group hover:shadow-md transition-all"
        >
          {/* Decorative blob */}
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-50 pointer-events-none" />

          <div className="flex flex-col items-center text-center relative z-10">
            {/* Label */}
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 mb-1 flex items-center gap-1">
              {showTotalWon && (
                <TrendingUp size={12} className="text-emerald-500" />
              )}
              {heroLabel}
            </span>

            {/* Big number */}
            <div className="text-[40px] font-black text-emerald-500 leading-none tracking-tight mb-4 drop-shadow-sm">
              ${heroValue.toLocaleString()}
            </div>

            {/* ─ Funnel Row ─ */}
            <div className="flex w-full divide-x divide-slate-100 border-t border-slate-50 pt-4">
              <div className="flex-1 flex flex-col items-center">
                <span className="text-2xl font-bold text-indigo-600">
                  {stats.applied_count}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Applied
                </span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <span className="text-2xl font-bold text-slate-800">
                  {stats.saved_count}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Saved
                </span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <span className="text-2xl font-bold text-amber-500">
                  {stats.win_rate}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Win Rate
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════
          NEW SECTION 2: Profile Completeness Ring
          ══════════════════════════════════════════════ */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-6 mb-6 cursor-pointer hover:border-indigo-200 transition-colors"
        >
          <ProgressRing percentage={stats.profile_completeness} />

          <div className="flex-1 min-w-0">
            {stats.profile_completeness >= 100 ? (
              <>
                <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-400" />
                  Profile Complete!
                </h3>
                <p className="text-xs text-slate-500 leading-tight">
                  You're getting the best possible matches. Keep applying!
                </p>
              </>
            ) : (
              <>
                <h3 className="font-bold text-slate-900 text-sm mb-1">
                  Supercharge your matches
                </h3>
                <p className="text-xs text-slate-500 mb-3 leading-tight">
                  {firstMissing
                    ? `Add your ${FIELD_LABELS[firstMissing] || firstMissing} to boost your Match Power and unlock better funds.`
                    : "Complete your profile to unlock better matches."}
                </p>
                <div className="inline-flex bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  +{boostPercent}% Profile Boost
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Settings List ── */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-6">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="font-semibold text-slate-700">
            Application Documents
          </div>
          <div className="text-slate-400">2 files</div>
        </div>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="font-semibold text-slate-700">
            Notification Settings
          </div>
          <CheckCircle2 size={20} className="text-emerald-500" />
        </div>
        <div className="p-4 flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="font-semibold text-slate-700">
            Privacy & Security
          </div>
        </div>
      </div>

      {/* ── Logout ── */}
      <button
        onClick={logout}
        className="w-full h-14 bg-white border border-rose-100 text-rose-500 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-rose-50 transition-colors shadow-sm"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
}
