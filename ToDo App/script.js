const todos = [
  {
    text: "Work",
    completed: true,
    createdOn: "Wed Aug 29 2018",
    completedOn: "Thu Aug 30 2018"
  },
  { text: "Exercise", completed: false, createdOn: "Sat Aug 24 2018" },
  {
    text: "Eat",
    completed: true,
    createdOn: "Mon Aug 20 2018",
    completedOn: "Wed Aug 22 2018"
  }
];
let filteredTodos = [];
let previousTodos = [];

const todoList = document.querySelector("#todo-list");
const todoInput = document.querySelector("#todo-input");
const todoSearch = document.querySelector("#todo-search");
const addbutton = document.querySelector("#add-todo");
const removeButton = document.querySelector("#remove-todo");
const undoButton = document.querySelector("#undo-remove");
const sortButton = document.querySelector("#sort-todo");
const sortOptionGroup = document.querySelector(".sort-option-group");

const Sorts = Object.freeze({
  CREATED_ON: Symbol("Created On"),
  COMPLETED_ON: Symbol("Completed On"),
  INCOMPLETE: Symbol("Incomplete")
});

let filter = "";
let sortedBy;

// initialize the list of todos
renderTodos(todos, todoList);

// Renders out a new list of todos
function renderTodos(todos, todoList) {
  filteredTodos = todos.filter(function(item) {
    return item.text.toLowerCase().includes(filter.toLowerCase());
  });

  // clear previous list of todos on page
  todoList.innerHTML = "";

  // render new todos
  filteredTodos.forEach(function(item) {
    const todo = document.createElement("div");
    todo.classList.add("todo-item");
    if (item.completed) {
      todo.classList.add("todo-complete");
    } else {
      todo.classList.add("todo-incomplete");
    }

    const todoText = document.createElement("p");
    todoText.textContent = item.text;
    todoText.classList.add("todo-text");
    todo.appendChild(todoText);

    const todoDate = document.createElement("span");
    todoDate.textContent = `Created On: ${item.createdOn}`;
    todoDate.classList.add("todo-createdOn");
    todo.appendChild(todoDate);

    if (item.completedOn) {
      const todoCompleted = document.createElement("span");
      todoCompleted.textContent = `Completed On: ${item.completedOn}`;
      todoCompleted.classList.add("todo-completedOn");
      todo.appendChild(todoCompleted);
    } else {
      const todoCompleted = document.createElement("span");
      todoCompleted.textContent = `Completed On: Incomplete`;
      todoCompleted.classList.add("todo-completedOn");
      todo.appendChild(todoCompleted);
    }

    todoList.appendChild(todo);

    todo.addEventListener("click", function(e) {
      todoClickHandler(todo);
    });
  });
}

// Adds a new todo item onto the page
function addTodo(todos, todoList, newTodo) {
  todos.push({
    text: newTodo,
    completed: false,
    createdOn: new Date().toDateString()
  });

  renderTodos(getSortedTodos(), todoList);
}

function getSortedTodos() {
  let todosToRender;

  switch (sortedBy) {
    case Sorts.COMPLETED_ON:
      todosToRender = dateCompletedSort();
      break;
    case Sorts.CREATED_ON:
      todosToRender = dateCreatedSort();
      break;
    case Sorts.INCOMPLETE:
      todosToRender = incompleteSort();
      break;
    default:
      todosToRender = todos.slice();
      break;
  }

  return todosToRender;
}

addbutton.addEventListener("click", function(e) {
  if (todoInput.value.length > 0) {
    addTodo(todos, todoList, todoInput.value);
    todoInput.value = "";
  }
});

function removeToDo(todos, removedTodo) {
  // find and remove todo object from array of todos
  for (let index = 0; index < todos.length; index++) {
    const element = todos[index];
    if (element.text == removedTodo.querySelector(".todo-text").textContent) {
      todos.splice(index, 1);
      break;
    }
  }
  removedTodo.parentNode.removeChild(removedTodo);
}

removeButton.addEventListener("click", function(e) {
  if (
    !this.classList.contains("disabled-button") &&
    confirm("Really remove the selected ToDo(s)?")
  ) {
    // remember previous list of todos for undo function
    previousTodos = todos.slice();

    const todosToBeRemoved = document.querySelectorAll(".active-todo");
    todosToBeRemoved.forEach(function(item) {
      removeToDo(todos, item);
    });
    this.classList.add("disabled-button");
  }

  undoButton.classList.remove("hidden-button");
});

undoButton.addEventListener("click", function(e) {
  todos.splice(0, todos.length, ...previousTodos);
  undoButton.classList.add("hidden-button");
  renderTodos(getSortedTodos(), todoList);
});

todoSearch.addEventListener("input", function(e) {
  filter = todoSearch.value;
  renderTodos(todos, todoList);
});

// respond to todo item clicks
const todoClickHandler = function(item) {
  item.classList.toggle("active-todo");

  const todos = document.querySelectorAll(".todo-item");
  let removeBtnActivated = false;

  for (let index = 0; index < todos.length; index++) {
    const element = todos[index];

    // check to see if any of the todos are currently clicked
    if (element.classList.contains("active-todo")) {
      removeButton.classList.remove("disabled-button"); // enable remove button
      removeBtnActivated = true;
      break;
    }
  }

  // if none of the todos are currently clicked, disable remove button
  if (!removeBtnActivated) {
    removeButton.classList.add("disabled-button");
  }
};

sortButton.addEventListener("click", function(e) {
  sortOptionGroup.classList.toggle("sort-active");
});

document.addEventListener("click", function(e) {
  if (e.target !== sortButton) {
    sortOptionGroup.classList.remove("sort-active");
  }
});

document
  .querySelector("#sort-dateCreated")
  .addEventListener("click", function(e) {
    let dateSorted = dateCreatedSort();

    renderTodos(dateSorted, todoList);
    sortButton.textContent = "Date Created";
    document.querySelectorAll(".sort-option").forEach(function(item) {
      item.classList.remove("sort-option-selected");
    });
    this.classList.add("sort-option-selected");
    sortedBy = Sorts.CREATED_ON;
  });

function dateCreatedSort() {
  return todos.sort(function(a, b) {
    if (new Date(a.createdOn) < new Date(b.createdOn)) {
      return -1;
    } else if (new Date(a.createdOn) > new Date(b.createdOn)) {
      return 1;
    } else {
      return 0;
    }
  });
}

document
  .querySelector("#sort-dateCompleted")
  .addEventListener("click", function(e) {
    let dateSorted = dateCompletedSort();

    renderTodos(dateSorted, todoList);
    sortButton.textContent = "Date Completed";
    document.querySelectorAll(".sort-option").forEach(function(item) {
      item.classList.remove("sort-option-selected");
    });
    this.classList.add("sort-option-selected");
    sortedBy = Sorts.COMPLETED_ON;
  });

function dateCompletedSort() {
  return todos.sort(function(a, b) {
    if (!b.completedOn || new Date(a.completedOn) < new Date(b.completedOn)) {
      return -1;
    } else if (
      !a.completedOn ||
      new Date(a.completedOn) > new Date(b.completedOn)
    ) {
      return 1;
    } else {
      return 0;
    }
  });
}

document
  .querySelector("#sort-incomplete")
  .addEventListener("click", function(e) {
    const sortedTodos = incompleteSort();

    renderTodos(sortedTodos, todoList);
    sortButton.textContent = "Incomplete First";
    document.querySelectorAll(".sort-option").forEach(function(item) {
      item.classList.remove("sort-option-selected");
    });
    this.classList.add("sort-option-selected");
    sortedBy = Sorts.INCOMPLETE;
  });

function incompleteSort() {
  let completeTodos = todos.filter(function(item) {
    return item.completed;
  });

  let incompleteTodos = todos.filter(function(item) {
    return !item.completed;
  });

  return incompleteTodos.concat(completeTodos);
}
