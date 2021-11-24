const uid = new ShortUniqueId();
// variables

let colors = ['lightPink', 'lightBlue', 'lightGreen', 'black'];
let k = 0;
let defaultColor = 'black';
let deleteMode = 0;

// elements

let Input = document.querySelector('.inputTask>textarea');
let mainDiv = document.querySelector('.main-container');
let colorPalette = document.querySelector('.color_palette_container');
let addContainer = document.querySelector('.add_container');
let delContainer = document.querySelector('.del_container');
let lockContainer = document.querySelector('.lock_container');
let unlockContainer = document.querySelector('.unlock_container');
let ModalColorContainer = document.querySelector('.modal_color_container');
let allColors = document.querySelectorAll('.Color');
let modal = document.querySelector('.modal');

// event listeners

Input.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && Input.value) {
        let id = uid();
        modal.style.display = 'none';
        createTask(id, Input.value, true);
        Input.value = "";
    }
});

addContainer.addEventListener('click', () => {

    modal.style.display = 'flex';

    addContainer.classList.add('active');
    delContainer.classList.remove('active');
    addContainer.classList.remove('active');
});

delContainer.addEventListener('click', () => {

    // addContainer.classList.remove('active');
    // delContainer.classList.add('active');

    deleteMode = !deleteMode;
    if (deleteMode) {
        delContainer.classList.add('active');
    }
    else {
        delContainer.classList.remove('active');
    }
});

lockContainer.addEventListener('click', () => {

    let allTasks = document.querySelectorAll('.task_main_container .task_text');
    // console.log(allTasks.length);

    for (let task of allTasks) {
        // console.log(task.classList);

        task.contentEditable = false;
    }

    lockContainer.classList.add('active');
    unlockContainer.classList.remove('active');
});

unlockContainer.addEventListener('click', () => {

    let allTasks = document.querySelectorAll('.task_main_container .task_text');
    for (let task of allTasks) {
        task.contentEditable = true;
    }

    unlockContainer.classList.add('active');
    lockContainer.classList.remove('active');
});

ModalColorContainer.addEventListener('click', (event)=>{
    let color = event.target;
    if(color != ModalColorContainer){

        defaultColor = color.classList[1];
        for(let currColor of allColors){
            currColor.classList.remove('selected');
        }

        color.classList.add('selected');
    }
});

// helpers

function createTask(taskId, taskDesp, addToLS) {

    let taskDiv = document.createElement('div');
    
    taskDiv.setAttribute('class', 'task_container');
    mainDiv.appendChild(taskDiv);

    taskDiv.innerHTML = `<div class="task_header"></div>
    <div class="task_main_container">
        <div class="task_id">
            <h3>#${taskId}</h3>
        </div>
        <div class="task_text" contenteditable = true >
            ${taskDesp}
        </div>
    </div>`;

    // add task to local storage

    if (addToLS) {
        let taskString = localStorage.getItem('tasks');
        let taskArr = JSON.parse(taskString) || [];
        let taskObj = {
            id: taskId,
            desp: taskDesp,
            color: defaultColor
        };

        taskArr.push(taskObj);
        localStorage.setItem('tasks', JSON.stringify(taskArr));
    }

    // change task header color

    let taskHeader = taskDiv.querySelector('.task_header');

    let currTaskID = taskHeader.parentNode.children[1].children[0].children[0].textContent;
    currTaskID = currTaskID.split('#')[1];

    let taskArr = JSON.parse(localStorage.getItem('tasks'));

    for (let i in taskArr) {
        if (taskArr[i].id == currTaskID) {
            defaultColor = taskArr[i].color;
            break;
        }
    }

    taskHeader.classList.add(defaultColor);

    taskHeader.addEventListener('click', () => {
        //   taskHeader.style.backgroundColor = colors[k];
        //   k = (k+1)%colors.length;

        // console.log(taskHeader.classList);
        let currColor = taskHeader.classList[1];
        let nextColor = colors[(colors.indexOf(currColor) + 1) % colors.length];
        taskHeader.classList.remove(currColor);
        taskHeader.classList.add(nextColor);

        // UPDATE new color in local storage

        let currTaskID = taskHeader.parentNode.children[1].children[0].children[0].textContent;
        currTaskID = currTaskID.split('#')[1];

        let taskArr = JSON.parse(localStorage.getItem('tasks'));

        for (let i in taskArr) {
            if (taskArr[i].id == currTaskID) {
                taskArr[i].color = nextColor;
                break;
            }
        }

        localStorage.setItem('tasks', JSON.stringify(taskArr));
    });

    taskDiv.addEventListener('click', () => {
        if (deleteMode) {
            taskDiv.remove();

            // remove from local storage as well

            let taskArr = JSON.parse(localStorage.getItem('tasks'));
            // console.log(taskArr);
            for (let i in taskArr) {
                let { id, desp, color } = taskArr[i];
                // console.log(id, taskId);
                if (id == taskId) {
                    taskArr.splice(i, 1);
                    break;
                }
            }

            localStorage.setItem('tasks', JSON.stringify(taskArr));
        }
    });

    let inputTask = taskDiv.querySelector('.task_main_container .task_text');
    // let content = inputTask.textContent;
    // console.log(content);

    let currID = inputTask.parentNode.children[0].children[0].textContent;
    currID = currID.split('#')[1];
    inputTask.addEventListener('blur', (event)=>{
        let content = inputTask.innerText;
        console.log(content);
        let taskArr = JSON.parse(localStorage.getItem('tasks'));

        console.log(taskId);
        for (let i in taskArr) {
            if (taskArr[i].id == currID) {
                taskArr[i].desp = content;
                break;
            }
        }

        localStorage.setItem('tasks', JSON.stringify(taskArr));
    });

}

// init function runs automatically when page loads
(function init(){
    let taskArr = JSON.parse(localStorage.getItem('tasks'));
    for (let task of taskArr) {
        let { id, desp, color } = task;
        // console.log(task);
        createTask(id, desp, false);
    }

    modal.style.display = 'none';
})();

// filtering cards on basis of header color

// let colorButtons = document.querySelectorAll('.color');
// for(let btn of colorButtons){
//     btn.addEventListener('click',()=>{
//         let filteredColor = btn.classList[1];
//         filterTasks(filteredColor);
//     })
// }

colorPalette.addEventListener('click', (event) => {
    let color = event.target.classList[1];
    console.log(color);
    if (color != undefined) filterTasks(color);
});

function filterTasks(filteredColor) {
    let allTaskCards = document.querySelectorAll('.task_container');
    for (let currTask of allTaskCards) {
        let tHeader = currTask.querySelector('.task_header');
        let headerColor = tHeader.classList[1];
        if (headerColor == filteredColor) {
            currTask.style.display = 'block';
        }
        else {
            currTask.style.display = 'none';
        }
    }
}
