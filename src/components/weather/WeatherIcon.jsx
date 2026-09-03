import { describeWeather } from "../../utils/weatherCodes";
import { cn } from "../../utils/cn";

const SIZE_CLASS = {
  xs: "h-5 w-5 text-lg",
  sm: "h-6 w-6 text-xl",
  md: "h-8 w-8 text-2xl",
  lg: "h-10 w-10 text-3xl",
  xl: "h-14 w-14 text-4xl",
  "2xl": "h-20 w-20 text-6xl",
};

export function WeatherIcon({ code, isDay = true, size = "md", className }) {
  const info = describeWeather(code);
  return (
    <div
      className={cn("flex items-center justify-center", SIZE_CLASS[size], className)}
      aria-label={info.label}
      role="img"
    >
      <Glyph kind={info.kind} isDay={isDay} />
    </div>
  );
}

function Glyph({ kind, isDay }) {
  const sun = "#fbbf24";
  const sun2 = "#f59e0b";
  const moon = "#cbd5e1";
  const cloud = "#94a3b8";
  const cloud2 = "#64748b";
  const rain = "#60a5fa";
  const snow = "#e0f2fe";
  const bolt = "#facc15";

  switch (kind) {
    case "clear":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          {isDay ? (
            <>
              <circle cx="32" cy="32" r="14" fill={sun} />
              <g stroke={sun2} strokeWidth="3" strokeLinecap="round">
                <line x1="32" y1="6" x2="32" y2="12" />
                <line x1="32" y1="52" x2="32" y2="58" />
                <line x1="6" y1="32" x2="12" y2="32" />
                <line x1="52" y1="32" x2="58" y2="32" />
                <line x1="14" y1="14" x2="18" y2="18" />
                <line x1="46" y1="46" x2="50" y2="50" />
                <line x1="14" y1="50" x2="18" y2="46" />
                <line x1="46" y1="18" x2="50" y2="14" />
              </g>
            </>
          ) : (
            <path d="M42 12 A20 20 0 1 0 52 34 A16 16 0 0 1 42 12 Z" fill={moon} />
          )}
        </svg>
      );
    case "mostly-clear":
    case "partly-cloudy":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          {isDay ? (
            <>
              <circle cx="22" cy="24" r="10" fill={sun} />
              <g stroke={sun2} strokeWidth="2" strokeLinecap="round">
                <line x1="22" y1="6" x2="22" y2="10" />
                <line x1="6" y1="24" x2="10" y2="24" />
                <line x1="10" y1="12" x2="13" y2="15" />
                <line x1="31" y1="12" x2="34" y2="9" />
              </g>
            </>
          ) : (
            <path d="M30 8 A14 14 0 1 0 40 24 A12 12 0 0 1 30 8 Z" fill={moon} />
          )}
          <path
            d="M18 44 Q18 34 28 34 Q31 26 40 28 Q50 28 52 38 Q60 38 60 46 Q60 54 52 54 L20 54 Q12 54 12 48 Q12 42 18 44 Z"
            fill={cloud}
          />
        </svg>
      );
    case "cloudy":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <path
            d="M14 40 Q14 28 26 28 Q30 18 40 20 Q52 20 54 32 Q62 32 62 42 Q62 52 52 52 L18 52 Q8 52 8 46 Q8 40 14 40 Z"
            fill={cloud}
          />
          <path
            d="M22 34 Q22 26 30 26 Q34 20 42 22 Q48 22 50 30"
            fill={cloud2}
            opacity="0.5"
          />
        </svg>
      );
    case "fog":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <path
            d="M14 32 Q14 22 24 22 Q28 14 38 16 Q48 16 50 26 Q58 26 58 34 Q58 42 50 42 L18 42 Q8 42 8 38 Q8 32 14 32 Z"
            fill={cloud}
          />
          <g stroke={cloud2} strokeWidth="3" strokeLinecap="round" opacity="0.7">
            <line x1="10" y1="50" x2="40" y2="50" />
            <line x1="18" y1="56" x2="54" y2="56" />
          </g>
        </svg>
      );
    case "drizzle":
    case "rain":
    case "showers":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <path
            d="M16 32 Q16 22 26 22 Q30 14 40 16 Q50 16 52 26 Q60 26 60 34 Q60 42 52 42 L20 42 Q10 42 10 38 Q10 32 16 32 Z"
            fill={cloud}
          />
          <g stroke={rain} strokeWidth="3" strokeLinecap="round">
            <line x1="22" y1="46" x2="18" y2="56" />
            <line x1="32" y1="46" x2="28" y2="56" />
            <line x1="42" y1="46" x2="38" y2="56" />
          </g>
        </svg>
      );
    case "heavy-rain":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <path
            d="M14 30 Q14 20 24 20 Q28 12 38 14 Q50 14 52 24 Q60 24 60 32 Q60 40 52 40 L18 40 Q8 40 8 36 Q8 30 14 30 Z"
            fill={cloud2}
          />
          <g stroke={rain} strokeWidth="3" strokeLinecap="round">
            <line x1="18" y1="44" x2="14" y2="58" />
            <line x1="26" y1="44" x2="22" y2="58" />
            <line x1="34" y1="44" x2="30" y2="58" />
            <line x1="42" y1="44" x2="38" y2="58" />
            <line x1="50" y1="44" x2="46" y2="58" />
          </g>
        </svg>
      );
    case "snow":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <path
            d="M16 32 Q16 22 26 22 Q30 14 40 16 Q50 16 52 26 Q60 26 60 34 Q60 42 52 42 L20 42 Q10 42 10 38 Q10 32 16 32 Z"
            fill={cloud}
          />
          <g fill={snow}>
            <circle cx="22" cy="52" r="2.5" />
            <circle cx="32" cy="55" r="2.5" />
            <circle cx="42" cy="52" r="2.5" />
          </g>
        </svg>
      );
    case "sleet":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <path d="M16 30 Q16 20 26 20 Q30 12 40 14 Q50 14 52 24 Q60 24 60 32 Q60 40 52 40 L20 40 Q10 40 10 36 Q10 30 16 30 Z" fill={cloud} />
          <line x1="22" y1="46" x2="18" y2="56" stroke={rain} strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="52" r="2.5" fill={snow} />
          <line x1="42" y1="46" x2="38" y2="56" stroke={rain} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "thunderstorm":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <path d="M14 30 Q14 20 24 20 Q28 12 38 14 Q50 14 52 24 Q60 24 60 32 Q60 40 52 40 L18 40 Q8 40 8 36 Q8 30 14 30 Z" fill={cloud2} />
          <polygon points="30,42 24,54 32,54 28,60 40,48 32,48 36,42" fill={bolt} />
        </svg>
      );
    default:
      return null;
  }
}
