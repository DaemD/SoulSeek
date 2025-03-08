/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        scaleIn: {
          from: { transform: "scale(0.9)", opacity: 0 },
          to: { transform: "scale(1)", opacity: 1 },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: 0.3, transform: "scale(1)" },
          "50%": { opacity: 0.5, transform: "scale(1.05)" },
        },
        "spin-very-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-slow-reverse": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.3s ease forwards",
        scaleIn: "scaleIn 0.3s ease forwards",
        "pulse-slow": "pulse-slow 4s ease-in-out infinite",
        "spin-very-slow": "spin-very-slow 20s linear infinite",
        "spin-slow-reverse": "spin-slow-reverse 30s linear infinite",
      },
      transitionProperty: {
        colors: "background-color, border-color, color, fill, stroke",
      },
      transitionDuration: {
        500: "500ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  // This safelist is crucial for dynamic color classes to work
  safelist: [
    // Add color classes that need to be dynamically applied
    "from-blue-600/30",
    "to-cyan-600/30",
    "from-blue-500/20",
    "to-cyan-500/20",
    "from-blue-400/30",
    "to-cyan-400/30",
    "border-blue-500",
    "text-blue-500",
    "hover:bg-blue-100",
    "bg-blue-50",
    "bg-blue-500",
    "hover:bg-blue-200",

    "from-amber-600/30",
    "to-yellow-600/30",
    "from-amber-500/20",
    "to-yellow-500/20",
    "from-amber-400/30",
    "to-yellow-400/30",
    "border-amber-500",
    "text-amber-500",
    "hover:bg-amber-100",
    "bg-amber-50",
    "bg-amber-500",
    "hover:bg-amber-200",

    "from-purple-600/30",
    "to-fuchsia-600/30",
    "from-purple-500/20",
    "to-fuchsia-500/20",
    "from-purple-400/30",
    "to-fuchsia-400/30",
    "border-purple-500",
    "text-purple-500",
    "hover:bg-purple-100",
    "bg-purple-50",
    "bg-purple-500",
    "hover:bg-purple-200",

    "from-red-600/30",
    "to-rose-600/30",
    "from-red-500/20",
    "to-rose-500/20",
    "from-red-400/30",
    "to-rose-400/30",
    "border-red-500",
    "text-red-500",
    "hover:bg-red-100",
    "bg-red-50",
    "bg-red-500",
    "hover:bg-red-200",

    "from-yellow-600/30",
    "to-amber-700/30",
    "from-yellow-500/20",
    "to-amber-600/20",
    "from-yellow-400/30",
    "to-amber-500/30",
    "border-yellow-500",
    "text-yellow-500",
    "hover:bg-yellow-100",
    "bg-yellow-50",
    "bg-yellow-500",
    "hover:bg-yellow-200",
  ],
}

