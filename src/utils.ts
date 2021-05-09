import {HIDE_BLOCK_CLASS, InsertPosition} from './constants';

export function createElement(template: string): Element {
  const element = document.createElement(`div`);
  element.innerHTML = template;

  return element.firstElementChild;
}

export function renderElement(container: Element, element: Element,
                              insertPosition: string = InsertPosition.BEFOREEND,
                              referenceElement: Element = undefined): void {
  switch (insertPosition) {
    case (InsertPosition.BEFOREEND):
      container.append(element);
      break;
    case (InsertPosition.AFTERBEGIN):
      container.prepend(element);
      break;
    case (InsertPosition.BEFOREBEGIN):
      container.insertBefore(element, referenceElement);
      break;
  }
}

export function setElementVisibility(element: Element, visibility: boolean): void {
  element.classList.toggle(HIDE_BLOCK_CLASS, !visibility);
}
