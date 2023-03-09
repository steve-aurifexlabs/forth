var forth2 = `

STORE_link: data NUMBER_link
STORE_flags: 0000 0000 0000 0000
STORE_length: 0000 0000 0000 1000
STORE_name0: 0000 0000 0101 0001  // !
STORE: data STORE_assembly
STORE_assembly: load parameterStackPointer
    : load zero
    : loadIndirect
    : store temp0

    : load parameterStackPointer
    : add parameterSize
    : load zero
    : loadIndirect

    : load temp0
    : storeIndirect

    : load parameterStackPointer
    : add parameterSize
    : add parameterSize
    : store parameterStackPointer

    : jump NEXT

OVER_link: data DUP_link
OVER_flags: 0000 0000 0000 0000
OVER_length: 0000 0000 0000 1000
OVER_name0: 0000 0000 0100 1111  // O
OVER_name1: 0000 0000 0101 0110  // V
OVER_name2: 0000 0000 0100 0101  // E
OVER_name3: 0000 0000 0101 0010  // R
OVER: data OVER_assembly
OVER_assembly: load parameterStackPointer
    : add parameterSize
    : load zero
    : loadIndirect
    : store temp0

    : load parameterStackPointer
    : subtract parameterSize
    : store parameterStackPointer

    : load temp0
    : storeIndirect

    : jump next

ROT_link: data OVER_link
ROT_flags: 0000 0000 0000 0000
ROT_length: 0000 0000 0000 0110
ROT_name0: 0000 0000 0101 0010  // R
ROT_name1: 0000 0000 0100 1111  // O
ROT_name2: 0000 0000 0101 0100  // T
ROT: data ROT_assembly
ROT_assembly: load parameterStackPointer
    : load zero
    : loadIndirect
    : store temp0

    : load parameterStackPointer
    : add parameterSize
    : load zero
    : loadIndirect
    : store temp1

    : load parameterStackPointer
    : add parameterSize
    : add parameterSize
    : load zero
    : loadIndirect
    : store parameterStackPointer

    : load parameterStackPointer
    : add parameterSize
    : load temp0
    : storeIndirect

    : load parameterStackPointer
    : add parameterSize
    : add parameterSize
    : load temp1
    : storeIndirect

    : jump next

EQU_link: data SUB_link
EQU_flags: 0000 0000 0000 0000
EQU_length: 0000 0000 0000 0010
EQU_name0: 0000 0000 0101 0001  // =
EQU: data EQU_assembly
EQU_assembly: load parameterStackPointer
    : load zero
    : loadIndirect
    : store temp0

    : load parameterStackPointer
    : add parameterSize
    : load zero
    : loadIndirect

    : subtract temp0
    : branchZero EQU_test_true
    : load zero
    : jump EQU_done
EQU_test_true: load one
EQU_done: store temp1

    : load parameterStackPointer
    : add parameterSize
    : store parameterStackPointer

    : load temp1
    : storeIndirect

    : jump next
`