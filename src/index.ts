import '@/styles.scss';

import { chart } from '@/chart';
import { getDataByIndex } from '@/data';

chart(
  document.getElementById('chart') as HTMLCanvasElement,
  getDataByIndex(0)
).init();

chart(
  document.getElementById('chart-2') as HTMLCanvasElement,
  getDataByIndex(1)
).init();
