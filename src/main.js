import "./style.css";

const input = document.querySelector("#todo-input");
//const addBtn = document.querySelector("#add");
const todoList = document.querySelector("#todo-list");
const dateElement = document.querySelector("#date");
const countElement = document.querySelector(".count");
const todoForm = document.querySelector("form");

const now = new Date();

const updateDisplay = () => {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();

  const formattedDate = `${year}년 ${month}월 ${date}일`;
  dateElement.textContent = formattedDate;

  const dayIndex = now.getDay();
  const shiftIndex = (dayIndex + 6) % 7;

  const rainbowColors = [
    "#f9d6d6",
    "#FFD6A5",
    "#f8f9ca",
    "#e7ffe2",
    "#c7f4f8",
    "#A0C4FF",
    "#d1cafd",
  ];

  const todayColor = rainbowColors[shiftIndex];
  document.body.style.backgroundColor = todayColor;

  const prev = document.querySelector("#prev");
  const next = document.querySelector("#next");
  prev.style.backgroundColor = todayColor;
  next.style.backgroundColor = todayColor;
};

document.querySelector("#prev").addEventListener("click", () => {
  now.setDate(now.getDate() - 1);
  updateDisplay();
});

document.querySelector("#next").addEventListener("click", () => {
  now.setDate(now.getDate() + 1);
  updateDisplay();
});

updateDisplay();

const saveTodos = () => {
  const todos = [];
  todoList.querySelectorAll("li").forEach((li) => {
    todos.push({
      text: li.querySelector("span").textContent,
      done: li.querySelector(".check").checked,
    });
  });
  localStorage.setItem("myTodoList", JSON.stringify(todos));
};

const loadTodos = () => {
  const savedTodos = JSON.parse(localStorage.getItem("myTodoList")) || [];
  savedTodos.forEach((todo) => {
    createTodoItem(todo.text, todo.done);
  });
};

const updateCount = () => {
  const currentCnt = todoList.querySelectorAll(".check:not(:checked)").length;
  countElement.textContent = currentCnt;
};

const createTodoItem = (value, isDone = false) => {
  const li = document.createElement("li");
  li.innerHTML = `
    <div class="output">
      <input class="check" type="checkbox" ${isDone ? "checked" : ""} />
      <span style="${isDone ? "text-decoration: line-through; color: gray;" : ""}">${value}</span>
      <button class="delete"> - </button>
    </div>
  `;

  li.querySelector(".delete").onclick = () => {
    li.remove();
    updateCount();
    saveTodos();
  };

  li.querySelector(".check").onchange = (e) => {
    const span = li.querySelector("span");
    if (e.target.checked) {
      span.style.textDecoration = "line-through";
      span.style.color = "gray";
    } else {
      span.style.textDecoration = "none";
      span.style.color = "black";
    }
    updateCount();
    saveTodos();
  };

  todoList.appendChild(li);
  updateCount();
};

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value.trim();

  if (value === "") {
    alert("내용을 입력해주세요.");
    return;
  }

  createTodoItem(value);
  saveTodos();

  input.value = "";
  input.focus();
});

loadTodos();
