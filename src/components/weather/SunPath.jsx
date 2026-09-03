import { Sunrise, Sunset } from "lucide-react";
import { Card } from "../common/Card";
import { formatTime } from "../../utils/format";

export function SunPath({ bundle }) {
  const today = bundle.daily[0];
  if (!today?.sunrise || !today?.sunset) {
    return (
      <Card>
        <h3 className="text-base font-semibold text-ink-900 dark:text-ink-50">Sun path</h3>
        <p className="mt-4 text-sm text-ink-500 dark:text-ink-300">Sun path not available.</p>
      </Card>
    );
  }

  const sunriseMs = new Date(today.sunrise).getTime();
  const sunsetMs = new Date(today.sunset).getTime();
  const nowMs = Date.now();
  const total = sunsetMs - sunriseMs;
  const rawProgress = (nowMs - sunriseMs) / total;
  const progress = Math.max(0, Math.min(1, rawProgress));

  const angle = Math.PI * progress;
  const cx = 20 + (280 - 20) * progress;
  const cy = 90 - Math.sin(angle) * 60;

  const daylightMs = total;
  const hours = Math.floor(daylightMs / 3600_000);
  const minutes = Math.floor((daylightMs % 3600_000) / 60_000);

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-ink-900 dark:text-ink-50">Sun path</h3>
        <p className="text-xs text-ink-400">
          {hours}h {minutes}m daylight
        </p>
      </div>

      <div className="mt-auto pt-3">
        <svg viewBox="0 0 300 110" className="w-full">
          <defs>
            <linearGradient id="sunGrad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#fb923c" />
              <stop offset="0.5" stopColor="#fbbf24" />
              <stop offset="1" stopColor="#94a3b8" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <path
            d="M 20 90 Q 150 -30 280 90"
            fill="none"
            stroke="currentColor"
            className="text-ink-300 dark:text-ink-600"
            strokeWidth="1.5"
            strokeDasharray="3 4"
          />
          <path
            d="M 20 90 Q 150 -30 280 90"
            fill="none"
            stroke="url(#sunGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="360"
            strokeDashoffset={360 * (1 - progress)}
          />
          <line
            x1="10"
            y1="90"
            x2="290"
            y2="90"
            stroke="currentColor"
            className="text-ink-300 dark:text-ink-600"
            strokeDasharray="2 4"
          />
          <circle cx={cx} cy={cy} r="6" fill="#fbbf24" />
          <circle cx={cx} cy={cy} r="10" fill="#fbbf24" opacity="0.25" />
        </svg>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sunrise className="h-4 w-4 text-warning" />
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-ink-400">Sunrise</p>
            <p className="font-mono text-sm text-ink-900 dark:text-ink-50">
              {formatTime(today.sunrise, bundle.timezone)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-[10px] font-mono uppercase tracking-widest text-ink-400">Sunset</p>
            <p className="font-mono text-sm text-ink-900 dark:text-ink-50">
              {formatTime(today.sunset, bundle.timezone)}
            </p>
          </div>
          <Sunset className="h-4 w-4 text-orange-400" />
        </div>
      </div>
    </Card>
  );
}
