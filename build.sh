#!/bin/bash

set -e

FILES_YGO="./cpp/ygo/card.cpp ./cpp/ygo/duel.cpp ./cpp/ygo/effect.cpp ./cpp/ygo/field.cpp ./cpp/ygo/group.cpp ./cpp/ygo/interpreter.cpp ./cpp/ygo/libcard.cpp ./cpp/ygo/libdebug.cpp ./cpp/ygo/libduel.cpp ./cpp/ygo/libeffect.cpp ./cpp/ygo/libgroup.cpp ./cpp/ygo/ocgapi.cpp ./cpp/ygo/operations.cpp ./cpp/ygo/playerop.cpp ./cpp/ygo/processor.cpp ./cpp/ygo/scriptlib.cpp"
FILES_LUA="./cpp/lua/lapi.c ./cpp/lua/lauxlib.c ./cpp/lua/lbaselib.c ./cpp/lua/lcode.c ./cpp/lua/lcorolib.c ./cpp/lua/lctype.c ./cpp/lua/ldblib.c ./cpp/lua/ldebug.c ./cpp/lua/ldo.c ./cpp/lua/ldump.c ./cpp/lua/lfunc.c ./cpp/lua/lgc.c ./cpp/lua/linit.c ./cpp/lua/liolib.c ./cpp/lua/llex.c ./cpp/lua/lmathlib.c ./cpp/lua/lmem.c ./cpp/lua/loadlib.c ./cpp/lua/lobject.c ./cpp/lua/lopcodes.c ./cpp/lua/loslib.c ./cpp/lua/lparser.c ./cpp/lua/lstate.c ./cpp/lua/lstring.c ./cpp/lua/lstrlib.c ./cpp/lua/ltable.c ./cpp/lua/ltablib.c ./cpp/lua/ltm.c ./cpp/lua/lundump.c ./cpp/lua/lutf8lib.c ./cpp/lua/lvm.c ./cpp/lua/lzio.c"

mkdir -p lib

em++ \
    -s RESERVED_FUNCTION_POINTERS=10 \
    -s ASYNCIFY=1 -s MODULARIZE=1 -s ASSERTIONS=1 \
    -s ALLOW_MEMORY_GROWTH=1 -s MALLOC=emmalloc \
    -s DISABLE_EXCEPTION_CATCHING=0 \
    -s NO_EXIT_RUNTIME=1 \
    -s "ASYNCIFY_IMPORTS=['invokeFunction']" \
    -s "EXPORTED_FUNCTIONS=['_malloc', '_free', '_OCG_GetVersion', '_OCG_CreateDuel', '_OCG_DestroyDuel', '_OCG_DuelNewCard', '_OCG_StartDuel', '_OCG_DuelProcess', '_OCG_DuelGetMessage', '_OCG_DuelSetResponse', '_OCG_LoadScript', '_OCG_DuelQueryCount', '_OCG_DuelQuery', '_OCG_DuelQueryLocation', '_OCG_DuelQueryField']" \
    -s "EXPORTED_RUNTIME_METHODS=['Asyncify', 'ccall', 'cwrap', 'stackSave', 'stackRestore', 'stackAlloc', 'getValue', 'setValue', 'UTF8ToString', 'stringToUTF8', 'stackTrace', 'lengthBytesUTF8', 'addFunction', 'removeFunction']" \
    -Os -g0 --closure 1
    -I./cpp/lua \
    $FILES_LUA \
    $FILES_YGO \
    -o lib/ocgcore.mjs
