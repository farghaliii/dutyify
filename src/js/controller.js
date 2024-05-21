import "core-js/stable";

import * as model from "./model.js";
import taskBoardView from "./views/taskBoardView.js";
import displayTaskView from "./views/displayTaskView.js";
import addTaskView from "./views/addTaskView.js";
import editTaskView from "./views/editTaskView.js";
import addCategoryView from "./views/addCategoryView.js";
import modalView from "./views/modalView.js";

// Control displaying all tasks
const displayTasks = function () {
  // If there are criteria, they will be applied first
  let tasks = model.filterTasks(model.getTasks());
  tasks = model.sortTasks(tasks);
  taskBoardView.render(
    tasks,
    model.state.categories,
    model.state.currentCategory
  );
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

// Control displaying 'Add Category Form'
const displayAddCategory = function (e = undefined) {
  if (e?.key === "Escape") modalView.closeModal();
  else {
    // Rendering the form
    addCategoryView.render();

    // Attach submit event listener
    addCategoryView.addHandlerSubmit(addCategory);

    // Open the modal to display it
    modalView.openModal();
  }
};

// Control adding new category
const addCategory = function (data) {
  // Clear the form
  addCategoryView.clear();

  // Add a new task
  model.addNewCategory(data);

  modalView.closeModal();

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
const displayEditTask = function (_, task) {
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
  // Toggle dropmenu
  if (action.isToggle) {
    taskBoardView.updateActionsUI(
      action.name,
      model.state.actions[action.name]
    );
    return;
  }

  // Delete Category
  if (action.name === "delete-category") {
    model.deleteCategory(action);
  }

  if (action.name == "filter" && action.field == "category") {
    // Update current category
    model.updateCurrentCategory(action);
  }

  let tasks = model.getTasks();

  // Update criteria
  if (action.isUpateCriteria) {
    const isCriterionRemoved = model.updateCriteria(action);
    if (isCriterionRemoved) {
      taskBoardView.resetActionInputs(action);
    }
  }

  // Delete a keyword
  if (action.isDeleteOneKeyword) {
    model.deleteFilterKeyword(action.value);
  }

  // Filtering based on the saved criteria
  tasks = model.filterTasks(tasks);

  // Sorting based on the saved criteria
  tasks = model.sortTasks(tasks);

  // Search for specific tasks based on a field and its value
  if (action.isSearch) {
    tasks = model.findTasks(tasks, action.value, action.field);
  }

  if (!action.isSearch && !action.isDeleteCategory) {
    taskBoardView.updateActionsUI(
      action.name,
      model.state.actions[action.name]
    );
  }

  taskBoardView.render(
    tasks,
    model.state.categories,
    model.state.currentCategory
  );
};

// Event Handlers
taskBoardView.addHandlerRender(displayTasks);
taskBoardView.addHandlerUpdateTaskStatus(updateTaskStatus);
taskBoardView.addHandlerActions(handleActions);
displayTaskView.addHandlerRender(displayTask);
addTaskView.addHandlerRender(displayAddTask);
addCategoryView.addHandlerRender(displayAddCategory);
