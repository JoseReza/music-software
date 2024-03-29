const divConsole = document.getElementById("divConsole");

let divInnerConsole = document.createElement("div");
divInnerConsole.style.margin = "1rem";
divInnerConsole.style.marginBottom = "2rem";
divConsole.appendChild(divInnerConsole);

async function setupConsole(console) {
    const consoleOldLog = console.log;
    console.log = function (message, ...args) {
        consoleOldLog(message, ...args);
        divConsole.scrollTop = divConsole.scrollHeight;
        try {
            let divMessage = document.createElement("div");
            divMessage.style.backgroundColor = "#444";
            divMessage.style.padding = "0.25rem";
            divMessage.innerHTML = typeof message == "string" ? message : JSON.stringify(message);
            divInnerConsole.appendChild(divMessage);
            for (let log of args) {
                console.log(log);
            }
        } catch { }
    };

    const consoleOldError = console.error;
    console.error = function (message, ...args) {
        consoleOldError(message, ...args);
        divConsole.scrollTop = divConsole.scrollHeight;
        try {
            let divMessage = document.createElement("div");
            divMessage.style.backgroundColor = "red";
            divMessage.style.borderRadius = "5px";
            divMessage.style.padding = "0.25rem";
            divMessage.innerHTML = message;
            divInnerConsole.appendChild(divMessage);
            for (let log of args) {
                console.error(log);
            }
        } catch { }
    };

    const consoleOldWarn = console.warn;
    console.warn = function (message, ...args) {
        consoleOldWarn(message, ...args);
        divConsole.scrollTop = divConsole.scrollHeight;
        try {
            let divMessage = document.createElement("div");
            divMessage.style.backgroundColor = "orange";
            divMessage.style.borderRadius = "5px";
            divMessage.style.padding = "0.25rem";
            divMessage.innerHTML = typeof message == "string" ? message : JSON.stringify(message);
            divInnerConsole.appendChild(divMessage);
            for (let log of args) {
                console.warn(log);
            }
        } catch { }
    };

    const consoleOldInfo = console.info;
    console.info = function (message, ...args) {
        consoleOldInfo(message, ...args);
        divConsole.scrollTop = divConsole.scrollHeight;
        try {
            let divMessage = document.createElement("div");
            divMessage.style.backgroundColor = "green";
            divMessage.style.borderRadius = "5px";
            divMessage.style.padding = "0.25rem";
            divMessage.innerHTML = typeof message == "string" ? message : JSON.stringify(message);
            divInnerConsole.appendChild(divMessage);
            for (let log of args) {
                console.info(log);
            }
        } catch { }
    };

    console.extraInfo = function (message, ...args) {
        consoleOldInfo(message, ...args);
        divConsole.scrollTop = divConsole.scrollHeight;
        try {
            let divMessage = document.createElement("div");
            divMessage.style.backgroundColor = "#2196f3";
            divMessage.style.borderRadius = "5px";
            divMessage.style.padding = "0.25rem";
            divMessage.innerHTML = typeof message == "string" ? message : JSON.stringify(message);
            divInnerConsole.appendChild(divMessage);
            for (let log of args) {
                console.info(log);
            }
        } catch { }
    };

    const consoleOldClear = console.clear;
    console.clear = function () {
        consoleOldClear();
        try {
            divInnerConsole.innerHTML = "";
        } catch { }
    };
}

setTimeout(() => setupConsole(console), 100);

setTimeout(() => {
    console.extraInfo(`Music software v${VERSION}`);
}, 100);
