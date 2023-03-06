Notes
-----

Cpu is a simple accumulator machine with a couple of quirks.

1) 12 bit data and 12 bit address, but 16 bit instructions. See storeOpcode
2) accumulator2 for data -> address. See indirect instructions.

Forth Assembly Templates
------------------------

pushReturnStack: store temp0
    : load returnStackPointer
    : subtract pointerSize
    : store returnStackPointer
    : load temp0
    : storeIndirect
    : load returnAddress
    : load temp0
    : jumpIndirect

popReturnStack: load returnStackPointer
    : load zero
    : loadIndirect
    : store temp0
    : load returnStackPointer
    : add pointerSize
    : store returnStackPointer
    : load returnAddress
    : load temp0
    : jumpIndirect


doColon: store temp1
    : immediate doColon_1
    : store returnAddress
    : jump pushReturnStack
doColon_1: load temp1
    : add pointerSize
    : store nextPointer
    : jump next