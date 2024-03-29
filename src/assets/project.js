const mainModuleName = "main";
let currentModule = mainModuleName;
let modules = {};

const project = {
    extensionAudio: "wav",
    extensionScript: "ms",
    export: async function (modules = {}, divEditor) {

        console.log("-->Generating");

        globalThis.toneJs.start();
        transport.restart();
        ms_timeLine_.resetVariables();

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
        await transport.encode(`${"audio"}.${project.extensionAudio}`);

        console.warn(`Exported audio file: ${"audio"}.${project.extensionAudio}`);

        let blob = new Blob([JSON.stringify(modules)], { type: 'application/json' });
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${"script"}.${this.extensionScript}`;
        document.body.appendChild(link);
        link.click();
        console.warn(`Exported script: ${"script"}.${project.extensionScript}`);
    },
    import: async function (event) {
        console.warn("Importing module");
        return await new Promise((resolve, reject) => {
            const fileInput = event.target;
            const file = fileInput.files[0];

            if (!file) {
                alert('Please select a file project');
                return;
            }

            const reader = new FileReader();

            reader.onload = function (e) {
                const jsonContent = e.target.result;
                try {
                    const jsonObject = JSON.parse(jsonContent);
                    resolve(jsonObject);
                } catch (error) {
                    alert('Error al analizar el archivo ms.');
                    console.error(error);
                    reject({ main: "//Error importing project" });
                }
            };

            reader.readAsText(file);
        });
    }
}