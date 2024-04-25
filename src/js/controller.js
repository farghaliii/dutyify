import "core-js/stable";

import * as model from "./model.js";
import taskBoardView from "./views/taskBoardView.js";
import displayTaskView from "./views/displayTaskView.js";
import addTaskView from "./views/addTaskView.js";
import modalView from "./views/modalView.js";

// Control Displaying All Tasks
const displayTasks = function () {
  const tasks = model.state.tasks;
  taskBoardView.render(tasks);
};

// Control Displaying a Task
const displayTask = function (taskStatus, taskId) {
  const task = model.state.tasks[taskStatus].find((t) => t.id === taskId);
  displayTaskView.render(task);
  modalView.openModal();
};

// Control Displaying Add Task Form
const displayAddTask = function (e = undefined) {
  if (e?.key === "Escape") modalView.closeModal();
  else {
    addTaskView.render();
    modalView.openModal();
  }
};

// Event Handlers
taskBoardView.addHandlerRender(displayTasks);
displayTaskView.addHandlerRender(displayTask);
addTaskView.addHandlerRender(displayAddTask);
