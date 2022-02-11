// Built upon https://www.wasmtutor.com/webassembly-barebones-wasi

export function createPolyfill () {
  let moduleInstanceExports = null;

  const WASI_ESUCCESS = 0;
  const WASI_EBADF = 8;
  const WASI_EINVAL = 28;
  const WASI_ENOSYS = 52;
  const WASI_STDOUT_FILENO = 1;

  function setModuleInstance(instance) {
    moduleInstanceExports = instance.exports;
  }

  function getModuleMemoryDataView() {
    // call this any time you'll be reading or writing to a module's memory 
    // the returned DataView tends to be dissaociated with the module's memory buffer at the will of the WebAssembly engine 
    // cache the returned DataView at your own peril!!

    return new DataView(moduleInstanceExports?.memory.buffer);
  }

  function fd_prestat_get(fd, bufPtr) {
    return WASI_EBADF;
  }

  function fd_prestat_dir_name(fd, pathPtr, pathLen) {
    return WASI_EINVAL;
  }

  function environ_sizes_get(environCount, environBufSize) {
    const view = getModuleMemoryDataView();
    view.setUint32(environCount, 0, !0);
    view.setUint32(environBufSize, 0, !0);
    return WASI_ESUCCESS;
  }

  function environ_get(environ, environBuf) {
    return WASI_ESUCCESS;
  }

  function args_sizes_get(argc, argvBufSize) {
    const view = getModuleMemoryDataView();
    view.setUint32(argc, 0, !0);
    view.setUint32(argvBufSize, 0, !0);
    return WASI_ESUCCESS;
  }

  function args_get(argv, argvBuf) {
    return WASI_ESUCCESS;
  }

  function fd_fdstat_get(fd, bufPtr) {
    const view = getModuleMemoryDataView();
    view.setUint8(bufPtr, fd);
    view.setUint16(bufPtr + 2, 0, !0);
    view.setUint16(bufPtr + 4, 0, !0);
    function setBigUint64(byteOffset, value, littleEndian) {
      const lowWord = value;
      const highWord = 0;

      view.setUint32(littleEndian ? 0 : 4, lowWord, littleEndian);
      view.setUint32(littleEndian ? 4 : 0, highWord, littleEndian);
    }

    setBigUint64(bufPtr + 8, 0, !0);
    setBigUint64(bufPtr + 8 + 8, 0, !0);

    return WASI_ESUCCESS;
  }

  function fd_write(fd, iovs, iovsLen, nwritten) {
    let written = 0;
    const bufferBytes = [];
    const view = getModuleMemoryDataView();

    function getiovs(iovs, iovsLen) {
      // iovs* -> [iov, iov, ...]
      // __wasi_ciovec_t {
      //   void* buf,
      //   size_t buf_len,
      // }
      const buffers = Array.from({
        length: iovsLen
      }, function (_, i) {
        const ptr = iovs + i * 8;
        const buf = view.getUint32(ptr, !0);
        const bufLen = view.getUint32(ptr + 4, !0);

        return new Uint8Array(moduleInstanceExports.memory.buffer, buf, bufLen);
      });

      return buffers;
    }

    const buffers = getiovs(iovs, iovsLen);

    function writev(iov) {
      let b
      for (b = 0; b < iov.byteLength; b++) {
        bufferBytes.push(iov[b]);
      }

      written += b;
    }

    buffers.forEach(writev);
    if (fd === WASI_STDOUT_FILENO) console.log(String.fromCharCode.apply(null, bufferBytes));
    view.setUint32(nwritten, written, !0);
    return WASI_ESUCCESS;
  }

  function poll_oneoff(sin, sout, nsubscriptions, nevents) {
    return WASI_ENOSYS;
  }

  function proc_exit(rval) {
    return WASI_ENOSYS;
  }

  function fd_close(fd) {
    return WASI_ENOSYS;
  }

  function fd_seek(fd, offset, whence, newOffsetPtr) {
  }

  function fd_close(fd) {
    return WASI_ENOSYS;
  }

  return {
    setModuleInstance: setModuleInstance,
    environ_sizes_get: environ_sizes_get,
    args_sizes_get: args_sizes_get,
    fd_prestat_get: fd_prestat_get,
    fd_fdstat_get: fd_fdstat_get,
    fd_write: fd_write,
    fd_prestat_dir_name: fd_prestat_dir_name,
    environ_get: environ_get,
    args_get: args_get,
    poll_oneoff: poll_oneoff,
    proc_exit: proc_exit,
    fd_close: fd_close,
    fd_seek: fd_seek
  }
}

export async function importWasmModule (moduleData, wasiPolyfill) {
  const memory = new WebAssembly.Memory({
    initial: 2,
    maximum: 10
  });

  const moduleImports = {
    wasi_snapshot_preview1 : wasiPolyfill,
    wasi_unstable: wasiPolyfill,
    env: {
      is_web3os: true
    },
    js: {
      mem: memory
    }
  };

  let instance

  // let module = await (await fetch(moduleName)).arrayBuffer()
  // let module = null;

  // if (WebAssembly.compileStreaming) {
  //   module = await WebAssembly.compileStreaming(fetch(moduleName));
  // } else {
  //   const response = await fetch(moduleName);
  //   const buffer = await response.arrayBuffer();
  //   module = await WebAssembly.compile(buffer);
  // }

  // console.log({ module, moduleData, moduleImports })

  instance = await WebAssembly.instantiate(moduleData, moduleImports);

  wasiPolyfill.setModuleInstance(instance.instance);
  // instance.exports._start();

  return instance
}

export async function load (moduleData) {
  const wasiPolyfill = new createPolyfill()
  return await importWasmModule(moduleData, wasiPolyfill)
}
