const inputbox = document.getElementById("addtask");
let Donecounter = parseInt(localStorage.getItem("Donecounter")) || 0;
let addtaskcounter = parseInt(localStorage.getItem("addtaskcounter")) || 0;
let edit = false;
let editDiv = null; // To store the reference to the task div being edited

function addtask() {
    if (inputbox.value.trim() === '') {
        alert("Please enter something");
    } else {
        addtaskcounter++;
        updateCounters();

        if (addtaskcounter === 1){
            CreateTaskTodoDiv();
        } else if (addtaskcounter > 1){
            const textTodoDiv = document.querySelector(`.tasktodo .text`);
            textTodoDiv.textContent = `Tasks todo-${addtaskcounter}`; 
        }

        // Create the task container div
        let div = document.createElement("div");
        div.className = "tasks-1 iner-tasktodo";

        // Create the task text div
        let textdiv = document.createElement("div");
        textdiv.className = "task";
        textdiv.textContent = inputbox.value;

        // Create the icons div
        let iconsdiv = document.createElement("div");
        iconsdiv.className = "icons";

        // Create the check, edit, and delete icons
        let checkIcon = createIconButton('fa-check');
        let editIcon = createIconButton('fa-pen');
        let deleteIcon = createIconButton('fa-trash');

        // Append icons to the icons div
        iconsdiv.appendChild(checkIcon);
        iconsdiv.appendChild(editIcon);
        iconsdiv.appendChild(deleteIcon);

        // Append the task text and icons div to the task container div
        div.appendChild(textdiv);
        div.appendChild(iconsdiv);

        // Append the task container div to the tasktodo section
        document.querySelector('.tasktodo').appendChild(div);

        // Clear the input box after adding the task
        inputbox.value = '';

        // Attach event listeners to the buttons
        attachEventListeners(div, textdiv, checkIcon, editIcon, deleteIcon);

        // Save tasks and counters to localStorage
        saveData();
    }
}

function attachEventListeners(div, textdiv, checkIcon, editIcon, deleteIcon) {
    // Mark task as done
    checkIcon.querySelector('button').addEventListener('click', function() {
        addtaskcounter--;
        updateCounters();
        Donecounter++;
        updateCounters();

        if (Donecounter === 1) {
            CreateDoneTaskDiv();
        } else if (Donecounter > 1) {
            const textDoneDiv = document.querySelector(`.donetasks .text`);
            textDoneDiv.textContent = `Done-${Donecounter}`;
        }

        TasksDone(textdiv.textContent);

        // Optionally, remove the task from the todo list after marking it as done
        div.remove();
        saveData();
    });

    // Edit task
    editIcon.querySelector('button').addEventListener('click', function() {
        edit = true;
        editDiv = textdiv; // Store reference to the div being edited
        inputbox.value = textdiv.textContent;
        inputbox.focus();
    });

    // Delete task
    deleteIcon.querySelector('button').addEventListener('click', function() {
        div.remove(); // Remove the task when delete is clicked
        addtaskcounter--;
        updateCounters();
        saveData();
    });
}

function createIconButton(iconClass) {
    let iTag = document.createElement('i');
    iTag.className = `fa-solid ${iconClass}`;

    let button = document.createElement('button');
    button.type = 'button';
    button.className = 'iconbtn';
    button.appendChild(iTag);

    let iTagDiv = document.createElement('div');
    iTagDiv.className = 'i-tag';
    iTagDiv.appendChild(button);

    return iTagDiv;
}

function TasksDone(taskMessage) {
    const doneTasksDiv = document.querySelector('.donetasks');
    const tskdoneDiv = document.createElement('div');
    tskdoneDiv.className = 'tskdone';
    tskdoneDiv.textContent = taskMessage;
    doneTasksDiv.appendChild(tskdoneDiv);
}

function CreateDoneTaskDiv() {
    const doneTasksDiv = document.querySelector('.donetasks');
    const textDoneDiv = document.createElement('div');
    textDoneDiv.className = 'text';
    textDoneDiv.textContent = `Done-${Donecounter}`;
    doneTasksDiv.appendChild(textDoneDiv);
}

function handleEditButtonClick() {
    if (inputbox.value.trim() === '') {
        alert("Please enter something");
    } else if (editDiv) { // Check if there is a div being edited
        editDiv.textContent = inputbox.value;
        edit = false;
        editDiv = null; // Clear the reference after editing
        inputbox.value = ''; // Clear input box after editing
        saveData();
    }
}

function handleButtonClick() {
    if (edit) {
        handleEditButtonClick();
    } else {
        addtask();
    }
}

function CreateTaskTodoDiv() {
    const TasksTodoDiv = document.querySelector('.tasktodo');
    const textTaskTodoDiv = document.createElement('div');
    textTaskTodoDiv.className = 'text';
    textTaskTodoDiv.textContent = `Tasks todo-${addtaskcounter}`;
    TasksTodoDiv.appendChild(textTaskTodoDiv);
}

function updateCounters() {
    localStorage.setItem("addtaskcounter", addtaskcounter);
    localStorage.setItem("Donecounter", Donecounter);

    // Handle visibility of "Tasks todo" heading
    const textTodoDiv = document.querySelector('.tasktodo .text');
    if (addtaskcounter > 0) {
        if (textTodoDiv) {
            textTodoDiv.textContent = `Tasks todo-${addtaskcounter}`;
        }
    } else if (textTodoDiv) {
        textTodoDiv.remove(); // Remove the "Tasks todo" heading if no tasks are left
    }
}

function saveData() {
    const tasktodo = document.querySelector('.tasktodo');
    const donetasks = document.querySelector('.donetasks');
    localStorage.setItem("tasks", tasktodo.innerHTML);
    localStorage.setItem("doneTasks", donetasks.innerHTML);
}

function loadData() {
    const tasktodo = document.querySelector('.tasktodo');
    const donetasks = document.querySelector('.donetasks');
    tasktodo.innerHTML = localStorage.getItem("tasks") || '';
    donetasks.innerHTML = localStorage.getItem("doneTasks") || '';

    // Update counters and reattach event listeners
    updateCounters();
    tasktodo.querySelectorAll('.tasks-1').forEach(div => {
        const textdiv = div.querySelector('.task');
        const checkIcon = div.querySelector('.fa-check').closest('.i-tag');
        const editIcon = div.querySelector('.fa-pen').closest('.i-tag');
        const deleteIcon = div.querySelector('.fa-trash').closest('.i-tag');
        attachEventListeners(div, textdiv, checkIcon, editIcon, deleteIcon);
    });
}

// Load data from local storage when the page is loaded
window.onload = loadData;



