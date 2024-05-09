import "core-js/stable";

import * as model from "./model.js";
import taskBoardView from "./views/taskBoardView.js";
import displayTaskView from "./views/displayTaskView.js";
import addTaskView from "./views/addTaskView.js";
import editTaskView from "./views/editTaskView.js";
import modalView from "./views/modalView.js";

// Control displaying all tasks
const displayTasks = function () {
  // If there are criteria, they will be applied first
  let tasks = model.filterTasks(JSON.parse(JSON.stringify(model.state.tasks)));
  tasks = model.sortTasks(tasks);
  taskBoardView.render(tasks);
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
const handleActions = function (action) {
  if (action.name == "toggle-action") {
    taskBoardView.updateActionsUI(model.state.criteria[action.type]);
    return;
  }

  // Deep cloning the tasks objects
  // [This isn't the best way to clone an object deeply BUT it works fine here.]
  // Maybe in another situation I'll use 'cloneDeep' from lodash library.
  let tasks = JSON.parse(JSON.stringify(model.state.tasks));

  // TODO: -Fix: When remove criterion UI doesn't update
  const isCriterionRemoved = model.updateCriteria(action);
  if (isCriterionRemoved) {
    taskBoardView.uncheckActionBtn(action);
  }

  tasks = model.filterTasks(tasks);
  tasks = model.sortTasks(tasks);

  taskBoardView.updateActionsUI(model.state.criteria[action.name]);
  taskBoardView.render(tasks);
};

// Event Handlers
taskBoardView.addHandlerRender(displayTasks);
taskBoardView.addHandlerUpdateTaskStatus(updateTaskStatus);
taskBoardView.addHandlerActions(handleActions);
displayTaskView.addHandlerRender(displayTask);
addTaskView.addHandlerRender(displayAddTask);
