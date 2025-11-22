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

function openWindow(title, appType = 'default') {
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

    // App specific styling/size
    if (appType === 'notepad') {
        win.style.width = '400px';
        win.style.height = '300px';
    } else if (appType === 'calculator') {
        win.style.width = '200px';
        win.style.minHeight = 'auto'; // allow it to shrink
    } else if (appType === 'browser') {
        win.style.width = '600px';
        win.style.height = '450px';
    }

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

    // Content Generation based on App Type
    if (appType === 'notepad') {
        content.innerHTML = `
            <textarea class="notepad-area"></textarea>
        `;
        content.style.padding = '0';
        content.style.height = '100%';
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
    } else if (appType === 'calculator') {
        content.innerHTML = `
            <div class="calc-display" id="calc-display-${windowId}">0</div>
            <div class="calc-buttons">
                <button onclick="calcInput('${windowId}', '7')">7</button>
                <button onclick="calcInput('${windowId}', '8')">8</button>
                <button onclick="calcInput('${windowId}', '9')">9</button>
                <button onclick="calcOp('${windowId}', '/')">/</button>

                <button onclick="calcInput('${windowId}', '4')">4</button>
                <button onclick="calcInput('${windowId}', '5')">5</button>
                <button onclick="calcInput('${windowId}', '6')">6</button>
                <button onclick="calcOp('${windowId}', '*')">*</button>

                <button onclick="calcInput('${windowId}', '1')">1</button>
                <button onclick="calcInput('${windowId}', '2')">2</button>
                <button onclick="calcInput('${windowId}', '3')">3</button>
                <button onclick="calcOp('${windowId}', '-')">-</button>

                <button onclick="calcInput('${windowId}', '0')">0</button>
                <button onclick="calcInput('${windowId}', '.')">.</button>
                <button onclick="calcResult('${windowId}')">=</button>
                <button onclick="calcOp('${windowId}', '+')">+</button>

                <button onclick="calcClear('${windowId}')" style="width: 100%; margin-top: 5px;">C</button>
            </div>
        `;
        content.style.overflow = 'hidden';
    } else if (appType === 'browser') {
        content.style.padding = '0';
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.innerHTML = `
            <div class="browser-toolbar">
                <button onclick="browserBack('${windowId}')">Back</button>
                <button onclick="browserForward('${windowId}')">Forward</button>
                <button onclick="browserReload('${windowId}')">Reload</button>
                <input type="text" id="browser-address-${windowId}" class="browser-address" value="about:blank" onkeydown="if(event.key === 'Enter') browserNavigate('${windowId}')">
                <button onclick="browserNavigate('${windowId}')">Go</button>
            </div>
            <iframe id="browser-frame-${windowId}" class="browser-frame" src="data:text/html,<h1>Google Chrome</h1><p>Welcome to the browser.</p>"></iframe>
        `;
    } else if (appType === 'programs') {
        content.innerHTML = `
            <div class="icon" ondblclick="openWindow('Notepad', 'notepad')">
                <div class="icon-img notepad-icon"></div>
                <div class="icon-text" style="color:black; text-shadow:none;">Notepad</div>
            </div>
            <div class="icon" ondblclick="openWindow('Calculator', 'calculator')">
                <div class="icon-img calc-icon"></div>
                <div class="icon-text" style="color:black; text-shadow:none;">Calculator</div>
            </div>
            <div class="icon" ondblclick="openWindow('Google Chrome', 'browser')">
                <div class="icon-img browser-icon"></div>
                <div class="icon-text" style="color:black; text-shadow:none;">Chrome</div>
            </div>
        `;
        content.style.display = 'flex';
        content.style.flexDirection = 'row';
        content.style.justifyContent = 'flex-start';
        content.style.alignItems = 'flex-start';
    } else if (title === 'My Computer') {
         content.innerHTML = `
            <div class="icon" ondblclick="alert('Access Denied')">
                <div class="icon-img drive-icon"></div>
                <div class="icon-text" style="color:black; text-shadow:none;">(C:)</div>
            </div>
            <div class="icon" ondblclick="openWindow('Control Panel', 'default')">
                <div class="icon-img control-panel-icon"></div>
                <div class="icon-text" style="color:black; text-shadow:none;">Control Panel</div>
            </div>
        `;
        content.style.display = 'flex';
        content.style.flexDirection = 'row';
    } else {
        content.innerHTML = `<p>Welcome to ${title}!</p><p>This is a simplistic clone.</p>`;
    }

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
        taskbarItem: taskbarItem,
        calcState: { current: '', op: null, prev: null } // for calculator
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

// Calculator Logic
function calcInput(windowId, val) {
    const display = document.getElementById(`calc-display-${windowId}`);
    const state = windows[windowId].calcState;
    if (state.reset) {
        state.current = '';
        state.reset = false;
    }
    state.current += val;
    display.textContent = state.current;
}

function calcOp(windowId, op) {
    const state = windows[windowId].calcState;
    state.prev = parseFloat(state.current);
    state.current = '';
    state.op = op;
}

function calcResult(windowId) {
    const display = document.getElementById(`calc-display-${windowId}`);
    const state = windows[windowId].calcState;
    const current = parseFloat(state.current);
    let res = 0;
    if (state.op === '+') res = state.prev + current;
    if (state.op === '-') res = state.prev - current;
    if (state.op === '*') res = state.prev * current;
    if (state.op === '/') res = state.prev / current;

    display.textContent = res;
    state.current = res.toString();
    state.prev = null;
    state.op = null;
    state.reset = true;
}

function calcClear(windowId) {
    const display = document.getElementById(`calc-display-${windowId}`);
    const state = windows[windowId].calcState;
    state.current = '';
    state.prev = null;
    state.op = null;
    display.textContent = '0';
}

// Browser Logic
function browserNavigate(windowId) {
    const addressInput = document.getElementById(`browser-address-${windowId}`);
    const frame = document.getElementById(`browser-frame-${windowId}`);
    let url = addressInput.value;

    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:') && !url.startsWith('about:')) {
        url = 'http://' + url;
    }

    frame.src = url;
    addressInput.value = url;
}

function browserReload(windowId) {
    const frame = document.getElementById(`browser-frame-${windowId}`);
    frame.src = frame.src;
}

function browserBack(windowId) {
    const frame = document.getElementById(`browser-frame-${windowId}`);
    frame.contentWindow.history.back();
}

function browserForward(windowId) {
    const frame = document.getElementById(`browser-frame-${windowId}`);
    frame.contentWindow.history.forward();
}
