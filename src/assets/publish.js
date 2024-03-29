
console.log("-->Publish");
let paramNameUserData = "userData";
let audioFileExtensions = ["wav", "mp3"];
let scriptFileExtensions = ["ms", "mse"];

let loading = {
    show: async () => {
        document.getElementById("divPublishing").style.display = "block";
    },
    hide: async () => {
        document.getElementById("divPublishing").style.display = "none";
    }
};

async function start() {
    let userDataString = localStorage.getItem(paramNameUserData);
    if (!userDataString) {
        alert("You cannot publish, first export your project and after init session in github");
        return false;
    }
}
start();

let inputProjectName = document.getElementById("inputProjectName");
let inputScript = document.getElementById("inputScript");
let inputAudio = document.getElementById("inputAudio");
let checkout = document.getElementById("checkout");
let paypalButtonContainer = document.getElementById("paypal-button-container");
checkout.addEventListener("click", async () => {
    let isReady = await checkInputs();
    if (isReady) {
        paypalButtonContainer.style.display = "block";
        inputProjectName.disabled = true;
        inputScript.disabled = true;
        inputAudio.disabled = true;
    }
});

async function checkInputs() {

    if (!inputProjectName.value || inputProjectName == "") {
        alert("Please enter a name for store and backup your music project");
        return false;
    }

    let userData = JSON.parse(localStorage.getItem("userData"));
    let projectName = `${userData.login}-${inputProjectName.value}`;
    while (projectName.includes(" ")) {
        projectName = projectName.replace(" ", "-");
    }
    while (projectName.includes("/")) {
        projectName = projectName.replace("/", "-");
    }

    //Get filesystem json
    let responseFilesystem = await fetch(`${SCRIPTS_FILESYSTEM_HOST}/filesystem.json`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    let responseFilesystemParsed = await responseFilesystem.json();
    console.log(responseFilesystemParsed);

    for(let file of responseFilesystemParsed){
        if(file.includes(projectName)){
            alert("That project name already exists for your user")
            return false;
        }else{
            inputProjectName.value = projectName;
        }
    }

    if (!inputAudio.files[0]) {
        alert("Please select the audio file .wav .mp3");
        return false;
    }

    if (!audioFileExtensions.includes(inputAudio.files[0].name.split(".")[inputAudio.files[0].name.split(".").length - 1])) {
        alert("Please just enter files with .wav .mp3 extensions in audio input");
        return false;
    }

    if (!inputScript.files[0]) {
        alert("Please enter the script file .ms .mse");
        return false;
    }

    if (!scriptFileExtensions.includes(inputScript.files[0].name.split(".")[inputScript.files[0].name.split(".").length - 1])) {
        alert("Please just enter files with .ms .mse extensions in script input");
        return false;
    }

    return true;
}

async function publishProject(data) {

    try {

        loading.show();
        let projectName = inputProjectName.value;

        const readerDataAudio = new FileReader();
        let fileDataAudio = await new Promise((resolve) => {
            readerDataAudio.onload = function (e) {
                const fileContent = e.target.result;
                resolve(fileContent);
            }
            readerDataAudio.readAsDataURL(inputAudio.files[0]);
        });

        const readerDataScript = new FileReader();
        let fileDataScript = await new Promise((resolve) => {
            readerDataScript.onload = function (e) {
                const fileContent = e.target.result;
                resolve(fileContent);
            }
            readerDataScript.readAsDataURL(inputScript.files[0]);
        });

        document.getElementById("divPublishing").innerHTML = `<h3>Uploading ${projectName} script file...</h3>`;

        //Save script
        let responseSaveScript = await fetch(`${SCRIPTS_FILESYSTEM_HOST}/save-file`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: JSON.parse(localStorage.getItem(paramNameUserData)),
                name: `${projectName}.${inputScript.files[0].name.split(".")[inputScript.files[0].name.split(".").length - 1]}`,
                content: fileDataScript
            })
        });
        let responseSaveScriptParsed = await responseSaveScript.json();
        console.log(responseSaveScriptParsed);

        document.getElementById("divPublishing").innerHTML = `<h3>Uploading ${projectName} audio file...</h3>`;

        //Save audio file
        let responseSaveAudio = await fetch(`${SCRIPTS_FILESYSTEM_HOST}/save-file`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: JSON.parse(localStorage.getItem(paramNameUserData)),
                name: `${projectName}.${inputAudio.files[0].name.split(".")[inputAudio.files[0].name.split(".").length - 1]}`,
                content: fileDataAudio
            })
        });
        let responseSaveAudioParsed = await responseSaveAudio.json();
        console.log(responseSaveAudioParsed);

        //Save information file
        let responseSaveInformation = await fetch(`${SCRIPTS_FILESYSTEM_HOST}/save-file`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: JSON.parse(localStorage.getItem(paramNameUserData)),
                name: `${projectName}.json`,
                content: btoa(encodeURIComponent(JSON.stringify(data)))
            })
        });
        let responseSaveInformationParsed = await responseSaveInformation.json();
        console.log(responseSaveInformationParsed);


        if (!responseSaveAudioParsed.return) {
            alert("Error uploading the audio file");
        }

        if (!responseSaveScriptParsed.return) {
            alert("Error uploading the script file")
        }

        console.log("data", data);

        document.getElementById("divPublishing").innerHTML = `<h3>Uploaded...</h3>`;
        setTimeout(loading.hide, 3000);
    } catch (error) {
        console.error(error);
    }
}

export function initPayPalButton() {

    let userDataString = localStorage.getItem(paramNameUserData);
    if (!userDataString) {
        alert("You cannot publish, first export your project and after init session in github");
        return false;
    }

    paypal.Buttons({
        style: {
            shape: 'rect',
            color: 'black',
            layout: 'vertical',
            label: 'pay',
            disableMaxWidth: true
        },

        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{ "description": "Publish music software project audio", "amount": { "currency_code": "USD", "value": 5 } }]
            });
        },

        onApprove: function (data, actions) {
            return actions.order.capture().then(function (orderData) {

                // Full available details
                console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));

                //Publish audio

                publishProject();

            });
        },

        onError: function (err) {
            console.log(err);
        }
    }).render('#paypal-button-container');
}
initPayPalButton();

