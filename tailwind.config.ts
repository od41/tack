import type { Config } from 'tailwindcss'
/** @type {import('tailwindcss').Config} */

const config: Config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{ts,tsx}',
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
      boxShadow: {
        'shadow-custom': '0 4.4px 11.8px 0 hsla(245, 100%, 61%, 0.19)',
      },
      backgroundImage: {
        'glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.00) 100%)',
        'blue-glass': 'linear-gradient(180deg, #0A33DD 0%, #0A33DD 25%, #8AA1E7 100%)'
      },
      colors: {
        border: "hsl(var(--stroke) / 0.6)",
        'alt-stroke': "hsl(var(--stroke) / 0.05)",
        input: "hsl(var(--primary-black))",
        ring: "hsl(var(--stroke) / 0.1)",
        background: "hsl(var(--accent-1))",
        foreground: "hsl(var(--text))",
        'alt': "hsl(var(--text-alt))",
        'muted': "hsl(var(--primary-black-2) / 0.4)",
        'accent-shade': 'hsl(var(--accent-shade))',
        'accent-1': 'hsl(var(--accent-1))',
        'accent-2': 'hsl(var(--accent-2))',
        'accent-3': 'hsl(var(--accent-3))',
        'accent-4': 'hsl(var(--accent-4))',
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
