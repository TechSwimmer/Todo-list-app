// function to render a calender when site starts

// const { response } = require("express");

// const { application } = require("express");






const navLinks = document.querySelector('ul');
const listButton = document.querySelector('#toggle-nav-menu');
const backbtn = document.querySelector('#back-btn')

listButton.addEventListener('click', () => {
    navLinks.classList.remove('nav-menu-links')
    listButton.classList.add('nav-menu-links')
    backbtn.classList.remove('nav-menu-links')

})


backbtn.addEventListener('click', () => {
    navLinks.classList.add('nav-menu-links');
    listButton.classList.remove('nav-menu-links')
    backbtn.classList.add('nav-menu-links')
})


//generate year and month styles when hovering on arrows.

const leftArrowYear = document.getElementById('l-arrow-year');
const rightArrowYear = document.getElementById('r-arrow-year');
const leftArrowMonth = document.getElementById('l-arrow-month');
const rightArrowMonth = document.getElementById('r-arrow-month');

// const year = document.getElementById('year');
// const month = document.getElementById('month');

leftArrowYear.addEventListener('mouseenter', () => {
    leftArrowYear.style.width = '20px'

})

leftArrowYear.addEventListener('mouseleave', () => {
    leftArrowYear.style.width = '0px'
})

rightArrowYear.addEventListener('mouseenter', () => {
    rightArrowYear.style.width = '20px'
})
rightArrowYear.addEventListener('mouseleave', () => {
    rightArrowYear.style.width = '0px'
})

rightArrowMonth.addEventListener('mouseenter', () => {
    rightArrowMonth.style.width = '20px'
})

rightArrowMonth.addEventListener('mouseleave', () => {
    rightArrowMonth.style.width = '0'
})
leftArrowMonth.addEventListener('mouseenter', () => {
    leftArrowMonth.style.width = '20px'
})
leftArrowMonth.addEventListener('mouseleave', () => {
    leftArrowMonth.style.width = '0px'
})




//------------------------exp----------------------------





todayTasks();                         //   function to load tyhe current day tasks right in tyyhe beginning 


// let numOfDays = new Date(2024,3,32).getDate();
// console.log(numOfDays)


// ------------------------------------------------add-task-icon btn use and add-task page dynamism.-----------------------------------------

function openTaskPage() {
    
    let taskAdder = document.getElementById('taskPageContainer');
    taskAdder.style.display = 'block';
    document.getElementById('task-name').value = "";
    document.getElementById('task-notes').value = "";
    document.getElementById('task-date').value = "";

    document.getElementById('overlay').style.display = 'block';
    addTaskBtn.classList.add('visibility');
    document.querySelector('.task-container').classList.remove('visibility')

}

function closeTaskPage() {
    document.getElementById('taskPageContainer').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.querySelector('.task-container').classList.add('visibility')
    addTaskBtn.classList.remove('visibility');
}

let addTaskBtn = document.querySelector('.add-task-icon');

addTaskBtn.addEventListener('click', () => {
  
    
    openTaskPage();


})


// overlay mouse pointer behaviour when create task page is open


let overlay = document.getElementById('overlay');
overlay.addEventListener('click', function () {
    closeTaskPage();
    
});

overlay.addEventListener('mouseenter', function () {
    overlay.style.cursor = 'pointer';
})


// task page elements and behaviour to load them in the day-info page updating the day-info heading to the date supplied.



async function renderTaskPage() {
    let taskName = document.getElementById('task-name').value;
    let taskNotes = document.getElementById('task-notes').value;
    let taskDate = document.getElementById('task-date').value;

    // Provide default task notes if empty
    if (taskNotes === "") {
        taskNotes = "No Task Notes.";
    }

    let userNoteInput = taskNotes.replace(/\n/g, "<br>");
    let taskDayInfo = document.getElementById('day-info');
    let navHeader = document.querySelector('h2');
    taskDayInfo.innerHTML = "";
    // Ensure both task name and task date are provided
    if (!taskName || !taskDate) {
        return;
    }

    // Prepare task object to send to the server
    const newTask = {
        taskName: taskName,
        taskNotes: taskNotes,
        taskDate: new Date(taskDate),
        completed: false
    };
    // add the tasks in the db
    try {
        // Send the task data to the server
        let response = await fetch('http://localhost:5000/tasks/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });

        let taskdata = await response.json(); // Get task details from the response

        if (response.ok) {
            let taskId = taskdata._id; // Retrieve taskId from response data

            let taskDiv = document.createElement('div');
            taskDiv.setAttribute('data-id', taskId);
            taskDiv.innerHTML = `
                <div class="task-added" data-id="${taskId}" data-date="${taskDate}">
                    <div class="head-checkbox">
                        <h3>${taskName}</h3>
                        <div class="checkbox">
                            <h4 class="task-done">Task Done.</h4>
                        </div>
                    </div>
                    <p>${userNoteInput}</p>
                    <div id="Edit-del-btn">
                    <div id="Delete-task">Delete</div>
                    <div id="Edit-task">Edit task</div>
                    </div>
                </div>`;
            console.log(taskDate,taskName,taskNotes,taskId)
            navHeader.innerText = taskDate;
            taskDayInfo.appendChild(taskDiv);

            // Close task page after adding the task
            closeTaskPage();
        } else {
            console.error('Error creating task:', taskdata.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

    let taskSubmitBtn = document.getElementById('create');

    taskSubmitBtn.addEventListener('click', (event) => {
        
        event.preventDefault();

        
        renderTaskPage();
        


    })









    // calender behaviour when adding a task on a date
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


    function renderCalendar(year, month, date) {
        // the year and monthh on whichh the task is added must be displayed in calender
        let taskDate = document.getElementById('task-date').value;
        let taskName = document.getElementById('task-name').value;
        if (!taskDate || !taskName) {
            alert('please provide a task name and the date when the task should be completed.')
            openTaskPage();
            return;
        }

        let calendar = document.getElementById('calendar');

        let startOfMonth = new Date(year, month - 1, 1).getDay();
        let numOfDays = 32 - new Date(year, month - 1, 32).getDate();

        let renderMonth = document.getElementById('month');
        let renderYear = document.getElementById('year');
        renderMonth.innerText = "";
        renderYear.innerText = "";
        let taskDateCalendar = document.getElementById('task-date').value;
        let splittedDate = taskDateCalendar.split('-');

        renderMonth.innerText = months[splittedDate[1] - 1];
        renderYear.innerText = splittedDate[0];

        //render the dates of the month in proper order


        let dateRow = document.querySelector('#table-body tr')
        let dateCell = document.querySelectorAll('#table-body tr td')
        dateCell.forEach((cell, index) => {
            cell.textContent = "";
            cell.style.backgroundColor = "aqua";
        })



        let currentDate = 1;

        dateCell.forEach((cell, index) => {
            //check if the current index is after the first day of the month
            if (index >= startOfMonth && index < startOfMonth + numOfDays) {
                cell.textContent = currentDate;
                currentDate++;
                if (currentDate === date + 1) {
                    cell.style.backgroundColor = 'blue';


                }
            }

            else { cell.classList.add('empty') }



        })


    }


    // console.log(renderMonth)
    // console.log(renderYear)
    // console.log(taskDateCalendar);
    let submitDateCalendar = document.getElementById('create');
    submitDateCalendar.addEventListener('click', () => {
        let taskDateCalendar = document.getElementById('task-date').value;
        let splittedDate = taskDateCalendar.split('-');


        renderCalendar(Number(splittedDate[0]), Number(splittedDate[1]), Number(splittedDate[2]));
    })






    // render a calender with today's date when  you first start the page and ensure tht there is a csslender loaded in all scenarios the calender should indicate thhe scenario 



    function renderRegularCalendar() {

        const currentDate = new Date()
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();

        const renderMonth = document.getElementById('month');
        const renderYear = document.getElementById('year');
        const originalMonth = document.getElementById('month').innerText;
        renderMonth.innerText = months[month - 1];
        renderYear.innerText = year;

        // for days

        let daysInMonth = 32 - new Date(year, month - 1, 32).getDate();
        let monthStartDay = new Date(year, month - 1, 1).getDay();


        let dateRow = document.querySelector('#table-body tr');
        let dateCell = document.querySelectorAll('#table-body tr td');
        let dayCounter = 1;
        dateCell.forEach((cell, index) => {
            if (index >= monthStartDay && index < monthStartDay + daysInMonth) {
                cell.textContent = dayCounter;
                if (dayCounter == day) {
                    cell.style.backgroundColor = 'blue';
                }
                dayCounter++;
            }
            else {
                cell.classList.add('empty')
            }

        })

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

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        // change the year if we click btn on january and set the month to dec
        if (currMonth.textContent == months[0]) {
            yearChange.textContent = yearNumber - 1;
            currMonth.textContent = months[11];
            daysLoader(parseInt(yearChange.textContent), months.indexOf(currMonth.textContent))
        }
        else {
            for (let i = 0; i <= months.length; i++) {
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

        let dateCell = document.querySelectorAll('#table-body tr td');
        let currentDay = 1;

        let date = new Date();
        let thismonth = date.getMonth();
        let thisyear = date.getFullYear();
        let todayDate = date.getDate();


        dateCell.forEach((cell, index) => {
            cell.textContent = "";
            cell.style.backgroundColor = 'aqua'
        });

        dateCell.forEach((cell, index) => {

            if (index >= startOfMonth && currentDay <= numOfDays) {
                cell.textContent = currentDay;
                if (cell.textContent == todayDate && year == thisyear && month == thismonth) {
                    cell.style.backgroundColor = 'blue';
                }
                currentDay++;
            }
            else {
                cell.classList.add('empty');

            }
        });
    }

    // let startOfMonth = new Date(2024,m-1,1).getDay();
    // console.log(startOfMonth);


    //-----------------------------------------------------------------------------right month button behaviour

    let rMonthArrow = document.getElementById('r-arrow-month');

    function rightMonthbtn() {
        let currMonth = document.getElementById('month');
        let currYear = document.getElementById('year');

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


        if (currMonth.textContent === months[11]) {
            let yearChange = parseInt(currYear.textContent) + 1;
            currYear.textContent = yearChange;
            currMonth.textContent = months[0];
            daysLoader(yearChange, months.indexOf(currMonth.textContent))
        }
        else {
            let presentYear = parseInt(currYear.textContent);
            changeMonth = months.indexOf(currMonth.textContent) + 1;
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
        let taskName;
        let taskNotes;
        let taskID;
        let taskDate;


        // console.log(isoDateString);
        // Check if the clicked element is a "Task Done" checkbox
        if (event.target && event.target.classList.contains('task-done')) {
            // Find the task div to remove
            const taskDiv = event.target.closest('.task-added');
            if (taskDiv) {
                taskName = taskDiv.querySelector('h3').innerText;
                taskNotes = taskDiv.querySelector('p').innerText;
                taskDate = taskDiv.getAttribute('data-date');
                taskID = taskDiv.getAttribute('data-id');

                // create a date obj from the string
                let dateObject = new Date(taskDate);

                // Convert the Date object to ISO 8601 format 
                let isoDateString = dateObject.toISOString();

                taskDiv.remove(); // Remove the task from the DOM


                console.log(taskName, taskNotes, taskDate,taskID);
                //get the task name and notes of the completed task compare it to tasks and obtain taskID


                fetch('http://localhost:5000/tasks')
                    .then(response => response.json())
                    .then(data => {
                        data.forEach(task => {
                            if (taskID == task._id) {

                                taskID = task._id;
                                console.log(taskID);

                                fetch(`http://localhost:5000/tasks/completed/${taskID}`, {
                                    method: 'PATCH',
                                    headers: {
                                        'content-type': 'application/json'
                                    },
                                    body: JSON.stringify({ completed: true })
                                })
                                    .then(response => {
                                        console.log(response);
                                        return response.json()
                                    })
                                    .then(data => {
                                        console.log("Task marked as completed:", data);
                                    })
                                    .catch(error => {
                                        console.error("Error updating tasks: ", error);
                                    })
                            }
                        })
                    })
            }
        }




    });
   








    //-----------------------------------------------------------------------------


 





    // make a function that can bring out the tasks stored on the date that the user clicks on the calender if no date then front end should display no tasks for this date.

    let dateCells = document.querySelectorAll('td');
    console.log(dateCells);

    dateCells.forEach((day) => {
        day.style.backgroundColor = '';
        day.addEventListener('click', (event) => {
            dateCells.forEach(day => day.style.backgroundColor = 'aqua')
            day.style.backgroundColor = 'blueviolet';
            let month = document.getElementById('month').innerHTML;
            let year = document.getElementById('year').innerHTML;
            let selectedDay = day.innerText;

            for (let i = 0; i <= months.length; i++) {
                if (month == months[i]) {
                    month = i + 1;
                }
            }

            let navHeader = document.querySelector('h2')
            if (!selectedDay) { return }
            navHeader.innerText = `${year}-${month}-${selectedDay}`;

            //check if the selected day is today and display nav header respectively


            const today = new Date();
            const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

            const thisYear = todayDate.getFullYear();
            const thisMonth = todayDate.getMonth() + 1;
            const thisDay = todayDate.getDate();

            const todaysDate = `${thisYear}-${thisMonth}-${thisDay}`
            console.log(todaysDate, navHeader.innerText);
            if (navHeader.innerText == todaysDate) {
                navHeader.innerText = 'TODAY';
            }

            getDataFromBackend(year, month, selectedDay);

        });
    });

    function getDataFromBackend(year, month, selectedDay) {

        let reqTaskDate = new Date(Date.UTC(year, month - 1, selectedDay));
        reqTaskDate = reqTaskDate.toISOString().split('T')[0];

        let taskDayInfo = document.getElementById('day-info');
        taskDayInfo.innerHTML = '';                                                                   // clear previous tasks
        const url = `http://localhost:5000/tasks?year=${year}&month=${month}&day=${selectedDay}`;
        let taskFound = false;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.forEach(task => {
                   
                    let dbTaskDate = new Date(task.taskDate).toISOString().split('T')[0];
                    if (reqTaskDate == dbTaskDate) {
                        taskFound = true;
                        console.log(reqTaskDate, dbTaskDate)
                        let taskName = task.taskName;
                        let taskNotes = task.taskNotes || 'No Task Notes';
                        let userNoteInput = taskNotes.replace(/\n/g, "<br>");
                        let taskID = task._id;
                        let taskDiv = document.createElement('div');
                        taskDiv.setAttribute('data-id', task.id);
                        taskDiv.innerHTML = `<div class="task-added" data-id="${taskID}" data-date="${task.taskDate}">
                            <div class="head-checkbox">
                                <h3>${taskName}</h3>
                                <div class="checkbox">
                                    <h4 class="task-done">Task Done.</h4>
                                </div>
                            </div>
                            <p>${userNoteInput}</p>
                            <div id="Edit-del-btn">
                            <div id="Delete-task">Delete</div>
                            <div id="Edit-task">Edit task</div>
                            </div>
                        </div>`;
                        taskDayInfo.appendChild(taskDiv);
                        // Add the task ID as a data attribute (use data-task-id)
                       

                    }
                });

                // if no tasks are found for the specific date then the frontend should display 'No tasks for the day"
                if (!taskFound) {
                    let taskDiv = document.createElement('div');
                    taskDiv.innerHTML = taskDiv.innerHTML = `<h4 id="no-tasks">No tasks for the day.</h4>`;
                    taskDayInfo.appendChild(taskDiv);
                }
            })
            .catch(error => {
                console.log('Error fetching tasks : ', error)
            })


    }








  


    // function to display all tasks when all tasks button is clicked


    function displayAllTasks() {
        let navHeader = document.querySelector('h2');
        let taskDayInfo = document.getElementById('day-info');


        let dateCells = document.querySelectorAll('#table-body tr td')
        dateCells.forEach(cell => cell.style.backgroundColor = 'aqua')


        taskDayInfo.innerHTML = "";

        fetch('http://localhost:5000/tasks')
            .then(response => response.json())
            .then(data => {

                if(data.length == 0){
                    let taskDiv = document.createElement('div');
                    taskDiv.innerHTML = taskDiv.innerHTML = `<h4 id="no-tasks">No tasks created.</h4>`;
                    taskDayInfo.appendChild(taskDiv);
                }
                data.forEach(task => {
                let taskName = task.taskName;
                let taskNotes = task.taskNotes;
                let userNoteInput = taskNotes.replace(/\n/g, "<br>");
                let taskDate = task.taskDate;
                let taskID = task._id;
                navHeader.innerText = "All Tasks";
                let taskDiv = document.createElement('div');
                taskDiv.innerHTML =
                    `<div class="task-added" data-id="${taskID}" data-date="${taskDate}">
                <div class="head-checkbox"><h3>${taskName}</h3><div class="checkbox"><h4 class="task-done">Task Done.</h4></div></div>
   
                <p>${userNoteInput}</p>
                <div id="Edit-del-btn">
                    <div id="Delete-task">Delete</div>
                    <div id="Edit-task">Edit task</div>
                    </div>
                </div>`;
                taskDiv.setAttribute('data-date', task.taskDate);
                console.log(taskDate)
                taskDayInfo.appendChild(taskDiv);
            })})
    }

    let allTaskBtn = document.getElementById('All-Tasks');

    allTaskBtn.addEventListener('click', () => {
        displayAllTasks();

        // media query to hide the nav menu links for mobile devices
        const mediaQuery = window.matchMedia('(max-width:1280px)')
        function handleMediaQueryChange(e) {
            let navMenuLinks = document.getElementById('nav-menu-links');
            let backbtn = document.getElementById('back-btn');
            let toggleNavMenu = document.getElementById('toggle-nav-menu');
            let toggleNavImg = document.getElementsByClassName('toggle-img')

            if (e.matches) {
                // If the screen width is <= 1280px, hide nav menu links
                navMenuLinks.classList.add('visibility');
                backbtn.classList.toggle('visibility');
                toggleNavMenu.classList.add('invisibility');

                toggleNavMenu.addEventListener('click', () => {
                    navMenuLinks.classList.remove('visibility');
                    backbtn.classList.remove('visibility');
                    toggleNavMenu.classList.remove('invisibility');
                })

            }
            else {
                navMenuLinks.style.display = 'flex';
            }
        }

        // Initial check when the function is called
        handleMediaQueryChange(mediaQuery);

        // Attach the listener for when the window resizes
        mediaQuery.addEventListener('change', handleMediaQueryChange);

    })


    // fetch all the completed tasks when completed tasks is cliiicked


    function showCompletedTasks() {
        let navHeader = document.querySelector('h2').innerText = 'Completed';
        let taskDayInfo = document.getElementById('day-info');
        let noTrueTaskCounter =  0;
        taskDayInfo.innerHTML = "";
        let dateCells = document.querySelectorAll('#table-body tr td')
        dateCells.forEach(cell => cell.style.backgroundColor = 'aqua')
        fetch('http://localhost:5000/tasks')
        .then(response => {
            
            return response.json();
        })
        .then(data => {
            console.log(data)
            if (data.length == 0){
                let taskDiv = document.createElement('div');
                    taskDiv.innerHTML = taskDiv.innerHTML = `<h4 id="no-tasks">No tasks created.</h4>`;
                    taskDayInfo.appendChild(taskDiv);
            }
            else{
                data.forEach(task => {
                    if(task.completed == true){
                        noTrueTaskCounter++
                        let taskId = task._id;
                        
                        let taskNotes = task.taskNotes;
                        let userNoteInput = taskNotes.replace(/\n/g, "<br>");
                        let taskDiv = document.createElement('div');
                        taskDiv.innerHTML = `<div class="task-added" data-id="${taskId}" data-date="${task.taskDate}">
                        <div class="head-checkbox"><h3>${task.taskName}</h3><div class="checkbox"><h4 class="task-done">Task Done.</h4></div></div>
                        <p>${userNoteInput}</p>
                        <div id="Edit-del-btn">
                    <div id="Delete-task">Delete</div>
                    <div id="Edit-task">Edit task</div>
                    </div>
                    </div>`;
                        taskDayInfo.appendChild(taskDiv);
                    }
                   
                    
                })
              
                if(noTrueTaskCounter == 0){
                    let taskDiv = document.createElement('div');
                    taskDiv.innerHTML = `<h4 id="no-tasks">No tasks completed</h4>`;
                    taskDayInfo.appendChild(taskDiv);
                }
            }
            
        })    
    }


    let completedTaskBtn = document.getElementById('completed');

    completedTaskBtn.addEventListener('click', () => {
        showCompletedTasks();

        // media query to hide the nav menu links for mobile devices
        const mediaQuery = window.matchMedia('(max-width:1280px)')
        function handleMediaQueryChange(e) {
            let navMenuLinks = document.getElementById('nav-menu-links');
            let backbtn = document.getElementById('back-btn');
            let toggleNavMenu = document.getElementById('toggle-nav-menu');
            let toggleNavImg = document.getElementsByClassName('toggle-img')

            if (e.matches) {
                // If the screen width is <= 1280px, hide nav menu links
                navMenuLinks.classList.add('visibility');
                backbtn.classList.toggle('visibility');
                toggleNavMenu.classList.add('invisibility');

                toggleNavMenu.addEventListener('click', () => {
                    navMenuLinks.classList.remove('visibility');
                    backbtn.classList.remove('visibility');
                    toggleNavMenu.classList.remove('invisibility');
                })

            }
            else {
                navMenuLinks.style.display = 'flex';
            }
        }

        // Initial check when the function is called
        handleMediaQueryChange(mediaQuery);

        // Attach the listener for when the window resizes
        mediaQuery.addEventListener('change', handleMediaQueryChange);
    })



    // functionality for tomorrow button

    function displayTomorrowTasks() {
        let date = new Date();
        date.setDate(date.getDate() + 1)

        let day = date.getDate() + 1;
        let month = date.getMonth();
        let year = date.getFullYear();

        let tomorrowDateString = date.toISOString().split('T')[0];
        let taskDayInfo = document.getElementById('day-info');
        taskDayInfo.innerHTML = "";
        let navHeader = document.querySelector('h2');
        navHeader.innerText = 'Tomorrow';
        console.log(tomorrowDateString)
        fetch('http://localhost:5000/tasks')
            .then(response => response.json())
            .then(data => {

                // filter tasks for tomorrow
                let tasksForTomorrow = data.filter(task => task.taskDate.split('T')[0] == tomorrowDateString)
                console.log(tasksForTomorrow)
                if (tasksForTomorrow.length > 0) {
                    // display the tasks
                    tasksForTomorrow.forEach(task => {
                        let taskNotes = task.taskNotes;
                        let userNoteInput = taskNotes.replace(/\n/g, "<br>");
                        let taskDiv = document.createElement('div');
                        let taskId = task._id;
                        taskDiv.innerHTML = `<div class="task-added" data-id="${taskId}" data-date="${task.taskDate}">
                        <div class="head-checkbox"><h3>${task.taskName}</h3><div class="checkbox"><h4 class="task-done">Task Done.</h4></div></div>
                        <p>${userNoteInput}</p>
                        <div id="Edit-del-btn">
                    <div id="Delete-task">Delete</div>
                    <div id="Edit-task">Edit task</div>
                    </div>
                    </div>`;
                        taskDayInfo.appendChild(taskDiv);
                    })
                } else {
                    let taskDiv = document.createElement('div');
                    taskDiv.innerHTML = taskDiv.innerHTML = `<h4 id="no-tasks">No tasks for the day.</h4>`;
                    taskDayInfo.appendChild(taskDiv);
                }

            })
        renderCalendarWRTCond(year, month, day)
        // .catch(error => console.error("Error fetching tasks:", error));
    }


    let tomorrowbtn = document.getElementById('Tomorrow');

    tomorrowbtn.addEventListener('click', () => {
        displayTomorrowTasks();

        // media query to hide the nav menu links for mobile devices
        const mediaQuery = window.matchMedia('(max-width:1280px)')
        function handleMediaQueryChange(e) {
            let navMenuLinks = document.getElementById('nav-menu-links');
            let backbtn = document.getElementById('back-btn');
            let toggleNavMenu = document.getElementById('toggle-nav-menu');
            let toggleNavImg = document.getElementsByClassName('toggle-img')

            if (e.matches) {
                // If the screen width is <= 1280px, hide nav menu links
                navMenuLinks.classList.add('visibility');
                backbtn.classList.toggle('visibility');
                toggleNavMenu.classList.add('invisibility');

                toggleNavMenu.addEventListener('click', () => {
                    navMenuLinks.classList.remove('visibility');
                    backbtn.classList.remove('visibility');
                    toggleNavMenu.classList.remove('invisibility');
                })

            }
            else {
                navMenuLinks.style.display = 'flex';
            }
        }

        // Initial check when the function is called
        handleMediaQueryChange(mediaQuery);

        // Attach the listener for when the window resizes
        mediaQuery.addEventListener('change', handleMediaQueryChange);
    })

    function renderCalendarWRTCond(year, month, day) {

        const renderMonth = document.getElementById('month');
        const renderYear = document.getElementById('year');

        const dateRow = document.querySelector('#table-body tr');
        const dateCell = document.querySelectorAll('#table-body tr td');

        dateCell.forEach((cell, index) => {
            cell.style.background = 'aqua';
            if (index == day) {
                cell.style.backgroundColor = 'blue';
            }
        })
        renderMonth.innerText = months[month];
        renderYear.innerText = year;
    }



    // today btn functionality

    const todayBtn = document.getElementById('Today');

    // function for today btn

    function todayTasks() {
        //get today's date
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        let todayDateString = date.toISOString().split('T')[0];

        // set navheader as today
        let navHeader = document.querySelector('h2');
        navHeader.innerText = 'Today';

        // clear previous tasks in the day-iinfo
        let taskDayInfo = document.getElementById('day-info');
        taskDayInfo.innerHTML = "";

        fetch('http://localhost:5000/tasks')
            .then(response => response.json())
            .then(data => {

                // filter tasks for today
                let tasksForToday = data.filter(task => task.taskDate.split('T')[0] == todayDateString);

                console.log(tasksForToday)
                if (tasksForToday.length > 0) {
                    tasksForToday.forEach(task => {
                        let taskID = task._id;
                        let taskNotes = task.taskNotes;
                        let userNoteInput = taskNotes.replace(/\n/g, "<br>"); 
                        let taskDiv = document.createElement('div');
                        taskDiv.innerHTML = `<div class="task-added" data-id="${taskID}" data-date="${task.taskDate}">
                            <div class="head-checkbox"><h3>${task.taskName}</h3><div class="checkbox"><h4 class="task-done">Task Done.</h4></div></div>
                            <p>${userNoteInput}</p>
                            <div id="Edit-del-btn">
                        <div id="Delete-task">Delete</div>
                        <div id="Edit-task">Edit task</div>
                        </div>
                        </div>`;
                        taskDayInfo.appendChild(taskDiv);
                        renderCalendarWRTCond(year, month, day + 1)
                    })

                } else {
                    let taskDiv = document.createElement('div');
                    taskDiv.innerHTML = taskDiv.innerHTML = `<h4 id="no-tasks">No tasks for the day.</h4>`;
                    taskDayInfo.appendChild(taskDiv);
                    renderCalendarWRTCond(year, month, day + 1)
                }
            })
    }

    todayBtn.addEventListener('click', () => {
        todayTasks();

        // media query to hide the nav menu links for mobile devices
        const mediaQuery = window.matchMedia('(max-width:1280px)')
        function handleMediaQueryChange(e) {
            let navMenuLinks = document.getElementById('nav-menu-links');
            let backbtn = document.getElementById('back-btn');
            let toggleNavMenu = document.getElementById('toggle-nav-menu');
            let toggleNavImg = document.getElementsByClassName('toggle-img')

            if (e.matches) {
                // If the screen width is <= 1280px, hide nav menu links
                navMenuLinks.classList.add('visibility');
                backbtn.classList.toggle('visibility');
                toggleNavMenu.classList.add('invisibility');

                toggleNavMenu.addEventListener('click', () => {
                    navMenuLinks.classList.remove('visibility');
                    backbtn.classList.remove('visibility');
                    toggleNavMenu.classList.remove('invisibility');
                })

            }
            else {
                navMenuLinks.style.display = 'flex';
            }
        }

        // Initial check when the function is called
        handleMediaQueryChange(mediaQuery);

        // Attach the listener for when the window resizes
        mediaQuery.addEventListener('change', handleMediaQueryChange);
    })


    // a function that will delete all tasks storedin all dates

    function deleteAllTasks() {
        let taskDayInfo =  document.getElementById('day-info');
        taskDayInfo.innerHTML = '';

        if (confirm('Are you sure to delete all tasks? this action is irreversible and will delete completed and incomplete tasks.')) {
            fetch('http://localhost:5000/tasks', {
                method: 'DELETE',
                headers: {

                    'content-type': 'application/json'
                }

            })
                .then(response => {
                    if (response.ok) {
                        console.log('all tasks deleted successfully');
                        alert('All tasks have been deleted.')
                    }
                    else {
                        console.log('Error deleting tasks.')
                    }
                })
                .catch(error => {'Error:', error}) 
        }


    }

    let deleteBtn = document.getElementById('delete');

    deleteBtn.addEventListener('click',  ()  => {
        deleteAllTasks();

        // media query to hide the nav menu links for mobile devices
        const mediaQuery = window.matchMedia('(max-width:1280px)')
        function handleMediaQueryChange(e) {
            let navMenuLinks = document.getElementById('nav-menu-links');
            let backbtn = document.getElementById('back-btn');
            let toggleNavMenu = document.getElementById('toggle-nav-menu');
            let toggleNavImg = document.getElementsByClassName('toggle-img')

            if (e.matches) {
                // If the screen width is <= 1280px, hide nav menu links
                navMenuLinks.classList.add('visibility');
                backbtn.classList.toggle('visibility');
                toggleNavMenu.classList.add('invisibility');

                toggleNavMenu.addEventListener('click', () => {
                    navMenuLinks.classList.remove('visibility');
                    backbtn.classList.remove('visibility');
                    toggleNavMenu.classList.remove('invisibility');
                })

            }
            else {
                navMenuLinks.style.display = 'flex';
            }
        }

        // Initial check when the function is called
        handleMediaQueryChange(mediaQuery);

        // Attach the listener for when the window resizes
        mediaQuery.addEventListener('change', handleMediaQueryChange);
    })


    // delete or edit  specific task from database

    document.getElementById('day-info').addEventListener('click' , function(event){
        // check if the element clicked is delete or edit

        if(event.target && (event.target.id == 'Delete-task' || event.target.id == 'Edit-task')){
            // find the taskDiv to get taskID
            const taskDiv = event.target.closest('.task-added') 
            if(taskDiv){
                // get id
                let taskID = taskDiv.getAttribute('data-id');
                let taskDate =  taskDiv.getAttribute('data-date');
                let taskName = taskDiv.querySelector('h3').innerText;
                let taskNotes = taskDiv.querySelector('p').innerText;
                console.log(taskID,taskDate)
                // perform delete and edit operations

                if(event.target.id == 'Delete-task'){
                    deleteSpecificTask(taskID,taskDiv);
                    
                }
                else if (event.target.id == 'Edit-task'){
                    openEditPage();
                    
                }
            }
        }
    })


    // functon to delete specific task
    
    function deleteSpecificTask(taskID,taskDiv) {

        if(confirm('this task will be removed. this action is irreversible')){
            fetch(`http://localhost:5000/tasks/delete/${taskID}`,{
                method : 'DELETE',
                headers: {
                    'content-type': 'application/json'
                }
            })
            .then(response => {
                if(response.ok) {
                    console.log('Task Deleted successfully.')
                    taskDiv.remove();
                }
                else{
                    console.error('Error deleting tasks.:', response.statusText)
                }
            })
            
        }
    }


         


// edit specifc task


function editTask(taskID,taskDiv,taskName,taskNotes,taskDate){

    const updatedTask = {
        taskName: taskName,
        taskNotes: taskNotes,
        _id: taskID,
        taskDate: taskDate
    }
    fetch(`http://localhost:5000/tasks/update/${taskID}`,{
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task updated successfully:', data);
        // You can also update the DOM with the new task details if needed
    })
    .catch(error => {
        console.error('Error updating task:', error);
    });
}


function openEditPage() {
    
    let taskEditor = document.getElementById('editTaskPageContainer');
    taskEditor.style.display = 'block';
    

    document.getElementById('overlay').style.display = 'block';
    addTaskBtn.classList.add('visibility');
    document.querySelector('#edit-task-container').classList.remove('visibility')

}

function closeEditPage() {
    document.getElementById('editTaskPageContainer').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.querySelector('#edit-task-container').classList.add('visibility')
    addTaskBtn.classList.remove('visibility');
}

let overlaytwo = document.querySelectorAll('#overlay');
console.log(overlaytwo)
// overlaytwo.addEventListener('click', function() {
//     closeEditPage();
// })