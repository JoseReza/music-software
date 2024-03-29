
async function start() {

  let logo = document.getElementById("logo");

  var divEditor = ace.edit("divEditor");
  divEditor.setTheme("ace/theme/chaos");
  divEditor.session.setMode("ace/mode/javascript");
  divEditor.setOptions({
    fontSize: "14pt",
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
  });

  let paddingBar = document.getElementById("padding-bar");
  let interval;
  let cursorPosition = {
    x: 0,
    y: 0
  };
  document.addEventListener("mousemove", (event) => {
    cursorPosition.x = event.clientX;
    cursorPosition.y = event.clientY;
  });
  let functionInterval = () => {
    let percentage = Math.floor((cursorPosition.x / window.innerWidth) * 100) + 1;
    document.documentElement.style.setProperty('--left-width', `${percentage}%`);
    document.documentElement.style.setProperty('--right-width', `${100 - percentage - 5.5}%`);
  };
  paddingBar.addEventListener("mousedown", () => {
    interval = setInterval(functionInterval, 20);
    setTimeout(() => { clearInterval(interval); }, 1000);
  });

  let main = await (await fetch("./assets/main.js")).text();
  modules.main = main;
  divEditor.setValue(main);
  globalThis.toneJs.start();


  let divmodules = document.getElementById("divmodules");
  let rendermodules = () => {
    divmodules.innerHTML = '';
    for (let pageName in modules) {
      let divPage = document.createElement("div");
      divPage.classList.add("button");
      divPage.innerHTML = pageName;
      divmodules.appendChild(divPage);
      divPage.addEventListener("click", () => {
        modules[currentModule] = divEditor.getValue();
        divEditor.setValue(modules[pageName])
        currentModule = pageName;
      });
    }
    divEditor.$isFocused = true;
  }
  rendermodules();

  let divCreateModule = document.getElementById("divCreateModule");
  divCreateModule.addEventListener("click", () => {
    let moduleName = window.prompt("Module name");
    if (moduleName == undefined || moduleName == "") {
      alert("Please enter a valid module name");
      return;
    } else if (Object.keys(modules).includes(moduleName)) {
      alert("That module name already exists, please enter a valid module name");
      return;
    } else {
      modules[moduleName] = `console.log("${moduleName}");`;
      rendermodules();
    }
  });

  let divDeleteModule = document.getElementById("divDeleteModule");
  divDeleteModule.addEventListener("click", () => {
    if (currentModule != mainModuleName) {
      let confirmation = confirm(`Do you want to delete "${currentModule}" module ?`)
      if (confirmation) {
        delete modules[currentModule];
        currentModule = mainModuleName;
        rendermodules();
        divEditor.setValue(modules[mainModuleName]);
        divEditor.focus();
      }
    } else {
      alert(`You cannot delete ${mainModuleName} module`);
      return;
    }
  });

  let divExportProject = document.getElementById("divExportProject");
  divExportProject.addEventListener("click", () => project.export(modules, divEditor));

  let divImportProject = document.getElementById("divImportProject");
  divImportProject.addEventListener('click', async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = `application/${project.extension}`;
    const click = async function () {
      modules = await project.import(event);
      rendermodules();
      divEditor.setValue(modules[mainModuleName]);
      for (let module of Object.keys(modules)) {
        console.extraInfo(`Imported: ${module} module`)
      }
    }
    input.addEventListener("change", click);
    input.click();
  });

  let divIframeClose = document.getElementById("divIframeClose");
  let divIframe = document.getElementById("divIframe");
  let iframe = document.getElementById("iframe");

  iframe.addEventListener('load', function () {
    loading.secondary.hide();
  });

  let divSounds = document.getElementById("divSounds");
  divSounds.addEventListener('click', async () => {
    divIframe.style.display = "block";
    iframe.src = SOUNDS_FRONTEND_HOST;
    loading.secondary.show();
    setTimeout(() => {
      document.addEventListener('click', clickedOutside);
    }, 1000)
  });

  let divScripts = document.getElementById("divScripts");
  divScripts.addEventListener('click', async () => {
    divIframe.style.display = "block";
    iframe.src = SCRIPTS_FRONTEND_HOST;
    loading.secondary.show();
    setTimeout(() => {
      document.addEventListener('click', clickedOutside);
    }, 1000)
  });


  divIframeClose.addEventListener("click", async () => {
    document.removeEventListener("click", clickedOutside);
    divIframe.style.display = "none";
  });

  let divPublishProject = document.getElementById("divPublishProject");
  divPublishProject.addEventListener("click", async () => {
    let response = confirm("For publish project first export and obtain script.ms and audio.wav, do you want to export the project now?");
    if (response) {
      await project.export(modules, divEditor);
    }

    localStorage.setItem("modules", JSON.stringify(modules));

    let userDataString = localStorage.getItem("userData");
    if (!userDataString) {
      alert("You cannot publish, first export your project and after init session in github");
      return false;
    }
    iframe.src = PUBLISH_HOST;
    loading.secondary.show();
    divIframe.style.display = "block";
  });

  const clickedOutside = function (event) {
    if (!divIframe.contains(event.target)) {
      divIframe.style.display = "none";
      document.removeEventListener("click", clickedOutside);
    }
  }

  let state = false;
  let divPlayPause = document.getElementById("divPlayPause");
  divPlayPause.addEventListener("click", async function () {

    //keep going

    globalThis.toneJs.start();
    transport.clear();
    ms_timeLine_.resetVariables();

    if (!state) {

      await utils.wait(500);
      logo.classList.toggle("animation");
      try {
        modules[currentModule] = divEditor.getValue();
        for (let moduleName of Object.keys(modules)) {
          try {
            eval(modules[moduleName]);
          } catch (error) {
            console.error(error);
            return false;
          }
        }

        if (!ms_timeLine_.evaluateBeforeSetup()) {
          return false;
        }

        await setup();

        if (!ms_timeLine_.evaluateAfterSetup()) {
          return false;
        }


      } catch (error) {
        console.error(error);
      }

      let compiled = await transport.compile();
      if (compiled) {
        state = true;
        console.extraInfo(`Compiled: ${compiled.return}, beats: ${compiled.beats}, duration: ${Math.ceil((60000 / compiled.bpm) * compiled.beats)} ms`);

        transport.start();
        timeTranscurred = compiled.startTimeMs;

        console.log("Starting:");
        intervalTime = setInterval(() => {
          timeTranscurred += 100;
          if (timeTranscurred >= Math.ceil((60000 / compiled.bpm) * compiled.beats) + 1000) {
            transport.restart();
            state = false;
            clearInterval(intervalTime);
            divPlayPause.innerHTML = `<img src="./assets/images/play.svg" width="35">`;
          }
          if (compiled.endTimeMs != undefined && (compiled.endTimeMs / 1000) + 1000 <= (timeTranscurred / 1000)) {
            transport.restart();
            state = false;
            clearInterval(intervalTime);
            divPlayPause.innerHTML = `<img src="./assets/images/play.svg" width="35">`;
          }
        }, 100);
        divPlayPause.innerHTML = `<img src="./assets/images/pause.svg" width="35">`;
      }

    } else {
      transport.restart();
      state = false;
      clearInterval(intervalTime);
      divPlayPause.innerHTML = `<img src="./assets/images/play.svg" width="35">`;
    }
    logo.classList.toggle("animation");
  });

  loading.main.show();
  await utils.wait(1000);
  loading.main.hide();
}
start();