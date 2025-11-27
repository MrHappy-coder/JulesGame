# Windows 95 Clone

A simplistic clone of the Windows 95 operating system interface built with HTML, CSS, and JavaScript.

## Features

-   **Desktop**: Iconic teal background with "My Computer", "Recycle Bin", "Notepad", "Google Chrome", "MS-DOS Prompt", and "Paint" icons.
-   **Window Management**: Draggable windows that can be minimized and restored.
-   **Taskbar**: Functional Start button, clock, and window switcher.
-   **Start Menu**: Functional menu launching apps.
-   **Apps**:
    -   **Notepad**: A simple text editor with simulated Save/Load functionality (using LocalStorage).
    -   **Calculator**: A functional arithmetic calculator.
    -   **Google Chrome**: A simulated web browser with a "Start Page" portal and working Google Search integration.
    -   **MS-DOS Prompt**: A simulated command-line interface supporting commands like `dir`, `ver`, `cls`, `echo`, and `help`.
    -   **Paint**: A basic drawing application with a color palette and canvas.

## How to Run

There are two ways to run this project:

### 1. Open directly in browser
Simply double-click the `index.html` file to open it in your default web browser.

### 2. Use a local server (Recommended)
If you have Python installed, you can run a simple HTTP server:

1.  Open a terminal/command prompt in the project folder.
2.  Run the following command:
    ```bash
    python3 -m http.server
    ```
3.  Open your browser and go to `http://localhost:8000`.
