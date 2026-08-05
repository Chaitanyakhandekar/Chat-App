/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs':  ['10px', { lineHeight: '1.3' }],
        'xs':   ['11px', { lineHeight: '1.4' }],
        'sm':   ['13px', { lineHeight: '1.5' }],
        'base': ['14px', { lineHeight: '1.6' }],
        'md':   ['15px', { lineHeight: '1.5' }],
        'lg':   ['18px', { lineHeight: '1.4' }],
        'xl':   ['22px', { lineHeight: '1.3' }],
      },
      colors: {
        /* ── Background / Surfaces ── */
        background: '#090a0f',
        surface: {
          900: '#0d0f17',
          800: '#121520',
          700: '#1a1e2e',
          600: '#23283c',
          hover: '#1e2235',
        },
        border: 'rgba(255,255,255,0.07)',

        /* ── Text ── */
        text: {
          primary:   '#f1f3f9',
          secondary: '#a0a5b8',
          muted:     '#5e647e',
          dim:       '#5e647e',
        },

        /* ── Single Accent System ── */
        accent: {
          DEFAULT: '#6366f1',
          hover:   '#4f46e5',
          light:   '#818cf8',
          dark:    '#4338ca',
          subtle:  'rgba(99,102,241,0.12)',
        },

        /* ── Semantics ── */
        success: '#22c55e',
        warning: '#f59e0b',
        danger:  '#ef4444',
      },
      borderRadius: {
        'xs':   '4px',
        'sm':   '8px',
        'md':   '12px',
        'lg':   '16px',
        'xl':   '20px',
        'full': '9999px',
      },
      boxShadow: {
        'subtle':  '0 1px 2px rgba(0,0,0,0.2)',
        'panel':   '0 8px 24px rgba(0,0,0,0.35)',
        'overlay': '0 16px 48px rgba(0,0,0,0.5)',
      },
      animation: {
        'fade-in':  'fadeIn 0.2s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in': 'scaleIn 0.18s cubic-bezier(0.16,1,0.3,1) both',
        'slide-up': 'slideUp 0.22s cubic-bezier(0.16,1,0.3,1) both',
        'ctx-in':   'ctxIn 0.15s cubic-bezier(0.16,1,0.3,1) both',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ctxIn: {
          '0%':   { opacity: '0', transform: 'scale(0.94) translateY(-4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
