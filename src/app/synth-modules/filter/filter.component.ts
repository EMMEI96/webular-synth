import { Component, OnInit, Input } from '@angular/core';
import { ModulableComponent } from 'src/app/synth-modules/IModulable';
import { AudioContextManagerService } from 'src/app/services/audio-context-manager.service';
import { ModulableAudioParamWrapper, AudioParamDescriptor } from '../AudioParamWrapper';
import { ModuleComponent } from 'src/app/interfaces/module.component';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent extends ModulableComponent implements OnInit, ModuleComponent {
  // style: any =
  // {
  //     stroke: '#dfe3e9',
  //     strokeWidth: 3,
  //     fill: { color: '#fefefe', gradientType: 'linear', gradientStops: [[0, 1], [50, 0.9], [100, 1]] }
  // };
  // marks: any =
  // {
  //     colorRemaining: { color: 'grey', border: 'grey' },
  //     colorProgress: { color: '#00a4e1', border: '#00a4e1' },
  //     type: 'line',
  //     offset: '71%',
  //     thickness: 3,
  //     size: '6%',
  //     majorSize: '9%',
  //     majorInterval: 10,
  //     minorInterval: 2
  // };
  // labels: any =
  // {
  //     offset: '88%',
  //     step: 10,
  //     visible: true
  // };
  // progressBar: any =
  // {
  //     style: { fill: '#00a4e1', stroke: 'grey' },
  //     size: '9%',
  //     offset: '60%',
  //     background: { fill: 'grey', stroke: 'grey' }
  // };
  // pointer: any =
  // {
  //     type: 'arrow',
  //     style: { fill: '#00a4e1', stroke: 'grey' },
  //     size: '59%',
  //     offset: '49%',
  //     thickness: 5
  // };
  @Input() data: Object;
  private _filterNode: BiquadFilterNode;
  private _filterTypes: BiquadFilterType[]; // readonly
  private _modulableParameters: ModulableAudioParamWrapper[];

  public get filterTypes(): string[] {
    return this._filterTypes;
  }

  public get innerNode(): AudioNode {
    return this._filterNode;
  }
  public get modulableParameters(): ModulableAudioParamWrapper[] {
    return this._modulableParameters;
  }

  public constructor(private contextManager: AudioContextManagerService) {
    super();
    this._filterNode = this.contextManager.audioContext.createBiquadFilter();
    // how to extract a string[] from BiquadFilterType?!?!?! O.O
    this._filterTypes = ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass'];
    this._modulableParameters = [
      new ModulableAudioParamWrapper(
        new AudioParamDescriptor('frequency', 1, 5500, 22000, 'Hz'),
          this._filterNode.frequency
      ),
      new ModulableAudioParamWrapper(
        new AudioParamDescriptor('resonance', -100, 1, 100, ''),
          this._filterNode.Q
      )
    ];
  }

  public ngOnInit() {
  }

  public typeChange(eventArg: any): void {
    this._filterNode.type = eventArg.target.value;
  }
}