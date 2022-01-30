import { css } from '@/utils';

export type Tooltip = {
  value: string;
  name: string;
  color: string;
};

function template(title: string, items: Tooltip[]) {
  return `
    <div class="tooltip-title">${title}</div>
    <ul class="tooltip-list">
      ${items
        .map(
          (item) => `
          <li class="tooltip-list-item">
            <div class="value" style="color: ${item.color}">${item.value}</div>
            <div class="name" style="color: ${item.color}">${item.name}</div>
          </li>`
        )
        .join('\n')}
    </ul>
`;
}

export function tooltip(element: HTMLElement) {
  function clear() {
    element.innerHTML = '';
  }

  return {
    show(
      { top, left }: { top: number; left: number },
      { title, content }: { title: string; content: Tooltip[] }
    ) {
      const { width, height } = element.getBoundingClientRect();
      clear();
      css(element, {
        display: 'block',
        top: `${top - height}px`,
        left: `${left + width}px`,
      });
      element.insertAdjacentHTML('afterbegin', template(title, content));
    },
    hide() {
      css(element, {
        display: 'none',
      });
    },
  };
}
