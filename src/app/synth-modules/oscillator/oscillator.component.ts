import { Component, OnInit } from '@angular/core';
import { AudioContextManagerService } from 'src/app/services/audio-context-manager.service';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { Voice } from 'src/app/synth-modules/oscillator/voice';
import { MidiContextManagerService } from 'src/app/services/midi-context-manager.service';
import { IObserver } from 'src/app/system2/patterns/observer/IObserver';

@Component({
  selector: 'app-oscillator',
  templateUrl: './oscillator.component.html',
  styleUrls: ['./oscillator.component.scss']
})

export class OscillatorComponent implements OnInit, IObserver<[number, boolean, number, number]> {


  public c: AudioContext;
  public g: GainNode;
  public active_voices: any;
  public frequency: any;
  private waveForm: any;
  public midiData: any;
  public maxVelocity: number;
  public addSemitone: number;
  public finePitch: number;
  public active: number;

  constructor(private contextManager: AudioContextManagerService, private midiManager: MidiContextManagerService) {
    midiManager.attach(this);
   }

  update(arg: [number, boolean, number, number]): void {
    // throw new Error('Method not implemented.');
    console.log(arg);
    if (arg[1] === true) {
      this.noteOn(arg[2], arg[3]);
    } else {
      this.noteOff(arg[2]);
    }
  }

  ngOnInit() {
    this.active = 0;
    this.active_voices = [];
    this.c = this.contextManager.audioContext;
    this.g = this.c.createGain();
    // let active = 0;
    this.waveForm = 'sine';
    this.maxVelocity = 100;
    this.addSemitone = 0;
    this.finePitch = 0;
    // this.g.gain.setValueAtTime(0.5, this.c.currentTime);

    // this.midiManager.midiAccess();
    // this.midiFunction();
  }

  public midiFunction() {
    // prova;
  }

  public selectWaveform(data) {
    switch (data) {
      case (0): this.waveForm = 'sine'; this.active = 0; break;
      case (1): this.waveForm = 'square'; this.active = 1; break;
      case (2): this.waveForm = 'sawtooth'; this.active = 2; break;
      case (3): this.waveForm = 'triangle'; this.active = 3; break;
    }
  }



  public noteOn(midiNote, velocity) {
    this.g.gain.value = velocity / 127 * this.maxVelocity / 127;
    this.frequency = MidiContextManagerService.midiNoteToFrequency(midiNote + this.addSemitone) + this.finePitch;
    // 440 * Math.pow(2, ((midiNote + this.addSemitone) - 69) / 12) + this.finePitch;
    console.log(this.waveForm);
    const note = new Voice(this.c, this.g, this.waveForm, this.finePitch);
    this.active_voices[midiNote] = note;
    note.playNote(this.frequency);
  }

  public noteOff(midiNote) {
    this.active_voices[midiNote].stopNote();
    delete this.active_voices[midiNote];
  }
/*
  public checkMidi() {
    if (navigator['requestMIDIAccess']) {
      navigator['requestMIDIAccess']({
        sysex: false
      }).then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this));
    } else {
      alert('No MIDI support in your browser.');
    }
  }

  public onMIDISuccess(midiAccess) {
    console.log(midiAccess);
    let midi;
    midi = midiAccess;
    const inputs = midi.inputs.values();
    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
      console.log(input.value);
      input.value.onmidimessage = this.onMIDIMessage.bind(this);
    }
  }

  public onMIDIFailure(error) {
    console.log('No access to MIDI devices or your browser doesn\'t support WebMIDI API. Please use WebMIDIAPIShim ' + error);
  }

  public onMIDIMessage(event) {
    // console.log('message');

    this.midiData = event.data;
    const channel = this.midiData[0] & 0xf;
    const type = this.midiData[0] & 0xf0;
    const note = this.midiData[1];
    const velocity = this.midiData[2];

    switch (type) {
      case 144: // noteOn message
        this.noteOn(note, velocity);
        break;
      case 128: // noteOff message
        this.noteOff(note, velocity);
        break;
    }

  }
  */

  public onVolumeChange(value) {
    // console.log(value);
    this.maxVelocity = value;
    this.g.gain.value = this.maxVelocity / 127;
    // this.noteOn(66,this.maxVelocity);
  }

  public fineTuneChange(value) {
    this.finePitch = value;
    // console.log(this.finePitch);
  }

  public coarseTuneChange(value) {
    this.addSemitone = value;
    // console.log(this.addSemitone);
  }


}