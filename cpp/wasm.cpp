#include "ygo/common.h"
#include "ygo/ocgapi.h"
#include "emscripten.h"
#include "stdlib.h"

extern "C" {

typedef struct FileData {
    char* content;
    int length;
} FileData;

typedef void (*OCG_ScriptReader2)(void* payload, OCG_Duel duel, const char* name, FileData* data);

typedef struct handleReadFilePayload {
    void* payload;
    OCG_ScriptReader2 reader;
} handleReadFilePayload;

int handleReadFile(void* payload, OCG_Duel duel, const char* name) {
    handleReadFilePayload* func = static_cast<handleReadFilePayload*>(payload);
    FileData res;
    func->reader(func->payload, duel, name, &res);
    if (res.content != 0) {
        int result = OCG_LoadScript(duel, res.content, res.length, name);
        free(res.content);
        return result;
    }
    return OPERATION_FAIL;
}

typedef struct OCG_DuelOptions2 {
	uint32_t seed;
	uint64_t flags;
	OCG_Player team1;
	OCG_Player team2;
	OCG_DataReader cardReader;
	void* payload1; /* relayed to cardReader */
	OCG_ScriptReader2 scriptReader;
	void* payload2; /* relayed to scriptReader */
	OCG_LogHandler logHandler;
	void* payload3; /* relayed to errorHandler */
	OCG_DataReaderDone cardReaderDone;
	void* payload4; /* relayed to cardReaderDone */
} OCG_DuelOptions2;

void EMSCRIPTEN_KEEPALIVE ocgapiGetVersion(int* major, int* minor) {
    OCG_GetVersion(major, minor);
}

int EMSCRIPTEN_KEEPALIVE ocgapiCreateDuel(OCG_Duel* duel, OCG_DuelOptions2* options) {
    OCG_DuelOptions realOptions;
    realOptions.seed = options->seed;
    realOptions.flags = options->flags;
    realOptions.team1 = options->team1;
    realOptions.team2 = options->team2;
    realOptions.cardReader = options->cardReader;
    realOptions.payload1 = options->payload1;
    realOptions.logHandler = options->logHandler;
    realOptions.payload3 = options->payload3;
    realOptions.cardReaderDone = options->cardReaderDone;
    realOptions.payload4 = options->payload4;

    handleReadFilePayload* scriptReaderPayload = static_cast<handleReadFilePayload*>(malloc(sizeof(handleReadFilePayload)));
    scriptReaderPayload->payload = options->payload2;
    scriptReaderPayload->reader = options->scriptReader;
    realOptions.scriptReader = handleReadFile;
    realOptions.payload2 = scriptReaderPayload;

    return OCG_CreateDuel(duel, realOptions);
}

void EMSCRIPTEN_KEEPALIVE ocgapiDestroyDuel(OCG_Duel duel) {
    OCG_DestroyDuel(duel);
}

void EMSCRIPTEN_KEEPALIVE ocgapiDuelNewCard(OCG_Duel duel, OCG_NewCardInfo* info) {
    OCG_DuelNewCard(duel, *info);
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
    return OCG_DuelQuery(duel, length, *info);
}

void* EMSCRIPTEN_KEEPALIVE ocgapiDuelQueryLocation(OCG_Duel duel, uint32_t* length, OCG_QueryInfo* info) {
    return OCG_DuelQueryLocation(duel, length, *info);
}

void* EMSCRIPTEN_KEEPALIVE ocgapiDuelQueryField(OCG_Duel duel, uint32_t* length) {
    return OCG_DuelQueryField(duel, length);
}

}