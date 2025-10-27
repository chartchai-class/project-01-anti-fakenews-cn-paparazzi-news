/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主色调 - 渐变色蓝紫色系
        primary: {
          50: '#ede9fe',
          100: '#ddd6fe',
          200: '#c4b5fd',
          300: '#a78bfa',
          400: '#8b5cf6',
          500: '#7c3aed',
          600: '#6366f1',
          700: '#4f46e5',
          800: '#4338ca',
          900: '#3730a3',
        },
        // 假新闻 - 红色系
        fake: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        // 真新闻 - 绿色系
        true: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        // 中立 - 黄色系
        neutral: {
          50: '#fefce8',
          100: '#fef9c3',
          500: '#eab308',
          600: '#ca8a04',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-fake': 'linear-gradient(135deg, #f93259 0%, #dc2626 100%)',
        'gradient-true': 'linear-gradient(135deg, #10b981 0%, #16a34a 100%)',
        'gradient-bg': 'linear-gradient(135deg, #f5f7fa 0%, #e0e7ff 100%)',
        'gradient-rainbow': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
        'glass-lg': '0 20px 40px rgba(0, 0, 0, 0.15)',
        'glow': '0 0 20px rgba(102, 126, 234, 0.5)',
        'glow-red': '0 0 20px rgba(220, 38, 38, 0.5)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.5)',
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'fade-up': 'fade-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-up': 'slide-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
    },
  },
  plugins: [],
}