import {InsertPosition, STATE_EMPTY, StateActions, Status, StatusLabel, Text} from '../constants';
import {renderElement, setElementVisibility} from '../utils';
import AbstractComponent from './abstract-component';
import BasketCleanerComponent from './basket-cleaner-component';
import EmptyItemComponent from './empty-item-component';
import TaskComponent from './task-component';
import TasksService from "../services/task-service";
import {Task} from "../customTypes";

export default class ListComponent extends AbstractComponent {
  private title: string;
  private tasks: Array<Task>;

  constructor(private taskService: TasksService, private status: string) {
    super();
    this.title = StatusLabel[status];
    this.tasks = this.taskService.getByStatus(status);
  }

  getTemplate(): string {
    return (
      `<article class="taskboard__group taskboard__group--${this.status}">
        <h3 class="taskboard__group-heading taskboard__group-heading--${this.status}">${this.title}</h3>
        <div class="taskboard__list" id="${this.status}"></div>
      </article>`
    );
  }

  afterCreateElement(): void {
    this.makeListDroppable();
    this.addHandlers();

    if (this.status === Status.BASKET) {
      const basketCleanerComponent: BasketCleanerComponent = new BasketCleanerComponent(this.taskService);
      const basketCleanerElement: Element = basketCleanerComponent.getElement;
      renderElement(this.getElement, basketCleanerElement, InsertPosition.BEFOREEND);
    }

    this.renderTasks();
  }

  private addHandlers(): void {
    window.addEventListener(StateActions.TASK_CREATE, this.changeDataHandler.bind(this));
    window.addEventListener(StateActions.TASK_UPDATE_TITLE, this.changeDataHandler.bind(this));
    window.addEventListener(StateActions.TASK_UPDATE_POSITION, this.changeDataHandler.bind(this));
    window.addEventListener(StateActions.TASK_DELETE, this.changeDataHandler.bind(this));
    window.addEventListener(StateActions.BASKET_CLEANUP, this.changeDataHandler.bind(this));
    window.addEventListener(StateActions.ELEMENT_DRAGOVER, this.elementDragoverHandler.bind(this));
  }

  private makeListDroppable(): void {
    const listElement: HTMLDivElement = (<HTMLDivElement>this.element).querySelector(`div.taskboard__list`);

    listElement.addEventListener(`dragover`, this.dragoverHandler.bind(this, listElement));
  }

  private renderTasks(): void {
    this.removeTasks();

    this.tasks.forEach((task: Task) => {
      const taskItemComponent: TaskComponent = new TaskComponent(this.taskService, task);
      const taskItemElement: Element = taskItemComponent.getElement;

      renderElement((<Element>this.getElement.lastChild).previousElementSibling, taskItemElement, InsertPosition.BEFOREEND);
    });

    this.renderEmptyComponent((this.status === Status.BASKET) ? Text.EMPTY_BASKET : Text.EMPTY_TASK);
  }

  private static extractStatus(element: HTMLDivElement): string {
    if (element.classList.contains(`task--backlog`)) {
      return Status.BACKLOG;
    } else if (element.classList.contains(`task--processing`)) {
      return Status.PROCESSING;
    } else if (element.classList.contains(`task--done`)) {
      return Status.DONE;
    } else if (element.classList.contains(`task--basket`)) {
      return Status.BASKET;
    }

    return Status.BACKLOG;
  }

  private removeTasks(): void {
    this.getElement.querySelector(`.taskboard__list`).innerHTML = ``;
  }

  private renderEmptyComponent(title: string): void {
    const emptyItemComponent: EmptyItemComponent = new EmptyItemComponent(title, this.status, STATE_EMPTY);
    const emptyItemElement: Element = emptyItemComponent.getElement;

    setElementVisibility(emptyItemElement, this.tasks.length === 0);
    renderElement(this.getElement.querySelector(`.taskboard__list`), emptyItemElement, InsertPosition.BEFOREEND);
  }

  private changeDataHandler(): void {
    this.tasks = this.taskService.getByStatus(this.status);
    this.renderTasks();
  }

  private elementDragoverHandler(): void {
    const draggedElement: HTMLDivElement = this.taskService.getDraggedElement();
    const isEmpty: boolean = this.tasks.length === 0;
    const draggedElementStatus: string = ListComponent.extractStatus(draggedElement);
    const isOneMovedElement: boolean = (this.tasks.length === 1) && (draggedElementStatus === this.status);

    if (isEmpty || isOneMovedElement) {
      const emptyElement: HTMLDivElement = this.getElement.querySelector(`.task--${STATE_EMPTY}`);

      setElementVisibility(emptyElement, this.status !== draggedElement.dataset.status);
    }
  }

  private dragoverHandler(container: HTMLDivElement, evt: MouseEvent): void {
    evt.preventDefault();

    const elementUnder: EventTarget = evt.target;
    const draggedElement: HTMLDivElement = this.taskService.getDraggedElement();

    if (elementUnder === draggedElement) {
      return;
    }

    if ((<HTMLDivElement>elementUnder).classList.contains(`task`)) {
      renderElement(container, draggedElement, InsertPosition.BEFOREBEGIN,
        (<HTMLDivElement>elementUnder) === draggedElement.nextElementSibling
          ? (<HTMLDivElement>elementUnder).nextElementSibling
          : (<HTMLDivElement>elementUnder));

      draggedElement.dataset.status = ListComponent.extractStatus((<HTMLDivElement>elementUnder));

      this.taskService.elementDragover();
    }
  }
}
