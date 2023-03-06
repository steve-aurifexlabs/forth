var forth2 = `
DROP_link: 0000 0000 0000 0000
DROP_flags: 0000 0000 0000 0000
DROP_length: 0000 0000 0000 1000
DROP_name0: 0000 0000 0100 0100  // D
DROP_name1: 0000 0000 0101 0010  // R
DROP_name2: 0000 0000 0100 1111  // O
DROP_name3: 0000 0000 0101 0000  // P
DROP: data DROP_assembly
DROP_assembly: load parameterStackPointer
    : add parameterSize
    : store parameterStackPointer

    : jump next

SWAP_link: data DROP_link
SWAP_flags: 0000 0000 0000 0000
SWAP_length: 0000 0000 0000 1000
SWAP_name0: 0000 0000 0101 0011  // S
SWAP_name1: 0000 0000 0101 0111  // W
SWAP_name2: 0000 0000 0100 0001  // A
SWAP_name3: 0000 0000 0101 0000  // P
SWAP: data SWAP_assembly
SWAP_assembly: load parameterStackPointer
    : load zero
    : loadIndirect
    : store temp0

    : load parameterStackPointer
    : add parameterSize
    : load zero
    : loadIndirect
    : store parameterStackPointer

    : load parameterStackPointer
    : add parameterSize
    : load temp0
    : storeIndirect

    : jump next

DUP_link: data SWAP_link
DUP_flags: 0000 0000 0000 0000
DUP_length: 0000 0000 0000 0110
DUP_name0: 0000 0000 0101 0100  // D
DUP_name1: 0000 0000 0101 0101  // U
DUP_name2: 0000 0000 0101 0000  // P
DUP: data DUP_assembly
DUP_assembly: load parameterStackPointer
    : load zero
    : loadIndirect
    : store temp0
    
    : load parameterStackPointer
    : subtract parameterSize
    : store parameterStackPointer

    : load temp0
    : storeIndirect

    : jump next

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

ADD_link: data ROT_link
ADD_flags: 0000 0000 0000 0000
ADD_length: 0000 0000 0000 0010
ADD_name0: 0000 0000 0101 0001  // +
ADD: data ADD_assembly
ADD_assembly: load parameterStackPointer
    : load zero
    : loadIndirect
    : store temp0

    : load parameterStackPointer
    : add parameterSize
    : load zero
    : loadIndirect

    : add temp0
    : store temp1

    : load parameterStackPointer
    : subtract parameterSize
    : store parameterStackPointer

    : load temp1
    : storeIndirect

    : jump next

SUB_link: data ADD_link
SUB_flags: 0000 0000 0000 0000
SUB_length: 0000 0000 0000 0010
SUB_name0: 0000 0000 0101 0001  // -
SUB: data SUB_assembly
SUB_assembly: load parameterStackPointer
    : load zero
    : loadIndirect
    : store temp0

    : load parameterStackPointer
    : add parameterSize
    : load zero
    : loadIndirect

    : subtract temp0
    : store temp1

    : load parameterStackPointer
    : subtract parameterSize
    : store parameterStackPointer

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

STORE_link: data LIT_link
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

    : jump next

FETCH_link: data STORE_link
FETCH_flags: 0000 0000 0000 0000
FETCH_length: 0000 0000 0000 0010
FETCH_name0: 0000 0000 0101 0001  // @
FETCH: data FETCH_assembly
FETCH_assembly: load parameterStackPointer
    : load zero
    : loadIndirect

    : load parameterStackPointer
    : loadIndirect

    : storeIndirect

    : jump next
`