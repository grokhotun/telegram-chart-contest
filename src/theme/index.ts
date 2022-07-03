export const theme = {
  day: {
    font: 'normal 20px Helvetica,sans-serif',
    background: '#fff',
  },
  night: { font: 'normal 20px Helvetica,sans-serif', background: '#e2e2e2' },
};

export type Theme = typeof theme[keyof typeof theme];
