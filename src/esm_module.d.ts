declare module "@ocgcore" {
  export interface LibraryModule extends EmscriptenModule {
    ccall: typeof ccall;
    cwrap: typeof cwrap;
    setValue: typeof setValue;
    getValue: typeof getValue;
    UTF8ToString: typeof UTF8ToString;
    stringToUTF8: typeof stringToUTF8;
    addFunction: typeof addFunction;
    removeFunction: typeof removeFunction;
    lengthBytesUTF8: typeof lengthBytesUTF8;
    Asyncify: {
      handleAsync(f: () => PromiseLike<any>): any;
      handleSleep(wakeUp: () => void): void;
    };
  }

  const Module: EmscriptenModuleFactory<LibraryModule>;

  export default Module;
}
