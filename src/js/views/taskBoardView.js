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

  updateActionsUI(actionName, criteria) {
    const checkboxInps = Array.from(
      this._dropmenuContentEl.querySelectorAll(
        `[data-action-name='${actionName}']`
      )
    );

    // Uncheck all
    checkboxInps.forEach((inp) => {
      inp.checked = false;
      this._unHighlightActionOption(inp.closest(".action-option"));
    });

    // Set current criteria
    criteria.forEach((c, index) => {
      if (actionName == "filter" && c.field == "dueDate") {
        const inpStart = this._dropmenuContentEl.querySelector("#dueDateStart");
        const inpEnd = this._dropmenuContentEl.querySelector("#dueDateEnd");
        const startDate = c.value.split(",")[0];
        const endDate = c.value.split(",")[1];
        inpStart.value = startDate;
        inpEnd.value = endDate;
        inpStart
          .closest(".action-option")
          .classList.add(`criterion-order--${index + 1}`);
      } else {
        // In case of checkbox
        const inp = this._dropmenuContentEl.querySelector(
          `[data-action-field='${c.field}'][value='${c.value}']`
        );
        inp.checked = true;
        inp
          .closest(".action-option")
          .classList.add(`criterion-order--${index + 1}`);
      }
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
    // Handle toggle action's dropmenu
    this._boardHeaderEl.addEventListener("click", (e) => {
      const actionBtn = e.target.closest(".btn");
      if (!actionBtn || actionBtn?.classList.contains("btn--add")) return;

      this._displayActionOptions(actionBtn.dataset.actionName);

      handler({
        name: actionBtn.dataset.actionName,
        isToggle: true,
      });
    });

    // Handle action itself
    this._boardHeaderEl.addEventListener("change", (e) => {
      const actionOptionEl = e.target.closest("fieldset");
      const actionName = actionOptionEl.dataset.actionName;
      const actionField = actionOptionEl.dataset.actionField;
      let actionValue = e.target.value;

      // In case of filtering based on the due date
      if (actionName == "filter" && actionField == "dueDate") {
        const inpStartDate = actionOptionEl.querySelector("#dueDateStart");
        const inpEndDate = actionOptionEl.querySelector("#dueDateEnd");

        // To be sure the user picks up the start and end dates
        if (!inpStartDate.value.length || !inpEndDate.value.length) return;

        const startDate = inpStartDate.value;
        const endDate = inpEndDate.value;

        // To check if the user picks up valid dates
        if (new Date(startDate) > new Date(endDate)) {
          // TODO: Handle this error
          console.log("Invalid Dates");
          return;
        }
        actionValue = `${startDate},${endDate}`;
      }

      handler({
        name: actionName,
        field: actionField,
        value: actionValue,
        isToggle: false,
      });
    });
  }

  uncheckActionBtn(action) {
    const checkboxInp = this._dropmenuContentEl.querySelector(
      `[data-action-field='${action.field}'][value='${action.value}']`
    );
    checkboxInp.checked = false;
    this._unHighlightActionOption(checkboxInp.closest(".action-option"));
  }

  _unHighlightActionOption(actionOption) {
    // Remove 'criterion-order--$'; class from the closest 'action-option' element
    const pattern = /criterion-order--\d+/;
    let className = actionOption.className;
    className = className.replace(pattern, "");
    actionOption.className = className;
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
        <fieldset class="action-option" data-action-name="sort" data-action-field="dueDate">
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
        <fieldset class="action-option" data-action-name="sort" data-action-field="priority">
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
        <fieldset class="action-option" data-action-name="sort" data-action-field="title">
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
        <fieldset class="action-option" data-action-name="filter" data-action-field="priority">
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

        <!-- Due Date -->
        <fieldset class="action-option" data-action-name="filter" data-action-field="dueDate">
          <legend>Due Date</legend>
          <div class="form__group">
            <label for="dueDateStart">Start</label>
            <input type="date" name="due-date-start" id="dueDateStart">
          </div>
          <div class="form__group">
            <label for="dueDateEnd">End</label>
            <input type="date" name="due-date-end" id="dueDateEnd">
          </div>
        </fieldset>
      </div>
    `;
  }

  _generateOptionRadioGroup(data) {
    const { actionName, actionField, actionValue, actionLabel } = data;
    return `
      <div>
        <input type="checkbox" data-action-name="${actionName}" data-action-field="${actionField}" name="${actionName}-${actionField}"
          id="${actionName}${actionField}${actionValue}" value="${actionValue}" class="checkbox__input">
        <label for="${actionName}${actionField}${actionValue}" class="checkbox__label">
          <span class="checkbox__btn"></span>
          ${actionLabel}
        </label>
      </div>
    `;
  }
}

export default new TaskBoardView();
