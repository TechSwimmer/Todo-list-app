// function to render a calender when site starts

// const { response } = require("express");

// const { application } = require("express");

// STORE LINKS

console.log(CONFIG.backendUrl);



// STORE ELEMENTS IN A VARIABLE FOR MULTIPLE USE
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const taskPageContainer = document.getElementById('taskPageContainer');
const overlayCreate = document.getElementById('overlay-create');
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
    if (feedbackDiv) feedbackDiv.style.display = 'none';

    // Clear previous task info
    taskDayInfo.innerHTML = "";

    // Ensure both task name and task date are provided
    if (!taskName || !taskDate) return;

    // Prepare task object
    const newTask = {
        taskName,
        taskNotes,
        taskDate: new Date(taskDate).toISOString(), // Ensure proper format
        completed: false
    };

    try {
        // Send the task to the server
        const response = await fetch(`${CONFIG.backendUrl}/tasks/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });

        const taskData = await response.json();

        if (!response.ok) throw new Error(taskData.message);

        // Create task UI
        const taskDiv = document.createElement('div');
        taskDiv.setAttribute('data-id', taskData._id);
        taskDiv.innerHTML = `
            <div class="task-added" data-id="${taskData._id}" data-date="${taskDate}">
                <div class="head-checkbox">
                    <h3>${taskName}</h3>
                    <div class="checkbox">
                        <h4 class="task-done">Task Done.</h4>
                    </div>
                </div>
                <p>${taskNotes.replace(/\n/g, "<br>")}</p>
                <div id="Edit-del-btn">
                    <div id="Delete-task">Delete</div>
                    <div id="Edit-task">Edit task</div>
                </div>
            </div>
        `;

        console.log(taskDate, taskName, taskNotes, taskData._id);
        navHeader.innerText = taskDate;
        taskDayInfo.appendChild(taskDiv);

        // Close task page
        closeTaskPage();
    } catch (error) {
        console.error("Error creating task:", error.message);
    }
}

// Attach event listener to submit button (only once)
taskSubmitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    renderTaskPage();
});

// Move event listeners outside to avoid adding them repeatedly
document.getElementById('allTaskBtn')?.addEventListener('click', displayAllTasks);
document.getElementById('completedTaskBtn')?.addEventListener('click', showCompletedTasks);
document.getElementById('todayBtn')?.addEventListener('click', todayTasks);
document.getElementById('tomorrowbtn')?.addEventListener('click', displayTomorrowTasks);
document.getElementById('helpbtn')?.addEventListener('click', displayHelpPage);



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
document.getElementById('create').addEventListener('click', () => {
    const taskDateInput = document.getElementById('task-date').value;

    if (!taskDateInput) return; // Prevent error if date is empty

    const [year, month, day] = taskDateInput.split('-').map(Number);
    renderCalendar(year, month, day);
});

// console.log(renderMonth)
// console.log(renderYear)
// console.log(taskDateCalendar);






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
                    document.querySelector('.nav-header h2').innerText = "Today";
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



//----------------------------CODE TO REMOVE THE ADDED TASK DIV WHEN USER CLICKS CHECKBOX------------------------------------------

document.getElementById('day-info').addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('task-done')) {
        const taskDiv = event.target.closest('.task-added');

        if (!taskDiv) return; // Ensure taskDiv exists

        const taskID = taskDiv.getAttribute('data-id');

        fetch(`${CONFIG.backendUrl}/tasks/completed/${taskID}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: true })
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
                console.error("Error updating tasks:", error);
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
function hideExtraPages() {
    document.getElementById('help')?.classList.add('visibility');
    document.getElementById('feedb')?.classList.add('visibility');
    document.getElementById('settings')?.classList.add('visibility');
}



// Function to display tasks for a selected date
function getDataFromBackend(year, month, selectedDay) {
    // Remove help and settings pages
    // hideExtraPages();
    clearTasks();

    document.querySelector('#feedb').style.display = 'none';
    document.querySelector('#settings').style.display = 'none';
    document.querySelector('#help').style.display = 'none';


    let reqTaskDate = new Date(Date.UTC(year, month - 1, selectedDay)).toISOString().split('T')[0];

    let taskDayInfo = document.getElementById('day-info');

    // Clear previous tasks
    // document.querySelectorAll('#day-info .task-added').forEach(task => task.remove());
    // let noTasksDiv = document.querySelector('#day-info #no-tasks');
    // if (noTasksDiv) noTasksDiv.remove();

    const url = `${CONFIG.backendUrl}/tasks?year=${year}&month=${month}&day=${selectedDay}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let updatedTask = data.filter(task => task.taskDate.split('T')[0] === reqTaskDate);

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
                                    <div id="Delete-task">Delete</div>
                                    <div id="Edit-task">Edit task</div>
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

function handleDateClick(year, month, currentDay){
    let dateCells = document.querySelectorAll('#table-body td'); 
    

    dateCells.forEach((date) => {
        date.addEventListener('click',() => {
            // capture the month and year in a variable
            let currYear = Number(document.querySelector('#year').innerText);
            let currMonth = document.querySelector('#month').innerText.trim();
            let selectedDate = date.innerText.trim();

            let currMonthInNumber

            
            for(let i = 0 ; i <= months.length; i++){
                if(currMonth == months[i]){
                    currMonthInNumber = i+1;
                }
            }
            console.log(currYear,currMonthInNumber,currYear)
            if(!selectedDate){ return;}

            getDataFromBackend(currYear,currMonthInNumber,selectedDate);
            
        })
    })
}

let dateCells = document.querySelectorAll('#table-body td')
dateCells.forEach((day) => {
   
    let dateCells = document.querySelectorAll('#table-body td')
    day.style.backgroundColor = '';
    day.addEventListener('click', () => {
        // Reset all cells
        dateCells.forEach(day => day.classList.remove('highlight'));

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

        // Fix "TODAY" comparison
        const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
        if (selectedDate === today) {
            navHeader.innerText = 'TODAY';
        } else {
            navHeader.innerText = selectedDate;
        }

        // Fetch tasks for the selected date
        console.log(year,month,selectedDay)
       
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
                    <div id="Delete-task">Delete</div>
                    <div id="Edit-task">Edit task</div>
                </div>
            `;
        taskDayInfo.appendChild(taskDiv);
    });
}

function fetchAndDisplayTasks(filterType) {
    clearUI();

    let taskDayInfo = document.getElementById('day-info');
    let navHeader = document.querySelector('h2');

    let date = new Date();
    if (filterType === "tomorrow") {
        date.setDate(date.getDate() + 1);
        navHeader.innerText = 'Tomorrow';
    } else if (filterType === "completed") {
        navHeader.innerText = 'Completed';
    } else {
        navHeader.innerText = 'All Tasks';
    }

    let targetDate = date.toISOString().split('T')[0];

    fetch(`${CONFIG.backendUrl}/tasks`)
        .then(response => response.json())
        .then(data => {
            let filteredTasks = data;

            if (filterType === "tomorrow") {
                filteredTasks = data.filter(task => task.taskDate.split('T')[0] === targetDate);
            } else if (filterType === "completed") {
                filteredTasks = data.filter(task => task.completed);
            }

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
                                        <h4 class="task-done">${task.completed ? 'Task Done.' : ''}</h4>
                                    </div>
                                </div>
                                <p>${taskNotes}</p>
                                <div id="Edit-del-btn">
                                    <div id="Delete-task">Delete</div>
                                    <div id="Edit-task">Edit task</div>
                                </div>
                            </div>`;

                    taskDayInfo.appendChild(taskDiv);
                });
            } else {
                taskDayInfo.innerHTML = `<h4 id="no-tasks">No tasks found.</h4>`;
            }
        });

    renderCalendarWRTCond(date.getFullYear(), date.getMonth(), date.getDate() - 1);
}



// Attach media query listener


function setupTaskButton(buttonId, filterType) {
    let button = document.getElementById(buttonId);
    button.addEventListener('click', () => {
        fetchAndDisplayTasks(filterType);

        const mediaQuery = window.matchMedia('(max-width:1280px)');
        handleMediaQueryChange(mediaQuery);
        mediaQuery.addEventListener('change', handleMediaQueryChange);
    });
}

// Set up buttons for displaying all and completed tasks
setupTaskButton('All-Tasks', 'all');
setupTaskButton('completed', 'completed');

// functionality for tomorrow button


document.getElementById('Tomorrow').addEventListener('click', () => fetchAndDisplayTasks("tomorrow"));

function renderCalendarWRTCond(year, month, day) {
    console.log(year, month, day);
    document.getElementById('month').innerText = months[month];
    document.getElementById('year').innerText = year;

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

function todayTasks() {
    let helpPage = document.getElementById('help');
    if (helpPage) helpPage.style.display = 'none';

    let feedbackDiv = document.querySelector('#feedb');
    if (feedbackDiv) feedbackDiv.style.display = 'none';

    let settingsPage = document.getElementById('settings');
    if (settingsPage) settingsPage.style.display = 'none';

    let taskDayInfo = document.getElementById('day-info');
    taskDayInfo.innerHTML = ''; // Clear previous tasks

    let date = new Date();
    let todayDateString = date.toISOString().split('T')[0];

    document.querySelector('h2').innerText = 'Today';

    fetch(`${CONFIG.backendUrl}/tasks`)
        .then(response => response.json())
        .then(data => {
            let tasksForToday = data.filter(task => task.taskDate.split('T')[0] === todayDateString);

            if (tasksForToday.length > 0) {
                tasksForToday.forEach(task => {
                    if (!task.completed) {
                        addTaskToUI(task, taskDayInfo);
                    }
                });
            } else {
                taskDayInfo.innerHTML = `<h4 id="no-tasks">No tasks for today.</h4>`;
            }

            renderCalendarWRTCond(date.getFullYear(), date.getMonth(), date.getDate() - 1);
        })
        .catch(error => console.error('Error fetching tasks:', error));
}
document.getElementById('Today').addEventListener('click', todayTasks);

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
                    <div id="Delete-task">Delete</div>
                    <div id="Edit-task">Edit task</div>
                </div>
            </div>`;

    container.appendChild(taskDiv);
}

// function that would delete specific tasks 

function deleteSpecificTask(taskID, taskDiv) {
    if (!confirm('This task will be removed. This action is irreversible.')) return;

    fetch(`${CONFIG.backendUrl}/tasks/delete/${taskID}`, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' }
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

function editTask(taskID, taskName, taskNotes, taskDate) {
    let userNoteInput = taskNotes.replace(/\n/g, "<br>");
    const updatedTask = { taskName, taskNotes: userNoteInput, _id: taskID, taskDate };

    fetch(`${CONFIG.backendUrl}/tasks/update/${taskID}`, {
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

function deleteCompletedTasks() {
    if (!confirm('Are you sure to delete all tasks? This action is irreversible.')) return;

    fetch(`${CONFIG.backendUrl}/tasks/delete-completed`, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' }
    })
        .then(response => {
            if (!response.ok) throw new Error('No completed tasks to delete');
            alert('All completed tasks have been deleted.');
            document.getElementById('day-info').innerHTML = '';
        })
        .catch(error => console.error('Error:', error));
}

// feedback form logic


document.getElementById('feedback-link').onclick = () => showPage('feedb', 'Feedback');
document.getElementById('help-link').onclick = () => showPage('help', 'Help');
document.getElementById('settings-link').onclick = () => showPage('settings', 'Settings');



function showPage(pageId, title) {
    let navMenuLinks = document.getElementById('nav-menu-links');
    let backbtn = document.getElementById('back-btn');
    let toggleNavMenu = document.getElementById('toggle-nav-menu');
    let taskDayInfo = document.getElementById('day-info');
    let feedbackPage = document.getElementById('feedb');
    let settingsPage = document.getElementById('settings');
    let helpPage = document.getElementById('help');
    let navHeader = document.querySelector('#nav-header h2');

    // Hide all sections first
    let taskDiv = taskDayInfo.querySelectorAll('.task-added');

    taskDiv.forEach((div) => {

        if (div) {
            div.remove();
        }
    })

    if (feedbackPage) feedbackPage.style.display = 'none';

    if (settingsPage) settingsPage.style.display = 'none';

    if (helpPage) helpPage.style.display = 'none';

    // Show the selected page

    navHeader.innerText = title;
    document.getElementById(pageId).style.display = 'flex';


    if (title == 'Feedback') {
        feedbackPage.style.display = 'flex';
        feedbackPage.style.flexDirection = 'column'

    }
    if (title == 'Help') {
        helpPage.style.display = 'flex';
    }

    if (title == 'Settings') {
        settingsPage.style.display = 'flex';
    }

    // Hide nav menu after selection
    navMenuLinks.classList.add('visibility');
    backbtn.classList.add('visibility');
    toggleNavMenu.classList.add('invisibility');

    const mediaQuery = window.matchMedia('(max-width:1280px)');
    handleMediaQueryChange(mediaQuery);
    mediaQuery.addEventListener('change', handleMediaQueryChange);

}



