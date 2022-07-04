import '@/styles.scss';

import { getDataByIndex } from '@/data';
import { TelegramChart } from '@/chart';
import { ThemeKeys } from '@/theme';

const tgChart1 = new TelegramChart({
  root: document.querySelector('#chart-1') as HTMLElement,
  data: getDataByIndex(0),
});

const tgChart2 = new TelegramChart({
  root: document.querySelector('#chart-2') as HTMLElement,
  data: getDataByIndex(1),
});

const tgChart3 = new TelegramChart({
  root: document.querySelector('#chart-3') as HTMLElement,
  data: getDataByIndex(2),
});

const tgChart4 = new TelegramChart({
  root: document.querySelector('#chart-4') as HTMLElement,
  data: getDataByIndex(3),
});

const tgChart5 = new TelegramChart({
  root: document.querySelector('#chart-5') as HTMLElement,
  data: getDataByIndex(4),
});

tgChart1.init();
tgChart2.init();
tgChart3.init();
tgChart4.init();
tgChart5.init();

document.querySelector('#theme-toggler')!.addEventListener('click', (e) => {
  if (!(e.target instanceof HTMLButtonElement)) return;
  const { theme = 'light' } = e.target.dataset;

  const key = theme as ThemeKeys;
  const buttonText = {
    light: {
      value: 'dark',
      text: 'Switch to dark mode',
    },
    dark: {
      value: 'light',
      text: 'Switch to light mode',
    },
  };

  const v = buttonText[key];

  document.body.classList.toggle('dark-mode');
  e.target.textContent = v.text;
  e.target.setAttribute('data-theme', v.value);

  [tgChart1, tgChart2, tgChart3, tgChart4, tgChart5].forEach((tgChart) => {
    tgChart.setTheme(key);
  });
});
