var forth0 = `
zero: 0000 0000 0000 0000
one: 0000 0000 0000 0001

temp0: 0000 0000 0000 0000
temp1: 0000 0000 0000 0000
temp2: 0000 0000 0000 0000
temp3: 0000 0000 0000 0000

pointerSize: 0000 0000 0000 0010
parameterSize: 0000 0000 0000 0010

nextPointer: data QUIT_link
latestPointer: data QUIT_link
herePointer: data hereStartsHere
compilingState: 0000 0000 0000 0000

returnStackPointer: 0000 1111 0000 0000
parameterStackPointer: 0000 1110 0000 0000

replInputAddress: 0000 1101 0000 0000
replOutputAddress: 0000 1101 0000 0010

next: load nextPointer
    : add pointerSize
    : store nextPointer

    : subtract pointerSize
    : load zero
    : loadIndirect

    : load zero
    : jumpIndirect

doColon: store temp0
    : load returnStackPointer
    : subtract pointerSize
    : store returnStackPointer

    : load temp0
    : storeIndirect

    : add pointerSize
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
EXIT_assembly: load returnStackPointer
    : add pointerSize
    : store returnStackPointer

    : jump next

LIT_link: data EXIT_link
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

FIND_link: data LIT_link
FIND_flags: 0000 0000 0000 0000
FIND_length: 0000 0000 0000 1000
FIND_name0: 0000 0000 0101 0001  // F
FIND_name1: 0000 0000 0101 0101  // I
FIND_name2: 0000 0000 0100 1001  // N
FIND_name3: 0000 0000 0101 0100  // D
FIND: data FIND_assembly
FIND_assembly: 


TCFA_link: data FIND_link
TCFA_flags: 0000 0000 0000 0000
TCFA_length: 0000 0000 0000 1000
TCFA_name0: 0000 0000 0101 0001  // >
TCFA_name1: 0000 0000 0101 0101  // C
TCFA_name2: 0000 0000 0100 1001  // F
TCFA_name3: 0000 0000 0101 0100  // A
TCFA: data TCFA_assembly
TCFA_assembly:


KEY_link: data TCFA_link
KEY_flags: 0000 0000 0000 0000
KEY_length: 0000 0000 0000 1000
KEY_name0: 0000 0000 0101 0001  // F
KEY_name1: 0000 0000 0101 0101  // I
KEY_name2: 0000 0000 0100 1001  // N
KEY_name3: 0000 0000 0101 0100  // D
KEY: data KEY_assembly
KEY_assembly:


WORD_link: data KEY_link
WORD_flags: 0000 0000 0000 0000
WORD_length: 0000 0000 0000 1000
WORD_name0: 0000 0000 0101 0001  // F
WORD_name1: 0000 0000 0101 0101  // I
WORD_name2: 0000 0000 0100 1001  // N
WORD_name3: 0000 0000 0101 0100  // D
WORD: data _assembly
WORD_assembly:


NUMBER_link: data WORD_link
NUMBER_flags: 0000 0000 0000 0000
NUMBER_length: 0000 0000 0000 1000
NUMBER_name0: 0000 0000 0101 0001  // F
NUMBER_name1: 0000 0000 0101 0101  // I
NUMBER_name2: 0000 0000 0100 1001  // N
NUMBER_name3: 0000 0000 0101 0100  // D
NUMBER: data _assembly
NUMBER_assembly:


INTERPRET_link: data NUMBER_link
INTERPRET_flags: 0000 0000 0000 0000
INTERPRET_length: 0000 0000 0001 0010
INTERPRET_name0: 0000 0000 0101 0001  // I
INTERPRET_name1: 0000 0000 0101 0101  // N
INTERPRET_name2: 0000 0000 0100 1001  // T
INTERPRET_name3: 0000 0000 0101 0100  // E
INTERPRET_name3: 0000 0000 0101 0100  // R
INTERPRET_name3: 0000 0000 0101 0100  // P
INTERPRET_name3: 0000 0000 0101 0100  // R
INTERPRET_name3: 0000 0000 0101 0100  // E
INTERPRET_name3: 0000 0000 0101 0100  // T
INTERPRET: data INTERPRET_assembly
INTERPRET_assembly: 

QUIT_link: data INTERPRET_link
QUIT_flags_length: 0000 0000 0000 1000
QUIT_name0: 0000 0000 0101 0001  // Q
QUIT_name1: 0000 0000 0101 0101  // U
QUIT_name2: 0000 0000 0100 1001  // I
QUIT_name3: 0000 0000 0101 0100  // T
QUIT: data QUIT_assembly
QUIT_assembly: data RZ
    : data RSPSTORE
    : data INTERPRET
    : data BRANCH
    : 0000 1111 1111 1000

hereStartsHere: 0000 0000 0000 0000
`