const todos = [
  { text: "Work", completed: true, createdOn: "Wed Aug 29 2018" },
  { text: "Exercise", completed: false, createdOn: "Sat Aug 24 2018" },
  { text: "Eat", completed: true, createdOn: "Mon Aug 20 2018" }
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
    const todoText = document.createElement("p");
    todoText.textContent = item.text;
    todoText.classList.add("todo-text");

    const todoDate = document.createElement("span");
    todoDate.textContent = `Created On: ${item.createdOn}`;
    todoDate.classList.add("todo-createdOn");

    const todo = document.createElement("div");
    todo.classList.add("todo-item");
    if (item.completed) {
      todo.classList.add("todo-complete");
    } else {
      todo.classList.add("todo-incomplete");
    }

    todo.appendChild(todoText);
    todo.appendChild(todoDate);

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
  renderTodos(todos, todoList);
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
      console.log(todos);
      break;
    }
  }
  removedTodo.parentNode.removeChild(removedTodo);
}

removeButton.addEventListener("click", function(e) {
  if (!this.classList.contains("disabled-button")) {
    if (confirm("Really remove the selected ToDo(s)?")) {
      const todosToBeRemoved = document.querySelectorAll(".active-todo");
      todosToBeRemoved.forEach(function(item) {
        removeToDo(todos, item);
      });
      this.classList.add("disabled-button");
    } else {
    }
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
