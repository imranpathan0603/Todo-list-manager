document.addEventListener("DOMContentLoaded", function () {

    // All your variables, event listeners, functions
    // loadTasksFromStorage();
    // createTaskElement();
    // enableDelete();
    // enableEdit();
    // enableComplete();
    // updateTaskOrder();
    // updateTaskCount();
    // etc...


    // input  ->input
// submit - click -> submit event - input word ko array me dala
// array me store karna hai - word array me store hua
// array ko display pe show karna hia - li me show kiye

const addInput = document.querySelector("#addInput");
const submit = document.querySelector("#submit");
let word = "";
let task = [];
const ul = document.createElement("ul");

// ADD UL inside container
document.querySelector(".todo-container").append(ul);

// Load tasks from localStorage (Page reload par bhi tasks dikhna chahiye)
function loadTasksFromStorage() {
  let savedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (savedTasks) {
    task = savedTasks;
    savedTasks.forEach((obj, index) => {
      createTaskElement(obj.text, index + 1, obj.completed);
    });
  }
}
loadTasksFromStorage();

// input se text lena (live)
addInput.addEventListener("input", function (evt) {
  word = evt.target.value;
});

// Create Task LI element + click + delete + numbering logic
function createTaskElement(text, number, isCompleted = false) {
  const li = document.createElement("li");
  li.classList.add('lists')
  // drag and drop
  li.setAttribute("draggable",true);
//  add class
  li.addEventListener('dragstart',function(){
    li.classList.add("dragging")
  })

// remove class
li.addEventListener("dragend",function(){
  li.classList.remove("dragging");
 updateTaskOrder(); // new order save in storage

})

// drag over
li.addEventListener("dragover",function(e){
  e.preventDefault();
    const dragging = document.querySelector(".dragging");
  if (dragging !== li) {
    ul.insertBefore(dragging, li.nextSibling);
  }
});


  if (isCompleted) {
    li.classList.add("completed");
  }

  li.textContent = `${number}. ${text}`;

  enableComplete(li);
  enableDelete(li);
  enableEdit(li);
  countTask()

  ul.append(li);
}

// submit - click event -> new task add in UI + array + storage
submit.addEventListener("click", function () {
  word = addInput.value.trim();
  if (word.length === 0) {
    alert("please enter a valid task / Kripya valid task likhe");
    return;
  }

  task.push({ text: word, completed: false });
  localStorage.setItem("tasks", JSON.stringify(task));

  createTaskElement(word, task.length);

  addInput.value = "";
  word = "";
});

// update numbering after delete (index always correct rakho)
function updateNumbers() {
  const listItems = ul.querySelectorAll("li");
  listItems.forEach((li, index) => {
    const txt = li.textContent.replace("✖", "").trim().split(". ")[1];
    li.childNodes[0].textContent = `${index + 1}. ${txt}`;
  });
}

// Enter key press = button click jaisa kaam kare
addInput.addEventListener("keydown", function (evt) {
  if (evt.key === "Enter") {
    submit.click();
  }
});

// Toggle Completed Task
function enableComplete(li) {
  li.addEventListener("click", function () {
    const actualTask = li.textContent.replace("✖", "").trim().split(". ")[1];
    const index = task.findIndex((t) => t.text === actualTask);

    task[index].completed = !task[index].completed;
    li.classList.toggle("completed");

    localStorage.setItem("tasks", JSON.stringify(task));
  });
}

// Delete Task
function enableDelete(li) {
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "✖";
  deleteBtn.classList.add("delete-btn");
  li.append(deleteBtn);

  deleteBtn.addEventListener("click", function (event) {
    event.stopPropagation();

    const actualTask = li.textContent.replace("✖", "").trim().split(". ")[1];
    const index = task.findIndex((t) => t.text === actualTask);

    task.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(task));

    li.remove();
    updateNumbers();
  });
}

// Edit Task
function enableEdit(li) {
  li.addEventListener("dblclick", function () {
    const oldTask = li.textContent.replace("✖", "").trim().split(". ")[1];

    const inputEdit = document.createElement("input");
    inputEdit.type = "text";
    inputEdit.value = oldTask;
    inputEdit.classList.add("edit-input");

    li.childNodes[0].textContent = "";
    li.insertBefore(inputEdit, li.querySelector(".delete-btn"));
    inputEdit.focus();

    inputEdit.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const newTask = inputEdit.value.trim();
        if (newTask.length === 0) return;

        const index = task.findIndex((t) => t.text === oldTask);
        task[index].text = newTask;
        localStorage.setItem("tasks", JSON.stringify(task));

        li.childNodes[0].textContent = `${index + 1}. ${newTask}`;
        inputEdit.remove();
      }
    });
  });
}





// theme
// Dark Mode - Auto and Manual Handling

// check system theme preference
const systemPrefDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// check localStorage theme
let savedTheme = localStorage.getItem("theme");

// apply theme based on preference
if (savedTheme === "dark" || (!savedTheme && systemPrefDark)) {
  document.body.classList.add("dark");
  document.querySelector("#themeToggle").checked = true;
}

// toggle button event
document.querySelector("#themeToggle").addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});

// keyboard shortcut: Shift + D theme toggle
document.addEventListener("keydown", function (e) {
  if (e.shiftKey && e.key === "D") {

    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    document.querySelector("#themeToggle").checked = isDark;

    localStorage.setItem("theme", isDark ? "dark" : "light");
  }
});



// order function 
function updateTaskOrder(){
  const reorderedTask=[];
    const listItems = ul.querySelectorAll("li");


    listItems.forEach((li)=>{
      const text = li.textContent.replace("✖","").trim().split(". ")[1];

        const original = task.find(t => t.text === text);
    reorderedTask.push(original);

    });
    
  task = reorderedTask;
  localStorage.setItem("tasks", JSON.stringify(task));
  updateNumbers();
}


function countTask(){
   let tasks = JSON.parse(localStorage.getItem("tasks"));

   let count =0;
   
   task.forEach((e)=>{
    if(e.completed === false){
      count++;
    }
   
   })
  const takscount= document.getElementById('taskCount');
  takscount.innerHTML=count;
}
}); // Do NOT forget closing
