# Dutyify

## User Stories

- As a user, I want to be able to create a new task so that I can organize my work efficiently.
- As a user, I want to be able to delete a task that I no longer need so that my task list stays up-to-date.
- As a user, I want to be able to mark a task as complete so that I can track my progress.
- As a user, I want to be able to edit a task in case I need to update its details or deadline.
- As a user, I want to be able to prioritize tasks so that I can focus on the most important ones first.
- As a user, I want to be able to categorize tasks into different groups or projects so that I can better organize my workload.
- As a user, I want to be able to set reminders or notifications for tasks with deadlines so that I don't miss them.
- As a user, I want to be able to search or filter tasks based on keywords, tags, or other criteria so that I can quickly find what I'm looking for.
- As a user, I want to be able to reorder tasks manually or based on priority so that I can adjust my workflow as needed.
- As a user, I want to be able to access the Task Manager App offline, without requiring an internet connection.
- As a user, I want the Task Manager App to be responsive and user-friendly across different devices and screen sizes.
- As a user, I want to be able to import and export tasks or task lists for backup or sharing purposes.
- As a user, I want the Task Manager App to be secure, ensuring that my task data remains private and protected.
- As a user, I want the Task Manager App to have a simple and intuitive interface, making it easy to use without needing extensive training.

---

## Features

### Create a new task

- Allow users to input a title and description for the task.
- Include an optional field for setting a deadline for the task.
- Provide options for users to select the priority level (high, medium, low) or assign numerical values to prioritize tasks.
- Allow users to optionally assign the task to a specific category or project for better organization.

### Delete a task

- Implement a delete button or action for each task in the task list.
- Display a confirmation dialog box when the delete action is triggered to prevent accidental deletion.
  Upon confirmation, remove the task from the task list.

### Mark a task as complete

- Include a checkbox or toggle button next to each task in the task list.
- When the checkbox/button is clicked, visually indicate that the task has been completed
  (e.g., strike through the task title or change its color).
- Provide an option to filter or hide completed tasks from the task list view.

### Edit a task

- Allow users to click on a task to enter an edit mode or provide an edit button/icon.
- Display editable fields for the task title, description, deadline, priority, and category.
- After making changes, provide a save button to apply the edits to the task.

### Prioritize tasks

- Implement a mechanism for users to set the priority level of each task.
- Display priority indicators next to each task in the task list (e.g., color-coded icons or labels).
- Allow users to sort tasks based on priority level within the task list.

### Categorize tasks

- Provide an interface for users to create, edit, and delete categories or projects.
- Allow users to assign tasks to specific categories during task creation or editing.
- Enable filtering tasks by category in the task list view.

### Set reminders/notifications

- Implement a notification system to alert users about upcoming task deadlines.
- Allow users to set reminders for tasks at specific times or intervals before the deadline.
- Provide options for users to customize notification preferences (e.g., sound, frequency).

### Search/filter tasks

- Include a search bar or filter options in the task list interface.
- Allow users to search for tasks using keywords present in the task title or description.
- Implement filters based on criteria such as priority, category, or completion status.

### Reorder tasks

- Enable users to drag and drop tasks within the task list to manually reorder them.
- Provide options to sort tasks automatically based on priority, deadline, or alphabetical order.
- Ensure that the reordering functionality is intuitive and responsive across devices.

### Offline access

- Implement local storage functionality to store task data on the user's device.
- Allow users to access and modify tasks even when offline.

### Responsive design

- Design the user interface to adapt smoothly to various screen sizes and orientations.
- Ensure that all features and functionalities are accessible and user-friendly on desktops, tablets, and smartphones.
- Test the app on different devices and resolutions to ensure a consistent user experience.

### Import/export Tasks

- Allow users to import tasks from external sources (e.g., CSV files, other task management apps).
- Provide options to export task data in common file formats for backup or sharing purposes (e.g., CSV, JSON).

### Intuitive interface

- Design a clean and minimalist user interface with intuitive navigation elements.
- Use familiar icons, buttons, and gestures to facilitate easy interaction.
- Provide helpful tooltips or hints for new users to understand how to use the app effectively.

---

## Steps

### App Structure ✅

- dutyify
  - src
    - css
      - style.css
    - js
      - views
        - xView.js _it is a class_
      - model.js _it is a module_
      - controller.js _it is a module_
  - index.html

### Design & implement the UI ✅

- Tasks Board
- Add Task Form Compoment
- Task Preview Component

### Init a new project using `npm init` it will create package.json file ✅

### Install Parcel using `npm i parcel -D` ✅

### In package.json add in scripts object these two commands ✅

- "start" : "parcel index.html" // To run parcel using `npm run start`
- "build" : "parcel build index.html" // To build our project after development using `npm run build`

### Install polyfill packages `npm i core-js regenerator-runtime` To support old broswers ✅

### Start with the business logic

## What I Learn

### Drag-n-Drop Technique

It consists of two parts the draggable elements and the droppable areas (Targets)

The **draggable** elements have these events:

- dragstart
- drag
- dragend

The **target** of these elements is the **draggable** element.

And the **droppable** area has these events:

- dragenter
- dragover
- dragleave
- drop _Fire in case the draggable element dropped in this **valid** droppable area/target_.

The **target** of these elements is the **droppable target(area)** element.

**So what does mean by _Valid Droppable Area_?**

The elements that support d-n-d they don't allow dropping by default, So we need to prevent
the default behavior in these two events (**dragenter** and **dragover**) by using **e.preventDefault()**

#### Problems

- **Drop within Task Element**

  - **Issue**: Each _card_ has _task_ divs containing text and details. I want users to be able to drop items onto the **board (cards)**, but currently, they can also drop them within individual tasks, which isn't the intended behavior.

  - **Solution**: Using conditions to determine the specific element

#### Resources

1. [Javascript drag and drop](https://www.javascripttutorial.net/web-apis/javascript-drag-and-drop/)
2. [Josestg: todo app](https://github.com/josestg/todo-app/)

### Misc Problems

- **Shortcut key functionality**

  - **Issue**: When I tried to implement a shortcut key functionality to open the task form quickly, I had a problem. The shortcut key I chose was 'n'. But whenever I tried to type a word with the letter 'n', the form opened again.

  - **Solution**: I implemented a function called isAnyInputOrTextareFocused that check if there is any input or textarea element focused,
    If there is then prevent the shortcut behaviour

    ```JS
      isAnyInputOrTextareFocused() {
        const focusedElement = document.activeElement;
        return (
          focusedElement.tagName === "INPUT" ||
          focusedElement.tagName === "TEXTAREA"
        );
      }
    ```
