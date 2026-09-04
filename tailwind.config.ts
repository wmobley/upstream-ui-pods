import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#008080',
          '50': '#E0F2F1',
          '100': '#B2DFDB',
          '200': '#80CBC4',
          '300': '#4DB6AC',
          '400': '#26A69A',
          '500': '#009688',
          '600': '#00897B',
          '700': '#00796B',
        },
        secondary: {
          DEFAULT: '#606060',
          '50': '#F9FAFB',
          '100': '#F3F4F6',
          '200': '#E5E7EB',
          '300': '#D1D5DB',
          '400': '#9CA3AF',
          '500': '#6B7280',
          '600': '#4B5563',
          '700': '#374151',
        },
        tacc: {
          neutral: {
            'xx-light': '#FFFFFF',
            'x-light': '#F4F4F4',
            light: '#D7D7D7',
            normal: '#AFAFAF',
            dark: '#707070',
            'x-dark': '#484848',
            'xx-dark': '#222222',
            black: '#000000',
          },
          accent: {
            'xxx-light': '#DFEAFE',
            'xx-light': '#CADDFE',
            'x-light': '#AAC7FF',
            light: '#3D6ACC',
            'light-alt': '#6D8BDA',
            normal: '#003399',
            dark: '#002266',
            'x-dark': '#001133',
            'xx-dark': '#021230',
            'xxx-dark': '#000A22',
          },
          secondary: {
            'xx-light': '#FCF6EC',
            'x-light': '#E5D7C0',
            light: '#D5B57C',
            normal: '#877453',
            dark: '#514328',
            'x-dark': '#332C1F',
          },
          tertiary: {
            'xx-light': '#E7F1F0',
            'x-light': '#B1D1CE',
            light: '#92CCC5',
            normal: '#61A39C',
            dark: '#406D68',
            'x-dark': '#1E3331',
          },
        },
      },
    },
  },
} satisfies Config;
