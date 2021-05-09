import {StateActions, Status} from '../constants';
import {Task} from "../customTypes";
import {nanoid} from "nanoid";

export default class TasksService {
  private draggedElement: HTMLDivElement;

  constructor(private tasks: Array<Task>) {
  }

   create(title: string): void {
    const newTask: Task = {
      id: nanoid(),
      status: Status.BACKLOG,
      title
    }

    this.tasks.push(newTask);

    TasksService.emitEvent(StateActions.TASK_CREATE, newTask);
  }

  updateTitle(task: Task): void {
    const taskIndex: number = this.getTaskIndexByID(task.id);

    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1, task);
      TasksService.emitEvent(StateActions.TASK_UPDATE_TITLE, task);
    }
  }

  updatePosition(task: Task, prevTaskId: string | undefined): void {
    const taskIndex: number = this.getTaskIndexByID(task.id);

    this.tasks.splice(taskIndex, 1);
    if (prevTaskId !== undefined) {
      const prevTaskIndex: number = this.tasks.findIndex((el) => el.id === prevTaskId);
      this.tasks.splice(prevTaskIndex + 1, 0, task);
    } else {
      this.tasks.unshift(task);
    }
    TasksService.emitEvent(StateActions.TASK_UPDATE_POSITION, task);
  }

  cleanupBasket(): void {
    this.tasks = this.tasks.filter((task) => task.status !== Status.BASKET);
    TasksService.emitEvent(StateActions.BASKET_CLEANUP);
  }

  getByStatus(status: string): Array<Task> {
    return this.tasks.filter((task) => task.status === status);
  }

  elementDragover(): void {
    TasksService.emitEvent(StateActions.ELEMENT_DRAGOVER);
  }

  startTaskEditing(task = {}): void {
    TasksService.emitEvent(StateActions.ELEMENT_EDITED, task);
  }

  setDraggedElement(taskElement: HTMLDivElement): void {
    this.draggedElement = taskElement;
  }

  getDraggedElement(): HTMLDivElement {
    return this.draggedElement;
  }

  private static emitEvent(type: string, detail?: any): void {
    window.dispatchEvent(new CustomEvent(type, {detail}));
  }

  private getTaskIndexByID(id: string): number {
    return this.tasks.findIndex((el) => el.id === id);
  }
}
