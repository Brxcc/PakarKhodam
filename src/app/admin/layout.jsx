"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Brain, LayoutDashboard, Stethoscope, Activity, BookOpen, LogOut, Menu, X, ChevronRight } from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) { router.push("/login"); return; }
        const data = await response.json();
        if (data.user.role !== "admin") { router.push("/"); return; }
        setUser(data.user);
      } catch {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Stethoscope, label: "Kelola Penyakit", href: "/admin/diseases" },
    { icon: Activity, label: "Kelola Gejala", href: "/admin/symptoms" },
    { icon: BookOpen, label: "Basis Pengetahuan", href: "/admin/rules" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080818] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-base">Memverifikasi akses admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a16] text-white">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0 w-68" : "-translate-x-full w-68"
        } bg-[#0e0e1e] border-r border-slate-800/80 flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-wide">PakarKhodam</span>
              <p className="text-xs font-medium text-indigo-400">Panel Administrator</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-bold shrink-0 text-white shadow-md">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-5 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-indigo-600/25 text-white border border-indigo-500/40 shadow-sm font-semibold"
                    : "text-gray-300 hover:text-white hover:bg-white/[0.06] border border-transparent"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-400" : "text-gray-400 group-hover:text-indigo-300"}`} />
                <span className="text-sm">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-indigo-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-4 py-3 w-full rounded-xl text-sm font-medium text-gray-300 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400 shrink-0" />
            <span className="text-sm">Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-68" : ""}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#0c0c1c]/90 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm font-medium text-gray-300">
              Sistem Pakar Diagnosis Kesehatan Mental — Forward Chaining & Teorema Bayes
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 min-h-[calc(100vh-4rem)]">{children}</main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
