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

  addHandlerRender(handler) {
    handler();
  }

  addHandlerUpdateTaskStatus(handler) {
    this._parentEl.addEventListener("taskStatusChanged", (e) =>
      handler(e.detail)
    );
  }

  addHandlerActions(handler) {
    const handleClick = (e) => {
      const btn = e.target.closest(".btn");
      if (!btn) return;
      this._handleClickedBtn(btn, handler);
    };

    const handleChange = (e) => {
      const input = e.target;
      this._handleChangedInput(input, handler);
    };

    const handleKeydown = (e) => {
      if (e.code === "Enter") {
        this._handleEnterKey(e.target, handler);
      }
    };

    this._boardHeaderEl.addEventListener("click", handleClick);
    this._boardHeaderEl.addEventListener("change", handleChange);
    this._boardHeaderEl.addEventListener("keydown", handleKeydown);
  }

  _handleClickedBtn(btn, handler) {
    if (btn.classList.contains("btn--add")) return;

    const actionOptionEl = btn.closest(".action-option");
    const actionField = actionOptionEl?.dataset.actionField;
    const actionName = actionOptionEl
      ? actionOptionEl.dataset.actionName
      : btn.dataset.actionName;

    // Clear input
    if (btn.classList.contains("btn--clear-input")) {
      // Clear due date inputs
      if (actionField == "dueDate") {
        const inpStartDate = actionOptionEl.querySelector("#dueDateStart");
        const inpEndDate = actionOptionEl.querySelector("#dueDateEnd");
        const startDate = inpStartDate.value;
        const endDate = inpEndDate.value;

        if (
          !startDate.length ||
          !endDate.length ||
          new Date(startDate) > new Date(endDate)
        ) {
          inpStartDate.value = "";
          inpEndDate.value = "";
          return;
        }
      }

      // Clear keywords input
      if (actionField == "keywords") {
        // If the input has a text and the user clicked clear
        btn.closest(".action-option__inputs").querySelector("input").value = "";
        // If the user clicked clear and there are no keywords
        if (!actionOptionEl.querySelector(".task__keyword")) return;
      }

      handler({
        name: actionName,
        field: actionField,
        value: "clear",
        isToggle: false,
      });

      return;
    }

    // Delete keyword
    if (btn.classList.contains("btn--delete-keyword")) {
      const deleteKeyword = btn.closest(".task__keyword").dataset.keyword;
      handler({
        name: actionName,
        field: actionField,
        value: deleteKeyword,
        isDeleteOneKeyword: true,
        isToggle: false,
      });
      return;
    }

    // Handle toggling dropdown menu with an action's options
    this._displayActionOptions(actionName);
    handler({
      name: actionName,
      isToggle: true,
    });
  }

  _handleChangedInput(input, handler) {
    // Except keywords input in the filter action
    if (input.name == "keywords") return;

    const actionOptionEl = input.closest(".action-option");
    const actionName = actionOptionEl.dataset.actionName;
    const actionField = actionOptionEl.dataset.actionField;

    // In general cases [Only one (input | select | textarea) filed]
    let actionValue = input.value;

    // In case of filtering based on the due date
    // [Exception because the due date filed in filtering has 2 inputs]
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
  }

  _handleEnterKey(input, handler) {
    if (!input.value) return;

    const actionOptionEl = input.closest("fieldset");
    const actionName = actionOptionEl.dataset.actionName;
    const actionField = actionOptionEl.dataset.actionField;
    const actionValue = input.value;

    // Clear input filed
    input.value = "";

    handler({
      name: actionName,
      field: actionField,
      value: actionValue,
      isToggle: false,
    });
  }

  updateActionsUI(actionName, criteria) {
    // Checkboxes
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

    if (actionName == "filter") {
      // Keywords container
      const keywordsEl = this._dropmenuContentEl.querySelector(
        ".action-option__keywords-container"
      );
      keywordsEl.innerHTML = "";
    }

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
      } else if (actionName == "filter" && c.field == "keywords") {
        const inp = this._dropmenuContentEl.querySelector("#keywords");
        let keywordsMarkup = ``;
        c.value.split(",").forEach((keyword) => {
          keywordsMarkup += `
            <span class="task__keyword" data-keyword="${keyword}">
              ${keyword}
              <button class="btn btn--delete-keyword">&#x2715;</button>
            </span>
          `;
        });
        const keywordsEl = this._dropmenuContentEl.querySelector(
          ".action-option__keywords-container"
        );
        keywordsEl.innerHTML = "";
        inp.value = "";
        keywordsEl.insertAdjacentHTML("afterbegin", keywordsMarkup);
        inp
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

  resetActionInputs(action) {
    if (action.field == "dueDate" || action.field == "keywords") {
      const inpParent = this._dropmenuContentEl.querySelector(
        `[data-action-name='${action.name}'][data-action-field='${action.field}']`
      );

      const inps = inpParent.querySelectorAll("input");
      inps.forEach((inp) => (inp.value = ""));

      if (action.field == "keywords") {
        const el = inpParent.querySelector(
          ".action-option__keywords-container"
        );
        el.innerHTML = "";
      }

      this._unHighlightActionOption(inpParent);
    } else {
      // In case of checkbox or radio
      const inp = this._dropmenuContentEl.querySelector(
        `[data-action-field='${action.field}'][value='${action.value}']`
      );
      inp.checked = false;
      this._unHighlightActionOption(inp.closest(".action-option"));
    }
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
        <!-- Keywords -->
        <fieldset class="action-option" data-action-name="filter" data-action-field="keywords">
          <legend>keywords</legend>
            <div class="action-option__keywords">
            <div class="action-option__inputs">            
              <div class="form__group">
              <input type="text" name="keywords" id="keywords">
              </div>
              <button class="btn btn--clear-input">Clear</button>
            </div>
            <div class="action-option__keywords-container"></div>
          </div>
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
          <button class="btn btn--clear-input">Clear</button>
        </fieldset>

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
