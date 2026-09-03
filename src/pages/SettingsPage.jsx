import { useEffect, useState } from "react";
import { Check, Moon, RotateCcw, Save, Sun, MonitorSmartphone, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { SegmentedControl } from "../components/common/SegmentedControl";
import { Toggle } from "../components/common/Toggle";

export function SettingsPage() {
  const { settings, updateSettings, resetSettings, clearHistory, toast } = useApp();
  const [draft, setDraft] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);

  const onSave = (e) => {
    e.preventDefault();
    updateSettings(draft);
    setSaved(true);
    toast({ kind: "success", title: "Preferences saved" });
    window.setTimeout(() => setSaved(false), 3000);
  };

  const onReset = () => {
    resetSettings();
    toast({ kind: "info", title: "Reset to defaults" });
  };

  return (
    <form onSubmit={onSave} className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-widest text-ink-400">Settings</p>
          <h2 className="mt-1 font-display text-3xl text-ink-900 dark:text-ink-50 sm:text-4xl">
            Preferences
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-500 dark:text-ink-300">
            Personalize units, appearance and what shows up on your dashboard. Everything is saved to this browser.
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" leftIcon={<RotateCcw className="h-3.5 w-3.5" />} onClick={onReset}>
            Reset to defaults
          </Button>
          <Button
            type="submit"
            variant="primary"
            leftIcon={<Save className="h-3.5 w-3.5" />}
            disabled={!dirty}
          >
            Save changes
          </Button>
        </div>
      </div>

      {saved ? (
        <div className="flex items-center gap-3 rounded-[20px] border border-success/20 bg-success/8 p-4 text-sm shadow-[0_10px_30px_-24px_rgba(52,211,153,0.45)]">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-success/20">
            <Check className="h-4 w-4 text-success" />
          </span>
          <p className="text-ink-900 dark:text-ink-50">Your preferences have been saved.</p>
        </div>
      ) : null}

      <hr className="border-[#E1E6ED]/50 dark:border-ink-600/30" />

      <Section
        title="Units"
        description="How temperatures, wind and precipitation are displayed across the app."
      >
        <SettingRow
          label="Temperature"
          description={
            draft.temperatureUnit === "celsius"
              ? "Currently set to Celsius"
              : "Currently set to Fahrenheit"
          }
        >
          <SegmentedControl
            value={draft.temperatureUnit}
            onChange={(v) => setDraft((d) => ({ ...d, temperatureUnit: v }))}
            options={[
              { value: "celsius", label: "°C", sublabel: "Celsius" },
              { value: "fahrenheit", label: "°F", sublabel: "Fahrenheit" },
            ]}
            ariaLabel="Temperature unit"
          />
        </SettingRow>
        <SettingRow label="Wind speed" description="Set once — used in cards, chart and stats.">
          <SegmentedControl
            value={draft.windUnit}
            onChange={(v) => setDraft((d) => ({ ...d, windUnit: v }))}
            options={[
              { value: "kmh", label: "km/h" },
              { value: "mph", label: "mph" },
              { value: "ms", label: "m/s" },
            ]}
            ariaLabel="Wind unit"
          />
        </SettingRow>
        <SettingRow label="Precipitation" description="mm are standard for millimetric measurement.">
          <SegmentedControl
            value={draft.precipUnit}
            onChange={(v) => setDraft((d) => ({ ...d, precipUnit: v }))}
            options={[
              { value: "mm", label: "mm" },
              { value: "inch", label: "inches" },
            ]}
            ariaLabel="Precipitation unit"
          />
        </SettingRow>
      </Section>

      <hr className="border-[#E1E6ED]/50 dark:border-ink-600/30" />

      <Section title="Appearance" description="Theme affects the entire application in real time.">
        <SettingRow
          label="Theme"
          description={
            draft.theme === "dark"
              ? "Dark — reduced glare, ideal for low-light rooms"
              : draft.theme === "light"
              ? "Light — high visibility during the day"
              : "Auto — follows your system setting"
          }
        >
          <ThemeSegmented value={draft.theme} onChange={(v) => setDraft((d) => ({ ...d, theme: v }))} />
        </SettingRow>
        <SettingRow label="Reduce motion" description="Turn off subtle animations and transitions.">
          <Toggle
            checked={draft.reduceMotion}
            onChange={(v) => setDraft((d) => ({ ...d, reduceMotion: v }))}
            label="Reduce motion"
          />
        </SettingRow>
        <SettingRow label="High contrast" description="Boost text and border contrast for accessibility.">
          <Toggle
            checked={draft.highContrast}
            onChange={(v) => setDraft((d) => ({ ...d, highContrast: v }))}
            label="High contrast"
          />
        </SettingRow>
      </Section>

      <hr className="border-[#E1E6ED]/50 dark:border-ink-600/30" />

      <Section
        title="Auto refresh"
        description="Keep the selected location's weather up to date while this dashboard is open."
      >
        <SettingRow
          label="Refresh weather"
          description={
            Number(draft.autoRefreshMinutes) > 0
              ? `Automatically refreshes every ${draft.autoRefreshMinutes} minutes.`
              : "Automatic refresh is off."
          }
        >
          <SegmentedControl
            value={Number(draft.autoRefreshMinutes) || 0}
            onChange={(v) => setDraft((d) => ({ ...d, autoRefreshMinutes: Number(v) }))}
            options={[
              { value: 0, label: "Off" },
              { value: 5, label: "5", sublabel: "min" },
              { value: 10, label: "10", sublabel: "min" },
              { value: 15, label: "15", sublabel: "min" },
            ]}
            ariaLabel="Automatic weather refresh interval"
          />
        </SettingRow>
      </Section>

      <hr className="border-[#E1E6ED]/50 dark:border-ink-600/30" />
      <Section
        title="Dashboard"
        description="Choose what shows up on your main weather view, and how much detail you want."
      >
        <SettingRow label="Default forecast range" description="Applies to the daily forecast card.">
          <SegmentedControl
            value={draft.forecastRange}
            onChange={(v) => setDraft((d) => ({ ...d, forecastRange: v }))}
            options={[
              { value: 3, label: "3", sublabel: "days" },
              { value: 5, label: "5", sublabel: "days" },
              { value: 7, label: "7", sublabel: "days" },
            ]}
            ariaLabel="Forecast range"
          />
        </SettingRow>
        <SettingRow label="Show weather chart" description="Interactive temperature / rain / wind trend.">
          <Toggle
            checked={draft.showChart}
            onChange={(v) => setDraft((d) => ({ ...d, showChart: v }))}
            label="Show weather chart"
          />
        </SettingRow>
        <SettingRow label="Show statistics" description="Weekly highs, lows and totals.">
          <Toggle
            checked={draft.showStatistics}
            onChange={(v) => setDraft((d) => ({ ...d, showStatistics: v }))}
            label="Show statistics"
          />
        </SettingRow>
      </Section>

      <hr className="border-[#E1E6ED]/50 dark:border-ink-600/30" />

      <Section title="Data" description="Manage what this browser has stored.">
        <SettingRow label="Search history" description="Clear the last five searched locations.">
          <Button
            type="button"
            variant="danger"
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => {
              clearHistory();
              toast({ kind: "info", title: "History cleared" });
            }}
          >
            Clear history
          </Button>
        </SettingRow>
      </Section>
    </form>
  );
}

function Section({ title, description, children }) {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
      <div>
        <h3 className="text-lg font-semibold text-ink-900 dark:text-ink-50">{title}</h3>
        <p className="mt-1 max-w-xs text-sm text-ink-500 dark:text-ink-300">{description}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <Card padded={false} className="p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-900 dark:text-ink-50">{label}</p>
          {description ? (
            <p className="mt-0.5 font-mono text-xs text-ink-400">{description}</p>
          ) : null}
        </div>
        <div className="shrink-0">{children}</div>
      </div>
    </Card>
  );
}

function ThemeSegmented({ value, onChange }) {
  const opts = [
    { value: "light", label: "Light", icon: <Sun className="h-3.5 w-3.5" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-3.5 w-3.5" /> },
    { value: "auto", label: "Auto", icon: <MonitorSmartphone className="h-3.5 w-3.5" /> },
  ];
  return (
    <div
      role="radiogroup"
      className="inline-flex items-center gap-0.5 rounded-[16px] border border-[#E1E6ED]/45 bg-white/50 p-1 dark:border-ink-600/30 dark:bg-ink-800/50"
    >
      {opts.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`flex items-center gap-1.5 rounded-[12px] px-3 py-1.5 text-xs transition-colors ${
              active
                ? "bg-accent-400 text-ink-950"
                : "text-ink-500 hover:text-ink-800 dark:text-ink-300 dark:hover:text-ink-50"
            }`}
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
