const todos = [
  { text: "Work", completed: true },
  { text: "Exercise", completed: false },
  { text: "Eat", completed: true }
];
let filteredTodos = [];

const todoList = document.querySelector("#todo-list");
const todoInput = document.querySelector("#todo-input");
const todoSearch = document.querySelector("#todo-search");
const addbutton = document.querySelector("#add-todo");
const removeButton = document.querySelector("#remove-todo");

let filter = "";

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
    const todo = document.createElement("p");
    todo.textContent = item.text;
    todo.classList.add("todo-item");
    if (item.completed) {
      todo.classList.add("todo-complete");
    } else {
      todo.classList.add("todo-incomplete");
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
    completed: false
  });
  renderTodos(todos, todoList);
}

addbutton.addEventListener("click", function(e) {
  if (todoInput.value.length > 0) {
    addTodo(todos, todoList, todoInput.value);
    todoInput.value = "";
  }
});

function removeToDo(todos, removedTodo) {
  let indexToBeRemoved;

  for (let index = 0; index < todos.length; index++) {
    const element = todos[index];
    if (element.text == removedTodo) {
      indexToBeRemoved = index;
      break;
    }
  }

  todos.splice(indexToBeRemoved, 1);
  removedTodo.parentNode.removeChild(removedTodo);
}

removeButton.addEventListener("click", function(e) {
  if (!this.classList.contains("disabled-button")) {
    const todosToBeRemoved = document.querySelectorAll(".active-todo");
    todosToBeRemoved.forEach(function(item) {
      removeToDo(todos, item);
    });
    this.classList.add("disabled-button");
  }
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
