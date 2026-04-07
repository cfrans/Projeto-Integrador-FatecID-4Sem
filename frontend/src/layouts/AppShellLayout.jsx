import { Outlet } from "react-router-dom";

import AnimatedBackground from "@/components/effects/AnimatedBackground";
import AppNavbar from "@/components/navigation/AppNavbar";

export default function AppShellLayout() {
    return (
        <div className="relative isolate min-h-screen overflow-hidden px-3 py-4 sm:px-5">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
                <AnimatedBackground />
            </div>

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 z-10 mx-auto h-[320px] w-[min(1200px,98vw)] rounded-b-[48px] bg-[linear-gradient(180deg,#0f6d67_0%,#0f4f5b_58%,#17304f_100%)] shadow-[0_26px_70px_rgba(10,37,53,0.5)]"
            />

            <div className="relative z-20 mx-auto flex w-full max-w-6xl flex-col gap-4">
                <AppNavbar />

                <section className="min-h-[calc(100vh-140px)] rounded-2xl border border-slate-200 bg-[#f4f5f7] p-5 text-slate-900 shadow-xl shadow-black/25 sm:p-6">
                    <Outlet />
                </section>
            </div>
        </div>
    );
}
