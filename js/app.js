// Data storage
let tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
let sessions = JSON.parse(localStorage.getItem('studySessions')) || [];

// DOM elements
const tasksTab = document.getElementById('tasksTab');
const sessionsTab = document.getElementById('sessionsTab');
const tasksList = document.getElementById('tasksList');
const sessionsList = document.getElementById('sessionsList');
const addTaskBtn = document.getElementById('addTaskBtn');
const addSessionBtn = document.getElementById('addSessionBtn');
const taskForm = document.getElementById('taskForm');
const sessionForm = document.getElementById('sessionForm');
const taskFormElement = document.getElementById('taskFormElement');
const sessionFormElement = document.getElementById('sessionFormElement');
const cancelTaskBtn = document.getElementById('cancelTaskBtn');
const cancelSessionBtn = document.getElementById('cancelSessionBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    renderTasks();
    renderSessions();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Task form
    addTaskBtn.addEventListener('click', () => showForm(taskForm));
    cancelTaskBtn.addEventListener('click', () => hideForm(taskForm));
    taskFormElement.addEventListener('submit', handleTaskSubmit);

    // Session form
    addSessionBtn.addEventListener('click', () => showForm(sessionForm));
    cancelSessionBtn.addEventListener('click', () => hideForm(sessionForm));
    sessionFormElement.addEventListener('submit', handleSessionSubmit);
}

// Tab switching
function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update panes
    tasksTab.classList.toggle('active', tabName === 'tasks');
    sessionsTab.classList.toggle('active', tabName === 'sessions');
}

// Form handling
function showForm(form) {
    form.classList.remove('hidden');
}

function hideForm(form) {
    form.classList.add('hidden');
}

// Task handling
function handleTaskSubmit(e) {
    e.preventDefault();
    
    const task = {
        id: Date.now().toString(),
        title: document.getElementById('taskTitle').value,
        subject: document.getElementById('taskSubject').value,
        dueDate: document.getElementById('taskDueDate').value,
        priority: document.getElementById('taskPriority').value,
        notes: document.getElementById('taskNotes').value,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    updateStats();
    taskFormElement.reset();
    hideForm(taskForm);
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

function renderTasks() {
    if (tasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📚</div>
                <h3>No tasks yet</h3>
                <p>Add your first task to get started!</p>
            </div>
        `;
        return;
    }

    tasksList.innerHTML = tasks.map(task => `
        <div class="task-card ${task.completed ? 'completed' : ''}">
            <div class="task-content">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask('${task.id}')">
                    ${task.completed ? '✓' : ''}
                </div>
                <div class="task-details">
                    <div class="task-header">
                        <div>
                            <h3 class="task-title ${task.completed ? 'completed' : ''}">${task.title}</h3>
                            <div class="task-badges">
                                <span class="task-subject">${task.subject}</span>
                                <span class="task-priority priority-${task.priority}">
                                    ${task.priority.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div class="task-actions">
                            <button class="btn-delete" onclick="deleteTask('${task.id}')">Delete</button>
                        </div>
                    </div>
                    ${task.notes ? `
                        <div class="task-notes">
                            <p>${task.notes}</p>
                        </div>
                    ` : ''}
                    <div class="task-footer">
                        <div class="task-due">
                            <span class="task-due-label">Due:</span>
                            <span class="task-due-date ${task.completed ? 'completed' : ''}">
                                ${formatDate(task.dueDate)}
                            </span>
                        </div>
                        <div class="task-status">
                            ${task.completed ? 'Completed' : 'In Progress'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Session handling
function handleSessionSubmit(e) {
    e.preventDefault();
    
    const session = {
        id: Date.now().toString(),
        subject: document.getElementById('sessionSubject').value,
        duration: parseInt(document.getElementById('sessionDuration').value),
        date: document.getElementById('sessionDate').value
    };

    sessions.push(session);
    saveSessions();
    renderSessions();
    updateStats();
    sessionFormElement.reset();
    document.getElementById('sessionDate').value = new Date().toISOString().split('T')[0];
    hideForm(sessionForm);
}

function deleteSession(id) {
    sessions = sessions.filter(s => s.id !== id);
    saveSessions();
    renderSessions();
    updateStats();
}

function renderSessions() {
    if (sessions.length === 0) {
        sessionsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⏱️</div>
                <h3>No sessions logged</h3>
                <p>Log your first study session to track progress!</p>
            </div>
        `;
        return;
    }

    sessionsList.innerHTML = sessions.map(session => {
        const hours = Math.floor(session.duration / 60);
        const minutes = session.duration % 60;
        
        return `
            <div class="session-card">
                <div class="session-content">
                    <div class="session-details">
                        <h3 class="session-title">${session.subject}</h3>
                        <div class="session-info">
                            <div class="session-info-item">
                                <span>⏱️</span>
                                <span class="session-duration">
                                    ${hours > 0 ? `${hours}h ` : ''}${minutes}m
                                </span>
                            </div>
                            <div class="session-info-item">
                                <span>📅</span>
                                <span class="session-date">
                                    ${formatDate(session.date, true)}
                                </span>
                            </div>
                            <div class="session-time">
                                ${formatTime(session.date)}
                            </div>
                        </div>
                    </div>
                    <button class="btn-delete" onclick="deleteSession('${session.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Stats
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalStudyTime = sessions.reduce((total, s) => total + s.duration, 0);
    const totalSessions = sessions.length;

    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('studyHours').textContent = `${(totalStudyTime / 60).toFixed(1)}h`;
    document.getElementById('totalSessions').textContent = totalSessions;
}

// Storage
function saveTasks() {
    localStorage.setItem('studyTasks', JSON.stringify(tasks));
}

function saveSessions() {
    localStorage.setItem('studySessions', JSON.stringify(sessions));
}

// Utilities
function formatDate(dateString, short = false) {
    const date = new Date(dateString);
    const options = short 
        ? { weekday: 'short', month: 'short', day: 'numeric' }
        : { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Initialize session date to today
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sessionDate').value = new Date().toISOString().split('T')[0];
});