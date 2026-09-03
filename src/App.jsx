import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { Toasts } from "./components/common/Toasts";
import { WeatherPage } from "./pages/WeatherPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { HistoryPage } from "./pages/HistoryPage";
import { StatisticsPage } from "./pages/StatisticsPage";
import { SettingsPage } from "./pages/SettingsPage";

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectLocation } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const onSelectLocation = (loc) => {
    selectLocation(loc);
    if (location.pathname !== "/weather") navigate("/weather");
  };

  const toggleSidebar = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setSidebarCollapsed((collapsed) => !collapsed);
      return;
    }
    setMenuOpen((open) => !open);
  };

  return (
    <div className="min-h-screen bg-[#EFF2F7] text-ink-900 dark:bg-ink-950 dark:text-ink-50">
      <div className="mx-auto flex max-w-[1600px]">
        <Sidebar
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((c) => !c)}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col transition-[width] duration-300 ease-out">
          <Header onSelectLocation={onSelectLocation} onToggleSidebar={toggleSidebar} />

          <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-6">
            <div className="mb-4 lg:hidden">
              <p className="text-xs text-ink-400">
                {new Intl.DateTimeFormat(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date())}
              </p>
              <h1 className="font-display text-2xl text-ink-900 dark:text-ink-50">
                {greetingFor()}, Amelia
              </h1>
            </div>

            <Routes>
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/" element={<Navigate to="/weather" />} />
            </Routes>
          </main>

          <footer className="border-t border-[#E1E6ED]/50 px-4 py-4 text-xs text-ink-400 sm:px-6 dark:border-ink-600/30">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p>Halcyon Weather Intelligence · Data from Open-Meteo</p>
              <p className="font-mono">v1.0 · frontend-only</p>
            </div>
          </footer>
        </div>
      </div>

      <Toasts />
    </div>
  );
}



function greetingFor() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </BrowserRouter>
  );
}
