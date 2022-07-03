import '@/styles.scss';

import { getDataByIndex } from '@/data';
import { TelegramChart } from '@/chart';

new TelegramChart({
  root: document.querySelector('#chart-1') as HTMLElement,
  data: getDataByIndex(0),
}).init();

new TelegramChart({
  root: document.querySelector('#chart-2') as HTMLElement,
  data: getDataByIndex(1),
}).init();

new TelegramChart({
  root: document.querySelector('#chart-3') as HTMLElement,
  data: getDataByIndex(2),
}).init();

new TelegramChart({
  root: document.querySelector('#chart-4') as HTMLElement,
  data: getDataByIndex(3),
}).init();

new TelegramChart({
  root: document.querySelector('#chart-5') as HTMLElement,
  data: getDataByIndex(4),
}).init();
