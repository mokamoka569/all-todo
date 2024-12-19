const formElement = document.querySelector("form");
const inputElement = document.querySelector("input");
const apiKey = "6762f18360a208ee1fde4d4a";
const loadingScreen = document.querySelector(".loading");
let allTodos = [];
getAllTodo();

formElement.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputElement.value.trim().length > 0) {
    addTodos();
  }
});
async function addTodos() {
  showScreen();
  const todo = {
    title: inputElement.value,
    apiKey: apiKey,
  };
  const obj = {
    method: "POST",
    body: JSON.stringify(todo),
    headers: {
      "content-type": "application/json",
    },
  };
  const response = await fetch("https://todos.routemisr.com/api/v1/todos", obj);
  if (response.ok) {
    const data = await response.json();
    if (data.message === "success") {
      toastr.success("added successfuly", "Toastr App");
      await getAllTodo();
      formElement.reset();
    }
  }
  hideScreen();
}

async function getAllTodo() {
  showScreen();
  const response = await fetch(
    `https://todos.routemisr.com/api/v1/todos/${apiKey}`
  );
  if (response.ok) {
    const data = await response.json();
    if (data.message === "success") {
      allTodos = data.todos;
      display();
    }
  }
  hideScreen();
}
function display() {
  let cartona = "";
  for (const todo of allTodos) {
    cartona += `
          <li class="d-flex align-items-center justify-content-between border-bottom pb-2 my-2">
                <span onclick="markCompleted('${todo._id}')" style="${
      todo.completed ? " text-decoration: line-through;" : ""
    }" class="task-name">${todo.title}</span>
                <div class="d-flex align-items-center gap-4">
                    ${
                      todo.completed
                        ? '<span> <i class="fa-regular fa-circle-check" style="color: #63E6BE;"></i></span>'
                        : ""
                    }
                    <span onclick="deleteData('${
                      todo._id
                    }')" class="icon"><i class="fa-solid fa-trash-can"></i></span>
                </div>
            </li>
        `;
  }
  document.querySelector(".task-container").innerHTML = cartona;
  changeProgress();
}
async function deleteData(idTodo) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      showScreen();
      const todoData = {
        todoId: idTodo,
      };
      const obj = {
        method: "DELETE",
        body: JSON.stringify(todoData),
        headers: {
          "content-type": "application/json",
        },
      };
      const response = await fetch(
        "https://todos.routemisr.com/api/v1/todos",
        obj
      );
      if (response.ok) {
        const data = await response.json();
        if (data.message === "success") {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          getAllTodo();
        }
      }
      hideScreen();
    }
  });
}
async function markCompleted(idTodo) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, completed it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      showScreen();
      const todoData = {
        todoId: idTodo,
      };
      const obj = {
        method: "PUT",
        body: JSON.stringify(todoData),
        headers: {
          "content-type": "application/json",
        },
      };
      const response = await fetch(
        "https://todos.routemisr.com/api/v1/todos",
        obj
      );
      if (response.ok) {
        const data = await response.json();
        if (data.message === "success") {
          Swal.fire({
            title: "completed!",
            icon: "success",
          });
          getAllTodo();
        }
      }
      hideScreen();
    }
  });
}
function showScreen() {
  loadingScreen.classList.remove("d-none");
}
function hideScreen() {
  loadingScreen.classList.add("d-none");
}
function changeProgress() {
  const completedTask = allTodos.filter((todo) => todo.completed).length;
  const totalTask = allTodos.length;
  document.getElementById("progress").style.width = `${
    (completedTask / totalTask) * 100
  }%`;
  const statusNumber = document.querySelectorAll(".stutas-number span");
  statusNumber[0].innerHTML = completedTask;
  statusNumber[1].innerHTML = totalTask;
}
