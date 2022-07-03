import '@/styles.scss';

import { chart } from '@/chart';
import { getDataByIndex } from '@/data';

chart(
  document.getElementById('chart-1') as HTMLCanvasElement,
  getDataByIndex(0)
).init();

chart(
  document.getElementById('chart-2') as HTMLCanvasElement,
  getDataByIndex(1)
).init();

chart(
  document.getElementById('chart-3') as HTMLCanvasElement,
  getDataByIndex(2)
).init();

chart(
  document.getElementById('chart-4') as HTMLCanvasElement,
  getDataByIndex(3)
).init();

chart(
  document.getElementById('chart-5') as HTMLCanvasElement,
  getDataByIndex(4)
).init();
