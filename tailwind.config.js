export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        rg: {
          bg: '#bfcbd9',
          heading: '#0f1729',
          body: '#475569',
          blue: '#3b82f6',
          cyan: '#22d3ee',
          violet: '#8b5cf6',
          nvidia: '#76b900',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
}
