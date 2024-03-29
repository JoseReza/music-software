let declaration = {}; // DECLARATIVE
let instructions = {}; // IMPERATIVE
let error = false;

const types = {
    DECLARATIVE: "DECLARATIVE",
    IMPERATIVE: "IMPERATIVE"
};
let type = types.DECLARATIVE;

let beatsPerMinute = 120;
let nc = 4;
let dc = 4;
let startTimeMs = 0;
let endTimeMs = undefined;

var timeLine = {
    beatsPerMinute,
    nc,
    dc,
    startTimeMs,
    endTimeMs,
    declaration,
    instructions,
    error,
    types,
    type: types.DECLARATIVE,
    play: (channel, instrument, note = "C4", duration = 1, volume = 100) => {

        if (channel < 0 || channel == undefined || typeof channel != "number") {
            console.error(`Channel parameter value ${channel} is not valid in play instruction`, "timeLine.play(channel|MANDATORY|NUMBER,instrument|MANDATORY|INSTANCE,note|OPTIONAL|C4,duration|OPTIONAL|NUMBER,volume|NUMBER);");
            timeLine.error = true;
            return false;
        }

        if (typeof instrument != "object") {
            console.error("Instrument parameter is not valid in play instruction", "timeLine.play(channel|MANDATORY|NUMBER,instrument|MANDATORY|INSTANCE,note|OPTIONAL|C4,duration|OPTIONAL|NUMBER,volume|NUMBER);");
            timeLine.error = true;
            return false;
        }

        if (!note || note == "") {
            console.error("Note parameter is not valid in play instruction", "timeLine.play(channel|MANDATORY|NUMBER,instrument|MANDATORY|INSTANCE,note|MANDATORY|C4,duration|OPTIONAL|NUMBER,volume|NUMBER);");
            timeLine.error = true;
            return false;
        }

        if (!timeLine.instructions) {
            timeLine.instructions = {}
        }

        if (!timeLine.instructions[channel]) {
            timeLine.instructions[channel] = [];
        }

        timeLine.instructions[channel].push({
            instrument,
            note,
            duration,
            volume
        });
    },
    wait: (channel, timeBeats = undefined) => {

        if (channel < 0 || channel == undefined || typeof channel != "number") {
            console.error(`Channel parameter value ${channel} is not valid in play instruction`, "timeLine.wait(channel|MANDATORY|NUMBER, timeBeats|MANDATORY|NUMBER);");
            timeLine.error = true;
            return false;
        }

        if (!timeBeats) {
            console.error("timeBeats parameter is undefined in wait instruction", "timeLine.wait(channel|MANDATORY|NUMBER, timeBeats|MANDATORY|NUMBER);");
            timeLine.error = true;
            return false;
        }

        if (!timeLine.instructions) {
            timeLine.instructions = {}
        }

        if (!timeLine.instructions[channel]) {
            timeLine.instructions[channel] = [];
        }

        timeLine.instructions[channel].push({
            wait: timeBeats
        });
    },
    print(message) {
        if (!message || message == "") {
            console.error("Message parameter is not valid in print instruction", "timeLine.print(message|MANDATORY|any);");
            timeLine.error = true;
            return false;
        }
        if (!timeLine.instructions) {
            timeLine.instructions = {}
        }

        if (!timeLine.instructions[0]) {
            timeLine.instructions[0] = [];
        }

        timeLine.instructions[0].push({
            print: message
        });
    }
};

var ms_timeLine_ = {
    resetVariables: () => {
        //Reset variables
        timeLine.type = undefined;
        timeLine.beatsPerMinute = undefined;
        timeLine.nc = undefined;
        timeLine.dc = undefined;
        timeLine.startTimeMs = undefined;
        timeLine.endTimeMs = undefined;
        timeLine.declaration = undefined;
        timeLine.instructions = undefined;
    },
    evaluateBeforeSetup: () => {
        //timeLine evaluations

        if (!Object.keys(timeLine.types).includes(timeLine.type)) {
            console.error(`timeLine.type: ${timeLine.type} is not allowed`);
            return false;
        }

        if (!timeLine.beatsPerMinute) {
            console.error(`timeLine.beatsPerMinute is ${timeLine.beatsPerMinute}`);
            return false;
        }

        if (!timeLine.nc) {
            console.error(`timeLine.nc is ${timeLine.nc}`);
            return false;
        }

        if (!timeLine.dc) {
            console.error(`timeLine.dc is ${timeLine.dc}`);
            return false;
        }

        if (!timeLine.beatsPerMinute) {
            console.error(`timeLine.beatsPerMinute is ${timeLine.beatsPerMinute}`);
            return false;
        }

        if (timeLine.startTimeMs < 0) {
            console.error(`timeLine.startTimeMs is ${timeLine.startTimeMs}`);
            return false;
        }

        if (!timeLine.endTimeMs <= timeLine.startTimeMs && timeLine.endTimeMs != undefined) {
            console.error(`timeLine.endTime is ${timeLine.endTimeMs} comparing to timeLine.startTime ${timeLine.startTimeMs} no logic`);
            return false;
        }

        if (timeLine.type == timeLine.types.IMPERATIVE) {
            timeLine.instructions = {};
        }
        return true;
    },
    evaluateAfterSetup: () => {
        if (timeLine.error) {
            timeLine.error = false;
            return false;
        }

        if (timeLine.type == timeLine.types.DECLARATIVE && (typeof timeLine.declaration != "object" || Array.isArray(timeLine.declaration))) {
            console.error("timeLine.declaration is not an object");
            return false;
        }
        console.info(`Compiling timeLine mode ${timeLine.type}`);
        return true;
    }
}