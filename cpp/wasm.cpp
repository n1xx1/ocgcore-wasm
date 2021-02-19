#include "ygo/common.h"
#include "ygo/ocgapi.h"
#include "emscripten.h"

extern "C" {

EMSCRIPTEN_KEEPALIVE 
void ocgapiGetVersion(int* major, int* minor) {
    OCG_GetVersion(major, minor);
}

EMSCRIPTEN_KEEPALIVE 
int ocgapiCreateDuel(OCG_Duel* duel, OCG_DuelOptions* options) {
    return OCG_CreateDuel(duel, *options);
}

EMSCRIPTEN_KEEPALIVE 
void ocgapiDestroyDuel(OCG_Duel duel) {
    OCG_DestroyDuel(duel);
}

EMSCRIPTEN_KEEPALIVE 
void ocgapiDuelNewCard(OCG_Duel duel, OCG_NewCardInfo* info) {
    OCG_DuelNewCard(duel, *info);
}

EMSCRIPTEN_KEEPALIVE 
void ocgapiStartDuel(OCG_Duel duel) {
    OCG_StartDuel(duel);
}

EMSCRIPTEN_KEEPALIVE 
int ocgapiDuelProcess(OCG_Duel duel) {
    return OCG_DuelProcess(duel);
}

EMSCRIPTEN_KEEPALIVE 
void* ocgapiDuelGetMessage(OCG_Duel duel, uint32_t* length) {
    return OCG_DuelGetMessage(duel, length);
}

EMSCRIPTEN_KEEPALIVE 
void ocgapiDuelSetResponse(OCG_Duel duel, const void* buffer, uint32_t length) {
    OCG_DuelSetResponse(duel, buffer, length);
}

EMSCRIPTEN_KEEPALIVE 
int ocgapiLoadScript(OCG_Duel duel, const char* buffer, uint32_t length, const char* name) {
    return OCG_LoadScript(duel, buffer, length, name);
}

EMSCRIPTEN_KEEPALIVE 
uint32_t ocgapiDuelQueryCount(OCG_Duel duel, uint8_t team, uint32_t loc) {
    return OCG_DuelQueryCount(duel, team, loc);
}

EMSCRIPTEN_KEEPALIVE 
void* ocgapiDuelQuery(OCG_Duel duel, uint32_t* length, OCG_QueryInfo* info) {
    return OCG_DuelQuery(duel, length, *info);
}

EMSCRIPTEN_KEEPALIVE 
void* ocgapiDuelQueryLocation(OCG_Duel duel, uint32_t* length, OCG_QueryInfo* info) {
    return OCG_DuelQueryLocation(duel, length, *info);
}

EMSCRIPTEN_KEEPALIVE 
void* ocgapiDuelQueryField(OCG_Duel duel, uint32_t* length) {
    return OCG_DuelQueryField(duel, length);
}

}