import "core-js/stable";

import * as model from "./model.js";
import taskBoardView from "./views/taskBoardView.js";
import displayTaskView from "./views/displayTaskView.js";

const tasksBoardEl = document.querySelector(".board");
function makeDraggable(node) {
  const events = [
    {
      name: "dragstart",
      handler: function (e) {
        if (!e.target.draggable) return;
        e.dataTransfer.setData("text/plain", e.target.id);
        e.target.classList.add("hide");
      },
    },
    {
      name: "drag",
      handler: function (e) {
        return;
      },
    },
    {
      name: "dragend",
      handler: function (e) {
        e.target.classList?.remove("hide");
      },
    },
  ];
  events.forEach((ev) => node.addEventListener(ev.name, ev.handler));
}
function makeDroppable(node) {
  const events = [
    {
      name: "dragenter",
      handler: function (e) {
        e.preventDefault();
      },
    },
    {
      name: "dragover",
      handler: function (e) {
        e.preventDefault();
        highlightTarget(e.target);
        e.dataTransfer.dropEffect = "move";
      },
    },
    {
      name: "dragleave",
      handler: function (e) {
        unHighlightTarget(e.target);
      },
    },
    {
      name: "drop",
      handler: function (e) {
        if (!e.target.classList.contains("card__tasks-container")) return;

        unHighlightTarget(e.target);

        // Get the draggable element
        const id = e.dataTransfer.getData("text/plain");
        // console.log(id);
        const draggableItem = document.getElementById(id);

        // If not the right element then exit
        if (!draggableItem) return;

        // Add it to the drop target
        e.target.append(draggableItem);
      },
    },
  ];
  events.forEach((ev) => node.addEventListener(ev.name, ev.handler));
}
function highlightTarget(target) {
  if (target.classList.contains("card__tasks-container")) {
    target.parentElement.classList.add("drag-over");
  }
}
function unHighlightTarget(target) {
  if (target.classList.contains("card__tasks-container")) {
    target.parentElement.classList.remove("drag-over");
  }
}

// Open Task in a modal
tasksBoardEl.addEventListener("click", function (e) {
  if (!e.target.closest(".task")) return;

  const taskId = +e.target.closest(".task").dataset.id;
  const taskStatus = e.target.closest(".task").dataset.status;
  const task = model.state.tasks[taskStatus].find((t) => t.id === taskId);
  displayTaskView.render(task);
  openModal(modalEl);
});

// Modal
const modalEl = document.querySelector(".modal");
const btnCloseModalEl = document.querySelector(".modal__btn--close");
const btnOpenModalEl = document.querySelector(".btn--open-modal");

modalEl.addEventListener("click", function (e) {
  if (!e.target.classList.contains("modal")) return;
  closeModal(this);
});
btnCloseModalEl.addEventListener("click", closeModal.bind(null, modalEl));
btnOpenModalEl.addEventListener("click", function () {
  const b = modalEl.querySelector(".modal__content-body");
  b.innerHTML = "";
  b.insertAdjacentHTML("afterbegin", generateAddNewTaskMarkup());
  openModal(modalEl);
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeModal(modalEl);
  if (e.key === "n" || e.key === "N") {
    const b = modalEl.querySelector(".modal__content-body");
    b.innerHTML = "";
    b.insertAdjacentHTML("afterbegin", generateAddNewTaskMarkup());
    openModal(modalEl);
  }
});

function closeModal(modal) {
  modal.classList.add("modal--close");
  document.querySelector("html").style.overflow = "auto";
  document.querySelector("html").style.overflowX = "hidden";
  document.querySelector("body").style.overflow = "auto";
}
function openModal(modal) {
  modal.classList.remove("modal--close");
  document.querySelector("html").style.overflow = "hidden";
  document.querySelector("body").style.overflow = "hidden";
}

function generateAddNewTaskMarkup() {
  return `
    <form class="form">
      <div class="form__first-box">
        <div class="form__group form__group--full-col">
          <label for="title">Title</label>
          <input type="text" name="title" id="title" minlength="4" placeholder="Task's title..." required>
          <span class="feedback-message">Must be more than<span class="highlighted">4 characters</span>.</span>
        </div>

        <div class="form__group form__group--full-col">
          <label for="description">Description</label>
          <textarea name="description" id="description" minlength="8" cols="30" rows="10" value=""
            placeholder="Task's description..." required></textarea>
          <span class="feedback-message">Must be more than<span class="highlighted">10 characters</span></span>
        </div>
      </div>

      <div class="form__second-box">
        <div class="form__group">
          <label for="keywords">Keywords</label>
          <input type="text" name="keywords" id="keywords" placeholder="keywords Separated by comma ','">
          <span class="feedback-message">Optional! Maximum<span class="highlighted">3 keywords</span>.</span>
        </div>

        <div class="form__group">
          <label for="category">Category</label>
          <select name="category" id="category">
            <option value="personal">Personal</option>
            <option value="design">Design</option>
            <option value="web-development">Web Development</option>
          </select>
        </div>

        <div class="form__group">
          <label for="priority-level">Priority</label>
          <select name="priority-level" id="priority-level">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div class="form__group">
          <label for="due-date">Due Date</label>
          <input type="date" value="2024-04-21" min="2024-04-21" name="due-date" id="due-date">
          <span class="feedback-message">Only<span class="highlighted">future</span> dates.</span>
        </div>
      </div>

      <div class="form__group form__group--actions form__group--full-col">
        <button type="submit" class="btn form__btn form__btn--add">Add</button>
      </div>
    </form>
  `;
}

const tasks = model.state.tasks;
taskBoardView.render(tasks);
const tasksContainersEl = document.querySelectorAll(".card__tasks-container");
makeDraggable(tasksBoardEl);
tasksContainersEl.forEach((container) => makeDroppable(container));
