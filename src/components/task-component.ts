import {StateActions} from '../constants';
import {setElementVisibility} from '../utils';
import AbstractComponent from './abstract-component';
import TasksService from "../services/task-service";
import {Task} from "../customTypes";

export default class TaskComponent extends AbstractComponent {
  constructor(private taskService: TasksService, private task: Task) {
    super();
  }

  getTemplate(): string {
    return (
      `<div class="taskboard__item task task--${this.task.status}" data-id="${this.task.id}">
        <div class="task__body">
          <p class="task--view">${this.task.title}</p>
          <input type="text" class="task--input" />
        </div>
        <button aria-label="Изменить" class="task__edit" type="button"></button>
      </div>`
    );
  }

  afterCreateElement(): void {
    this.makeTaskEditable();
    this.makeTaskDraggable();

    window.addEventListener(StateActions.ELEMENT_EDITED, (evt: CustomEvent) => {
      const isDisplayBlock: boolean = (evt.detail.id === undefined) || (evt.detail.id === this.task.id);

      setElementVisibility(this.getElement.querySelector(`.task__edit`), isDisplayBlock);
    });
  }

  private makeTaskEditable(): void {
    const taskEditElement: HTMLButtonElement = this.getElement.querySelector(`.task__edit`);
    const taskTitleElement: HTMLParagraphElement = this.getElement.querySelector(`.task--view`);
    const taskInputElement: HTMLInputElement = this.getElement.querySelector(`.task--input`);

    taskEditElement.addEventListener(`click`, (): void => {
      if (this.getElement.classList.contains(`task--active`)) {
        this.setTaskViewMode(true);
        this.saveTask(taskInputElement.value);
      } else {
        this.setTaskViewMode(false);
        taskInputElement.value = this.task.title;
      }
    });

    this.getElement.addEventListener(`keydown`, (evt: KeyboardEvent): void => {
      if (evt.code === `Enter` && evt.shiftKey === false && evt.ctrlKey === false && evt.altKey === false) {
        this.setTaskViewMode();
        this.saveTask(taskInputElement.value);
      } else if (evt.code === `Escape`) {
        this.setTaskViewMode();
        taskTitleElement.innerText = this.task.title;
      }
    });
  }

  private makeTaskDraggable(): void {
    this.taskService.setDraggedElement(null);

    this.getElement.setAttribute(`draggable`, `true`);
    this.getElement.addEventListener(`dragstart`, this.dragstartHandler.bind(this));
    this.getElement.addEventListener(`dragend`, this.dragendHandler.bind(this));
  }

  private dragstartHandler(): void {
    const draggedElement: Element = this.getElement;
    draggedElement.classList.add(`task--dragged`);
    this.taskService.setDraggedElement(<HTMLDivElement>draggedElement);
  }

  private dragendHandler(): void {
    const prevTaskId: string | undefined = this.getElement.previousElementSibling
      ? (<HTMLDivElement>this.getElement.previousElementSibling).dataset.id
      : undefined;
    const draggedElement: HTMLDivElement = this.taskService.getDraggedElement();

    draggedElement.classList.remove(`task--dragged`);
    if (draggedElement.dataset.status) {
      this.task.status = draggedElement.dataset.status;
      this.taskService.updatePosition(this.task, prevTaskId);
    }
    this.taskService.setDraggedElement(null);
  }

  private saveTask(newTitle: string): void {
    if (this.task.title !== newTitle) {
      this.task.title = newTitle;
      this.taskService.updateTitle(this.task);
    }
  }

  private setTaskViewMode(viewMode = true): void {
    const taskInputElement: HTMLInputElement = this.getElement.querySelector(`.task--input`);

    if (viewMode) {
      this.getElement.classList.remove(`task--active`);
      this.taskService.startTaskEditing();
      taskInputElement.blur();
    } else {
      this.getElement.classList.add(`task--active`);
      this.taskService.startTaskEditing(this.task);
      taskInputElement.focus();
    }
  }
}
