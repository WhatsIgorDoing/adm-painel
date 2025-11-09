import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        'border-subtle': '#E5E7EB',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        muted: '#FAFAFA',
        status: {
          booked: '#2563EB',
          bookedBg: '#E0EAFF',
          bookedText: '#1E40AF',
          cancelled: '#DC2626',
          cancelledBg: '#FEE2E2',
          cancelledText: '#991B1B',
          closed: '#6B7280',
          closedBg: '#E5E7EB',
          closedText: '#374151',
          dropped: '#4B5563',
          droppedBg: '#E5E7EB',
          inCart: '#7C3AED',
          inCartBg: '#EDE9FE',
          request: '#92400E',
          requestBg: '#FEF3C7',
          test: '#9CA3AF',
          testBg: '#F3F4F6'
        },
        delivery: {
          ready: '#059669',
          readyBg: '#D1FAE5',
          delayed: '#D97706',
          delayedBg: '#FFEDD5',
          transport: '#B45309',
          transportBg: '#FEF3C7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};

export default config;
