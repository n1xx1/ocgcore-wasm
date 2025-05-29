#include "ygo/common.h"
#include "ygo/ocgapi.h"
#include "emscripten.h"
#include "stdlib.h"

#if WASM_USE_JSPI

EM_ASYNC_JS(void, ocgapiHandleDataReader, (void* payload, uint32_t code, OCG_CardData* data), {
    try {
        await Module["handleDataReader"](payload, code, data);
    } catch(e) {
        console.warn(e);
    }
})

EM_ASYNC_JS(int, ocgapiHandleScriptReader, (void* payload, OCG_Duel duel, const char* name), {
    try {
        const contents = await Module["handleScriptReader"](payload, duel, UTF8ToString(name));
        if (contents) {
            const contentLength = lengthBytesUTF8(contents);
            const contentPtr = _malloc(contentLength + 1);
            stringToUTF8(contents, contentPtr, contentLength + 1);

            try {
                return await _ocgapiLoadScript(duel, contentPtr, contentLength, name);
            } finally {
                _free(contentPtr);
            }
        }
        return 0;
    } catch(e) {
        console.warn(e);
        return 0;
    }
})

#else

EM_JS(void, ocgapiHandleDataReader, (void* payload, uint32_t code, OCG_CardData* data), {
    try {
        Module["handleDataReader"](payload, code, data);
    } catch(e) {
        console.warn(e);
    }
})

EM_JS(int, ocgapiHandleScriptReader, (void* payload, OCG_Duel duel, const char* name), {
    try {
        const contents = Module["handleScriptReader"](payload, duel, UTF8ToString(name));
        if (contents) {
            const contentLength = lengthBytesUTF8(contents);
            const contentPtr = _malloc(contentLength + 1);
            stringToUTF8(contents, contentPtr, contentLength + 1);

            try {
                return _ocgapiLoadScript(duel, contentPtr, contentLength, name);
            } finally {
                _free(contentPtr);
            }
        }
        return 0;
    } catch(e) {
        console.warn(e);
        return 0;
    }
})

#endif

EM_JS(void, ocgapiHandleLogHandler, (void* payload, const char* string, int type), {
    Module["handleLogHandler"](payload, UTF8ToString(string), type);
})

extern "C" {

void EMSCRIPTEN_KEEPALIVE ocgapiGetVersion(int* major, int* minor) {
    OCG_GetVersion(major, minor);
}

int EMSCRIPTEN_KEEPALIVE ocgapiCreateDuel(OCG_Duel* duel, OCG_DuelOptions options) {
    options.cardReader = ocgapiHandleDataReader;
    options.scriptReader = ocgapiHandleScriptReader;
    options.logHandler = ocgapiHandleLogHandler;
    options.cardReaderDone = [](void* payload, OCG_CardData* data) {
        if (data->setcodes != nullptr) {
            free(data->setcodes);
        }
    };
    return OCG_CreateDuel(duel, &options);
}

void EMSCRIPTEN_KEEPALIVE ocgapiDestroyDuel(OCG_Duel duel) {
    OCG_DestroyDuel(duel);
}

void EMSCRIPTEN_KEEPALIVE ocgapiDuelNewCard(OCG_Duel duel, OCG_NewCardInfo* info) {
    OCG_DuelNewCard(duel, info);
}

void EMSCRIPTEN_KEEPALIVE ocgapiStartDuel(OCG_Duel duel) {
    OCG_StartDuel(duel);
}

int EMSCRIPTEN_KEEPALIVE ocgapiDuelProcess(OCG_Duel duel) {
    return OCG_DuelProcess(duel);
}

void* EMSCRIPTEN_KEEPALIVE ocgapiDuelGetMessage(OCG_Duel duel, uint32_t* length) {
    return OCG_DuelGetMessage(duel, length);
}

void EMSCRIPTEN_KEEPALIVE ocgapiDuelSetResponse(OCG_Duel duel, const void* buffer, uint32_t length) {
    OCG_DuelSetResponse(duel, buffer, length);
}

int EMSCRIPTEN_KEEPALIVE ocgapiLoadScript(OCG_Duel duel, const char* buffer, uint32_t length, const char* name) {
    return OCG_LoadScript(duel, buffer, length, name);
}

uint32_t EMSCRIPTEN_KEEPALIVE ocgapiDuelQueryCount(OCG_Duel duel, uint8_t team, uint32_t loc) {
    return OCG_DuelQueryCount(duel, team, loc);
}

void* EMSCRIPTEN_KEEPALIVE ocgapiDuelQuery(OCG_Duel duel, uint32_t* length, OCG_QueryInfo* info) {
    return OCG_DuelQuery(duel, length, info);
}

void* EMSCRIPTEN_KEEPALIVE ocgapiDuelQueryLocation(OCG_Duel duel, uint32_t* length, OCG_QueryInfo* info) {
    return OCG_DuelQueryLocation(duel, length, info);
}

void* EMSCRIPTEN_KEEPALIVE ocgapiDuelQueryField(OCG_Duel duel, uint32_t* length) {
    return OCG_DuelQueryField(duel, length);
}

}