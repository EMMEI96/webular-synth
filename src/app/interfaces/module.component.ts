export interface SynthModule {
    data: any;
    // loadPatch(): void;
    // savePatch(): any;

    // getInput(): AudioNode;
    getOutput(): AudioNode;
    connectToSynthNode(node: AudioNode);
    disconnectSynthModule(): void;
    // disconnectSynthModule();
}

// proposal
// export interface ModuleComponent<T> {
//     data: T;
//     loadPatch(): void;
//     savePatch(): void;
// }
