/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        surface2: "var(--surface-2)",
        ink: "var(--ink)",
        inksoft: "var(--ink-soft)",
        muted: "var(--muted)",
        line: "var(--line)",
        accent: "var(--accent)",
        accentink: "var(--accent-ink)",
        accentsoft: "var(--accent-soft)",
        band: "var(--band)",
        signal: "var(--signal)",
        signalsoft: "var(--signal-soft)",
        mint: "var(--mint)",
        mintink: "var(--mint-ink)",
        apricot: "var(--apricot)",
        apricotink: "var(--apricot-ink)",
        sky: "var(--sky)",
        skyink: "var(--sky-ink)",
        lilac: "var(--lilac)",
        lilacink: "var(--lilac-ink)",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(21, 35, 31, 0.04), 0 1px 3px rgba(21, 35, 31, 0.03)",
        lift: "0 4px 16px rgba(21, 35, 31, 0.08)",
      },
      borderRadius: {
        xl2: "1.125rem",
      },
    },
  },
  plugins: [],
};
