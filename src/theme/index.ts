export const theme = {
  light: {
    font: 'normal 20px Helvetica,sans-serif',
    chartTextColor: '#96a2aa',
    yLinesWidth: 4,
    chartLineWidth: 1,
    chartLineColor: '#bbb',
    chartBackground: '#fff',
    sliderBackground: '#fff',
    sliderHandle: '#ddeaf3',
    checkboxBorder: '#e6ecf0',
    checkboxColor: '#000',
    tooltipBackground: '#fff',
    tooltipBorder: '#dfe6eb',
    tooltipShadow: '1px 1px 1px rgba(0, 0, 0, .05)',
    tooltipTextColor: '#000',
  },
  dark: {
    font: 'normal 20px Helvetica,sans-serif',
    chartTextColor: '#546778',
    yLinesWidth: 4,
    chartLineWidth: 1,
    chartLineColor: '#293544',
    chartBackground: '#242f3e',
    sliderBackground: '#1f2a38',
    sliderHandle: '#40566b',
    checkboxBorder: '#344658',
    checkboxColor: '#fff',
    tooltipBackground: '#253241',
    tooltipBorder: '#253241',
    tooltipShadow: '1px 1px 1px rgba(0, 0, 0, .5)',
    tooltipTextColor: '#fff',
  },
};

export type ThemeKeys = keyof typeof theme;
export type Theme = typeof theme[ThemeKeys];
