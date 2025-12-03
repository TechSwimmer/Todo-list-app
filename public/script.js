// =====================
// GLOBAL DOM CACHE
// =====================
const DOM = {
    navMenuLinks : document.getElementById('nav-menu-links'),
    
    toggleNavMenu : document.getElementById('toggle-nav-menu'),
    taskDayInfo : document.getElementById('day-info'),
    feedbackPage : document.getElementById('feedb'),
    settingsPage : document.getElementById('settings'),
    helpPage : document.getElementById('help'),
    
    taskPageContainer : document.getElementById('taskPageContainer'),
    editTaskPageContainer : document.getElementById('editTaskPageContainer'),
    editTaskContainer : document.getElementById('edit-task-container'),
    overlayCreate : document.getElementById('overlay-create'),
    overlayEdit : document.getElementById('overlay-edit'),
    taskNameInput : document.getElementById('task-name'),
    
    taskNotesInput : document.getElementById('task-notes'),
    taskDateInput : document.getElementById('task-date'),
    taskContainer : document.querySelector('.task-container'),
    addTaskBtn : document.querySelector('.add-task-icon'),
    taskSubmitBtn : document.getElementById('create'),
    // edit-tas btn
    editBtn : document.getElementById('edit'),
    // edit-task DOM
    editTaskName : document.getElementById('edit-task-name'),
    editTaskNotes : document.getElementById('edit-task-notes'),
    editTaskDate : document.getElementById('edit-task-date'),
    // the msg to be displayed when no tass noTasksDiv
    noTasksDiv : document.querySelector('#day-info #no-tasks'),
    // calendar related
    lMonthArrow : document.getElementById('l-arrow-month'),
    currMonth : document.getElementById('month'),
    rMonthArrow : document.getElementById('r-arrow-month'),
    currYear : document.getElementById('year'),
    lYearArrow : document.getElementById('l-arrow-year'),
    rYearArrow : document.getElementById('r-arrow-year'),
    tableBody : document.getElementById("table-body"),
    // navbar related
    navLinks : document.querySelector('ul'),
    listButton : document.querySelector('#toggle-nav-menu'),
    backbtn : document.querySelector('#back-btn'),
    navHeader : document.querySelector('#nav-header h2'),
    feedbackLink : document.getElementById('feedback-link'),
    helpLink : document.getElementById('help-link'),
    settingsLink : document.getElementById('settings-link'),
    
    //feedback-form
    feebdName :   document.getElementById("feedb-name"), 
    feedbEmail : document.getElementById("feedb-email"),
    feedbExperience :  document.getElementById("feedb-experience"),
    feedbSatisfaction : document.getElementById("feedb-satisfaction"),
    feedbImprovement : document.getElementById("feedb-improvement"),
    feedbIssues : document.getElementById("feedb-issues"),
    // nav btns logn/signup DOMs
    loginNavBtn : document.querySelector('#login-signup-link'),
    overlayLogin : document.querySelector('.overlay-login'),
    loginPage : document.querySelector('.login-page'),

    //signup DOMs 
    signupContainer : document.querySelector('.signup-container'),
    overlaySignupContainer : document.querySelector('.overlay-signup-container'),
    signupBtn : document.querySelector('#signup-button'),

    // login DOMs
    loginBtn : document.querySelector('#login-button'),
    overlayLoginContainer : document.querySelector('.overlay-login-container'),
    loginUserPage : document.querySelector('.login-container'),

    // main login and logout btns
    navLogin : document.getElementById('login-signup-link'),
    navLogout : document.getElementById('logout-link')
}

// display login or logout btns
function updateAuthBtn() {
    const token = localStorage.getItem('authToken');

    if(token){
        DOM.navLogin.style.display = 'none';
        DOM.navLogout.style.display = 'block';
        console.log(token);
    }
    else{
        DOM.navLogin.style.display = 'block';
        DOM.navLogout.style.display = 'none';
        console.log(token);
    }
}
document.addEventListener("DOMContentLoaded", updateAuthBtn)


// STORE ELEMENTS IN A VARIABLE FOR MULTIPLE USE
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Toggle navigation menu
function toggleNav(open) {
    DOM.navLinks.classList.toggle("nav-menu-links", !open);
    DOM.listButton.classList.toggle("nav-menu-links", open);
    DOM.backbtn.classList.toggle("nav-menu-links", !open);
}

DOM.listButton.addEventListener("click", () => toggleNav(true));
DOM.backbtn.addEventListener("click", () => toggleNav(false));

// Arrow Hover Effects (Optimized)
const arrowElements = [
    { element: "#l-arrow-year", defaultWidth: "0px" },
    { element: "#r-arrow-year", defaultWidth: "0px" },
    { element: "#l-arrow-month", defaultWidth: "0px" },
    { element: "#r-arrow-month", defaultWidth: "0px" }
];

arrowElements.forEach(({ element, defaultWidth }) => {
    const arrow = document.querySelector(element);
    arrow.addEventListener("mouseenter", () => (arrow.style.width = "20px"));
    arrow.addEventListener("mouseleave", () => (arrow.style.width = defaultWidth));
});


// ------------------------------------------------add-task-icon btn use and add-task page dynamism.-----------------------------------------

function openTaskPage() {
    // Use CSS classes for visibility 
    DOM.taskPageContainer.classList.remove('hidden');
    DOM.overlayCreate.classList.add('block');
    DOM.taskContainer.classList.remove('visibility');
    DOM.addTaskBtn.classList.add('visibility');

    // Reset input fields
    DOM.taskNameInput.value = "";
    DOM.taskNotesInput.value = "";
    DOM.taskDateInput.value = "";
}

function closeTaskPage() {
    DOM.taskPageContainer.classList.add('hidden');
    DOM.overlayCreate.classList.remove('block');
    DOM.taskContainer.classList.add('visibility');
    DOM.addTaskBtn.classList.remove('visibility');
}

function closeEditPage() {
    DOM.editTaskPageContainer.style.display = 'none';
    DOM.editTaskContainer.classList.add('visibility');
    DOM.overlayEdit.style.display = 'none';
    DOM.addTaskBtn.classList.remove('visibility');
    // overlayEdit.style.pointerEvents = 'none'
}

// Add event listener
DOM.addTaskBtn.addEventListener('click', openTaskPage);


// overlay mouse pointer behaviour when create task page is open



DOM.overlayCreate.addEventListener('click', function () {
    closeTaskPage();
});

DOM.overlayCreate.addEventListener('mouseenter', function () {
   DOM.overlayCreate.style.cursor = 'pointer';
})
// overlay edit click functionality

DOM.overlayEdit.addEventListener('mouseenter', function () {
    DOM.overlayEdit.style.cursor = 'pointer';
})
DOM.overlayEdit.addEventListener('click', function () {
    closeEditPage()
})

// task page elements and behaviour to load them in the day-info page updating the day-info heading to the date supplied.

// elements required for rendering the task page
async function renderTaskPage() {
    const taskName = DOM.taskNameInput.value.trim();
    const taskNotes = DOM.taskNotesInput.value.trim() || "No Task Notes.";
    const taskDate = DOM.taskDateInput.value.trim();

    // Clear previous task info & hideExtraPages();
    clearUI()

    // Ensure both task name and task date are provided
    if (!taskName || !taskDate) return;

    // Check if user is logged in (assume token is stored in localStorage)
    const token = localStorage.getItem("authToken");
    const userID = localStorage.getItem("userID");
    console.log(token, userID)
    let apiEndpoint;
    let headers = { "Content-Type": "application/json" }
    let taskData = { taskName, taskNotes, taskDate: new Date(taskDate).toISOString(), completed: false }

    // if user is logged in set endpoint accordingly
    if (userID) {
        // for logged in user
        apiEndpoint = `${CONFIG.backendUrl}/api/user/tasks/add`;
        headers["Authorization"] = `Bearer ${token}`;
        headers["userID"] = userID;
    }

    // Prepare task object

    console.log(apiEndpoint)
    try {
        // Send the task to the server
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(taskData)
        });

        const responseData = await response.json();

        if (!response.ok) throw new Error(responseData.message);

        // Create task UI
        const taskDiv = document.createElement('div');
        taskDiv.setAttribute('data-id', responseData._id);
        taskDiv.innerHTML = `
            <div class="task-added" data-id="${responseData._id}" data-date="${taskDate}">
                <div class="head-checkbox">
                    <h3>${taskName}</h3>
                    <div class="checkbox">
                        <h4 class="task-done">Task Done.</h4>
                    </div>
                </div>
                <p>${taskNotes.replace(/\n/g, "<br>")}</p>
                <div id="Edit-del-btn">
                    <div id="Delete-task" class="Delete-task">Delete</div>
                    <div id="Edit-task" class="Edit-task">Edit task</div>
                </div>
            </div>
        `;

        console.log(taskDate, taskName, taskNotes, responseData._id);
        DOM.navHeader.innerText = taskDate;
        DOM.taskDayInfo.appendChild(taskDiv);

        // Close task page
        closeTaskPage();
    } catch (error) {
        console.error("Error creating task:", error.message);
    }
}


// function to handle the visibility of the navbar buttons 
// w.r.t  when it is clicked and at what screen width   

function handleMediaQueryChange(e) {
    // Ensure taskDayInfo is visible by default
    DOM.taskDayInfo.style.display = 'block';

    if (e.matches) {
        // Hide nav menu links and show back button when screen width is ≤ 1280px
        DOM.navMenuLinks.classList.add('visibility');
        DOM.backbtn.classList.add('visibility');
        DOM.toggleNavMenu.classList.add('invisibility');

        // Prevent multiple event listeners from being added
        DOM.toggleNavMenu.onclick = () => {
            DOM.navMenuLinks.classList.remove('visibility');
            DOM.backbtn.classList.remove('visibility');
            DOM.toggleNavMenu.classList.remove('invisibility');

            // Hide the current section when opening the nav menu
            if (DOM.feedbackPage) DOM.feedbackPage.style.display = 'none';
            if (DOM.settingsPage) DOM.settingsPage.style.display = 'none';
            if (DOM.helpPage) DOM.helpPage.style.display = 'none';
            DOM.taskDayInfo.style.display = 'none';
        };

        DOM.backbtn.onclick = () => {
            // Ensure the last active section remains visible
            if (DOM.feedbackPage && DOM.feedbackPage.style.display === 'block') {
                DOM.navHeader.innerText = 'Feedback';
            } else if (DOM.settingsPage && DOM.settingsPage.style.display === 'block') {
                DOM.navHeader.innerText = 'Settings';
            } else if (DOM.helpPage && DOM.helpPage.style.display === 'flex') {
                DOM.navHeader.innerText = 'Help';
            }

            // Hide the menu and show the correct section
            DOM.navMenuLinks.classList.add('visibility');
            DOM.backbtn.classList.add('visibility');
            DOM.toggleNavMenu.classList.add('invisibility');
            DOM.taskDayInfo.style.display = 'block';
        };
    } else {
        // Desktop view: Show nav menu links
        DOM.navMenuLinks.style.display = 'flex';
    }
}


// calender behaviour when adding a task on a date


function renderCalendar(year, month, date) {
    // the year and monthh on whichh the task is added must be displayed in calender
    // ELEMENTS REQUIRED FOR CALENDER MODIFICATIONS

    let taskDate = DOM.taskDateInput.value;
    let taskName = DOM.taskNameInput.value;

    // Guard clause: Ensure required inputs are provided
    if (!taskDate || !taskName) {
        alert('please provide a task name and the date when the task should be completed.')
        openTaskPage();
        return;
    }

    // Update displayed month & year
    DOM.currMonth.innerText = months[month - 1];
    DOM.currYear.innerText = year;

    // Get first day of the month and total days in the month
    const startOfMonth = new Date(year, month - 1, 1).getDay();
    const numOfDays = new Date(year, month, 0).getDate();

    // Clear previous calendar rows
    DOM.tableBody.innerHTML = '';
    // remove bg styles for date cells
    removeDateBg();

    //render the dates of the month in proper order
    let dateCounter = 1;
    for (let row = 0; row < 6; row++) { // Max 6 rows
        let tr = document.createElement('tr');

        for (let col = 0; col < 7; col++) { // 7 days a week
            let td = document.createElement('td');

            // Fill dates only after the first day offset
            if (row === 0 && col < startOfMonth) {
                td.classList.add('empty');
            } else if (dateCounter <= numOfDays) {
                td.textContent = dateCounter;

                // Highlight selected task date
                if (dateCounter === date) {
                    td.style.backgroundColor = 'blue';
                }

                dateCounter++;
            }

            tr.appendChild(td);
        }
        DOM.tableBody.appendChild(tr);
    }

}


// Event Listener for Task Submission
DOM.taskSubmitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    
    if (!DOM.taskDateInput.value) return; // Prevent error if date is empty

    const [year, month, day] = DOM.taskDateInput.value.split('-').map(Number);
    renderCalendar(year, month, day);
    renderTaskPage();
});


// render a calender with today's date when  you first start the page and ensure tht there is a csslender loaded in all scenarios the calender should indicate thhe scenario 

function renderRegularCalendar() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Correct month index
    const day = currentDate.getDate();

    DOM.currMonth.innerText = months[month - 1]; // Display month name
    DOM.currYear.innerText = year;

    // Get total days in the current month
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthStartDay = new Date(year, month - 1, 1).getDay(); // Start day (0=Sunday)

    // Clear previous calendar
    DOM.tableBody.innerHTML = '';

    let dayCounter = 1;
    for (let row = 0; row < 6; row++) { // Max 6 rows in a calendar
        let tr = document.createElement('tr');

        for (let col = 0; col < 7; col++) { // 7 columns for 7 days of the week
            let td = document.createElement('td');

            if (row === 0 && col < monthStartDay) {
                // Empty cells before month start
                td.classList.add('empty');
            } else if (dayCounter <= daysInMonth) {
                td.textContent = dayCounter;

                // Highlight today's date
                if (dayCounter === day) {
                    td.classList.add('highlight');
                    if (dayCounter == day) { document.querySelector('.nav-header h2').innerText = "Today"; }
                    console.log(dayCounter, day)
                }

                dayCounter++;
            }

            tr.appendChild(td);
        }
        DOM.tableBody.appendChild(tr);
    }

}

renderRegularCalendar();

// ---------------------------------------------------------------CALENDER BUTTONS FUNCTIONAlITY----------------------------------------------------------

//-------------------------------------------------------------left button functionality

function monthLeftbtn() {
   
    let yearNumber = parseInt(DOM.currYear.innerText);
    
    // change the year if we click btn on january and set the month to dec
    if (DOM.currMonth.textContent == months[0]) {
        DOM.currYear.textContent = yearNumber - 1;
        DOM.currMonth.textContent = months[11];
        daysLoader(parseInt(DOM.currYear.textContent), months.indexOf(DOM.currMonth.textContent))
    }
    else {
        for (let i = 0; i < months.length; i++) {
            if (DOM.currMonth.textContent === months[i]) {
                DOM.currMonth.textContent = months[i - 1];
                daysLoader(parseInt(DOM.currYear.textContent), months.indexOf(DOM.currMonth.textContent));
            }
        }
    }

}

DOM.lMonthArrow.addEventListener('click', () => {
    monthLeftbtn();
})

// function that will fill days in the table cells according to the current month and date that is set

function daysLoader(year, month) {
    let numOfDays = 32 - new Date(year, month, 32).getDate();
    let startOfMonth = new Date(year, month, 1).getDay();

    DOM.tableBody.innerHTML = ""; // Clear the previous table

    let date = new Date();
    let thismonth = date.getMonth();
    let thisyear = date.getFullYear();
    let todayDate = date.getDate();

    let currentDay = 1;

    for (let i = 0; i < 6; i++) { // Max 6 weeks
        let row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            let cell = document.createElement("td");

            if (i === 0 && j < startOfMonth) {
                cell.classList.add("empty");
            } else if (currentDay <= numOfDays) {
                cell.textContent = currentDay;

                if (currentDay === todayDate && year === thisyear && month === thismonth) {
                    cell.classList.add("highlight"); // Apply highlight class
                }
               
                currentDay++;

            }
            row.appendChild(cell);
        }
        DOM.tableBody.appendChild(row);
    }
}
//-----------------------------------------------------------------------------right month button behaviour

function rightMonthbtn() {
  
    if (DOM.currMonth.textContent === months[11]) {
        let yearNumber = parseInt(DOM.currYear.textContent) + 1;
        DOM.currYear.textContent = yearNumber;
        DOM.currMonth.textContent = months[0];
        daysLoader(yearNumber, months.indexOf(DOM.currMonth.textContent))
    }
    else {
        let yearNumber = parseInt(DOM.currYear.textContent);
        let changeMonth = months.indexOf(DOM.currMonth.textContent) + 1;
        DOM.currMonth.textContent = months[changeMonth];
        daysLoader(yearNumber, months.indexOf(DOM.currMonth.textContent));
    }
}

DOM.rMonthArrow.addEventListener('click', () => {
    rightMonthbtn();
})

//------------------------------------------------buttons for year---------------------------------------------------------------------

function leftYearBtn() {
    let changeYear = parseInt(DOM.currYear.innerText);
    DOM.currYear.textContent = changeYear - 1;
    daysLoader(changeYear - 1, months.indexOf(DOM.currMonth.textContent));
}

DOM.lYearArrow.addEventListener("click", () => {
    leftYearBtn()
})

function rightYearBtn() {
    let changeYear = parseInt(DOM.currYear.innerText);
    DOM.currYear.textContent = changeYear + 1;
    daysLoader(parseInt(DOM.currYear.textContent), months.indexOf(DOM.currMonth.textContent));
}

DOM.rYearArrow.addEventListener('click', () => {
    rightYearBtn();
})

// ----------------open the edit page with all the user info placed in the task editor-----------------

function openEditPage(taskName, taskNotes, taskDate, taskID) {

    DOM.editTaskName.value = taskName;
    DOM.editTaskNotes.value = taskNotes;
    DOM.editTaskDate.value = new Date(taskDate).toISOString().slice(0, 10);
    DOM.overlayEdit.style.display = 'block';
    DOM.addTaskBtn.classList.add('visibility');
    DOM.editTaskContainer.classList.remove('visibility');
    DOM.editTaskPageContainer.style.display = 'block';
    // Store the current task ID as a data attribute for future reference
    DOM.editBtn.setAttribute('data-id', taskID);

}

DOM.taskDayInfo.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('Edit-task')) {
        const edittaskDiv = event.target.closest('.task-added');
        const taskID = edittaskDiv.getAttribute('data-id');
        const edittaskDate = edittaskDiv.getAttribute('data-date');              // Get from data-date attribute
        const edittaskName = edittaskDiv.querySelector('h3').innerText;          // Select <h3> for task name
        const edittaskNotes = edittaskDiv.querySelector('p').innerHTML.replace(/<br>/g, "\n");
        edittaskDiv.remove();
        console.log(edittaskNotes)
        openEditPage(edittaskName, edittaskNotes, edittaskDate, taskID);
        // const editBtn = document.getElementById('edit');
        DOM.editBtn.replaceWith(DOM.editBtn.cloneNode(true)); // Remove old listeners
        document.getElementById('edit').addEventListener('click', () => {
            let taskDate = DOM.editTaskDate.value;
            let userNoteInput = DOM.editTaskNotes.value;

            const taskObj = {
                taskID,
                taskName: DOM.editTaskName.value,
                taskNotes: userNoteInput,
                taskDate: new Date(taskDate).toISOString().slice(0, 10)
            };

            console.log(taskObj);

            editTask(taskObj.taskID, taskObj.taskName, taskObj.taskNotes, taskObj.taskDate).then(() => {
                closeEditPage();
            });
        });
    }
});

// Remove the specific task when a user clicks delete specific task

DOM.taskDayInfo.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('Delete-task')) {
        const deleteTaskDiv = event.target.closest('.task-added')
        let taskID = deleteTaskDiv.getAttribute('data-id')
        console.log(taskID)
        deleteSpecificTask(taskID, deleteTaskDiv)
    }
})


//---------------------------- REMOVE THE ADDED TASK DIV WHEN USER CLICKS CHECKBOX------------------------------------------

DOM.taskDayInfo.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('task-done')) {
        const taskDiv = event.target.closest('.task-added');

        if (!taskDiv) return; // Ensure taskDiv exists

        const taskID = taskDiv.getAttribute('data-id');
        let token = localStorage.getItem('authToken')
        fetch(`${CONFIG.backendUrl}/api/tasks/completed/${taskID}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json','Authorization':`Bearer ${token}` },
            body: JSON.stringify({ completed: true }),
            
        })
            .then(response => {
                if (!response.ok) throw new Error("Failed to update task");
                return response.json();
            })
            .then(data => {
                console.log("Task marked as completed:", data);
                taskDiv.remove(); // Remove only after confirmation
            })
            .catch(error => {
                console.error("Error updating tasks:", error.message);
                alert("Failed to mark task as completed. Please try again.");
            });
    }
});


function displayNoTasksMessage(message) {
    let noTasksDiv = document.createElement('div');
    noTasksDiv.innerHTML = `<h4 id="no-tasks">${message}</h4>`;
    DOM.taskDayInfo.appendChild(noTasksDiv);
}

function clearTasks() {
    let taskDivs = document.querySelectorAll('.task-added');
    taskDivs.forEach(task => task.remove());
    let noTasksDiv = document.querySelectorAll('#no-tasks');
    noTasksDiv.forEach(task => task.remove());
}


// Function to display tasks for a selected date
function getDataFromBackend(year, month, selectedDay) {
    // Remove help and settings pages
    // hideExtraPages();
    clearUI()
    clearTasks()
    let reqTaskDate = new Date(Date.UTC(year, month - 1, selectedDay)).toISOString().split('T')[0];

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        console.error("No auth token found.not logged in.");
        displayNoTasksMessage("Please log in to view tasks.");
        return;
    }
    const userId = localStorage.getItem('userID');
    
    try {
        const payload = JSON.parse(atob(authToken.split('.')[1])); // Decode JWT payload
        // userId = payload.userID;
        
    } catch (error) {
        console.error("Failed to decode token:", error.message);
        displayNoTasksMessage("Invalid session. Please log in again.");
        return;
    }

    const url = `${CONFIG.backendUrl}/api/user/tasks/fetch?year=${year}&month=${month}&day=${selectedDay}&userID=${userId}`;

    fetch(url, {
        method: 'GET',

        headers: { 'Authorization': `Bearer ${authToken}`, "userid": localStorage.getItem('userID') }       // Include token in headers
    })
        .then(response => response.json())
        .then(data => {
            let updatedTask;
            if (Array.isArray(data)) {
                updatedTask = data.filter(task => task.taskDate.split('T')[0] === reqTaskDate);
            }
            else {
                updatedTask = [data];
            }

            if (updatedTask.length === 0) {
                displayNoTasksMessage("No tasks for the day.");
                return;
            }

            updatedTask.forEach(task => {
                if (!task.completed) {
                    let taskDiv = document.createElement('div');
                    taskDiv.innerHTML = `
                            <div class="task-added" data-id="${task._id}" data-date="${task.taskDate}">
                                <div class="head-checkbox">
                                    <h3>${task.taskName}</h3>
                                    <div class="checkbox"><h4 class="task-done">Task Done.</h4></div>
                                </div>
                                <p>${task.taskNotes.replace(/\n/g, "<br>")}</p>
                                <div id="Edit-del-btn">
                                    <div id="Delete-task" class="Delete-task">Delete</div>
                                    <div id="Edit-task" class="Edit-task">Edit task</div>
                                </div>
                            </div>`;

                    DOM.taskDayInfo.appendChild(taskDiv);

                }
            });

            if (updatedTask.every(task => task.completed)) {
                displayNoTasksMessage("All tasks for the day completed.");
            }
        })
        .catch(error => {
            console.error("Error fetching tasks:", error);
            displayNoTasksMessage("Failed to load tasks. Please try again.");
        });

}

function formatDate(dateString) {
    let [year, month, day] = dateString.split('-'); // Split into parts
    return `${year}-${parseInt(month)}-${parseInt(day)}`; // Convert to number to remove leading zeros
}

DOM.tableBody.addEventListener('click',(e) => {
    const cell = e.target;
    if(cell.tagName !== "TD" || !cell.innerText) {return}
    removeDateBg();

    cell.style.backgroundColor = 'blue';
    const year = Number(DOM.currYear.innerText);
    const month = months.indexOf(DOM.currMonth.innerText)+1;
    const day = Number(cell.innerText);

    const selectedDate = `${year}-${month}-${day}`

    // today/tomorrow logic
    let today = new Date().toISOString().split('T')[0];
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow = tomorrow.toISOString().split('T')[0];
    // set the date in correct format for proper comparison
    today = formatDate(today);
    tomorrow = formatDate(tomorrow);

    if(selectedDate == today){
        DOM.navHeader.innerText = 'Today'
    }
    else if(selectedDate === tomorrow){
        DOM.navHeader.innerText = 'Tomorrow'
    }
    else{
        DOM.navHeader.innerText = selectedDate;
    }
    getDataFromBackend(year,month,day)
})


function clearUI() {
    let elementsToHide = ['help', 'feedb', 'settings'];
    elementsToHide.forEach(id => {
        let element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });

    document.querySelectorAll('.task-added').forEach(task => task.remove());

    if (DOM.noTasksDiv) DOM.noTasksDiv.remove();

    let dateCells = document.querySelectorAll('#table-body tr td');
    dateCells.forEach(cell => cell.style.backgroundColor = 'aqua');
}

function renderTasks(tasks, filterType) {
   
    let filteredTasks = tasks;

    if (filterType === 'completed') {
        DOM.navHeader.innerText = "Completed";
        filteredTasks = tasks.filter(task => task.completed);
    } else {
        DOM.navHeader.innerText = "All Tasks";
    }

    if (filteredTasks.length === 0) {
        let taskDiv = document.createElement('div');
        taskDiv.innerHTML = `<h4 id="no-tasks">${filterType === 'completed' ? "No tasks completed" : "No tasks created."}</h4>`;
        DOM.taskDayInfo.appendChild(taskDiv);
        return;
    }

    filteredTasks.forEach(task => {
        let userNoteInput = task.taskNotes.replace(/\n/g, "<br>");
        let taskDiv = document.createElement('div');
        taskDiv.classList.add("task-added");
        taskDiv.setAttribute('data-id', task._id);
        taskDiv.setAttribute('data-date', task.taskDate);
        taskDiv.innerHTML = `
                <div class="head-checkbox">
                    <h3>${task.taskName}</h3>
                    <div class="checkbox">
                        <h4 class="task-done">Task Done.</h4>
                    </div>
                </div>
                <p>${userNoteInput}</p>
                <div id="Edit-del-btn">
                    <div id="Delete-task" class="Delete-task">Delete</div>
                    <div id="Edit-task" class="Edit-task">Edit task</div>
                </div>
            `;
        DOM.taskDayInfo.appendChild(taskDiv);
    });
}


function fetchAndDisplayTasks(filterType) {
    clearUI();
    clearTasks();
    let url = `${CONFIG.backendUrl}/api/user/tasks/alltasks`;
    
    let calenderDate = new Date()
    if(filterType == "tomorrow"){
        calenderDate.setDate(calenderDate.getDate() + 1);
    }
    fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            "userid": localStorage.getItem("userID")
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Tasks retrieved:', data);
            let filteredTasks = data;
            if(filterType === "Today"){
                DOM.navHeader.innerText = 'Today';
                const today = new Date();
                const year = today.getFullYear()
                const month = String((today.getMonth() + 1)).padStart(2, '0')
                const day = String((today.getDate())).padStart(2,'0');
                const todayDate = `${year}-${month}-${day}`
                filteredTasks = data.filter(task => task.taskDate.split('T')[0] == todayDate &&  task.completed == false)
            }
            if (filterType === "tomorrow") {
                let date = new Date();
                date.setDate(date.getDate() + 1);
                let targetDate =date.toISOString().split('T')[0];
                
                DOM.navHeader.innerText = 'Tomorrow';
                filteredTasks = data.filter(task => task.taskDate.split('T')[0] == targetDate && task.completed == false);
                console.log(targetDate)
            } else if (filterType === "completed") {
                DOM.navHeader.innerText = 'Completed';
                filteredTasks = data.filter(task => task.completed);
                console.log(filteredTasks)
            }
            else if (filterType === "All Tasks") {
                DOM.navHeader.innerText = 'All Tasks';
                filteredTasks = data.filter(task => task);
                console.log(filteredTasks)
            }
            console.log('filtered tasks:',filteredTasks);
            if (filteredTasks.length > 0) {
                filteredTasks.forEach(task => {
                    let taskDiv = document.createElement('div');
                    let taskId = task._id;
                    let taskNotes = task.taskNotes.replace(/\n/g, "<br>");

                    taskDiv.innerHTML = `
                            <div class="task-added" data-id="${taskId}" data-date="${task.taskDate}">
                                <div class="head-checkbox">
                                    <h3>${task.taskName}</h3>
                                    <div class="checkbox">
                                        <h4 class="task-done">${'Task Done.'}</h4>
                                    </div>
                                </div>
                                <p>${taskNotes}</p>
                                <div id="Edit-del-btn">
                                    <div id="Delete-task" class="Delete-task">Delete</div>
                                    <div id="Edit-task" class="Edit-task">Edit task</div>
                                </div>
                            </div>`;
                    console.log('Task div created:', taskDiv);

                    DOM.taskDayInfo.append(taskDiv);
                });
            } else {
                DOM.taskDayInfo.innerHTML = `<h4 id="no-tasks">No tasks found.</h4>`;
            }
        });

    renderCalendarWRTCond(calenderDate.getFullYear(), calenderDate.getMonth(), calenderDate.getDate() - 1);
    const mediaQuery = window.matchMedia('(max-width:1280px)');
    handleMediaQueryChange(mediaQuery);
    mediaQuery.addEventListener('change', handleMediaQueryChange);
}

// Attach media query listener


function setupTaskButton(buttonId, filterType) {
    let button = document.getElementById(buttonId);
    button.addEventListener('click', () => {
        fetchAndDisplayTasks(filterType);
        removeDateBg();
        const mediaQuery = window.matchMedia('(max-width:1280px)');
        handleMediaQueryChange(mediaQuery);
        mediaQuery.addEventListener('change', handleMediaQueryChange);
    });
}
// Set up buttons for displaying all and completed tasks
setupTaskButton('All-Tasks', 'All Tasks');
setupTaskButton('completed', 'completed');
setupTaskButton('Tomorrow', 'tomorrow');
setupTaskButton('Today', 'Today')

// functionality for tomorrow button


function renderCalendarWRTCond(year, month, day) {
    console.log(year, month, day);
    DOM.currMonth.innerText = months[month];
    DOM.currYear.innerText = year;

    //clear the prev datecells styles
    removeDateBg();

    let dateCells = document.querySelectorAll('#table-body tr td');
    let trueIndex = 0;

    dateCells.forEach((cell) => {
        if (cell.innerText !== "") {
            if (trueIndex === day) {
                cell.style.backgroundColor = 'blue';
            } else {
                cell.style.background = 'aqua';
            }
            trueIndex++;
        }
    });
}

// a function used to add tasks to UI 

function addTaskToUI(task, container) {
    let taskDiv = document.createElement('div');
    let taskID = task._id;
    let userNoteInput = task.taskNotes.replace(/\n/g, "<br>");
    console.log(task.taskDate.toString());
    taskDiv.innerHTML = `
            <div class="task-added" data-id="${taskID}" data-date="${task.taskDate}">
                <div class="head-checkbox">
                    <h3>${task.taskName}</h3>
                    <div class="checkbox"><h4 class="task-done">Task Done.</h4></div>
                </div>
                <p>${userNoteInput}</p>
                <div id="Edit-del-btn">
                    <div id="Delete-task" class="Delete-task">Delete</div>
                    <div id="Edit-task" class="Edit-task">Edit task</div>
                </div>
            </div>`;

    container.appendChild(taskDiv);
}

// function that would delete specific tasks 

function deleteSpecificTask(taskID, taskDiv) {
    if (!confirm('This task will be removed. This action is irreversible.')) return;
    let url = `${CONFIG.backendUrl}/api/user/tasks/delete/${taskID}`;
    fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'userid':localStorage.getItem("userID")
        },
        
    })
        .then(response => {
            if (!response.ok) throw new Error(`Failed to delete task: ${response.statusText}`);
            console.log('Task deleted successfully.');
            taskDiv.remove();
        })
        .catch(error => console.error('Error deleting task:', error));
}


// a function that would edit task when user clicks edit task btn

async function editTask(taskID, taskName, taskNotes, taskDate) {

    const updatedTask = { taskName, taskNotes, taskDate };
    return fetch(`${CONFIG.backendUrl}/api/user/tasks/update/${taskID}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json',"Authorization":`Bearer ${localStorage.getItem('authToken')}` },
        body: JSON.stringify(updatedTask)
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to update task');
            return response.json();
        })
        .then(data => {
            console.log('Task updated successfully:', data);
           
            addTaskToUI(updatedTask, DOM.taskDayInfo);
        })
        .catch(error => console.error('Error updating task:', error));
}

//  function that would delete all completed tasks when the delete completed btn is clicked

async function deleteCompletedTasks() {
    if (!confirm('Are you sure to delete all tasks? This action is irreversible.')) return;

    const token = localStorage.getItem('authToken');
    
    try {
        const response = await fetch(`${CONFIG.backendUrl}/api/tasks/delete-completed`, {
            method: 'DELETE',
            headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
        });

        const data = await response.json();
        console.log("Delete completed:", data);
        alert(data.message);
        DOM.taskDayInfo.innerHTML = '';

    }
    catch (err) {
        console.error("Error deleting completed tasks", err);
    }


}
document.querySelector('#delete').addEventListener('click', () => {
    deleteCompletedTasks();
})

// function to remove bg from datecells whenb displaying settings anbd similar pages

function removeDateBg() {
    let dateCells = document.querySelectorAll('#table-body tr td');

    dateCells.forEach((date) => {
        date.style.backgroundColor = 'aqua';
    })

}

// feedback settings and help page display logic

document.addEventListener("DOMContentLoaded", function () {
    DOM.feedbackLink.onclick = () => showPage('feedb', 'Feedback');
    DOM.helpLink.onclick = () => showPage('help', 'Help');
    DOM.settingsLink.onclick = () => showPage('settings', 'Settings');
});

function showPage(pageId, title) {
    let pages = ['feedb', 'settings', 'help']; // List of page IDs
    pages.forEach(id => {
        let page = document.getElementById(id);
        if (page) {
            page.style.display = 'none'; // Ensures no stacking
        }
    });
    // Hide all pages dynamically

    clearTasks();
    removeDateBg();
    // Show the selected page
    let selectedPage = document.getElementById(pageId);
    if (!selectedPage) {
        console.error(`Element with id '${pageId}' not found`);
        return;
    }
    selectedPage.style.display = 'flex'; // Assuming flex works best
    selectedPage.style.flexDirection = 'column';

    // Update header
    DOM.navHeader.innerText = title;

    // Hide nav menu after selection
    document.getElementById('nav-menu-links').classList.add('visibility');
    document.getElementById('back-btn').classList.add('visibility');
    document.getElementById('toggle-nav-menu').classList.add('invisibility');

    // Handle media queries
    const mediaQuery = window.matchMedia('(max-width:1280px)');
    handleMediaQueryChange(mediaQuery);
    mediaQuery.addEventListener('change', handleMediaQueryChange);
}


// submit the feedback form to the db

document.addEventListener("DOMContentLoaded", () => {
    const feedbackForm = document.getElementById("feedbackForm");

    feedbackForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = {
            name: DOM.feebdName.value.trim(),
            email: DOM.feedbEmail.value.trim(),
            experience: DOM.feedbExperience.value,
            satisfaction: DOM.feedbSatisfaction.value,
            improvement: DOM.feedbImprovement.value.trim(),
            issues: DOM.feedbIssues.value.trim(),
        }

        try {
            const response = await fetch(`${CONFIG.backendUrl}/api/submit-feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })
        
            if (response.ok) {
                alert("Feedback submitted successfully!")
                feedbackForm.reset()
                document.getElementById("feedbackModal").style.display = "none";
            }
            else {
                const result = await response.json();
                alert("Error:" + result.message);
            }
        }
        catch (error) {
            alert("Something went wrong.please try again.")
            console.error("Error submitting feedback:", error)
        }
    })
})

// local time displayed if location access denied


function startLocalTimeClock() {
    // Get all elements with class 'local-time'
    const elements = document.getElementsByClassName('local-time');
    
    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0"); // Fixed: "0" instead of 0
        
        // Update ALL elements with class 'local-time'
        for (let element of elements) {
            element.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }
    
    // Update immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);
}

async function fetchWeatherByLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const apiKey = "385ebe3296094d3d87564644250503";
                const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error("Weather data not found");

                    const data = await response.json();
                    const { location, current } = data;
                    const timeOnly = location.localtime.split(" ")[1];     // Extract only the time
                    document.getElementById("weather-card").innerHTML = `
                    <div class="weather-info">
                        <h3>${location.name}, ${location.region}, ${location.country}</h3>
                        <div class="weather-status">
                            <div class="weather-status-condition">
                                <p>${current.condition.text} <img src="https:${current.condition.icon}" alt="weather-icon"></p>
                            </div>
                            <div class="weather-status-info">
                                <p>🌡️ Temperature: ${current.temp_c}°C</p>
                                <p class="">🕒 Local Time:<span class="local-time">${timeOnly}</span></p>
                            </div>
                        </div>
                    </div>
                `;
                startLocalTimeClock();
                
                } catch (error) {
                    console.error("Weather fetch error:", error);
                    document.getElementById("weather-card").innerHTML = `<p>Failed to load weather</p>`;
                    startLocalTimeClock();
                }
            },
            (error) => {
                console.warn("Location access denied, using system time.");
                document.getElementById("weather-card").innerHTML = `
                <div class="weather-denied-card">
                    <h3 class="">🕒 :<span class="local-time">Loading...</span></h3>
                    <p class="access-denied">Location access denied.</p>
                    <p class="weather-unavailable">Weather Unavailable</p>
                </div>
                `;
                startLocalTimeClock();
            }
        );
    } else {
        console.error("Geolocation not supported");
        document.getElementById("weather-card").innerHTML = `<p>Geolocation not supported</p>`;
        startLocalTimeClock();
    }
}

fetchWeatherByLocation();


// login page and overlay logic 

function closeOverlayLogin() {
    DOM.overlayLogin.style.display = 'none';
    DOM.loginPage.style.display = 'none';
    const mediaQuery = window.matchMedia('(max-width:1280px)');
    handleMediaQueryChange(mediaQuery);
    mediaQuery.addEventListener('change', handleMediaQueryChange);
}

DOM.loginNavBtn.addEventListener('click', openOverlayLogin)
function openOverlayLogin() {
    DOM.overlayLogin.style.display = 'block';
    DOM.loginPage.style.display = 'flex';
    const mediaQuery = window.matchMedia('(max-width:1280px)');
    handleMediaQueryChange(mediaQuery);
    mediaQuery.addEventListener('change', handleMediaQueryChange);
}


DOM.overlayLogin.addEventListener('click', closeOverlayLogin)

//--------------------------------------
//------login btn functionality---------
//--------------------------------------

// function to open user-login page
function showLoginPage() {
    DOM.loginUserPage.style.display = 'flex';
    DOM.loginPage.style.display = 'none';
    DOM.overlayLoginContainer.style.display = 'block';
    closeOverlayLogin();

}
// function to close user-login page
function closeLoginPage() {
    DOM.loginUserPage.style.display = 'none';
    DOM.overlayLoginContainer.style.display = 'none';
}

DOM.overlayLoginContainer.addEventListener('click', closeLoginPage);


DOM.loginBtn.addEventListener('click', showLoginPage);


//open signup page

DOM.overlaySignupContainer.addEventListener('click', () => {
    closeSignupPage();
    closeLoginPage();
})

function openSignupPage() {
    DOM.loginPage.style.display = 'none';
    DOM.signupContainer.style.display = 'flex';
    DOM.overlaySignupContainer.style.display = 'block';
    closeOverlayLogin()
}

//close signup page

function closeSignupPage() {
    DOM.signupContainer.style.display = 'none';
    DOM.overlaySignupContainer.style.display = 'none';
}

// this is the first signup btn the user clicks it takes them to the sign up details page


DOM.signupBtn.addEventListener('click', () => {
    openSignupPage();
    closeLoginPage();
})


const signupForm = document.querySelector('.signup-form');

async function signupUser() {
    
    let usernameValue = document.querySelector('.signup-username').value.trim();

    if (usernameValue == "") {
        alert('please provide username');
        return;
    }
    let userEmail = document.querySelector('.signup-email').value.trim();
    if (!userEmail || !userEmail.includes('@')) {
        alert('Please provide valid email.')
        return;
    }

    let userPassword = document.querySelector('.signup-password').value.trim();
    if (userPassword.length < 6) {
        alert('password must cobntain 6 characters');
        return;
    }
    let confirmPassword = document.querySelector('.signup-confirm-password').value.trim();
    if (userPassword !== confirmPassword) {
        alert('passwords do not match.')
        return;
    }


    // prepare data
    const userData = {
        username: usernameValue,
        email: userEmail,
        password: userPassword.trim()
    }
    console.log(userData)
    try {
        const response = await fetch(`${CONFIG.backendUrl}/api/auth/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        let data = await response.json();
        console.log(data)
        if (!response.ok) {
            alert(`Error: ${data.msg || 'Something went wrong'}`);
            return;
        }

        // save token in local storage (for authentication)
        localStorage.setItem('authToken', data.token);
        alert('User registered successfully!');

        // redirect to login 
    }
    catch (error) {
        console.error('Error registering user:', error);
        alert('Server error. please try again later.');

    }
}

signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    signupUser();
    showLoginPage();
})

//---------------------
//--login users logic--
//---------------------

async function loginUser(email, password) {
   
    const editPassword = password.trim();
    console.log(editPassword);
    const res = await fetch(`${CONFIG.backendUrl}/api/auth/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: editPassword }),
    });
    const data = await res.json();
    console.log("response: ", data);
    if (!res.ok) {
        throw new Error(data.msg || "Login failed");
    }
    if (data.token && data.userID) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userID", data.userID);
        //   console.log(userID);
        alert("Login successful!");
        window.location.href = "/";
    } else {
        alert(data.msg);
    }


}

const loginUserForm = document.getElementById('loginForm');
loginUserForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.querySelector('#email').value;

    const password = document.querySelector('#password').value;
    if (!email || !password) {
        alert('Email or password field is missing.')
        return;
    }
    console.log(email, password);
    loginUser(email, password);
});

// logout function 

function logoutUser() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userID');

    alert('You have been logged out.');

    updateAuthBtn(); // toggle login/logout btns 
    clearTasks();
    clearUI();
}

DOM.navLogout.addEventListener('click', (e) => {
    e.preventDefault();
    logoutUser();
})