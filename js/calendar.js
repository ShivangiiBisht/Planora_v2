// Calendar
let currentDate = new Date();
let tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
let sessions = JSON.parse(localStorage.getItem('studySessions')) || [];

// DOM elements
const calendarGrid = document.getElementById('calendarGrid');
const currentMonthDisplay = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
    setupEventListeners();
});

function setupEventListeners() {
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    currentMonthDisplay.textContent = new Date(year, month).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    calendarGrid.innerHTML = '';
    
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.textContent = day;
        header.style.fontWeight = '600';
        header.style.color = '#9ca3af';
        header.style.padding = '0.5rem';
        header.style.textAlign = 'center';
        calendarGrid.appendChild(header);
    });
    
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        calendarGrid.appendChild(createDayElement(day, month - 1, year, true));
    }
    
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
        calendarGrid.appendChild(
            createDayElement(day, month, year, false, isToday)
        );
    }
    
    const remainingDays = 42 - (firstDay + daysInMonth);
    for (let day = 1; day <= remainingDays; day++) {
        calendarGrid.appendChild(createDayElement(day, month + 1, year, true));
    }
}

function createDayElement(day, month, year, isOtherMonth, isToday = false) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    if (isOtherMonth) dayElement.classList.add('other-month');
    if (isToday) dayElement.classList.add('today');
    
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    dayElement.appendChild(dayNumber);

    /* ===== ADDITION START ===== */
    const tasksContainer = document.createElement('div');
    tasksContainer.className = 'day-tasks';
    dayElement.appendChild(tasksContainer);
    /* ===== ADDITION END ===== */
    
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const dayTasks = tasks.filter(task => task.dueDate === dateString);

    /* ===== ADDITION START ===== */
    dayTasks.slice(0, 3).forEach(task => {
        const taskBlock = document.createElement('div');
        taskBlock.className = 'task-block';
        taskBlock.textContent = task.title;
        taskBlock.title = task.title;
        tasksContainer.appendChild(taskBlock);
        if (task.priority) {
    taskBlock.classList.add(`task-priority-${task.priority}`);
    }
    });

    if (dayTasks.length > 3) {
        const more = document.createElement('div');
        more.className = 'more-tasks';
        more.textContent = `+${dayTasks.length - 3} more`;
        tasksContainer.appendChild(more);
    }
    /* ===== ADDITION END ===== */
    
    dayElement.addEventListener('click', () => {
        showDayDetails(dateString);
    });
    
    return dayElement;
}

function showDayDetails(dateString) {
    const dayTasks = tasks.filter(task => task.dueDate === dateString);
    const daySessions = sessions.filter(session => session.date === dateString);
    
    if (dayTasks.length === 0 && daySessions.length === 0) {
        alert('No tasks or sessions on this day.');
        return;
    }
    
    let message = `Details for ${new Date(dateString).toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
    })}:\n\n`;
    
    if (dayTasks.length > 0) {
        message += 'Tasks Due:\n';
        dayTasks.forEach(task => {
            message += `  • ${task.title} (${task.subject})\n`;
        });
        message += '\n';
    }
    
    if (daySessions.length > 0) {
        message += 'Study Sessions:\n';
        daySessions.forEach(session => {
            const hours = Math.floor(session.duration / 60);
            const minutes = session.duration % 60;
            message += `  • ${session.subject} - ${hours > 0 ? hours + 'h ' : ''}${minutes}m\n`;
        });
    }
    
    alert(message);
}
