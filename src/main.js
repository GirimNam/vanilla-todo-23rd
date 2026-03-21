import "./style.css";

const input = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const dateElement = document.querySelector("#date");
const countElement = document.querySelector(".count");
const todoForm = document.querySelector("form");
const prev = document.querySelector("#prev");
const next = document.querySelector("#next");
const RAINBOW_COLORS = [
  "#f9d6d6",
  "#FFD6A5",
  "#f8f9ca",
  "#e7ffe2",
  "#c7f4f8",
  "#A0C4FF",
  "#d1cafd",
];

let currentDate = Temporal.Now.plainDateISO("Asia/Seoul");

const updateDisplay = () => {
  const formattedDate = `${currentDate.year}년 ${currentDate.month}월 ${currentDate.day}일`;
  dateElement.textContent = formattedDate;

  const dayIndex = currentDate.dayOfWeek;
  const shiftIndex = (dayIndex + 6) % 7;

  const todayColor = RAINBOW_COLORS[shiftIndex];
  document.body.style.backgroundColor = todayColor;

  prev.style.backgroundColor = todayColor;
  next.style.backgroundColor = todayColor;
};

prev.addEventListener("click", () => {
  ((currentDate = currentDate.subtract({ days: 1 })),
    updateDisplay(),
    loadTodos());
});

next.addEventListener("click", () => {
  ((currentDate = currentDate.add({ days: 1 })), updateDisplay(), loadTodos());
});

updateDisplay();

const getStorageKey = () => {
  return currentDate.toString();
};

const saveTodos = () => {
  const todos = [];
  todoList.querySelectorAll("li").forEach((li) => {
    todos.push({
      text: li.querySelector("span").textContent,
      done: li.querySelector(".check").checked,
    });
  });
  localStorage.setItem(getStorageKey(), JSON.stringify(todos));
};

const loadTodos = () => {
  const savedTodos = JSON.parse(localStorage.getItem(getStorageKey())) || [];
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
  const wrapper = document.createElement("div");
  wrapper.className = "output";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "check";
  checkbox.checked = isDone;

  const span = document.createElement("span");
  span.textContent = value;

  if (isDone) {
    span.classList.add("done");
  }

  li.querySelector(".delete").onclick = () => {
    li.remove();
    updateCount();
    saveTodos();
  };

  li.querySelector(".check").onchange = (e) => {
    const span = li.querySelector("span");
    if (e.target.checked) {
      span.classList.add("done");
    } else {
      span.classList.remove("done");
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
