import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        primary: {
          DEFAULT: '#1e3a8a',
          foreground: '#ffffff'
        },
        muted: '#0f172a',
        card: '#0b0b0b',
        border: '#1f2937'
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          '2xl': '1280px'
        }
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem'
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(0,0,0,0.6)'
      }
    }
  },
  plugins: []
} satisfies Config;
