import * as toneJs from 'tone';
globalThis.toneJs = toneJs;

import * as truffleContract from '@truffle/contract';
globalThis.truffleContract = truffleContract;

import AudioRecorder from 'audio-recorder-polyfill';
globalThis.audioRecorder = AudioRecorder;

import * as WavEncoder from "wav-encoder";
globalThis.wavEncoder = WavEncoder;