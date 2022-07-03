import '@/styles.scss';

import { chart } from '@/chart';
import { newChart } from '@/chart/newChart';
import { getDataByIndex } from '@/data';

chart(
  document.getElementById('chart') as HTMLCanvasElement,
  getDataByIndex(0)
).init();

newChart(
  document.getElementById('chart-2') as HTMLCanvasElement,
  getDataByIndex(0)
).init();
