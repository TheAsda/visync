export class Highlighter {
  highlighter: HTMLDivElement;

  constructor() {
    this.highlighter = document.createElement('div');
    this.highlighter.style.border = '2px solid red';
    this.highlighter.style.position = 'absolute';
    this.highlighter.style.display = 'none';
  }

  highligh(element: HTMLElement) {
    const { left, right, top, bottom } = element.getBoundingClientRect();
    this.highlighter.style.left = `${left}px`;
    this.highlighter.style.top = `${top}px`;
    this.highlighter.style.width = `${right - left}px`;
    this.highlighter.style.height = `${bottom - top}px`;
    if (!document.body.contains(this.highlighter)) {
      document.body.appendChild(this.highlighter);
    }
  }

  unhighlight() {
    if (document.body.contains(this.highlighter)) {
      document.body.removeChild(this.highlighter);
    }
  }
}

export const highlighter = new Highlighter();
