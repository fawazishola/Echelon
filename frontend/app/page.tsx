import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import logoPerfect from "../public/logo-perfect.svg";

export default function Splash() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-600 to-violet-700 text-white relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl"></div>
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-md text-center">
        
        {/* Mascot / Logo */}
        <div className="mb-8 relative w-48 h-48 bg-white rounded-[40px] p-6 flex items-center justify-center shadow-2xl animate-bounce-slow shadow-indigo-500/30">
             <Image src={logoPerfect} alt="Echelon Logo" className="w-full h-full object-contain drop-shadow-sm" priority />
        </div>

        <h1 className="text-4xl font-bold mb-2 tracking-tight">Echelon</h1>
        <p className="text-lg text-indigo-100 mb-12 font-medium opacity-90">
          Swipe. Apply. Fund Your Future.
        </p>

        <div className="w-full space-y-4">
          <Link
            href="/login" // In a real app navigate to login/onboarding
            className="group w-full flex items-center justify-center gap-2 bg-white text-indigo-600 font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/login"
            className="block w-full text-center text-sm font-medium text-indigo-100 hover:text-white transition-colors underline decoration-indigo-300/50 underline-offset-4"
          >
            I already have an account
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 text-xs text-indigo-200/60">
        © 2026 Echelon Inc.
      </div>
    </main>
  );
}
