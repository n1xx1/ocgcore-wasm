#!/bin/bash

set -e

FILES_YGO="./cpp/ygo/card.cpp ./cpp/ygo/duel.cpp ./cpp/ygo/effect.cpp ./cpp/ygo/field.cpp ./cpp/ygo/group.cpp ./cpp/ygo/interpreter.cpp ./cpp/ygo/libcard.cpp ./cpp/ygo/libdebug.cpp ./cpp/ygo/libduel.cpp ./cpp/ygo/libeffect.cpp ./cpp/ygo/libgroup.cpp ./cpp/ygo/ocgapi.cpp ./cpp/ygo/operations.cpp ./cpp/ygo/playerop.cpp ./cpp/ygo/processor_visit.cpp ./cpp/ygo/processor.cpp ./cpp/ygo/scriptlib.cpp"
FILES_LUA="./cpp/lua/lapi.c ./cpp/lua/lauxlib.c ./cpp/lua/lbaselib.c ./cpp/lua/lcode.c ./cpp/lua/lcorolib.c ./cpp/lua/lctype.c ./cpp/lua/ldblib.c ./cpp/lua/ldebug.c ./cpp/lua/ldo.c ./cpp/lua/ldump.c ./cpp/lua/lfunc.c ./cpp/lua/lgc.c ./cpp/lua/linit.c ./cpp/lua/liolib.c ./cpp/lua/llex.c ./cpp/lua/lmathlib.c ./cpp/lua/lmem.c ./cpp/lua/loadlib.c ./cpp/lua/lobject.c ./cpp/lua/lopcodes.c ./cpp/lua/loslib.c ./cpp/lua/lparser.c ./cpp/lua/lstate.c ./cpp/lua/lstring.c ./cpp/lua/lstrlib.c ./cpp/lua/ltable.c ./cpp/lua/ltablib.c ./cpp/lua/ltm.c ./cpp/lua/lundump.c ./cpp/lua/lutf8lib.c ./cpp/lua/lvm.c ./cpp/lua/lzio.c"

mkdir -p lib

# debug args: -sSTACK_OVERFLOW_CHECK=1 -sSAFE_HEAP=1 -O1 -g3 -sASSERTIONS=1

em++ \
  -Os -g0 --closure 1 -sASSERTIONS=0 \
  -sASYNCIFY=2 -sMODULARIZE=1 -DWASM_USE_JSPI -sFILESYSTEM=0 -sALLOW_MEMORY_GROWTH=1 -sMALLOC=emmalloc \
  -fwasm-exceptions -sSUPPORT_LONGJMP=wasm \
  -fno-rtti \
  -sNO_EXIT_RUNTIME=1 \
  -sASYNCIFY_EXPORTS=ocgapi* \
  -sEXPORTED_FUNCTIONS=['_malloc','_free'] \
  -sEXPORTED_RUNTIME_METHODS=['Asyncify','stackSave','stackRestore','stackAlloc','getValue','stringToUTF8','lengthBytesUTF8'] \
  -I./cpp/lua \
  $FILES_LUA \
  $FILES_YGO \
  ./cpp/wasm.cpp \
  -o lib/ocgcore.jspi.mjs

em++ \
  -Os -g0 --closure 1 -sASSERTIONS=0 \
  -sMODULARIZE=1 -sALLOW_MEMORY_GROWTH=1 -sMALLOC=emmalloc \
  -fwasm-exceptions -sSUPPORT_LONGJMP=wasm \
  -fno-rtti \
  -sNO_EXIT_RUNTIME=1 \
  -sEXPORTED_FUNCTIONS=['_malloc','_free'] \
  -sEXPORTED_RUNTIME_METHODS=['stackSave','stackRestore','stackAlloc','getValue','stringToUTF8','lengthBytesUTF8'] \
  -I./cpp/lua \
  $FILES_LUA \
  $FILES_YGO \
  ./cpp/wasm.cpp \
  -o lib/ocgcore.sync.mjs
