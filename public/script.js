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


// overlay mouse pointer behaviour


let overlay = document.getElementById('overlay');
overlay.addEventListener('click', function () {
    closeTaskPage();

});

overlay.addEventListener('mouseenter', function () {
    overlay.style.cursor = 'pointer';
})


// task page elements and behaviour to load them in the day-info page updating the day-info heading to the date supplied.




// async function renderTaskPage() {
//     let taskName = document.getElementById('task-name').value;
//     let taskNotes = document.getElementById('task-notes').value;
//     let taskDate = document.getElementById('task-date').value;

//     if (taskNotes == "") {
//         taskNotes = "No Task Notes.";
//     }

//     let userNoteInput = taskNotes.replace(/\n/g, "<br>");
//     let taskDayInfo = document.getElementById('day-info');
//     let navHeader = document.querySelector('h2');

//     // check if the task name and task date is provided

//     if (!taskName || !taskDate) { return; }


//     if (taskDate !== navHeader.textContent) {
//         taskDayInfo.textContent = "";
//         const newTask = {
//             taskName: taskName,
//             taskNotes: taskNotes,
//             taskDate: new Date(taskDate),
//             completed: false
//         };
//         try {
//             let response = await fetch('http://localhost:5000/tasks/add', {
//                 method: 'POST',

//                 headers: {
//                     'content-type': 'application/json'
//                 },
//                 body: JSON.stringify(newTask)
//             })

//             let taskdata = await response.json();   // get task details
//             if (response.ok) {
//                 let taskId = taskdata._id;     // retrieve task id from response

//                 let taskDiv = document.createElement('div');

                
//                 taskDiv.innerHTML =
//                     `<div class="task-added" data-id="${taskId}" data-date="${taskDate}">
//             <div class="head-checkbox"><h3>${taskName}</h3><div class="checkbox"><h4 class="task-done">Task Done.</h4></div></div>
   
//             <p>${userNoteInput}</p>
//             </div>`;
//             taskDiv.setAttribute('data-id', taskId)
//                 navHeader.innerText = taskDate;

//                 taskDayInfo.appendChild(taskDiv);
//                 closeTaskPage()
//             }

//         } catch (error) {
//             console.error('Error:', error);
//         }


        
//         // renderCalender()
//     }
//     else {
//         try {
//             let response = await fetch('http://localhost:5000/tasks/add', {
//                 method: 'POST',

//                 headers: {
//                     'content-type': 'application/json'
//                 },
//                 body: JSON.stringify({ taskName: taskName, taskNotes: taskNotes, taskDate: new Date(taskDate), completed: false })
//             })

//             let taskdata = await response.json();   // get task details
//             if (response.ok) {
//                 let taskId = taskdata._id;
//                 let taskDiv = document.createElement('div');
//                 taskDiv.setAttribute('data-id', taskId);
//                 taskDiv.innerHTML =
//                     `<div class="task-added" data-id="${taskId}" data-date="${taskDate}">
//     <div class="head-checkbox"><h3>${taskName}</h3><div class="checkbox"><h4 class="task-done">Task Done.</h4></div></div>
    
//     <p>${userNoteInput}</p>
//     </div>`;

//                 navHeader.innerText = taskDate;
//                 // taskDiv.getAttribute('data-date',)
//                 taskDayInfo.appendChild(taskDiv);

//                 closeTaskPage();
//                 // taskCompletedRemoval();
//                 // renderCalender()

//             }




//         } catch (error) {
//             console.error('Error:', error);
//         }
//     }

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
                </div>`;
            
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
                taskID = taskDiv.getAttribute('data-id')

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
                            if (taskName == task.taskName && taskNotes == task.taskNotes && isoDateString == task.taskDate && taskID==task._id) {

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


    const arr = [0, 0, 3, 3, 2, 2, 2, 5, 6];
    function findOddRep(arr) {
        var hashMap = {};

        for (const num of arr) {
            if (hashMap[num]) {
                hashMap[num]++;
            }
            else {
                hashMap[num] = 1;
            }
        }

        for (const num in hashMap) {
            if (hashMap[num] % 2 !== 0) {
                console.log(hashMap[num]);
            }
        }
    }



    findOddRep(arr);





    // adding user input data to the database

    // prevent default submit behaviour

    // let createTask = document.getElementById('create');
    // console.log(createTask)
    // createTask.addEventListener("click", (event) => {
    //     event.preventDefault();
    //     console.log('submitted')
    //     let taskName = document.getElementById('task-name').value;
    //     let taskNotes = document.getElementById('task-notes').value;
    //     let taskDate = document.getElementById('task-date').value;

    //     if (!taskNotes) {
    //         taskNotes = "No Task Notes."
    //     }

    //     const taskData = {
    //         taskName,
    //         taskNotes,
    //         taskDate
    //     }

    //     fetch('http://localhost:5000/tasks/add', {
    //         method: 'POST',

    //         headers: {
    //             'content-type': 'application/json'
    //         },
    //         body: JSON.stringify({ taskName: taskName, taskNotes: taskNotes, taskDate: new Date(taskDate), completed: false })
    //     })
    //         .then(response => response.json())

    //         .catch((error) => {
    //             console.log('Error:', error)
    //         });


    //     console.log(taskData)


    // })


    // make a function that can bring out the tasks stored on the date that the user clicks on the calender if no date then front end should display no tasks for this date.

    let dateCells = document.querySelectorAll('td');
    console.log(dateCells);

    dateCells.forEach((day) => {
        day.addEventListener('click', (event) => {
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
                            <p>${taskNotes}</p>
                        </div>`;
                        taskDayInfo.appendChild(taskDiv);
                        // Add the task ID as a data attribute (use data-task-id)
                       

                    }
                });

                // if no tasks are found for the specific date then the frontend should display 'No tasks for the day"
                if (!taskFound) {
                    let taskDiv = document.createElement('div');
                    taskDiv.innerHTML = `<div class="task-added">
                        <h3>No tasks for the day</h3>
                    </div>`;

                    taskDayInfo.appendChild(taskDiv)
                }
            })
            .catch(error => {
                console.log('Error fetching tasks : ', error)
            })


    }








    function countTaskWithspecifictaskName() {
        let taskName = "NIKHIL";

        fetch('http://localhost:5000/tasks')
            .then(response => response.json())
            .then(data => {
                data.forEach(task => {
                    if (task.taskName == taskName) {
                        console.log(task);
                    }
                });
            })

    }

    // countTaskWithspecifictaskName();


    // function to display all tasks when all tasks button is clicked


    function displayAllTasks() {
        let navHeader = document.querySelector('h2');
        let taskDayInfo = document.getElementById('day-info');





        taskDayInfo.innerHTML = "";

        fetch('http://localhost:5000/tasks')
            .then(response => response.json())
            .then(data => data.forEach(task => {
                let taskName = task.taskName;
                let taskNotes = task.taskNotes;
                let taskDate = task.taskDate;
                navHeader.innerText = "All Tasks";
                let taskDiv = document.createElement('div');
                taskDiv.innerHTML =
                    `<div class="task-added" data-id="" data-date="${taskDate}">
                <div class="head-checkbox"><h3>${taskName}</h3><div class="checkbox"><h4 class="task-done">Task Done.</h4></div></div>
   
                <p>${taskNotes}</p>
            </div>`;
                taskDiv.setAttribute('data-date', task.taskDate);
                console.log(taskDate)
                taskDayInfo.appendChild(taskDiv);
            }))
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
        taskDayInfo.innerHTML = "";

        fetch('http://localhost:5000/tasks')
            .then(response => response.json())
            .then(data => data.forEach(task => {

                if (task.completed == true) {
                    let taskDiv = document.createElement('div');
                    taskDiv.innerHTML =
                        `<div class="task-added" data-id="${task.id}" data-date="${task.taskDate}">
                    <div class="head-checkbox"><h3>${task.taskName}</h3><div class="checkbox"><h4 class="task-done">Task Done.</h4></div></div>
       
                    <p>${task.taskNotes}</p>
                </div>`;
                    taskDayInfo.appendChild(taskDiv);
                }
            }))
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
                        let taskDiv = document.createElement('div');
                        taskDiv.innerHTML = `<div class="task-added" data-id="${task.id}" data-date="${task.taskDate}">
                        <div class="head-checkbox"><h3>${task.taskName}</h3><div class="checkbox"><h4 class="task-done">Task Done.</h4></div></div>
                        <p>${task.taskNotes}</p>
                    </div>`;
                        taskDayInfo.appendChild(taskDiv);
                    })
                } else {
                    let taskDiv = document.createElement('div');
                    taskDiv.innerHTML = taskDiv.innerHTML = `<div class="task-added">
                <h3>No tasks for the day</h3>
            </div>`;
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
                        let taskDiv = document.createElement('div');
                        taskDiv.innerHTML = `<div class="task-added" data-id="${task.id}" data-date="${task.taskDate}">
                            <div class="head-checkbox"><h3>${task.taskName}</h3><div class="checkbox"><h4 class="task-done">Task Done.</h4></div></div>
                            <p>${task.taskNotes}</p>
                        </div>`;
                        taskDayInfo.appendChild(taskDiv);
                        renderCalendarWRTCond(year, month, day + 1)
                    })

                } else {
                    let taskDiv = document.createElement('div');
                    taskDiv.innerHTML = taskDiv.innerHTML = `<div class="task-added">
                <h3>No tasks for Today</h3>
            </div>`;
                    taskDayInfo.appendChild(taskDiv);
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

