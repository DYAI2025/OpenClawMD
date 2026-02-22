/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
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
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
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
        clay: {
          base: 'rgb(var(--clay-base-rgb) / <alpha-value>)',
          peach: 'rgb(var(--clay-peach-rgb) / <alpha-value>)',
          mint: 'rgb(var(--clay-mint-rgb) / <alpha-value>)',
          sage: 'rgb(var(--clay-sage-rgb) / <alpha-value>)',
          sand: 'rgb(var(--clay-sand-rgb) / <alpha-value>)',
          coral: 'rgb(var(--clay-coral-rgb) / <alpha-value>)',
          stone: 'rgb(var(--clay-stone-rgb) / <alpha-value>)',
          charcoal: 'rgb(var(--clay-charcoal-rgb) / <alpha-value>)',
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        '2xl': "calc(var(--radius) + 0.75rem)",
        xl: "calc(var(--radius) + 0.25rem)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 0.25rem)",
        sm: "calc(var(--radius) - 0.5rem)",
        xs: "calc(var(--radius) - 0.75rem)",
        blob: "2rem 1.25rem 2rem 1.25rem",
        round: "9999px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        clay: "0 2px 4px rgba(61, 58, 54, 0.04), 0 4px 8px rgba(61, 58, 54, 0.03), 0 8px 16px rgba(61, 58, 54, 0.02), 0 1px 2px rgba(61, 58, 54, 0.08), 0 2px 4px rgba(61, 58, 54, 0.06), 0 4px 8px rgba(61, 58, 54, 0.04)",
        'clay-lifted': "0 4px 8px rgba(61, 58, 54, 0.08), 0 8px 16px rgba(61, 58, 54, 0.06), 0 16px 32px rgba(61, 58, 54, 0.04)",
        'clay-inset': "inset 0 2px 4px rgba(61, 58, 54, 0.06), inset 0 1px 2px rgba(61, 58, 54, 0.08)",
        'clay-focus': "0 0 0 3px rgba(217, 130, 80, 0.25)",
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "slide-up": {
          from: { transform: "translateY(8px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-right": {
          from: { transform: "translateX(20px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "float": "float 4s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "slide-up": "slide-up 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
      },
      transitionTimingFunction: {
        'clay': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
  typography: {
    clay: {
      css: {
        '--tw-prose-body': '#3D3A36',
        '--tw-prose-headings': '#3D3A36',
        '--tw-prose-lead': '#3D3A36cc',
        '--tw-prose-links': '#E8B4A8',
        '--tw-prose-bold': '#3D3A36',
        '--tw-prose-counters': '#C5D5C8',
        '--tw-prose-bullets': '#C5D5C8',
        '--tw-prose-hr': '#D4CFC7',
        '--tw-prose-quotes': '#3D3A36',
        '--tw-prose-quote-borders': '#D4E5DD',
        '--tw-prose-captions': '#3D3A3680',
        '--tw-prose-code': '#E8B4A8',
        '--tw-prose-pre-code': '#3D3A36',
        '--tw-prose-pre-bg': '#F5F0E8',
        '--tw-prose-th-borders': '#D4CFC7',
        '--tw-prose-td-borders': '#E8DDD4',
      },
    },
  },
}
