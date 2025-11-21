// Clock
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes} ${ampm}`;
}

setInterval(updateClock, 1000);
updateClock();

// Start Menu
function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    const startButton = document.getElementById('start-button');
    startMenu.classList.toggle('hidden');
    startButton.classList.toggle('active');
}

// Close start menu when clicking outside
document.addEventListener('click', function(event) {
    const startMenu = document.getElementById('start-menu');
    const startButton = document.getElementById('start-button');
    if (!startMenu.contains(event.target) && !startButton.contains(event.target) && !startMenu.classList.contains('hidden')) {
        startMenu.classList.add('hidden');
        startButton.classList.remove('active');
    }
});

// Window Management
let zIndexCounter = 10;
let windows = {}; // Store window references: id -> {element, taskbarItem}

function openWindow(title) {
    const desktop = document.getElementById('desktop');
    const taskbarItems = document.getElementById('taskbar-items');
    const windowId = 'win-' + Date.now();

    // Create window structure
    const win = document.createElement('div');
    win.className = 'window';
    win.id = windowId;
    win.style.zIndex = ++zIndexCounter;
    win.style.left = '50px';
    win.style.top = '50px';

    const titleBar = document.createElement('div');
    titleBar.className = 'window-title-bar';

    const titleText = document.createElement('span');
    titleText.textContent = title;

    const controls = document.createElement('div');
    controls.className = 'window-controls';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    closeBtn.onclick = function() {
        closeWindow(windowId);
    };

    controls.appendChild(closeBtn);
    titleBar.appendChild(titleText);
    titleBar.appendChild(controls);
    win.appendChild(titleBar);

    const content = document.createElement('div');
    content.className = 'window-content';
    content.innerHTML = `<p>Welcome to ${title}!</p><p>This is a simplistic clone.</p>`;
    win.appendChild(content);

    desktop.appendChild(win);

    // Create Taskbar Item
    const taskbarItem = document.createElement('div');
    taskbarItem.className = 'taskbar-item active';
    taskbarItem.textContent = title;
    taskbarItem.onclick = function() {
        toggleWindow(windowId);
    };
    taskbarItems.appendChild(taskbarItem);

    // Store reference
    windows[windowId] = {
        element: win,
        taskbarItem: taskbarItem
    };

    // Drag functionality
    makeDraggable(win, titleBar);

    // Bring to front on click
    win.addEventListener('mousedown', function() {
        focusWindow(windowId);
    });

    focusWindow(windowId);
}

function closeWindow(windowId) {
    if (windows[windowId]) {
        const win = windows[windowId].element;
        const taskbarItem = windows[windowId].taskbarItem;

        win.remove();
        taskbarItem.remove();

        delete windows[windowId];
    }
}

function toggleWindow(windowId) {
    const win = windows[windowId].element;

    if (win.style.display === 'none') {
        // Restore
        win.style.display = 'flex';
        focusWindow(windowId);
    } else {
        // If it's already focused, minimize it
        if (win.classList.contains('focused')) {
            win.style.display = 'none';
            windows[windowId].taskbarItem.classList.remove('active');
            win.classList.remove('focused');
        } else {
            // Otherwise, just bring it to front
            focusWindow(windowId);
        }
    }
}

function focusWindow(windowId) {
    const win = windows[windowId].element;
    const taskbarItem = windows[windowId].taskbarItem;

    // Update z-index
    win.style.zIndex = ++zIndexCounter;

    // Update visual states for all windows
    for (const id in windows) {
        const w = windows[id];
        if (id === windowId) {
            w.element.classList.remove('inactive');
            w.element.classList.add('focused');
            w.taskbarItem.classList.add('active');
        } else {
            w.element.classList.add('inactive');
            w.element.classList.remove('focused');
            w.taskbarItem.classList.remove('active');
        }
    }
}

function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;

        // Also focus the window
        // element.dispatchEvent(new Event('mousedown')); // This might be tricky, better to handle in the openWindow logic
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
