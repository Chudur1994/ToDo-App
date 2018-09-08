const todos = [
  { text: "Work", completed: true },
  { text: "Exercise", completed: false },
  { text: "Eat", completed: true }
];
let filteredTodos = [];

const todoList = document.querySelector("#todo-list");
const todoInput = document.querySelector("#todo-input");
const todoSearch = document.querySelector("#todo-search");

let filter = "";

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
  });
}

// Adds a new todo item onto the page
function addTodo(todos, todoList, newTodo) {
  todos.push({ text: newTodo, completed: false });
  const todo = document.createElement("p");
  todo.textContent = newTodo;
  todo.classList.add("todo-item", "todo-incomplete");
  todoList.appendChild(todo);
}

// initialize the list of todos
renderTodos(todos, todoList);

document.querySelector("#add-todo").addEventListener("click", function(e) {
  if (todoInput.value.length > 0) {
    addTodo(todos, todoList, todoInput.value);
    todoInput.value = "";
  }
});

document.querySelector("#remove-todo").addEventListener("click", function(e) {
  console.log("remove");
});

todoSearch.addEventListener("input", function(e) {
  filter = todoSearch.value;
  renderTodos(todos, todoList);
});
