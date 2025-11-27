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
    } else if (appType === 'msdos') {
        win.style.width = '500px';
        win.style.height = '350px';
        win.style.backgroundColor = 'black';
    } else if (appType === 'paint') {
        win.style.width = '500px';
        win.style.height = '400px';
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
            <div class="notepad-toolbar">
                <button onclick="notepadSave('${windowId}')">Save</button>
                <button onclick="notepadLoad('${windowId}')">Load</button>
            </div>
            <textarea class="notepad-area" id="notepad-area-${windowId}"></textarea>
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
        const homePageHTML = `
            data:text/html,
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; background-color: white; padding: 20px; text-align: center; }
                    h1 { color: #4285f4; }
                    .links { display: flex; flex-direction: column; align-items: center; margin-top: 20px; }
                    a { display: block; margin: 10px; font-size: 16px; color: blue; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <h1>Start Page</h1>
                <p>Welcome to the simulated internet.</p>
                <div class="links">
                    <a href="https://www.google.com/webhp?igu=1">Google Search</a>
                    <a href="https://www.wikipedia.org/">Wikipedia</a>
                    <a href="https://web.archive.org/">Internet Archive</a>
                    <a href="https://example.com/">Example Domain</a>
                    <a href="https://win98icons.alexmeub.com/">Windows 98 Icons</a>
                </div>
            </body>
            </html>
        `;
        content.innerHTML = `
            <div class="browser-toolbar">
                <button onclick="browserBack('${windowId}')">Back</button>
                <button onclick="browserForward('${windowId}')">Forward</button>
                <button onclick="browserReload('${windowId}')">Reload</button>
                <input type="text" id="browser-address-${windowId}" class="browser-address" value="Home" onkeydown="if(event.key === 'Enter') browserNavigate('${windowId}')">
                <button onclick="browserNavigate('${windowId}')">Go</button>
            </div>
            <iframe id="browser-frame-${windowId}" class="browser-frame" src="${homePageHTML.replace(/"/g, '&quot;')}"></iframe>
        `;
    } else if (appType === 'msdos') {
        content.innerHTML = `
            <div class="msdos-container" onclick="document.getElementById('msdos-input-${windowId}').focus()">
                <div id="msdos-output-${windowId}" class="msdos-output">Microsoft(R) Windows 95<br>(C)Copyright Microsoft Corp 1981-1996.<br><br>C:\\WINDOWS></div>
                <div class="msdos-input-line">
                    <input type="text" id="msdos-input-${windowId}" class="msdos-input" onkeydown="if(event.key === 'Enter') msdosCommand('${windowId}', this.value)">
                </div>
            </div>
        `;
        content.style.padding = '0';
        content.style.backgroundColor = 'black';
        content.style.color = 'white';
        content.style.height = '100%';
        setTimeout(() => document.getElementById(`msdos-input-${windowId}`).focus(), 0);
    } else if (appType === 'paint') {
        content.innerHTML = `
            <div class="paint-toolbar">
                <div class="paint-colors">
                    <div class="color-box" style="background: black" onclick="paintSetColor('${windowId}', 'black')"></div>
                    <div class="color-box" style="background: white" onclick="paintSetColor('${windowId}', 'white')"></div>
                    <div class="color-box" style="background: red" onclick="paintSetColor('${windowId}', 'red')"></div>
                    <div class="color-box" style="background: green" onclick="paintSetColor('${windowId}', 'green')"></div>
                    <div class="color-box" style="background: blue" onclick="paintSetColor('${windowId}', 'blue')"></div>
                    <div class="color-box" style="background: yellow" onclick="paintSetColor('${windowId}', 'yellow')"></div>
                </div>
                <button onclick="paintClear('${windowId}')">Clear</button>
            </div>
            <canvas id="paint-canvas-${windowId}" class="paint-canvas"></canvas>
        `;
        content.style.padding = '0';
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.height = '100%';

        // Need to initialize canvas after it's in the DOM, we can use setTimeout
        setTimeout(() => initPaint(windowId), 0);
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
            <div class="icon" ondblclick="openWindow('MS-DOS Prompt', 'msdos')">
                <div class="icon-img msdos-icon"></div>
                <div class="icon-text" style="color:black; text-shadow:none;">MS-DOS</div>
            </div>
             <div class="icon" ondblclick="openWindow('Paint', 'paint')">
                <div class="icon-img paint-icon"></div>
                <div class="icon-text" style="color:black; text-shadow:none;">Paint</div>
            </div>
        `;
        content.style.display = 'flex';
        content.style.flexDirection = 'row';
        content.style.justifyContent = 'flex-start';
        content.style.alignItems = 'flex-start';
        content.style.flexWrap = 'wrap';
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
        calcState: { current: '', op: null, prev: null }, // for calculator
        paintState: { color: 'black', isDrawing: false } // for paint
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
        if (url.includes('.') && !url.includes(' ')) {
            url = 'http://' + url;
        } else {
            url = 'https://www.google.com/search?igu=1&q=' + encodeURIComponent(url);
        }
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

// Notepad Logic
function notepadSave(windowId) {
    const area = document.getElementById(`notepad-area-${windowId}`);
    localStorage.setItem('notepad-content', area.value);
    alert('File Saved to LocalStorage!');
}

function notepadLoad(windowId) {
    const area = document.getElementById(`notepad-area-${windowId}`);
    const content = localStorage.getItem('notepad-content');
    if (content !== null) {
        area.value = content;
    } else {
        alert('No saved file found.');
    }
}

// MS-DOS Logic
function msdosCommand(windowId, cmd) {
    const output = document.getElementById(`msdos-output-${windowId}`);
    const input = document.getElementById(`msdos-input-${windowId}`);

    // Echo command
    output.innerHTML += `<div>C:\\WINDOWS&gt;${cmd}</div>`;

    const command = cmd.toLowerCase().trim();

    if (command === 'dir') {
        output.innerHTML += `
            <div> Volume in drive C is WINDOWS95</div>
            <div> Volume Serial Number is 1234-5678</div>
            <div> Directory of C:\\WINDOWS</div>
            <div><br></div>
            <div>COMMAND  COM        93,912  07-11-95  9:50a</div>
            <div>NOTEPAD  EXE        35,328  07-11-95  9:50a</div>
            <div>WIN      COM        24,258  07-11-95  9:50a</div>
            <div>SYSTEM       &lt;DIR&gt;        07-11-95  9:50a</div>
            <div>        4 file(s)        153,498 bytes</div>
            <div>        1 dir(s)     100,000,000 bytes free</div>
        `;
    } else if (command === 'ver') {
        output.innerHTML += `<div>Windows 95 [Version 4.00.950]</div>`;
    } else if (command === 'cls') {
        output.innerHTML = '';
    } else if (command === 'exit') {
        closeWindow(windowId);
        return; // Stop here
    } else if (command === 'help') {
        output.innerHTML += `<div>Supported commands: DIR, VER, CLS, EXIT, ECHO, HELP</div>`;
    } else if (command.startsWith('echo ')) {
        output.innerHTML += `<div>${cmd.substring(5)}</div>`;
    } else if (command === '') {
        // do nothing
    } else {
        output.innerHTML += `<div>Bad command or file name</div>`;
    }

    output.innerHTML += `<div><br>C:\\WINDOWS&gt;</div>`;

    // Scroll to bottom
    const container = output.parentElement;
    container.scrollTop = container.scrollHeight;

    input.value = '';
    input.focus();
}

// Paint Logic
function initPaint(windowId) {
    const canvas = document.getElementById(`paint-canvas-${windowId}`);
    if (!canvas) return; // Should not happen with setTimeout

    // Set canvas size to match container
    // We need to do this otherwise resolution is low
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black'; // default color

    let isDrawing = false;

    canvas.onmousedown = function(e) {
        isDrawing = true;
        ctx.beginPath();
        const rect = canvas.getBoundingClientRect();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    canvas.onmousemove = function(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    canvas.onmouseup = function() {
        isDrawing = false;
    };

    canvas.onmouseleave = function() {
        isDrawing = false;
    };

    // Store context reference if needed, but for now direct access is fine
    windows[windowId].paintCtx = ctx;
}

function paintSetColor(windowId, color) {
    const ctx = windows[windowId].paintCtx;
    if (ctx) {
        ctx.strokeStyle = color;
    }
}

function paintClear(windowId) {
    const canvas = document.getElementById(`paint-canvas-${windowId}`);
    const ctx = windows[windowId].paintCtx;
    if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
