import { MappedChartData } from '@/types';

export function computeBoundaries({ yAxis }: Pick<MappedChartData, 'yAxis'>) {
  const data = yAxis.map(({ coords }) => coords).flat();

  const max = Math.max(...data);
  const min = Math.min(...data);

  return [min, max];
}
