export const theme = {
  light: {
    font: 'normal 20px Helvetica,sans-serif',
    background: '#fff',
  },
  dark: { font: 'normal 20px Helvetica,sans-serif', background: '#e2e2e2' },
};

export type ThemeKeys = keyof typeof theme;
export type Theme = typeof theme[ThemeKeys];
