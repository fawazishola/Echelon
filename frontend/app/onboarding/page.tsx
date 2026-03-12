"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mascot } from "@/components/Mascot";
import { useAuth } from "@/lib/auth";
import { fetchWithAuth } from "@/lib/api";
import { Check, UploadCloud, ChevronRight, ChevronLeft, Calendar, User, BookOpen, GraduationCap, Trophy, FileText, CheckCircle2 } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const { user, login } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // State for onboarding data
    const [formData, setFormData] = useState({
        full_name: user?.full_name || "",
        dob: "",
        gender: "",
        ethnicity: "",

        education_level: "",
        institution: "",
        major: "",
        gpa: "",
        grad_year: "",

        extracurriculars: "",
        awards: "",
        volunteer_work: "",

        // In a real app we'd store the files
        transcript_uploaded: false,
        resume_uploaded: false,
        essay_uploaded: false,
    });

    const updateForm = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const nextStep = () => setStep((s) => Math.min(6, s + 1));
    const prevStep = () => setStep((s) => Math.max(1, s - 1));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth("/users/me", {
                method: "PUT",
                body: JSON.stringify({ ...formData, onboarding_complete: true })
            });

            if (res.ok) {
                // Force an auth context refresh
                const token = localStorage.getItem("token");
                if (token) await login(token);

                nextStep(); // Go to celebration step
            } else {
                console.error("Failed to update profile", await res.text());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-indigo-50 p-3 rounded-full text-indigo-600">
                                <User size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Personal Info</h2>
                                <p className="text-slate-500">Let's get the basics down.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Input
                                placeholder="Full Name"
                                value={formData.full_name}
                                onChange={(e) => updateForm("full_name", e.target.value)}
                                autoComplete="name"
                                required
                            />
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <Input
                                    type="text"
                                    placeholder="Date of Birth (YYYY-MM-DD)"
                                    className="pl-12"
                                    value={formData.dob}
                                    onChange={(e) => updateForm("dob", e.target.value)}
                                    autoComplete="bday"
                                    pattern="\d{4}-\d{2}-\d{2}"
                                    required
                                />
                            </div>
                            <select
                                className="flex h-14 w-full rounded-xl border-2 border-transparent bg-slate-100 px-4 py-2 text-base text-slate-900 focus-visible:outline-none focus-visible:border-indigo-600 focus-visible:bg-white transition-all"
                                value={formData.gender}
                                onChange={(e) => updateForm("gender", e.target.value)}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-binary">Non-binary</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-amber-50 p-3 rounded-full text-amber-500">
                                <GraduationCap size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Academics</h2>
                                <p className="text-slate-500">Where are you in your journey?</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <select
                                className="flex h-14 w-full rounded-xl border-2 border-transparent bg-slate-100 px-4 py-2 text-base text-slate-900 focus-visible:outline-none focus-visible:border-indigo-600 focus-visible:bg-white transition-all"
                                value={formData.education_level}
                                onChange={(e) => updateForm("education_level", e.target.value)}
                            >
                                <option value="">Education Level</option>
                                <option value="High School">High School</option>
                                <option value="Undergraduate">Undergraduate</option>
                                <option value="Graduate">Graduate</option>
                            </select>

                            <div className="relative">
                                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <Input
                                    placeholder="Institution Name"
                                    className="pl-12"
                                    value={formData.institution}
                                    onChange={(e) => updateForm("institution", e.target.value)}
                                />
                            </div>

                            <Input
                                placeholder="Major / Field of Study"
                                value={formData.major}
                                onChange={(e) => updateForm("major", e.target.value)}
                            />

                            <div className="flex gap-4">
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="GPA"
                                    className="w-1/2"
                                    value={formData.gpa}
                                    onChange={(e) => updateForm("gpa", e.target.value)}
                                />
                                <Input
                                    type="number"
                                    placeholder="Grad Year"
                                    className="w-1/2"
                                    value={formData.grad_year}
                                    onChange={(e) => updateForm("grad_year", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-emerald-50 p-3 rounded-full text-emerald-500">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Achievements</h2>
                                <p className="text-slate-500">What makes you stand out?</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-2 block">Extracurriculars</label>
                                <Input
                                    placeholder="E.g., Debate team, Robotics club, Varsity soccer"
                                    value={formData.extracurriculars}
                                    onChange={(e) => updateForm("extracurriculars", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-2 block">Awards & Honors</label>
                                <Input
                                    placeholder="E.g., National Merit Finalist, Science Fair 1st place"
                                    value={formData.awards}
                                    onChange={(e) => updateForm("awards", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-2 block">Volunteer Work</label>
                                <Input
                                    placeholder="E.g., Habitat for Humanity, Local food bank"
                                    value={formData.volunteer_work}
                                    onChange={(e) => updateForm("volunteer_work", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-rose-50 p-3 rounded-full text-rose-500">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Documents</h2>
                                <p className="text-slate-500">Upload now or add them later.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Upload Zones */}
                            {[
                                { id: "transcript", label: "Transcript (PDF)", state: formData.transcript_uploaded },
                                { id: "resume", label: "Resume / CV (PDF)", state: formData.resume_uploaded },
                                { id: "essay", label: "Personal Statement (Optional)", state: formData.essay_uploaded },
                            ].map((doc) => (
                                <div
                                    key={doc.id}
                                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${doc.state ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50"
                                        }`}
                                    onClick={() => updateForm(`${doc.id}_uploaded`, !doc.state)}
                                >
                                    {doc.state ? (
                                        <div className="flex flex-col items-center text-emerald-600">
                                            <CheckCircle2 size={32} className="mb-2" />
                                            <span className="font-semibold">{doc.label} Uploaded</span>
                                            <span className="text-xs opacity-80 mt-1">Tap to change</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-500">
                                            <UploadCloud size={32} className="mb-2 text-slate-400" />
                                            <span className="font-medium text-slate-700">Upload {doc.label}</span>
                                            <span className="text-xs text-slate-400 mt-1">Drag and drop or browse</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <Mascot expression="thinking" size={80} className="mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-slate-900">Review Your Profile</h2>
                            <p className="text-slate-500">Does everything look correct?</p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl space-y-4 shadow-inner border border-slate-100">
                            <div>
                                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Personal</h3>
                                <p className="text-slate-900 font-medium">{formData.full_name} • {formData.gender || "Not specified"}</p>
                            </div>
                            <div className="h-px bg-slate-200"></div>
                            <div>
                                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Academics</h3>
                                <p className="text-slate-900 font-medium">{formData.institution || "No institution"} • {formData.major || "No major"}</p>
                                <p className="text-slate-600 text-sm mt-0.5">GPA: {formData.gpa || "N/A"} • Class of {formData.grad_year || "N/A"}</p>
                            </div>
                            <div className="h-px bg-slate-200"></div>
                            <div>
                                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Documents</h3>
                                <div className="flex gap-2 mt-2">
                                    {formData.transcript_uploaded && <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-md">Transcript</span>}
                                    {formData.resume_uploaded && <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-md">Resume</span>}
                                    {!formData.transcript_uploaded && !formData.resume_uploaded && <span className="text-sm text-slate-500">No documents uploaded</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="text-center py-12 flex flex-col items-center justify-center h-full min-h-[50vh]">
                        <Mascot expression="celebrating" size={120} className="mx-auto mb-8 animate-bounce" />
                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">You're All Set!</h2>
                        <p className="text-lg text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed">
                            We've analyzed your profile and found <strong>dozens of scholarships</strong> you have a high chance of winning.
                        </p>
                        <Button size="lg" className="w-full text-lg shadow-xl shadow-indigo-200/50" onClick={() => router.push("/dashboard/discover")}>
                            Start Swiping <ChevronRight size={20} className="ml-2" />
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:bg-slate-50 md:py-12 md:px-4">
            <div className="flex-1 w-full max-w-lg mx-auto bg-white flex flex-col md:rounded-3xl md:shadow-xl md:border md:border-slate-100 md:overflow-hidden relative">

                {/* Progress Bar (Hidden on celebration setup) */}
                {step < 6 && (
                    <div className="w-full bg-slate-100 h-2">
                        <div
                            className="bg-indigo-600 h-full transition-all duration-500 ease-out"
                            style={{ width: `${(step / 5) * 100}%` }}
                        ></div>
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 flex flex-col p-6 md:p-10 relative overflow-hidden">

                    <AnimatePresence mode="wait" custom={1}>
                        <motion.div
                            key={step}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                            className="flex-1 w-full"
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>

                </div>

                {/* Bottom Navigation / Controls */}
                {step < 6 && (
                    <div className="p-6 md:p-8 bg-white border-t border-slate-100 flex items-center justify-between z-10">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={prevStep}
                            disabled={step === 1 || loading}
                            className={step === 1 ? "opacity-0" : "opacity-100"}
                        >
                            <ChevronLeft size={24} />
                        </Button>

                        {step < 5 ? (
                            <Button onClick={nextStep} className="px-8 shadow-md">
                                Next Step <ChevronRight size={18} className="ml-1" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                className="px-8 bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200 shadow-lg"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Complete Profile"} <Check size={18} className="ml-1" />
                            </Button>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
