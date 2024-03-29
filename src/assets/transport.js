var divProgress = document.getElementById("divProgress");
var playDivProgress = (note = "") => {
    note = note.replace("#", "");
    note = note.replace("S", "");
    note = note.toLocaleUpperCase();

    let noteOctave = note.charCodeAt(1);
    let noteLetter = note.charCodeAt(0);

    let noteOctaveMagnitude = noteOctave - 48; // 48 --> 0 in ascii table // Octave
    let noteLetterMagnitude = noteLetter - 65; // 65 --> A in ascii table // Note

    let numberString = `${noteOctaveMagnitude}${noteLetterMagnitude}`;
    let value = (Number(numberString) / 77) * 100;
    divProgress.value = value;
}

var intervalTime;
var timeTranscurred = 0;

const transport = {
    compile: async () => {

        let timeLineObjectSequence = {};

        if (timeLine.type == timeLine.types.DECLARATIVE) {
            timeLineObjectSequence = timeLine.declaration;
        }

        if (timeLine.type == timeLine.types.IMPERATIVE) {
            timeLineObjectSequence = timeLine.instructions;
        }

        //console.log(timeLineObjectSequence);

        if (Object.keys(timeLineObjectSequence).length <= 0) {
            console.error(`timeLine not have instructions to compile`);
            console.extraInfo(`Example: `);
            timeLine.beatsPerMinute = 120;

            console.warn(`timeLine.type = timeLine.types.IMPERATIVE;`);
            console.warn(`timeLine.beatsPerMinute = 120;`);
            console.warn(`timeLine.nc = 4;`);
            console.warn(`timeLine.dc = 4;`);
            console.warn(`timeLine.playTimeLine = true;`);
            console.warn(`timeLine.startTimeMs = 0;`);
            console.warn(`timeLine.endTimeMs = undefined;`);
            console.warn(`async function setup(){let piano = await instrument.import("piano/C4.wav");\ntimeLine.play(piano, "C4", 1)}`);
            return false;
        }

        if (timeLine.beatsPerMinute == undefined) {
            console.error(`timeLine.beatsPerMinute parameter is undefined`);
            return false;
        } else if (typeof timeLine.beatsPerMinute != "number") {
            console.error(`timeLine.beatsPerMinute parameter is not a number`);
            return false;
        } else if (timeLine.beatsPerMinute <= 0) {
            console.error(`timeLine.beatsPerMinute parameter cannot be less or equal to zero`);
            return false;
        }

        globalThis.toneJs.Transport.bpm.value = timeLine.beatsPerMinute;

        if (timeLine.nc == undefined) {
            console.error(`nc [numerator compas] parameter is undefined`);
            return false;
        } else if (typeof timeLine.nc != "number") {
            console.error(`nc [numerator compas] parameter is not a number`);
            return false;
        } else if (timeLine.nc <= 0) {
            console.error(`nc [numerator compas] parameter cannot be less or equal to zero`);
            return false;
        }

        if (timeLine.nc > 32) {
            console.error(`nc [numerator compas] parameter cannot be grather than 32`);
            return false;
        }

        globalThis.toneJs.Transport.timeSignature = timeLine.nc;

        if (timeLine.dc == undefined) {
            console.error(`dc [denominator compas] parameter is undefined`);
            return false;
        } else if (typeof timeLine.dc != "number") {
            console.error(`dc [denominator compas] parameter is not a number`);
            return false;
        } else if (timeLine.dc <= 0) {
            console.error(`dc [numerator compas] parameter cannot be less or equal to zero`);
            return false;
        }

        if (timeLine.dc > 32) {
            console.error(`dc [denominator compas] parameter cannot be grather than 32`);
            return false;
        }

        if (typeof timeLineObjectSequence != "object") {
            console.error(`timeLine is not an object`);
            return false;
        } else if (Array.isArray(timeLineObjectSequence)) {
            console.error(`timeLine.declaration is an array, must be an object`);
            return false;
        }

        let instructions = [];
        let durationInBeats = 0;

        for (let channel of Object.keys(timeLineObjectSequence)) {

            let lastBeatScheduled = 0;
            let lastDuration = 0;
            let countBeats = 0;

            for (let [index, { beat, instrument, note, volume, duration, wait, print }] of timeLineObjectSequence[channel].entries()) {

                if (!print) {
                    //console.extraInfo(`Input--> ${beat}, ${instrument}, ${note}, ${duration}, ${volume}`);

                    let indexBeat = undefined;
                    if (beat == undefined) {
                        //console.warn(`Calculating beat parameter from Duration parameter ${_duration}`);

                        if (typeof lastDuration == "number") {
                            indexBeat = lastDuration;
                        } else if (typeof lastDuration == "string") {

                            let patternNumbers = /[+-]?([0-9]*[.])?[0-9]+/g;
                            let patternString = /[n+]/g;
                            let numbersArray = lastDuration.match(patternNumbers);
                            let numbersString = "";
                            let number = 0;

                            for (let value of numbersArray) {
                                numbersString += value;
                            }
                            number = Number(numbersString);

                            let wordsArray = lastDuration.match(patternString);
                            let wordsString = "";

                            for (let value of wordsArray) {
                                wordsString += value;
                            }

                            if (numbersArray == null) {
                                console.error(`Duration parameter not have a number ${index - 1} index of array`);
                                return false;
                            }

                            if (wordsArray == null) {
                                console.error(`Duration parameter not have n [note] or + [seconds] symbol in ${index - 1} index of array`);
                                return false;
                            }

                            if (wordsString == "n" || wordsString == "+") {
                                if (number != NaN) {

                                    switch (wordsString) {
                                        case "n": // 4n = 1/4 m, 5n = 1/5 m
                                            indexBeat = (nc / number) + lastBeatScheduled;
                                            break;
                                        case "+": // beatPerSecond = beatPerMinute/60
                                            indexBeat = ((timeLine.beatsPerMinute / 60) * number) + lastBeatScheduled;
                                            break;
                                    }

                                    //console.log(`calculate of beats: ${indexBeat}`);
                                } else {
                                    console.error(`Duration parameter is missing from numbers`);
                                    return false;
                                }
                            } else {
                                console.error(`Duration parameter is missing from "n", "+" letters`);
                                return false;
                            }
                        }
                    } else if (typeof beat == "number") {
                        indexBeat = beat;
                    }

                    if (wait != undefined) {
                        if (typeof wait == "number") {
                            let _wait = `${(dc / wait).toFixed(3)}n`;
                            lastDuration = _wait;
                            countBeats += indexBeat - lastBeatScheduled;
                            lastBeatScheduled = countBeats;
                            continue;
                        } else {
                            console.error(`Wait paramater is not a number`);
                            return false;
                        }
                    }

                    let _instrument = undefined;
                    if (typeof instrument == "object") {
                        _instrument = instrument;
                    } else if (instrument == undefined) {
                        console.error(`Instrument parameter is undefined in ${index} index of array`);
                        return false;
                    }
                    else if (!Object.keys(instruments).includes(instrument)) {
                        console.error(`Instrument ${instrument} is not included in library in ${index} index of array`);
                        return false;
                    } else {
                        _instrument = instruments[instrument]
                    }

                    let _note = undefined;
                    if (note == undefined) {
                        console.error(`Note parameter is undefined in ${index} index of array`);
                        return false;
                    } else if (Array.isArray(note)) {                                               //Play chords // REPRODUCCION Y SEGURIDAD DE ACORDES

                        for (let jindex in note) {
                            if (typeof note[jindex] != "string") {
                                console.error(`SUB Note parameter is not a string in ${index} index of array`);
                                return false;
                            } else if (note[jindex] == "") {
                                note[jindex] = "C5"
                            }
                        }

                        _note = note;

                    } else if (typeof note != "string") {
                        console.error(`Note parameter is not a string in ${index} index of array`);
                        return false;
                    } else if (note == "") {
                        _note = "C5"
                    } else {
                        _note = note;
                    }



                    let _duration = undefined;
                    if (duration == undefined) {
                        console.error(`Duration parameter is undefined in ${index} index of array`);
                        return false;
                    } else if (typeof duration != "string" && typeof duration != "number") {
                        console.error(`Duration parameter is not a string or number in ${index} index of array`);
                        return false;
                    } else if (typeof duration == "number") {
                        _duration = `${(dc / duration).toFixed(3)}n`;
                    }
                    else if (typeof duration == "string") {
                        let patternNumbers = /[+-]?([0-9]*[.])?[0-9]+/g;
                        let patternString = /[n+]/g;
                        if (duration.match(patternNumbers) == null) {
                            console.error(`Duration parameter not have a number in ${index} index of array`);
                            return false;
                        }
                        if (duration.match(patternString) == null) {
                            console.error(`Duration parameter not have n [note] or + [seconds] symbol in ${index} index of array`);
                            return false;
                        }
                        _duration = duration;
                    } else {
                        _duration = "1n";
                    }

                    let _volume = undefined;
                    if (typeof volume != "number" && typeof volume != "undefined") {
                        console.error(`Volume parameter is not a a number in ${index} index of array`);
                        return false;
                    } else if (typeof volume == "number" && volume < 0) {
                        console.error(`Volume parameter cannot be less tha zero in ${index} index of array`);
                        return false;
                    }

                    if (volume == undefined) {
                        _volume = 100;
                    } else {
                        _volume = volume;
                    }

                    //console.extraInfo(`Compiled: Beat ${indexBeat.toFixed(2)}, ${_instrument.name}, ${_note}, ${_duration}, ${_volume}`);
                    instructions.push({ beat: indexBeat, instrument: _instrument, note: _note, volume: _volume, duration: _duration, index: index });
                    //console.log(`${countBeats}, ${indexBeat}, ${lastBeatScheduled}`);
                    countBeats += (indexBeat - lastBeatScheduled);
                    const currentBeat = countBeats;
                    //console.log(countBeats);
                    globalThis.toneJs.Transport.schedule(function (time) {
                        console.log(`timeMs : ${Math.ceil((60 / timeLine.beatsPerMinute) * currentBeat * 1000)}:, ${_instrument.name}, ${_note}`);
                        _instrument.value.triggerAttackRelease(_note, _duration, time, _volume / 100);
                        playDivProgress(_note);
                    }, `+${(countBeats * (60 / globalThis.toneJs.Transport.bpm.value))}`);

                    //console.log(`${Math.floor(countBeats / globalThis.toneJs.Transport.timeSignature)}:${countBeats % globalThis.toneJs.Transport.timeSignature}`);

                    lastBeatScheduled = countBeats;
                    lastDuration = _duration;


                    //lastBeatScheduled > durationInBeats
                    if (lastBeatScheduled > durationInBeats) {
                        durationInBeats = lastBeatScheduled;
                    }

                } else {
                    globalThis.toneJs.Transport.schedule(function (time) {
                        console.extraInfo(`Print: ${print}`);
                    }, `+${(countBeats * (60 / globalThis.toneJs.Transport.bpm.value))}`);
                }
            }

        }

        if (timeLine.startTimeMs < 0 || timeLine.startTimeMs == undefined) {
            console.error(`timeLine.startTimeMs is not a number greater or equal to zero`);
            return false;
        }
        if (timeLine.endTimeMs <= 0) {
            console.error(`timeLine.endTimeMs is not a number greater than zero`);
            return false;
        }

        if (timeLine.endTimeMs != undefined && timeLine.endTimeMs <= timeLine.startTimeMs) {
            console.error(`timeLine.endTimeMs cannot be less or equal to timeLine.startTimeMs`);
            return false;
        }

        let startBeat = Math.trunc((globalThis.toneJs.Transport.bpm.value / 60000) * timeLine.startTimeMs);
        globalThis.toneJs.Transport.position = timeLine.startTimeMs / 1000;

        //console.log(startBeat, timeLine.startTimeMs, instructions);

        let endBeat = 0;

        if (timeLine.endTimeMs == undefined) {
            endBeat = Math.trunc(durationInBeats + 1);
        } else {
            endBeat = Math.trunc((globalThis.toneJs.Transport.bpm.value / 60000) * timeLine.endTimeMs);
        }

        //console.log(instructions);

        return {
            return: true,
            instructions: instructions,
            bpm: globalThis.toneJs.Transport.bpm.value,
            nc: nc,
            dc: dc,
            beats: Math.trunc(durationInBeats + 1),
            startBeat: startBeat,
            endBeat: endBeat,
            startTimeMs: timeLine.startTimeMs,
            endTimeMs: timeLine.endTimeMs,
        };
    },
    encode: async (audioName = "audio.wav") => {

        return new Promise(async (resolve, reject) => {

            let compile = await transport.compile();
            //console.log(compile);
            if (compile.return) {

                loading.generatingMain.show();
                let recorder = new globalThis.toneJs.Recorder();
                let instrumentsNames = compile.instructions.map((instruction) => instruction.instrument.name);      // Catch all instruments names used in timeLine for all instructions
                instrumentsNames = Array.from(new Set(instrumentsNames));                                           // Delete repeated instruments names

                let instrumentsInstances = {};
                for (let instrumentName of instrumentsNames) {
                    instrumentsInstances[instrumentName] = await instruments[instrumentName].instance();            // Invoke the instrument instance
                    instrumentsInstances[instrumentName].connect(recorder);                                         // Connect every instrument to recorder
                }

                const synth = new globalThis.toneJs.Synth();
                synth.triggerAttackRelease("C4", "1n", "0", 0);
                globalThis.toneJs.start();

                await utils.wait(500);
                recorder.start();


                for (let instruction of compile.instructions) {
                    if (instruction.beat >= compile.startBeat && instruction.beat < compile.endBeat) {
                        instrumentsInstances[instruction.instrument.name].triggerAttackRelease(
                            instruction.note,
                            instruction.duration,
                            `+${((instruction.beat - compile.startBeat) * (60 / compile.bpm))}`,
                            instruction.volume / 100
                        );
                    }
                }

                let count = 0;
                let step = 100;
                let percentage = 0;
                let interval = setInterval(() => {
                    percentage = Math.trunc((count / (Math.ceil((60000 / compile.bpm) * (compile.endBeat - compile.startBeat)))) * 100);
                    if (percentage > 100) {
                        percentage = 100;
                    }
                    loading.generatingMain.update(percentage);
                    count += step;
                }, step);

                setTimeout(async () => {

                    const recording = await recorder.stop();

                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const arrayBuffer = await recording.arrayBuffer();
                    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

                    globalThis.wavEncoder.encode({
                        sampleRate: audioBuffer.sampleRate,
                        channelData: [audioBuffer.getChannelData(0)]
                    }).then((wavBuffer) => {

                        const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
                        const wavUrl = URL.createObjectURL(wavBlob);

                        clearInterval(interval);
                        loading.generatingMain.update(100);

                        const downloadLink = document.createElement('a');
                        downloadLink.href = wavUrl;
                        downloadLink.download = audioName;
                        downloadLink.click();

                        resolve();
                        loading.generatingMain.hide();

                    });

                }, (compile.endBeat - compile.startBeat) * Math.ceil((60000 / compile.bpm)) + 2500);

                transport.stop();
                transport.clear();
            }
        });
    },
    start: async () => {
        await globalThis.toneJs.Transport.start();
    },
    stop: () => {
        globalThis.toneJs.Transport.stop();
    },
    clear: () => {
        globalThis.toneJs.Transport.position = 0;
        globalThis.toneJs.Transport.cancel();
    },
    restart: async () => {
        timeTranscurred = 0;
        transport.stop();
        transport.clear();
    }
}

var studyVariable = undefined;