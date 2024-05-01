import "core-js/stable";

import * as model from "./model.js";
import taskBoardView from "./views/taskBoardView.js";
import displayTaskView from "./views/displayTaskView.js";
import addTaskView from "./views/addTaskView.js";
import editTaskView from "./views/editTaskView.js";
import modalView from "./views/modalView.js";

// Control displaying all tasks
const displayTasks = function () {
  taskBoardView.render(model.state.tasks);
};

// Control displaying a task
const displayTask = function (taskStatus, taskId) {
  const task = model.state.tasks[taskStatus].find((t) => t.id == taskId);
  displayTaskView.render(task);

  // Attach actions event listeners
  displayTaskView.addHandlerTaskActions({
    delete: {
      task: { id: taskId, status: task.status },
      handler: deleteTask,
    },
    edit: {
      task,
      handler: displayEditTask,
    },
  });

  modalView.openModal();
};

// Control displaying 'Add Task Form'
const displayAddTask = function (e = undefined) {
  if (e?.key === "Escape") modalView.closeModal();
  else {
    // Rendering the form
    addTaskView.render(model.state.categories);

    // Attach submit event listener
    addTaskView.addHandlerSubmit(addTask);

    // Open the modal to display it
    modalView.openModal();
  }
};

// Control adding new task
const addTask = function (data) {
  // Clear the form
  addTaskView.clear();

  // Add a new task
  model.addNewTask(data);

  // Re-render the tasks board
  displayTasks();
};

// Control delete a task
const deleteTask = function (task) {
  // Delete the task
  model.deleteTask(task);

  // Re-render the tasks board
  displayTasks();

  // Close the modal
  modalView.closeModal();
};

// Control displaying 'Edit Task Form'
const displayEditTask = function (e, task) {
  const data = {
    task: task,
    categories: model.state.categories,
  };

  // Rendering the form
  editTaskView.render(data);

  // Attach submit event listener
  editTaskView.addHandlerSubmit(updateTask);

  // Open the modal to display it
  modalView.openModal();
};

// Control edit a task
const updateTask = function (data) {
  model.updateTask(data);

  // Re-render the tasks board
  displayTasks();

  modalView.closeModal();
};

// Control update the task status
const updateTaskStatus = function (task) {
  // Update status
  model.updateTaskStatus(task.id, task.status, task.newStatus);

  // Re-render the tasks board
  displayTasks();
};

// Control actions
const handleAction = function (action) {
  // Call action function
  model[action.name](action.property, action.propertyValue);
  taskBoardView.render(model.state.tasks);
};

// Event Handlers
taskBoardView.addHandlerRender(displayTasks);
taskBoardView.addHandlerUpdateTaskStatus(updateTaskStatus);
taskBoardView.addHandlerActions(handleAction);
displayTaskView.addHandlerRender(displayTask);
addTaskView.addHandlerRender(displayAddTask);
