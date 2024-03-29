let instruments = {};

const instrument = {
    import: async (name = undefined, instrumentPath = undefined) => {

        if (name == undefined) {
            console.error("instrument name is undefined");
            return;
        } else if (typeof name != "string") {
            console.error("instrument name is not a string");
            return;
        }

        let definitiveInstrumentPath = "";

        if (instrumentPath) {
            if (instrumentPath.includes("https://")) {
                definitiveInstrumentPath = instrumentPath;
            } else {
                definitiveInstrumentPath = `${SOUNDS_FILESYSTEM_HOST}/filesystem/${instrumentPath}`;
            }
        } else {
            definitiveInstrumentPath = `${SOUNDS_FILESYSTEM_HOST}/filesystem/${name}`;
        }

        console.log(`Importing instrument: ${name}`);

        let timeout = setTimeout(() => {
            console.error("Error importing instrument: " + definitiveInstrumentPath);
        }, 10000);

        let instance = new Promise((resolve) => {
            let instance = new globalThis.toneJs.Sampler({ "C4": definitiveInstrumentPath }, () => {
                console.info(`Instrument imported: ${name}`);
                clearTimeout(timeout);
                resolve(instance);
            })
        });


        let value = await instance;
        value.toDestination();

        instruments[name] = {
            name: name,
            instance: async () => { return instance },
            value: value
        };
        return instruments[name];
    },
    list: async () => {
        let response = await fetch(`${SOUNDS_FILESYSTEM_HOST}/filesystem.json`);
        let responseParsed = await response.json();
        console.log(responseParsed);
        let sounds = [];
        for (let sound of responseParsed) {
            let soundSplitted = sound.split("/");
            let soundString = `${soundSplitted[soundSplitted.length - 2]}/${soundSplitted[soundSplitted.length - 1]}`;
            sounds.push(`${soundSplitted[soundSplitted.length - 2]}/${soundSplitted[soundSplitted.length - 1]}`);
            console.log(soundString);
        }
        return sounds;
    }
}