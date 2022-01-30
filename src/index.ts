import '@/styles.scss';

import { chart } from '@/chart';
import { getChartData } from '@/data';

const telegramChart = chart(
  document.getElementById('chart') as HTMLCanvasElement,
  getChartData()
);

telegramChart.init();
