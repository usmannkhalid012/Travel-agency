export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 40px rgba(122, 92, 255, 0.25)'
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0f172a 0%, #312e81 45%, #6d28d9 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))'
      },
      colors: {
        midnight: '#0f172a',
        royal: '#4f46e5',
        orchid: '#8b5cf6'
      }
    }
  },
  plugins: []
};