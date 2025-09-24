// function to render a calender when site starts

// const { response } = require("express");

// const { application } = require("express");

// STORE LINKS

// console.log(CONFIG.backendUrl);



// STORE ELEMENTS IN A VARIABLE FOR MULTIPLE USE
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const taskPageContainer = document.getElementById('taskPageContainer');
const editTaskContainer = document.getElementById('edit-task-container');
const editTaskPageContainer = document.getElementById('editTaskPageContainer');
const overlayCreate = document.getElementById('overlay-create');
const overlayEdit = document.getElementById('overlay-edit');
const taskNameInput = document.getElementById('task-name');
const taskNotesInput = document.getElementById('task-notes');
const taskDateInput = document.getElementById('task-date');
const taskContainer = document.querySelector('.task-container');
const addTaskBtn = document.querySelector('.add-task-icon');

const navLinks = document.querySelector('ul');
const listButton = document.querySelector('#toggle-nav-menu');
const backbtn = document.querySelector('#back-btn')

// Toggle navigation menu
function toggleNav(open) {
    navLinks.classList.toggle("nav-menu-links", !open);
    listButton.classList.toggle("nav-menu-links", open);
    backbtn.classList.toggle("nav-menu-links", !open);
}

listButton.addEventListener("click", () => toggleNav(true));
backbtn.addEventListener("click", () => toggleNav(false));

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


//------------------------exp----------------------------




//   function to load tyhe current day tasks right in tyyhe beginning 


// let numOfDays = new Date(2024,3,32).getDate();
// console.log(numOfDays)


// ------------------------------------------------add-task-icon btn use and add-task page dynamism.-----------------------------------------



function openTaskPage() {
    // Use CSS classes for visibility 
    taskPageContainer.classList.remove('hidden');
    overlayCreate.classList.add('block');
    taskContainer.classList.remove('visibility');
    addTaskBtn.classList.add('visibility');

    // Reset input fields
    taskNameInput.value = "";
    taskNotesInput.value = "";
    taskDateInput.value = "";
}

function closeTaskPage() {
    taskPageContainer.classList.add('hidden');
    overlayCreate.classList.remove('block');
    taskContainer.classList.add('visibility');
    addTaskBtn.classList.remove('visibility');
}

function closeEditPage() {
    editTaskPageContainer.style.display = 'none';
    editTaskContainer.classList.add('visibility');
    overlayEdit.style.display = 'none';
    addTaskBtn.classList.remove('visibility');
    // overlayEdit.style.pointerEvents = 'none'
}

// Add event listener
addTaskBtn.addEventListener('click', openTaskPage);


// overlay mouse pointer behaviour when create task page is open


let overlaycreate = document.getElementById('overlay-create');
overlaycreate.addEventListener('click', function () {
    closeTaskPage();

});

overlaycreate.addEventListener('mouseenter', function () {
    overlaycreate.style.cursor = 'pointer';
})
// overlay edit click functionality

overlayEdit.addEventListener('mouseenter', function () {
    overlayEdit.style.cursor = 'pointer';
})
overlayEdit.addEventListener('click', function () {
    closeEditPage()
})

// task page elements and behaviour to load them in the day-info page updating the day-info heading to the date supplied.

// elements required for rendering the task page


const taskDayInfo = document.getElementById('day-info');
const navHeader = document.querySelector('h2');
const feedbackDiv = document.querySelector('#feedb');
const taskSubmitBtn = document.getElementById('create');

async function renderTaskPage() {
    const taskName = taskNameInput.value.trim();
    const taskNotes = taskNotesInput.value.trim() || "No Task Notes.";
    const taskDate = taskDateInput.value.trim();

    // Hide feedback message if it exists
    // if (feedbackDiv) feedbackDiv.style.display = 'none';
    // Clear previous task info
    // hideExtraPages();
    let helpPage = document.getElementById('help');
    if (helpPage) helpPage.style.display = 'none';

    let feedbackDiv = document.querySelector('#feedb');
    if (feedbackDiv) feedbackDiv.style.display = 'none';

    let settingsPage = document.getElementById('settings');
    if (settingsPage) settingsPage.style.display = 'none';
    clearTasks()
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
    else {
        // for guest user set things accordingly
        let guestID = localStorage.getItem("guestID");
        if (!guestID) {
            guestID = `guest_${Date.now()}`;
            localStorage.setItem("guestID", guestID);
        }
        apiEndpoint = `${CONFIG.backendUrl}/api/guest/tasks/add`;
        taskData.guestID = guestID;
        headers["Guest-ID"] = guestID;

    }


    // console.log(userID,guestID)
    // Prepare task object

    console.log(taskData)
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
        navHeader.innerText = taskDate;
        taskDayInfo.appendChild(taskDiv);

        // Close task page
        closeTaskPage();
    } catch (error) {
        console.error("Error creating task:", error.message);
    }





}

// Attach event listener to submit button (only once)


// Move event listeners outside to avoid adding them repeatedly
// document.getElementById('allTaskBtn')?.addEventListener('click', displayAllTasks);
// document.getElementById('completedTaskBtn')?.addEventListener('click', showCompletedTasks);
// document.getElementById('todayBtn')?.addEventListener('click', todayTasks);
// document.getElementById('tomorrowbtn')?.addEventListener('click', displayTomorrowTasks);
// document.getElementById('helpbtn')?.addEventListener('click', displayHelpPage);



// function to handle the visibility of the navbar buttons 
// w.r.t  when it is clicked and at what screen width   

function handleMediaQueryChange(e) {
    let navMenuLinks = document.getElementById('nav-menu-links');
    let backbtn = document.getElementById('back-btn');
    let toggleNavMenu = document.getElementById('toggle-nav-menu');
    let taskDayInfo = document.getElementById('day-info');
    let feedbackPage = document.getElementById('feedb');
    let settingsPage = document.getElementById('settings');
    let helpPage = document.getElementById('help');
    let navHeader = document.querySelector('#nav-header h2');

    // Ensure taskDayInfo is visible by default
    taskDayInfo.style.display = 'block';

    if (e.matches) {
        // Hide nav menu links and show back button when screen width is ≤ 1280px
        navMenuLinks.classList.add('visibility');
        backbtn.classList.add('visibility');
        toggleNavMenu.classList.add('invisibility');

        // Prevent multiple event listeners from being added
        toggleNavMenu.onclick = () => {
            navMenuLinks.classList.remove('visibility');
            backbtn.classList.remove('visibility');
            toggleNavMenu.classList.remove('invisibility');

            // Hide the current section when opening the nav menu
            if (feedbackPage) feedbackPage.style.display = 'none';
            if (settingsPage) settingsPage.style.display = 'none';
            if (helpPage) helpPage.style.display = 'none';
            taskDayInfo.style.display = 'none';
        };

        backbtn.onclick = () => {
            // Ensure the last active section remains visible
            if (feedbackPage && feedbackPage.style.display === 'block') {
                navHeader.innerText = 'Feedback';
            } else if (settingsPage && settingsPage.style.display === 'block') {
                navHeader.innerText = 'Settings';
            } else if (helpPage && helpPage.style.display === 'flex') {
                navHeader.innerText = 'Help';
            }

            // Hide the menu and show the correct section
            navMenuLinks.classList.add('visibility');
            backbtn.classList.add('visibility');
            toggleNavMenu.classList.add('invisibility');
            taskDayInfo.style.display = 'block';
        };
    } else {
        // Desktop view: Show nav menu links
        navMenuLinks.style.display = 'flex';
    }
}


// calender behaviour when adding a task on a date


function renderCalendar(year, month, date) {
    // the year and monthh on whichh the task is added must be displayed in calender
    // ELEMENTS REQUIRED FOR CALENDER MODIFICATIONS

    let taskDate = document.getElementById('task-date').value;
    let taskName = document.getElementById('task-name').value;

    // Guard clause: Ensure required inputs are provided
    if (!taskDate || !taskName) {
        alert('please provide a task name and the date when the task should be completed.')
        openTaskPage();
        return;
    }

    const calendar = document.getElementById('calendar');
    const renderMonth = document.getElementById('month');
    const renderYear = document.getElementById('year');

    // Update displayed month & year
    renderMonth.innerText = months[month - 1];
    renderYear.innerText = year;

    // Get first day of the month and total days in the month
    const startOfMonth = new Date(year, month - 1, 1).getDay();
    const numOfDays = new Date(year, month, 0).getDate();

    // Clear previous calendar rows
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
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
        tableBody.appendChild(tr);
    }

}


// Event Listener for Task Submission
taskSubmitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const taskDateInput = document.getElementById('task-date').value;

    if (!taskDateInput) return; // Prevent error if date is empty


    const [year, month, day] = taskDateInput.split('-').map(Number);
    renderCalendar(year, month, day);

    renderTaskPage();
});

// console.log(renderMonth)
// console.log(renderYear)
// console.log(taskDateCalendar);


// logic to apply the edit task function when the button is clicked








// render a calender with today's date when  you first start the page and ensure tht there is a csslender loaded in all scenarios the calender should indicate thhe scenario 



function renderRegularCalendar() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Correct month index
    const day = currentDate.getDate();

    const renderMonth = document.getElementById('month');
    const renderYear = document.getElementById('year');

    renderMonth.innerText = months[month - 1]; // Display month name
    renderYear.innerText = year;

    // Get total days in the current month
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthStartDay = new Date(year, month - 1, 1).getDay(); // Start day (0=Sunday)

    // Clear previous calendar
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

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
        tableBody.appendChild(tr);
    }

}

renderRegularCalendar();





// TASK DONE CLICK BEHAVIOUR






// ---------------------------------------------------------------CALENDER BUTTONS FUNCTIONAlITY----------------------------------------------------------

//-------------------------------------------------------------left button functionality
let lMonthArrow = document.getElementById('l-arrow-month');

function monthLeftbtn() {
    //get the arrow btns and the elements that must be changed


    let yearChange = document.getElementById('year');
    let yearNumber = parseInt(yearChange.innerText);
    //get the month div

    let currMonth = document.getElementById('month');

    // month array to change according to current month position

    // change the year if we click btn on january and set the month to dec
    if (currMonth.textContent == months[0]) {
        yearChange.textContent = yearNumber - 1;
        currMonth.textContent = months[11];
        daysLoader(parseInt(yearChange.textContent), months.indexOf(currMonth.textContent))
    }
    else {
        for (let i = 0; i < months.length; i++) {
            if (currMonth.textContent === months[i]) {
                currMonth.textContent = months[i - 1];
                daysLoader(parseInt(yearChange.textContent), months.indexOf(currMonth.textContent));
            }
        }
    }


}


lMonthArrow.addEventListener('click', () => {
    monthLeftbtn();
})



// function that will fill days in the table cells according to the current month and date that is set

function daysLoader(year, month) {
    let numOfDays = 32 - new Date(year, month, 32).getDate();
    let startOfMonth = new Date(year, month, 1).getDay();

    let tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Clear the previous table

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
                cell.addEventListener('click', () => handleDateClick(year, month, currentDay)); // Fix event loss
                currentDay++;

            }

            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    }
}

// let startOfMonth = new Date(2024,m-1,1).getDay();
// console.log(startOfMonth);


//-----------------------------------------------------------------------------right month button behaviour

let rMonthArrow = document.getElementById('r-arrow-month');

function rightMonthbtn() {
    let currMonth = document.getElementById('month');
    let currYear = document.getElementById('year');




    if (currMonth.textContent === months[11]) {
        let yearChange = parseInt(currYear.textContent) + 1;
        currYear.textContent = yearChange;
        currMonth.textContent = months[0];
        daysLoader(yearChange, months.indexOf(currMonth.textContent))
    }
    else {
        let presentYear = parseInt(currYear.textContent);
        let changeMonth = months.indexOf(currMonth.textContent) + 1;
        currMonth.textContent = months[changeMonth];
        daysLoader(presentYear, months.indexOf(currMonth.textContent));
    }
}


rMonthArrow.addEventListener('click', () => {
    rightMonthbtn();
})



//------------------------------------------------buttons for year---------------------------------------------------------------------

//------------------------------------------------left year button

let lYearArrow = document.getElementById('l-arrow-year')

function leftYearBtn() {
    let year = document.getElementById('year');
    let changeYear = parseInt(year.innerText);
    let month = document.getElementById('month');

    year.textContent = changeYear - 1;

    daysLoader(changeYear - 1, months.indexOf(month.textContent));
}

lYearArrow.addEventListener("click", () => {
    leftYearBtn()
})


//------------------------------------------------------right arrow button


let rYearArrow = document.getElementById('r-arrow-year');

function rightYearBtn() {
    let year = document.getElementById('year');
    let changeYear = parseInt(year.innerText);
    let month = document.getElementById('month');

    year.textContent = changeYear + 1;

    daysLoader(parseInt(year.textContent), months.indexOf(month.textContent));
}

rYearArrow.addEventListener('click', () => {
    rightYearBtn();
})


// ----------------open the edit page with all the user info placed in the task editor-----------------

function openEditPage(taskName, taskNotes, taskDate, taskID) {


    document.getElementById('edit-task-name').value = taskName;
    document.getElementById('edit-task-notes').value = taskNotes;
    document.getElementById('edit-task-date').value = new Date(taskDate).toISOString().slice(0, 10);
    document.getElementById('overlay-edit').style.display = 'block';
    addTaskBtn.classList.add('visibility');
    document.getElementById('edit-task-container').classList.remove('visibility');
    let taskEditor = document.getElementById('editTaskPageContainer');
    taskEditor.style.display = 'block';
    // Store the current task ID as a data attribute for future reference
    document.getElementById('edit').setAttribute('data-id', taskID);

}

document.getElementById('day-info').addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('Edit-task')) {
        const edittaskDiv = event.target.closest('.task-added');
        const taskID = edittaskDiv.getAttribute('data-id');
        const edittaskDate = edittaskDiv.getAttribute('data-date');              // Get from data-date attribute
        const edittaskName = edittaskDiv.querySelector('h3').innerText;          // Select <h3> for task name
        const edittaskNotes = edittaskDiv.querySelector('p').innerHTML.replace(/<br>/g, "\n");
        edittaskDiv.remove();
        console.log(edittaskNotes)
        openEditPage(edittaskName, edittaskNotes, edittaskDate, taskID);
        const editBtn = document.getElementById('edit');
        editBtn.replaceWith(editBtn.cloneNode(true)); // Remove old listeners
        document.getElementById('edit').addEventListener('click', () => {
            let taskDate = document.querySelector('.edit-task-date').value;
            let userNoteInput = document.querySelector('.edit-task-notes').value;

            const taskObj = {
                taskID,
                taskName: document.querySelector('.edit-task-name').value,
                taskNotes: userNoteInput,
                taskDate: new Date(taskDate).toISOString().slice(0, 10)
            };

            console.log(taskObj);

            editTask(taskObj.taskID, taskObj.taskName, taskObj.taskNotes, taskObj.taskDate).then(() => {
                let taskDayInfo = document.getElementById('day-info');
                // addTaskToUI(taskObj, taskDayInfo);
                closeEditPage();
            });
        });
    }
});

// Remove the specific task when a user clicks delete specific task

document.getElementById('day-info').addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('Delete-task')) {

        const deleteTaskDiv = event.target.closest('.task-added')
        let taskID = deleteTaskDiv.getAttribute('data-Id')

        deleteSpecificTask(taskID, deleteTaskDiv)
    }
})





//---------------------------- REMOVE THE ADDED TASK DIV WHEN USER CLICKS CHECKBOX------------------------------------------


document.getElementById('day-info').addEventListener('click', function (event) {
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
    let taskDayInfo = document.getElementById('day-info');
    let taskDiv = document.createElement('div');
    taskDiv.innerHTML = `<h4 id="no-tasks">${message}</h4>`;
    taskDayInfo.appendChild(taskDiv);
}

function clearTasks() {
    let taskDivs = document.querySelectorAll('.task-added');
    taskDivs.forEach(task => task.remove());

    let noTasksDiv = document.querySelector('#day-info #no-tasks');
    if (noTasksDiv) noTasksDiv.remove();
}

// Function to hide unnecessary pages (Help, Feedback, Settings)
// function hideExtraPages() {
//     document.querySelector('#help')?.style.display = 'none';
//     document.querySelector('#feedb')?.style.display = 'none';
//     document.querySelector('#settings')?.style.display = 'none';
// }



// Function to display tasks for a selected date
function getDataFromBackend(year, month, selectedDay) {
    // Remove help and settings pages
    // hideExtraPages();
    clearTasks();
    // removeDateBg();
    if (document.querySelector('#feedb')) document.querySelector('#feedb').style.display = 'none';
    if (document.querySelector('#settings')) document.querySelector('#settings').style.display = 'none';
    if (document.querySelector('#help')) document.querySelector('#help').style.display = 'none';


    let reqTaskDate = new Date(Date.UTC(year, month - 1, selectedDay)).toISOString().split('T')[0];

    let taskDayInfo = document.getElementById('day-info');
    console.log(reqTaskDate)
    console.log(selectedDay)

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        console.error("No auth token found. Guest not logged in.");
        displayNoTasksMessage("Please log in as a guest to view tasks.");
        return;
    }
    const userId = localStorage.getItem('userID');
    console.log(userId)
    console.log(authToken);

    try {
        const payload = JSON.parse(atob(authToken.split('.')[1])); // Decode JWT payload
        // userId = payload.userID;

        console.log(payload)
        // console.log(guestID);
    } catch (error) {
        console.error("Failed to decode token:", error.message);
        displayNoTasksMessage("Invalid session. Please log in again.");
        return;
    }

    // Clear previous tasks
    // document.querySelectorAll('#day-info .task-added').forEach(task => task.remove());
    // let noTasksDiv = document.querySelector('#day-info #no-tasks');
    // if (noTasksDiv) noTasksDiv.remove();
    console.log("Token being sent:", authToken);
    const url = `${CONFIG.backendUrl}/api/user/tasks/fetch?year=${year}&month=${month}&day=${selectedDay}&userID=${userId}`;

    fetch(url, {
        method: 'GET',

        headers: { 'Authorization': `Bearer ${authToken}`, "userid": localStorage.getItem('userID') }       // Include token in headers
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
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

                    taskDayInfo.appendChild(taskDiv);

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








// Function to handle date selection from the calendar

function handleDateClick(year, month, currentDay) {
    let dateCells = document.querySelectorAll('#table-body td');
    // remove prev styling

    removeDateBg();

    dateCells.forEach((date) => {
        date.addEventListener('click', () => {
            // capture the month and year in a variable
            let currYear = Number(document.querySelector('#year').innerText);
            let currMonth = document.querySelector('#month').innerText.trim();
            let selectedDate = date.innerText.trim();

            let currMonthInNumber


            for (let i = 0; i <= months.length; i++) {
                if (currMonth == months[i]) {
                    currMonthInNumber = i + 1;
                }
            }
            console.log(currYear, currMonthInNumber, currYear)
            if (!selectedDate) { return; }

            getDataFromBackend(currYear, currMonthInNumber, selectedDate);

        })
    })
}


function formatDate(dateString) {
    let [year, month, day] = dateString.split('-'); // Split into parts
    return `${year}-${parseInt(month)}-${parseInt(day)}`; // Convert to number to remove leading zeros
}

let dateCells = document.querySelectorAll('#table-body td')
dateCells.forEach((day) => {

    let dateCells = document.querySelectorAll('#table-body td')
    day.style.backgroundColor = '';
    day.addEventListener('click', () => {
        // Reset all cells
        removeDateBg()

        // Highlight selected day
        day.style.backgroundColor = 'blue';

        let month = document.getElementById('month').innerText;
        let year = document.getElementById('year').innerText;
        let selectedDay = day.innerText;

        if (!selectedDay) return;

        // Convert month name to number efficiently
        month = months.indexOf(month) + 1;

        let navHeader = document.querySelector('h2');
        let selectedDate = `${year}-${month}-${selectedDay}`;
        // selectedDate = selectedDate.toISOString().split('T')[0];
        // Fix "TODAY" comparison
        let today = new Date().toISOString().split('T')[0];
        let tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow = tomorrow.toISOString().split('T')[0];
        // set the date in correct format for proper comparison
        today = formatDate(today);
        tomorrow = formatDate(tomorrow);

        console.log(tomorrow) // "YYYY-MM-DD"
        console.log(selectedDate)
        if (selectedDate === today) {
            navHeader.innerText = 'Today';
        } else if (selectedDate === tomorrow) {
            navHeader.innerText = 'Tommorow';
        }
        else {
            navHeader.innerText = selectedDate;
        }

        // Fetch tasks for the selected date
        console.log(year, month, selectedDay)

        getDataFromBackend(year, month, selectedDay);



    });
});


function clearUI() {
    let elementsToHide = ['help', 'feedb', 'settings'];
    elementsToHide.forEach(id => {
        let element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });

    let taskDayInfo = document.getElementById('day-info');
    document.querySelectorAll('.task-added').forEach(task => task.remove());

    let noTasksDiv = document.querySelector('#day-info #no-tasks');
    if (noTasksDiv) noTasksDiv.remove();

    let dateCells = document.querySelectorAll('#table-body tr td');
    dateCells.forEach(cell => cell.style.backgroundColor = 'aqua');
}

function renderTasks(tasks, filterType) {
    let taskDayInfo = document.getElementById('day-info');
    let navHeader = document.querySelector('h2');
    let filteredTasks = tasks;

    if (filterType === 'completed') {
        navHeader.innerText = "Completed";
        filteredTasks = tasks.filter(task => task.completed);
    } else {
        navHeader.innerText = "All Tasks";
    }

    if (filteredTasks.length === 0) {
        let taskDiv = document.createElement('div');
        taskDiv.innerHTML = `<h4 id="no-tasks">${filterType === 'completed' ? "No tasks completed" : "No tasks created."}</h4>`;
        taskDayInfo.appendChild(taskDiv);
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
        taskDayInfo.appendChild(taskDiv);
    });
}

// display all tasks wrt the specific user

const fetchAllUserTasks = async () => {
    const url = `${CONFIG.backendUrl}/api/user/tasks/alltasks`;
    const authToken = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userID");

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'userid': userId
            }

        })
        const data = await response.json();

        if (data.length === 0) {
            displayNoTasksMessage("No tasks created.");
            return;
        }

        renderTasks(data, 'all');
    }
    catch (error) {
        console.error("Error fetching tasks:", error);
        displayNoTasksMessage("failed to fetch tasks. Please try again.");
    }
};

// call the fetchAllUserTasks function
// const allTaskBtn = document.querySelector('#All-Tasks');
// allTaskBtn.addEventListener('click', fetchAllUserTasks);


function fetchAndDisplayTasks(filterType) {
    clearUI();

    let taskDayInfo = document.getElementById('day-info');
    let navHeader = document.querySelector('h2');
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
                navHeader.innerText = 'Today';
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
                
                navHeader.innerText = 'Tomorrow';
                filteredTasks = data.filter(task => task.taskDate.split('T')[0] == targetDate && task.completed == false);
                console.log(targetDate)
            } else if (filterType === "completed") {
                navHeader.innerText = 'Completed';
                filteredTasks = data.filter(task => task.completed);
                console.log(filteredTasks)
            }
            else if (filterType === "All Tasks") {
                navHeader.innerText = 'All Tasks';
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

                    taskDayInfo.append(taskDiv);
                });
            } else {
                taskDayInfo.innerHTML = `<h4 id="no-tasks">No tasks found.</h4>`;
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


// document.getElementById('Tomorrow').addEventListener('click', () => fetchAndDisplayTasks("tomorrow"));
// document.getElementById('All-Tasks').addEventListener('click', () => fetchAndDisplayTasks("All Tasks"));


function renderCalendarWRTCond(year, month, day) {
    console.log(year, month, day);
    document.getElementById('month').innerText = months[month];
    document.getElementById('year').innerText = year;

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

// Modify the display part of tasks  and display the tasks for present day



// a function used to add tasks to UI 

function addTaskToUI(task, container) {
    let taskDiv = document.createElement('div');
    let taskID = task._id;
    let userNoteInput = task.taskNotes.replace(/\n/g, "<br>");

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

    fetch(`${CONFIG.backendurl}/api/guest/tasks/delete/${taskID}`, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Guest-ID': localStorage.getItem("guestID")
        },
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    })
        .then(response => {
            if (!response.ok) throw new Error(`Failed to delete task: ${response.statusText}`);
            console.log('Task deleted successfully.');
            taskDiv.remove();
        })
        .catch(error => console.error('Error deleting task:', error));
}

// let deleteTaskBtn = document.querySelector()


// a function that would edit task when user clicks edit task btn

async function editTask(taskID, taskName, taskNotes, taskDate) {

    const updatedTask = { taskName, taskNotes, _id: taskID, taskDate };

    return fetch(`${CONFIG.backendUrl}/tasks/update/${taskID}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(updatedTask)
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to update task');
            return response.json();
        })
        .then(data => {
            console.log('Task updated successfully:', data);
            let taskDayInfo = document.getElementById('day-info');
            addTaskToUI(updatedTask, taskDayInfo);
        })
        .catch(error => console.error('Error updating task:', error));
}


//  function that would delete all completed tasks when the delete completed btn is clicked

async function deleteCompletedTasks() {
    if (!confirm('Are you sure to delete all tasks? This action is irreversible.')) return;

    // let headers = { "Content-Type": "application/json" }
    const token = localStorage.getItem('authToken');
    // const userID = localStorage.getItem('userID');
    

    // if (userID) {
    //     headers["Authorization"] = `Bearer ${token}`;
    //     // headers["userID"] = userID;  // Add userID in the headers
    //     // console.log(userID)
    // }
   
    // else {
    //     alert("No active user found.");
    //     return;
    // }
    // console.log(headers)

    try {
        const response = await fetch(`${CONFIG.backendUrl}/api/tasks/delete-completed`, {
            method: 'DELETE',
            headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`}
        });

        const data = await response.json();
        console.log("Delete completed:", data);
        alert(data.message);
        document.getElementById('day-info').innerHTML = '';

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
    document.getElementById('feedback-link').onclick = () => showPage('feedb', 'Feedback');
    document.getElementById('help-link').onclick = () => showPage('help', 'Help');
    document.getElementById('settings-link').onclick = () => showPage('settings', 'Settings');
});

function showPage(pageId, title) {
    let navHeader = document.querySelector('#nav-header h2');
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
    navHeader.innerText = title;

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
            name: document.getElementById("feedb-name").value.trim(),
            email: document.getElementById("feedb-email").value.trim(),
            experience: document.getElementById("feedb-experience").value,
            satisfaction: document.getElementById("feedb-satisfaction").value,
            improvement: document.getElementById("feedb-improvement").value.trim(),
            issues: document.getElementById("feedb-issues").value.trim(),
        }

        try {
            const response = await fetch(`${CONFIG.backendUrl}/submit-feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })


            // console.log(result);

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

function showLocalTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}



function showLocalTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}

async function fetchWeatherByLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const apiKey = "385ebe3296094d3d87564644250503";
                const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

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
                                <p>🕒 Local Time: ${timeOnly}</p>
                            </div>
                        </div>
                    </div>
                `;
                } catch (error) {
                    console.error("Weather fetch error:", error);
                    document.getElementById("weather-card").innerHTML = `<p>Failed to load weather</p>`;
                }
            },
            (error) => {
                console.warn("Location access denied, using system time.");
                document.getElementById("weather-card").innerHTML = `
                <div class="weather-denied-card">
                    <h3 class="local-time">🕒 : ${showLocalTime()}</h3>
                    <p class="access-denied">Location access denied.</p>
                    <p class="weather-unavailable">Weather Unavailable</p>
                </div>
                `;
            }
        );
    } else {
        console.error("Geolocation not supported");
        document.getElementById("weather-card").innerHTML = `<p>Geolocation not supported</p>`;
    }
}

fetchWeatherByLocation();





// login page and overlay logic 

const loginNavBtn = document.querySelector('#login-signup-link');
const overlayLogin = document.querySelector('.overlay-login');
const loginPage = document.querySelector('.login-page');

function closeOverlayLogin() {
    overlayLogin.style.display = 'none';
    loginPage.style.display = 'none';
    const mediaQuery = window.matchMedia('(max-width:1280px)');
    handleMediaQueryChange(mediaQuery);
    mediaQuery.addEventListener('change', handleMediaQueryChange);
}

loginNavBtn.addEventListener('click', openOverlayLogin)
function openOverlayLogin() {
    overlayLogin.style.display = 'block';
    loginPage.style.display = 'flex';
    const mediaQuery = window.matchMedia('(max-width:1280px)');
    handleMediaQueryChange(mediaQuery);
    mediaQuery.addEventListener('change', handleMediaQueryChange);
}

// const overlaylogin = document.getElementsByClassName('overlay-login');

overlayLogin.addEventListener('click', closeOverlayLogin)


// login btn functionality

const loginBtn = document.querySelector('#login-button');
const overlayLoginContainer = document.querySelector('.overlay-login-container');
// console.log(loginBtn);

// function to open user-login page
function showLoginPage() {
    const loginUserPage = document.querySelector('.login-container');
    loginUserPage.style.display = 'flex';

    loginPage.style.display = 'none';
    overlayLoginContainer.style.display = 'block';
    closeOverlayLogin();

}
// function to close user-login page
function closeLoginPage() {
    const loginUserPage = document.querySelector('.login-container');
    loginUserPage.style.display = 'none';
    overlayLoginContainer.style.display = 'none';
}

// const overlayLoginContainer = document.querySelector('.overlay-login-container');

overlayLoginContainer.addEventListener('click', closeLoginPage);




loginBtn.addEventListener('click', showLoginPage);


//open signup page
const signupContainer = document.querySelector('.signup-container');
const overlaySignupContainer = document.querySelector('.overlay-signup-container');

overlaySignupContainer.addEventListener('click', () => {
    closeSignupPage();
    closeLoginPage();
})

function openSignupPage() {
    loginPage.style.display = 'none';
    signupContainer.style.display = 'flex';
    overlaySignupContainer.style.display = 'block';
    overlayLogin.style.display = 'none';

}




//close signup page

function closeSignupPage() {
    signupContainer.style.display = 'none';
    overlaySignupContainer.style.display = 'none';
}

// this is the first signup btn the user clicks it takes them to the sign up details page
const signupBtn = document.querySelector('#signup-button');

signupBtn.addEventListener('click', () => {
    openSignupPage();
    closeLoginPage();
})




// guest info page and it's overlay behaviour
const guestInfoPage = document.querySelector('.guest-details');
const guestPageOverlay = document.querySelector('.overlay-guest-details');

function openGuestInfoPage() {
    guestInfoPage.style.display = 'flex';
    guestPageOverlay.style.display = 'block';
    loginPage.style.display = 'none';
    overlayLogin.style.display = 'none';
}

function closeGuestInfoPage() {
    guestInfoPage.style.display = 'none';
    guestPageOverlay.style.display = 'none';
}

guestPageOverlay.addEventListener('click', () => {
    closeGuestInfoPage();
})


document.getElementById('guest-button').addEventListener('click', async () => {

    openGuestInfoPage()

})
// submitting guest username and providing guestID  

const submitUsernameBtn = document.getElementById('usernameForm');

submitUsernameBtn.addEventListener('submit', async (event) => {

    event.preventDefault();

    // prepare username to send in db
    let usernameValue = document.getElementById('username').value.trim();
    if (usernameValue == "") {
        alert("please enter a username");
        return;
    }

    // Check if username already exists


    // set guestId to send to db
    let guestID = `guest_${Date.now()}`;
    localStorage.removeItem("userID");
    localStorage.setItem("guestID", guestID);

    //  authToken
    const authToken = localStorage.getItem("authToken");

    // console.log('username submitted:', username);

    try {
        const response = await fetch(`${CONFIG.backendUrl
            
        }/api/auth/guest/guest`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json", "Guest-ID": localStorage.getItem("guestID")
            },
            body: JSON.stringify({ username: usernameValue })
        })

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Server Error: ${response.status} - ${text}`)
        }

        const data = await response.json();

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("guestID", data.guestID);
        console.log(authToken, guestID)
        alert(`Welcome ${data.username}! Your guestID is ${data.guestID}`);

        closeGuestInfoPage();
    }
    catch (error) {
        console.error("Guest Login Failed: ", error);
        alert("Guest login failed. please try again")
    }

})

// signup button functyionality

const signupForm = document.querySelector('.signup-form');

async function signupUser() {
    localStorage.removeItem("guestID");
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


// login users logic
// Login function

async function loginUser(email, password) {
    localStorage.removeItem("guestID")
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
        window.location.href = "http://127.0.0.1:5500/public/index.html";
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