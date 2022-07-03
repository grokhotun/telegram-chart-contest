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
      display: 'block',
      top: `${top - height}px`,
      left: `${left + width}px`,
    });

    this.tooltip.insertAdjacentHTML('afterbegin', this.render(title, content));
  }

  hide() {
    css(this.tooltip, {
      display: 'none',
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
