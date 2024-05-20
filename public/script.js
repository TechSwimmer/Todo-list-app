  // function to render a calender when site starts






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

overlay.addEventListener('mouseenter', function() {
    overlay.style.cursor = 'pointer';
})


// task page elements and behaviour to load them in the day-info page updating the day-info heading to the date supplied.




function renderTaskPage() {
    let taskName = document.getElementById('task-name').value;
    let taskNotes = document.getElementById('task-notes').value;
    let taskDate = document.getElementById('task-date').value;

    let userNoteInput = taskNotes.replace(/\n/g, "<br>");
    let taskDayInfo = document.getElementById('day-info');
    let navHeader = document.querySelector('h2');

     // check if the task name and task date is provided
    
     if(!taskName && !taskDate){return;}
  
  
    if (taskDate !== navHeader.textContent) {
        taskDayInfo.textContent = "";
        
       

        let taskDiv = document.createElement('div');
        taskDiv.innerHTML =
            `<div class="task-added">
    <div class="head-checkbox"><h3>${taskName}</h3><div class="checkbox"><h4 class="task-done">Task Done.</h4></div></div>
   
    <p>${userNoteInput}</p>
    </div>`;

        navHeader.innerText = taskDate;

        taskDayInfo.appendChild(taskDiv);
        closeTaskPage();
        // renderCalender()
    }
    else {
        
        let taskDiv = document.createElement('div');
        taskDiv.innerHTML =
            `<div class="task-added">
    <div class="head-checkbox"><h3>${taskName}</h3><div class="checkbox"><h4 class="task-done">Task Done.</h4></div></div>
    
    <p>${userNoteInput}</p>
    </div>`;

        navHeader.innerText = taskDate;

        taskDayInfo.appendChild(taskDiv);
        closeTaskPage();
        // renderCalender()
    }

}

let taskSubmitBtn = document.getElementById('create');

taskSubmitBtn.addEventListener('click', (event) => {

    event.preventDefault();
   
    
    renderTaskPage();



})


// renderTaskPage();




//hover behaviour for the div that is supposed to be the chheckbox
//kal isko bharna he






// calender behaviour when adding a task on a date
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


function renderCalendar(year, month, date) {
    // the year and monthh on whichh the task is added must be displayed in calender
    let taskDate = document.getElementById('task-date').value;
    let taskName = document.getElementById('task-name').value;
    if(!taskDate || !taskName){
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
    const month = currentDate.getMonth()+1;
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
        daysLoader(parseInt(yearChange.textContent),months.indexOf(currMonth.textContent))
    }
    else {
        for (let i = 0; i <= months.length; i++) {
            if (currMonth.textContent === months[i]) {
                currMonth.textContent = months[i - 1];
                daysLoader(parseInt(yearChange.textContent),months.indexOf(currMonth.textContent));
            }
        }
    }


}


lMonthArrow.addEventListener('click', () => {
    monthLeftbtn();
})



// function that will fill days in the table cells according to the current month and date that is set

function daysLoader(year, month){
    let numOfDays = 32 - new Date(year,month,32).getDate();
    let startOfMonth = new Date(year,month,1).getDay();

    let dateCell = document.querySelectorAll('#table-body tr td');
    let currentDay = 1;
    
    let date = new Date();
    let thismonth = date.getMonth();
    let thisyear = date.getFullYear();
    let todayDate = date.getDate();
   

    dateCell.forEach((cell,index) => {
        cell.textContent = "";
        cell.style.backgroundColor = 'aqua'
    });

    dateCell.forEach((cell,index) => {
        
        if(index >= startOfMonth && currentDay <= numOfDays){
            cell.textContent = currentDay;
            if(cell.textContent == todayDate && year == thisyear && month == thismonth){
                cell.style.backgroundColor = 'blue';
            }
            currentDay++;
        }
        else{
            cell.classList.add ('empty');
          
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


    if(currMonth.textContent === months[11]){
        let yearChange = parseInt(currYear.textContent) + 1;
        currYear.textContent = yearChange;
        currMonth.textContent = months[0];
        daysLoader(yearChange,months.indexOf(currMonth.textContent))
    }
    else{
        let presentYear = parseInt(currYear.textContent);
        changeMonth = months.indexOf(currMonth.textContent) + 1;
        currMonth.textContent = months[changeMonth];
        daysLoader(presentYear,months.indexOf(currMonth.textContent));
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

    daysLoader(changeYear-1, months.indexOf(month.textContent));
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

    daysLoader(parseInt(year.textContent),months.indexOf(month.textContent));
}

rYearArrow.addEventListener('click', () => {
    rightYearBtn();
})



//----------------------------CODE TO REMOVE THE ADDED TASK DIV WHEN USER CLICKS CHECKBOX------------------------------------------


let checkboxes = document.querySelectorAll('.checkbox');
let addedTasks = document.querySelectorAll('.task-added');
const taskDayInfo = document.getElementById('day-info');
function taskCompletedRemoval() {
    

    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('click', () => {
            
            const addedTask = addedTasks[index];
            taskDayInfo.addedTask.removeChild(addedTask);  
            
            
            
        })
    })
}

 taskCompletedRemoval();
// checkbox.addEventListener('click', () => {
    
// })

// console.log(checkbox)
// console.log(addedTask)

console.log('welcome');




//-----------------------------------------------------------------------------


const arr = [0,0,3,3,2,2,2,5,6];
function findOddRep(arr){
var hashMap = {};

for (const num of arr){
    if(hashMap[num]){
        hashMap[num]++;
    }
    else{
        hashMap[num] = 1;
    }
}

for (const num in hashMap){
    if(hashMap[num] % 2 !== 0){
        console.log(hashMap[num]);
    }
}
}



findOddRep(arr);