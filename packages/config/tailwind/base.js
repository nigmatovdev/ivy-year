/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Luxury dark green palette - Ivyonaire brand
        ivy: {
          50: '#f0f7f4',
          100: '#dceee5',
          200: '#bddccb',
          300: '#92c2a8',
          400: '#64a382',
          500: '#428765',
          600: '#326b4f',
          700: '#2a5642',
          800: '#254537',
          900: '#1f3a2e',
          950: '#0f2119',
        },
        // Refined grays for luxury feel
        border: '#e8ebe9',
        primary: {
          50: '#f9faf9',
          100: '#f2f4f3',
          200: '#e8ebe9',
          300: '#d4d9d6',
          400: '#a8b0ab',
          500: '#7d8a82',
          600: '#5f6b64',
          700: '#4d5651',
          800: '#414844',
          900: '#383d3a',
          950: '#1d201e',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3': ['1.875rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['1.5rem', { lineHeight: '1.5', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body': ['1rem', { lineHeight: '1.75' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'soft-md': '0 4px 16px 0 rgba(0, 0, 0, 0.06), 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 8px 24px 0 rgba(0, 0, 0, 0.08), 0 4px 8px 0 rgba(0, 0, 0, 0.1)',
        'soft-xl': '0 12px 32px 0 rgba(0, 0, 0, 0.1), 0 6px 12px 0 rgba(0, 0, 0, 0.12)',
        'ivy': '0 4px 16px 0 rgba(31, 58, 46, 0.12), 0 2px 4px 0 rgba(31, 58, 46, 0.08)',
        'ivy-lg': '0 8px 24px 0 rgba(31, 58, 46, 0.15), 0 4px 8px 0 rgba(31, 58, 46, 0.1)',
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
