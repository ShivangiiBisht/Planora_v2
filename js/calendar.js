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
    
    // Update month display
    currentMonthDisplay.textContent = new Date(year, month).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    calendarGrid.innerHTML = '';
    
    // Add day headers
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
    
    // Add previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dayElement = createDayElement(day, month - 1, year, true);
        calendarGrid.appendChild(dayElement);
    }
    
    // Add current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() && 
                       month === today.getMonth() && 
                       year === today.getFullYear();
        const dayElement = createDayElement(day, month, year, false, isToday);
        calendarGrid.appendChild(dayElement);
    }
    
    // Add next month days
    const remainingDays = 42 - (firstDay + daysInMonth); // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
        const dayElement = createDayElement(day, month + 1, year, true);
        calendarGrid.appendChild(dayElement);
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
    
    // Check for tasks and sessions on this date
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasTasks = tasks.some(task => task.dueDate === dateString);
    const hasSessions = sessions.some(session => session.date === dateString);
    
    if (hasTasks || hasSessions) {
        const indicators = document.createElement('div');
        indicators.className = 'day-indicators';
        
        if (hasTasks) {
            const taskIndicator = document.createElement('div');
            taskIndicator.className = 'indicator task';
            indicators.appendChild(taskIndicator);
        }
        
        if (hasSessions) {
            const sessionIndicator = document.createElement('div');
            sessionIndicator.className = 'indicator session';
            indicators.appendChild(sessionIndicator);
        }
        
        dayElement.appendChild(indicators);
    }
    
    // Add click event to show details
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