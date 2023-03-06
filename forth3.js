var forth3 = `
TOR_link: data FETCH_link
TOR_flags: 0000 0000 0000 0000
TOR_length: 0000 0000 0000 0100
TOR_name0: 0000 0000 0101 0001  // >
TOR_name1: 0000 0000 0101 0101  // R
TOR: data TOR_assembly
TOR_assembly: load parameterStackPointer
    : load zero
    : loadIndirect
    : store temp0

    : load returnStackPointer
    : subtract pointerSize
    : store returnStackPointer
    : load temp0
    : storeIndirect

    : load parameterStackPointer
    : add parameterSize
    : store parameterStackPointer

    : jump next

FROMR_link: 0000 data TOR_link
FROMR_flags: 0000 0000 0000 0000
FROMR_length: 0000 0000 0000 1000
FROMR_name0: 0000 0000 0101 0001  // F
FROMR_name1: 0000 0000 0101 0101  // R
FROMR_name2: 0000 0000 0100 1001  // O
FROMR_name3: 0000 0000 0101 0100  // M
FROMR_name1: 0000 0000 0101 0101  // R
FROMR: data FROMR_assembly
FROMR_assembly: load returnStackPointer
    : load zero
    : loadIndirect
    : store temp0

    : load parameterStackPointer
    : subtract parameterSize
    : store parameterStackPointer
    : load temp0
    : storeIndirect

    : load returnStackPointer
    : add pointerSize
    : store returnStackPointer

    : jump next


_link: data _link
_flags: 0000 0000 0000 0000
_length: 0000 0000 0000 1000
_name0: 0000 0000 0101 0001  // F
_name1: 0000 0000 0101 0101  // I
_name2: 0000 0000 0100 1001  // N
_name3: 0000 0000 0101 0100  // D
: data _assembly
_assembly:

`