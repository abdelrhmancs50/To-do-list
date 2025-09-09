//setting up the variables
let theInput = document.querySelector(".add-task input");
let theAddButton = document.querySelector(".plus");
let tasksContent = document.querySelector(".tasks-content");
let tasksCount = document.querySelector(".tasks-count span");
let tasksCompleted = document.querySelector(".completed-tasks span");
let deleteAll = document.querySelector(".delete-all");
let completeAll = document.querySelector(".complete-all");
// focus on input feild
window.onload = function () {
  theInput.focus();
  let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = savedTasks;

  if (tasks.length > 0) {
    let noTasksMsg = document.querySelector(".no-tasks-message");
    if (noTasksMsg) noTasksMsg.remove();

    tasks.forEach((task) => {
      createTaskElement(task);
    });
  }
  calculateTasks();
};
// array to keep tasks
let tasks = [];
let newTask = theInput.value;

// creating task elements
function createTaskElement(taskText) {
  let mainSpan = document.createElement("span");
  mainSpan.classList.add("task-box");

  let deleteButton = document.createElement("span");
  deleteButton.classList.add("delete");

  let text = document.createTextNode(taskText);
  let deleteText = document.createTextNode("delete");

  mainSpan.appendChild(text);
  mainSpan.appendChild(deleteButton);
  deleteButton.appendChild(deleteText);

  tasksContent.appendChild(mainSpan);
}

//adding the tasks
theAddButton.onclick = function () {
  let newTask = theInput.value.trim().toLowerCase();
  // if input is empty
  if (theInput.value === "") {
    Swal.fire({
      title: "Error !",
      text: "يجب إضافة مهة",
      icon: "error",
      confirmButtonText: "تمام",
    });
  } else {
    if (tasks.includes(newTask)) {
      Swal.fire({
        title: "Error !",
        text: "المهمة موجودة بالفعل",
        icon: "error",
        confirmButtonText: "تمام",
      });
    } else {
      tasks.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      let noTasksMsg = document.querySelector(".no-tasks-message");

      if (document.body.contains(document.querySelector(".no-tasks-message"))) {
        noTasksMsg.remove();
      }
      createTaskElement(theInput.value);
      calculateTasks();
      theInput.value = "";
      theInput.focus();
    }
  }
};
//delete tasks
document.addEventListener("click", function (e) {
  if (e.target.className == "delete") {
    let taskText = e.target.parentNode.firstChild.textContent
      .trim()
      .toLowerCase();
    tasks = tasks.filter((task) => task !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    e.target.parentNode.remove();

    //check the number of tasks
    if (tasksContent.childElementCount == 0) {
      createNoTasks();
    }
  }
  if (e.target.classList.contains("task-box")) {
    e.target.classList.toggle("finished");
  }
  calculateTasks();
});

// delete all tasks
deleteAll.onclick = function () {
  tasks = [];
  localStorage.removeItem("tasks");
  tasksContent.innerHTML = "";
  createNoTasks();
};
// complete all tasks
completeAll.onclick = function () {
  Array.from(tasksContent.children).forEach((child) => {
    if (child.classList.contains("task-box")) {
      child.classList.add("finished");
    }
  });
};

// function to create no tasks message
function createNoTasks() {
  let msgSpan = document.createElement("span");
  msgSpan.classList.add("no-tasks-message");
  let msgText = document.createTextNode("no tasks to show");
  msgSpan.appendChild(msgText);
  tasksContent.appendChild(msgSpan);
}
// function to calculate tasks
function calculateTasks() {
  tasksCount.innerHTML = document.querySelectorAll(".task-box").length;
  tasksCompleted.innerHTML =
    document.querySelectorAll(".task-box.finished").length;
}
// add tasks by enter button
theInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    theAddButton.click();
  }
});
