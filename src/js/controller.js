import "core-js/stable";

import * as model from "./model.js";
import taskBoardView from "./views/taskBoardView.js";
import displayTaskView from "./views/displayTaskView.js";
import addTaskView from "./views/addTaskView.js";
import modalView from "./views/modalView.js";
import { formDataExtraction } from "./helpers.js";

// Control displaying all tasks
const displayTasks = function () {
  const tasks = model.state.tasks;
  taskBoardView.render(tasks);
};

// Control displaying a task
const displayTask = function (taskStatus, taskId) {
  const task = model.state.tasks[taskStatus].find((t) => t.id === taskId);
  displayTaskView.render(task);
  modalView.openModal();
};

// Control displaying 'Add Task Form'
const displayAddTask = function (e = undefined) {
  if (e?.key === "Escape") modalView.closeModal();
  else {
    addTaskView.render();
    modalView.openModal();

    // Attach submit event listener
    addTaskView.addHandlerSubmit(addTask);
  }
};
// Control adding new task
const addTask = function (e) {
  const data = formDataExtraction(e.target);
  console.log(data);
  model.addNewTask(data);
};

// Event Handlers
taskBoardView.addHandlerRender(displayTasks);
displayTaskView.addHandlerRender(displayTask);
addTaskView.addHandlerRender(displayAddTask);
