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
        card: "var(--shadow-card)",
        lift: "var(--shadow-lift)",
      },
      borderRadius: {
        xl2: "1.125rem",
      },
    },
  },
  plugins: [],
};
