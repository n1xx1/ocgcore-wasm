#!/bin/bash

set -e

FILES_YGO="./cpp/ygo/card.cpp ./cpp/ygo/duel.cpp ./cpp/ygo/effect.cpp ./cpp/ygo/field.cpp ./cpp/ygo/interpreter.cpp ./cpp/ygo/libcard.cpp ./cpp/ygo/libdebug.cpp ./cpp/ygo/libduel.cpp ./cpp/ygo/libeffect.cpp ./cpp/ygo/libgroup.cpp ./cpp/ygo/ocgapi.cpp ./cpp/ygo/operations.cpp ./cpp/ygo/playerop.cpp ./cpp/ygo/processor_visit.cpp ./cpp/ygo/processor.cpp ./cpp/ygo/scriptlib.cpp"
FILES_LUA="./cpp/ygo/lua/src/lapi.c ./cpp/ygo/lua/src/lauxlib.c ./cpp/ygo/lua/src/lbaselib.c ./cpp/ygo/lua/src/lcode.c ./cpp/ygo/lua/src/lcorolib.c ./cpp/ygo/lua/src/lctype.c ./cpp/ygo/lua/src/ldblib.c ./cpp/ygo/lua/src/ldebug.c ./cpp/ygo/lua/src/ldo.c ./cpp/ygo/lua/src/ldump.c ./cpp/ygo/lua/src/lfunc.c ./cpp/ygo/lua/src/lgc.c ./cpp/ygo/lua/src/linit.c ./cpp/ygo/lua/src/liolib.c ./cpp/ygo/lua/src/llex.c ./cpp/ygo/lua/src/lmathlib.c ./cpp/ygo/lua/src/lmem.c ./cpp/ygo/lua/src/loadlib.c ./cpp/ygo/lua/src/lobject.c ./cpp/ygo/lua/src/lopcodes.c ./cpp/ygo/lua/src/loslib.c ./cpp/ygo/lua/src/lparser.c ./cpp/ygo/lua/src/lstate.c ./cpp/ygo/lua/src/lstring.c ./cpp/ygo/lua/src/lstrlib.c ./cpp/ygo/lua/src/ltable.c ./cpp/ygo/lua/src/ltablib.c ./cpp/ygo/lua/src/ltm.c ./cpp/ygo/lua/src/lundump.c ./cpp/ygo/lua/src/lutf8lib.c ./cpp/ygo/lua/src/lvm.c ./cpp/ygo/lua/src/lzio.c"

mkdir -p lib

# debug args: -sSTACK_OVERFLOW_CHECK=1 -sSAFE_HEAP=1 -O1 -g3 -sASSERTIONS=1

em++ \
  -Os -g0 --closure 1 -sASSERTIONS=0 \
  -sJSPI -sMODULARIZE=1 -DWASM_USE_JSPI -sFILESYSTEM=0 -sALLOW_MEMORY_GROWTH=1 -sMALLOC=emmalloc \
  -fwasm-exceptions -sSUPPORT_LONGJMP=wasm \
  -fno-rtti \
  -sNO_EXIT_RUNTIME=1 -sIMPORTED_MEMORY \
  -sJSPI_EXPORTS=ocgapiDuelNewCard,ocgapiCreateDuel,ocgapiStartDuel,ocgapiDuelProcess,ocgapiLoadScript \
  -sENVIRONMENT=web \
  -sEXPORTED_FUNCTIONS=['_malloc','_free'] \
  -sEXPORTED_RUNTIME_METHODS=['stackSave','stackRestore','stackAlloc','getValue','stringToUTF8','lengthBytesUTF8','HEAP8','HEAPU8'] \
  -I./cpp/ygo/lua/src \
  $FILES_LUA \
  $FILES_YGO \
  ./cpp/wasm.cpp \
  -o lib/ocgcore.jspi.mjs

em++ \
  -Os -g0 --closure 1 -sASSERTIONS=0 \
  -sMODULARIZE=1 -sALLOW_MEMORY_GROWTH=1 -sMALLOC=emmalloc \
  -fwasm-exceptions -sSUPPORT_LONGJMP=wasm \
  -fno-rtti \
  -sNO_EXIT_RUNTIME=1 -sIMPORTED_MEMORY \
  -sENVIRONMENT=web \
  -sEXPORTED_FUNCTIONS=['_malloc','_free'] \
  -sEXPORTED_RUNTIME_METHODS=['stackSave','stackRestore','stackAlloc','getValue','stringToUTF8','lengthBytesUTF8','HEAP8','HEAPU8'] \
  -I./cpp/ygo/lua/src \
  $FILES_LUA \
  $FILES_YGO \
  ./cpp/wasm.cpp \
  -o lib/ocgcore.sync.mjs
