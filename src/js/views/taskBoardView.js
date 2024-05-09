import "core-js/stable";

import { makeDraggable, makeDroppable } from "../helpers";
import { PRIORITY_HIGH, PRIORITY_LOW, PRIORITY_MEDIUM } from "../config";

class TaskBoardView {
  _parentEl = document.querySelector(".board");
  _boardHeaderEl = document.querySelector(".board-header");
  _dropmenuEl = this._boardHeaderEl.querySelector(".board-header__dropmenu");
  _dropmenuContentEl = this._dropmenuEl.querySelector(".dropmenu__content");
  _todoCardEl = document.querySelector("#todo");
  _outdatedCardEl = document.querySelector("#outdated");
  _inprogressCardEl = document.querySelector("#inProgress");
  _completedCardEl = document.querySelector("#completed");
  _tasksContainersEl = document.querySelectorAll(".card__tasks-container");
  _data;

  constructor() {
    makeDraggable(this._parentEl);
    this._tasksContainersEl.forEach((container) =>
      makeDroppable(container, this._parentEl)
    );
  }

  render(data) {
    this._data = data;
    this._generateMarkup();
  }

  updateActionsUI(criteria) {
    criteria.forEach((c, index) => {
      const radioInp = this._dropmenuContentEl.querySelector(
        `[data-action-field='${c.field}'][value='${c.value}']`
      );

      radioInp
        .closest(".action-option")
        .classList.add(`criterion-order--${index + 1}`);

      radioInp.checked = true;
    });
  }

  addHandlerRender(handler) {
    handler();
  }

  addHandlerUpdateTaskStatus(handler) {
    this._parentEl.addEventListener("taskStatusChanged", (e) =>
      handler(e.detail)
    );
  }

  addHandlerActions(handler) {
    this._boardHeaderEl.addEventListener("click", (e) => {
      const actionBtn = e.target.closest(".btn");
      const radioInput = e.target.closest("input");

      if (
        (!actionBtn && !radioInput) ||
        actionBtn?.classList.contains("btn--add")
      )
        return;

      // For displaying action's aptions
      if (actionBtn && !radioInput) {
        this._displayActionOptions(actionBtn.dataset.actionName);
        handler({ name: `toggle-action`, type: actionBtn.dataset.actionName });
      }

      // For applying the action [sorting | filtering ..etc]
      if (!actionBtn && radioInput)
        handler({
          name: radioInput.dataset.actionName,
          field: radioInput.dataset.actionField,
          value: radioInput.value,
        });
    });
  }

  uncheckActionBtn(action) {
    this._dropmenuContentEl.querySelector(
      `[data-action-field='${action.field}'][value='${action.value}']`
    ).checked = false;
  }

  _generateMarkup() {
    const todoMarkup = this._data.todo
      .map((task) => this._generateTaskPreviewCardMarkup(task))
      .join("");

    const inProgressMarkup = this._data.inProgress
      .map((task) => this._generateTaskPreviewCardMarkup(task))
      .join("");

    const completedMarkup = this._data.completed
      .map((task) => this._generateTaskPreviewCardMarkup(task))
      .join("");

    const outdatedMarkup = this._data.outdated
      .map((task) => this._generateTaskPreviewCardMarkup(task))
      .join("");

    this._todoCardMarkup(todoMarkup, this._data.todo.length);
    this._inProgressCardMarkup(inProgressMarkup, this._data.inProgress.length);
    this._completedCardMarkup(completedMarkup, this._data.completed.length);
    this._outdatedCardMarkup(outdatedMarkup, this._data.outdated.length);
  }

  _todoCardMarkup(TasksMarkup, TasksNum) {
    this._generateCardMarkup(this._todoCardEl, TasksMarkup, TasksNum);
  }

  _inProgressCardMarkup(TasksMarkup, TasksNum) {
    this._generateCardMarkup(this._inprogressCardEl, TasksMarkup, TasksNum);
  }

  _completedCardMarkup(TasksMarkup, TasksNum) {
    this._generateCardMarkup(this._completedCardEl, TasksMarkup, TasksNum);
  }

  _outdatedCardMarkup(TasksMarkup, TasksNum) {
    this._generateCardMarkup(this._outdatedCardEl, TasksMarkup, TasksNum);
  }

  _generateCardMarkup(cardEl, tasksMarkup, tasksNum) {
    this._updateTasksNumber(cardEl, tasksNum);
    const tasksContainer = cardEl.querySelector(".card__tasks-container");
    tasksContainer.innerHTML = "";
    tasksContainer.insertAdjacentHTML("afterbegin", tasksMarkup);
  }

  _updateTasksNumber(cardEl, tasksNum) {
    cardEl.querySelector(".tasks-number").innerHTML = tasksNum;
  }

  _generateTaskPreviewCardMarkup(task) {
    return `
      <li id="${task.id}" class="task" draggable="true" data-id="${
      task.id
    }" data-status="${task.status}">
        <span class="task__category">${task.category.name}</span>
        <div class="task__details-box">
          <p class="task__title">${task.title}</p>
          <p class="task__description">${task.description}</p>
        </div>
        <div class="task__info">
          <div class="task__priority-box">
            <span class="priority__status priority__status--${
              task.priority
            }"></span>
          </div>

          <div class="task__keywords">
            ${task.keywords
              .map((keyword) => `<span class="task__keyword">${keyword}</span>`)
              .join("")}
          </div>
        </div>
      </li>
    `;
  }

  _displayActionOptions(action) {
    let markup = "";

    // If user clicked on the same action button that mean show/hide these action's options
    if (action == this._dropmenuEl.dataset.currentAction) {
      this._dropmenuEl.classList.toggle("hidden");
      return;
    }

    // If user clicked on different action button that means generate that action's markup and display it

    // Generate the markup according to the action
    if (action == "sort") markup = this._generateSortActionMarkup();
    if (action == "filter") markup = this._generateFilterActionMarkup();

    // Displaying it.
    this._dropmenuContentEl.innerHTML = "";
    this._dropmenuContentEl.insertAdjacentHTML("afterbegin", markup);
    this._dropmenuEl.dataset.currentAction = action;
    this._dropmenuEl.classList.remove("hidden");
  }

  _generateSortActionMarkup() {
    return `
        <div class="sort__options">
        <!-- Due date -->
        <fieldset class="action-option">
          <legend>Due Date</legend>
          ${this._generateOptionRadioGroup({
            actionName: "sort",
            actionField: "dueDate",
            actionValue: "asc",
            actionLabel: "Earliest",
          })}

          ${this._generateOptionRadioGroup({
            actionName: "sort",
            actionField: "dueDate",
            actionValue: "desc",
            actionLabel: "Latest",
          })}
        </fieldset>

        <!-- Priority -->
        <fieldset class="action-option">
          <legend>Priority</legend>
          ${this._generateOptionRadioGroup({
            actionName: "sort",
            actionField: "priority",
            actionValue: "asc",
            actionLabel: "Low to High",
          })}

          ${this._generateOptionRadioGroup({
            actionName: "sort",
            actionField: "priority",
            actionValue: "desc",
            actionLabel: "High to Low",
          })}
        </fieldset>

        <!-- Title -->
        <fieldset class="action-option">
          <legend>Title</legend>
          ${this._generateOptionRadioGroup({
            actionName: "sort",
            actionField: "title",
            actionValue: "asc",
            actionLabel: "A - Z",
          })}

          ${this._generateOptionRadioGroup({
            actionName: "sort",
            actionField: "title",
            actionValue: "desc",
            actionLabel: "Z - A",
          })}
        </fieldset>
      </div>
    `;
  }
  _generateFilterActionMarkup() {
    return `
      <div class="filter__options">
        <!-- Priority -->
        <fieldset class="action-option">
          <legend>Priority</legend>

          ${this._generateOptionRadioGroup({
            actionName: "filter",
            actionField: "priority",
            actionValue: PRIORITY_LOW,
            actionLabel: "Low",
          })}

          ${this._generateOptionRadioGroup({
            actionName: "filter",
            actionField: "priority",
            actionValue: PRIORITY_MEDIUM,
            actionLabel: "Medium",
          })}

          ${this._generateOptionRadioGroup({
            actionName: "filter",
            actionField: "priority",
            actionValue: PRIORITY_HIGH,
            actionLabel: "High",
          })}
        </fieldset>
      </div>
    `;
  }

  _generateOptionRadioGroup(data) {
    const { actionName, actionField, actionValue, actionLabel } = data;
    return `
      <div class="radio__group">
        <input type="radio" data-action-name="${actionName}" data-action-field="${actionField}" name="${actionName}-${actionField}"
          id="${actionName}${actionField}${actionValue}" value="${actionValue}" class="radio__input">
        <label for="${actionName}${actionField}${actionValue}" class="radio__label">
          <span class="radio__btn"></span>
          ${actionLabel}
        </label>
      </div>
    `;
  }
}

export default new TaskBoardView();
