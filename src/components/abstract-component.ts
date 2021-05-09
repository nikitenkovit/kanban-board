import {createElement} from '../utils';

export default abstract class AbstractComponent {
  protected element: null | Element;

  protected constructor() {
    this.element = null;
  }

  protected getTemplate(): string {
    throw new Error(`It's AbstractComponent method, please implement it!`);
  }

  get getElement(): Element {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      this.afterCreateElement();
    }
    return <Element>this.element;
  }

  protected afterCreateElement():void {
  }
}
