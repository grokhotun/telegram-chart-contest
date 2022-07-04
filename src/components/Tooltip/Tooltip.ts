import { Theme } from '@/theme';
import { css } from '@/utils';

type ContentItem = {
  value: string;
  name: string;
  color: string;
};

export class Tooltip {
  private tooltip: HTMLElement;

  constructor(element: HTMLElement) {
    this.tooltip = element;
  }

  setTheme(theme: Theme) {
    css(this.tooltip, {
      background: theme.tooltipBackground,
      borderColor: theme.tooltipBorder,
      boxShadow: theme.tooltipShadow,
      color: theme.tooltipTextColor,
    });
  }

  show({
    top,
    left,
    title,
    content,
  }: {
    top: number;
    left: number;
    title: string;
    content: ContentItem[];
  }) {
    const { width, height } = this.tooltip.getBoundingClientRect();

    css(this.tooltip, {
      opacity: '1',
      top: `${top - height}px`,
      left: `${left + width}px`,
    });

    this.tooltip.insertAdjacentHTML('afterbegin', this.render(title, content));
  }

  hide() {
    css(this.tooltip, {
      opacity: '0',
    });
  }

  clear() {
    this.tooltip.innerHTML = '';
  }

  render(title: string, content: ContentItem[]) {
    this.clear();

    return `
      <div class="tooltip">
        <div class="tooltip-title">${title}</div>
        <ul class="tooltip-list">
          ${content
            .map(
              ({ color, value, name }) => `
              <li class="tooltip-list-item">
                <div class="value" style="color: ${color}">${value}</div>
                <div class="name" style="color: ${color}">${name}</div>
              </li>`
            )
            .join('\n')}
        </ul>
      </div>
    `;
  }
}
