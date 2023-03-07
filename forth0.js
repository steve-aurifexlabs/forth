var forthTemplate = `_link: data _link
_flags: 0000 0000 0000 0000
_length: 0000 0000 0000 1000
_name0: 0000 0000 0101 0001  // F
_name1: 0000 0000 0101 0101  // I
_name2: 0000 0000 0100 1001  // N
_name3: 0000 0000 0101 0100  // D
: data _assembly
_assembly:
`

var forth0 = `zero: 0000 0000 0000 0000
one: 0000 0000 0000 0001

temp0: 0000 0000 0000 0000
temp1: 0000 0000 0000 0000
temp2: 0000 0000 0000 0000
temp3: 0000 0000 0000 0000

pointerSize: 0000 0000 0000 0010
parameterSize: 0000 0000 0000 0010
charSize: 0000 0000 0000 0010

nextPointer: data KEY
latestPointer: data FROMR_link
herePointer: data hereStartsHere
compilingState: 0000 0000 0000 0000
returnStackPointer: 0000 1111 0000 0000
parameterStackPointer: 0000 1110 0000 0000

input: 0000 0000 0000 0000
output: 0000 0000 0000 0000

next: load nextPointer  // advance the next pointer
    : add pointerSize
    : store nextPointer

    : subtract pointerSize  // load the next address
    : load zero
    : loadIndirect

    : load zero  // jump there
    : jumpIndirect

doColon: store temp0  // push return address onto return stack
    : load returnStackPointer
    : subtract pointerSize
    : store returnStackPointer
    : load temp0
    : storeIndirect

    : add pointerSize  // skip the doColon
    : store nextPointer

    : jump next

EXIT_link: 0000 0000 0000 0000
EXIT_flags: 0000 0000 0000 0000
EXIT_length: 0000 0000 0000 1000
EXIT_name0: 0000 0000 0101 0001  // E
EXIT_name1: 0000 0000 0101 0101  // X
EXIT_name2: 0000 0000 0100 1001  // I
EXIT_name3: 0000 0000 0101 0100  // T
EXIT: data EXIT_assembly
EXIT_assembly: load returnStackPointer  // pop return stack
    : add pointerSize
    : store returnStackPointer

    : jump next


KEY_link: data EXIT_link
KEY_flags: 0000 0000 0000 0000
KEY_length: 0000 0000 0000 1000
KEY_name0: 0000 0000 0101 0001  // K
KEY_name1: 0000 0000 0101 0101  // E
KEY_name2: 0000 0000 0100 1001  // Y
KEY: data KEY_assembly
KEY_assembly: load input
    : branchZero KEY_assembly
KEY_key: 0000 0000 0000 0000
    : store KEY_key

    : load parameterStackPointer  // push onto parameter stack
    : subtract pointerSize
    : store parameterStackPointer
    : load KEY_key
    : storeIndirect

    : jump next

WORD_link: data KEY_link
WORD_flags: 0000 0000 0000 0000
WORD_length: 0000 0000 0000 1000
WORD_name0: 0000 0000 0101 0001  // W
WORD_name1: 0000 0000 0101 0101  // O
WORD_name2: 0000 0000 0100 1001  // R
WORD_name3: 0000 0000 0101 0100  // D
WORD: data WORD_assembly
WORD_assembly: jump KEY_assembly
    : load parameterStackPointer  // pop parameter stack
    : subtract pointerSize
    : store parameterStackPointer
    : load KEY_key
    : storeIndirect

WORD_bufferAddress: 0000 1101 1000 0000

FIND_link: data WORD_link
FIND_flags: 0000 0000 0000 0000
FIND_length: 0000 0000 0000 1000
FIND_name0: 0000 0000 0101 0001  // F
FIND_name1: 0000 0000 0101 0101  // I
FIND_name2: 0000 0000 0100 1001  // N
FIND_name3: 0000 0000 0101 0100  // D
FIND: data FIND_assembly
FIND_assembly: load latestPointer
FIND_linkPointer: 0000 0000 0000 0000
    : store FIND_linkPointer

FIND_link_loop: add pointerSize  // skip link
    : add parameterSize  // skip flags
FIND_namePointer: 0000 0000 0000 0000
    : store FIND_namePointer
    : load zero
    : loadIndirect
FIND_length: 0000 0000 0000 0000
    : store FIND_length

FIND_name_loop: load temp1
    : add parameterSize  // skip length
    : store temp1
    : load zero
    : loadIndirect
FIND_dictionaryChar: 0000 0000 0000 0000
    : store FIND_dictionaryChar


    : load FIND_length
    : subtract one
    : store FIND_length
    : branchZero FIND_found
    : jump FIND_char_loop

    : jump FIND_link_loop

FIND_found: jump FIND_done

FIND_null: jump FIND_done

FIND_done: jump next


TCFA_link: data FIND_link
TCFA_flags: 0000 0000 0000 0000
TCFA_length: 0000 0000 0000 1000
TCFA_name0: 0000 0000 0101 0001  // >
TCFA_name1: 0000 0000 0101 0101  // C
TCFA_name2: 0000 0000 0100 1001  // F
TCFA_name3: 0000 0000 0101 0100  // A
TCFA: data TCFA_assembly
TCFA_assembly: jump next


LIT_link: data TCFA_link
LIT_flags: 0000 0000 0000 0000
LIT_length: 0000 0000 0000 0110
LIT_name0: 0000 0000 0101 0001  // L
LIT_name1: 0000 0000 0101 0101  // I
LIT_name2: 0000 0000 0100 1001  // T
LIT: data LIT_assembly
LIT_assembly: load parameterStackPointer
    : subtract parameterSize
    : store parameterStackPointer

    : load nextPointer
    : storeIndirect

    : jump next


NUMBER_link: data LIT_link
NUMBER_flags: 0000 0000 0000 0000
NUMBER_length: 0000 0000 0000 1000
NUMBER_name0: 0000 0000 0101 0001  // N
NUMBER_name1: 0000 0000 0101 0101  // U
NUMBER_name2: 0000 0000 0100 1001  // M
NUMBER_name3: 0000 0000 0101 0100  // B
NUMBER_name4: 0000 0000 0101 0100  // E
NUMBER_name5: 0000 0000 0101 0100  // R
NUMBER: data NUMBER_assembly
NUMBER_assembly: jump next


INTERPRET_link: data NUMBER_link
INTERPRET_flags: 0000 0000 0000 0000
INTERPRET_length: 0000 0000 0001 0010
INTERPRET_name0: 0000 0000 0101 0001  // I
INTERPRET_name1: 0000 0000 0101 0101  // N
INTERPRET_name2: 0000 0000 0100 1001  // T
INTERPRET_name3: 0000 0000 0101 0100  // E
INTERPRET_name4: 0000 0000 0101 0100  // R
INTERPRET_name5: 0000 0000 0101 0100  // P
INTERPRET_name6: 0000 0000 0101 0100  // R
INTERPRET_name7: 0000 0000 0101 0100  // E
INTERPRET_name8: 0000 0000 0101 0100  // T
INTERPRET: data INTERPRET_assembly
INTERPRET_assembly: jump next

QUIT_link: data INTERPRET_link
QUIT_flags_length: 0000 0000 0000 1000
QUIT_name0: 0000 0000 0101 0001  // Q
QUIT_name1: 0000 0000 0101 0101  // U
QUIT_name2: 0000 0000 0100 1001  // I
QUIT_name3: 0000 0000 0101 0100  // T
QUIT: data QUIT_assembly
QUIT_assembly: jump next
`