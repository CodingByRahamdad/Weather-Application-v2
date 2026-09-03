import { useEffect, useState } from "react";

// Observes an element's width so charts can adapt tick density/labels
// to the actual space available instead of guessing from the viewport.
export function useElementWidth(ref) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = (w) => setWidth(Math.round(w));
    update(el.getBoundingClientRect().width);

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) update(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}
