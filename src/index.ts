import '@/styles.scss';

import { chart } from '@/chart';
import { newChart } from '@/chart/newChart';
import { getChartData } from '@/data';

chart(
  document.getElementById('chart') as HTMLCanvasElement,
  getChartData()
).init();

newChart(
  document.getElementById('chart-2') as HTMLCanvasElement,
  getChartData()
).init();
