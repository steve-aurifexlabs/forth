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

var forth0 = `zero: 0000 0000 0000 0000  // (0000)
one: 0000 0000 0000 0001  // (0010)

input: 0000 0000 0000 0000  // (0100) memory mapped IO
output: 0000 0000 0000 0000  // (0110) memory mapped IO

temp0: 0000 0000 0000 0000
temp1: 0000 0000 0000 0000
temp2: 0000 0000 0000 0000
temp3: 0000 0000 0000 0000

pointerSize: 0000 0000 0000 0010
parameterSize: 0000 0000 0000 0010
charSize: 0000 0000 0000 0010

coldStartPointer: data TEST
nextPointer: data coldStartPointer
codeword: 0000 0000 0000 0000
currentPointer: 0000 0000 0000 0000

latestPointer: data FROMR_link
herePointer: data hereStartsHere
compilingState: 0000 0000 0000 0000

returnStackPointer: 0000 1111 0000 0000
parameterStackPointer: 0000 1110 0000 0000



literal: 0000 0000 0000 0000
offset: 0000 0000 0000 0000

next: load nextPointer  // advance the next pointer
    : store currentPointer
    : add pointerSize
    : store nextPointer

    : load currentPointer
    : load zero
    : loadIndirect

    : store codeword

    : load zero  // jump there
    : loadIndirect

    : load zero
    : jumpIndirect

doColon: load returnStackPointer  // push address onto return stack
    : subtract pointerSize
    : store returnStackPointer
    : load nextPointer
    : storeIndirect

    : load codeword
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
    : load zero
    : loadIndirect
    : store nextPointer

    : load returnStackPointer  // pop return stack
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
LIT_assembly: load nextPointer  // load literal
    : load zero
    : loadIndirect
    : store literal
    
    : load parameterStackPointer // push -> pstack
    : subtract parameterSize
    : store parameterStackPointer
    : load literal
    : storeIndirect

    : load nextPointer  // skip over literal
    : add pointerSize
    : store nextPointer

    : jump next

DUP_link: data LIT_link
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

ADD_link: data DUP_link
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
    : store temp0

    : load parameterStackPointer
    : add parameterSize
    : store parameterStackPointer

    : load temp0
    : storeIndirect

    : jump next
    
DOUBLE_link: data DUP_link
DOUBLE_flags: 0000 0000 0000 0000
DOUBLE_length: 0000 0000 0000 0110
DOUBLE_name0: 0000 0000 0101 0100  // D
DOUBLE_name1: 0000 0000 0101 0101  // O
DOUBLE_name2: 0000 0000 0101 0000  // U
DOUBLE_name2: 0000 0000 0101 0000  // B
DOUBLE_name2: 0000 0000 0101 0000  // L
DOUBLE_name2: 0000 0000 0101 0000  // E
DOUBLE: data doColon
    : data DUP
    : data ADD
    : data EXIT

QUAD_link: data DOUBLE_link
QUAD_flags: 0000 0000 0000 0000
QUAD_length: 0000 0000 0000 0110
QUAD_name0: 0000 0000 0101 0100  // Q
QUAD_name1: 0000 0000 0101 0101  // U
QUAD_name2: 0000 0000 0101 0000  // A
QUAD_name2: 0000 0000 0101 0000  // D
QUAD: data doColon
QUAD_0: data DOUBLE
QUAD_1: data DOUBLE
QUAD_2: data EXIT

TEST_link: data QUAD_link
TEST_flags: 0000 0000 0000 0000
TEST_length: 0000 0000 0000 1000
TEST_name0: 0000 0000 0101 0001  // F
TEST_name1: 0000 0000 0101 0101  // R
TEST_name2: 0000 0000 0100 1001  // O
TEST_name3: 0000 0000 0101 0100  // M
TEST_name1: 0000 0000 0101 0101  // R
TEST: data doColon
TEST_0: data LIT
TEST_1: 0000 0000 0000 0101
TEST_2: data QUAD
    : data TEST_done

TEST_done: data TEST_done_1
TEST_done_1: load zero
TEST_done_2: branchZero TEST_done_1

FETCH_link: data TEST_link
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

BRANCH_link: data SUB_link
BRANCH_flags: 0000 0000 0000 0000
BRANCH_length: 0000 0000 0000 0010
BRANCH_name0: 0000 0000 0101 0001  // @
BRANCH: data BRANCH_assembly
BRANCH_assembly: load nextPointer  // load offset
    : load zero
    : loadIndirect
    : store offset
    
    : load nextPointer
    : add offset
    : store nextPointer

    : jump next

ZBRANCH_link: data FETCH_link
ZBRANCH_flags: 0000 0000 0000 0000
ZBRANCH_length: 0000 0000 0000 0010
ZBRANCH_name0: 0000 0000 0101 0001  // 0
ZBRANCH_name0: 0000 0000 0101 0001  // B
ZBRANCH_name0: 0000 0000 0101 0001  // R
ZBRANCH_name0: 0000 0000 0101 0001  // A
ZBRANCH_name0: 0000 0000 0101 0001  // N
ZBRANCH_name0: 0000 0000 0101 0001  // C
ZBRANCH_name0: 0000 0000 0101 0001  // H
ZBRANCH: data ZBRANCH_assembly
ZBRANCH_assembly: load parameterStackPointer
    : load zero
    : loadIndirect
    
    : branchZero ZBRANCH_true
    : jump next
ZBRANCH_true: jump BRANCH_assembly

KEY_link: data TEST_link
KEY_flags: 0000 0000 0000 0000
KEY_length: 0000 0000 0000 1000
KEY_name0: 0000 0000 0101 0001  // K
KEY_name1: 0000 0000 0101 0101  // E
KEY_name2: 0000 0000 0100 1001  // Y
KEY: data doColon
    : data LIT
    : data input
    : data FETCH
    : data ZBRANCH
    : 0000 1111 1111 0100
    : data EXIT

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
    : store temp0

    : load parameterStackPointer
    : subtract parameterSize
    : store parameterStackPointer

    : load temp0
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

WORD_link: data KEY_link
WORD_flags: 0000 0000 0000 0000
WORD_length: 0000 0000 0000 1000
WORD_name0: 0000 0000 0101 0001  // W
WORD_name1: 0000 0000 0101 0101  // O
WORD_name2: 0000 0000 0100 1001  // R
WORD_name3: 0000 0000 0101 0100  // D
WORD: data doColon
    : data KEY
    : data LIT
    : 0000 0000 0010 0000  // compare to " " (ascii decimal 32)
    : data SUB
    : data ZBRANCH
    : 0000 0000 0000 0100 // need to store the keys here
    : data BRANCH
    : 0000 1111 1110 1110
    : data 
    : data STORE
    : data EXIT
WORD_var_bufferAddress: 0000 1101 1000 0000


INTERPRET_link: data WORD_link
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
INTERPRET: data doColon
    : data WORD // TODO - FIND NUMBER COMMA
    : data EXIT

QUIT_link: data INTERPRET_link
QUIT_flags_length: 0000 0000 0000 1000
QUIT_name0: 0000 0000 0101 0001  // Q
QUIT_name1: 0000 0000 0101 0101  // U
QUIT_name2: 0000 0000 0100 1001  // I
QUIT_name3: 0000 0000 0101 0100  // T
QUIT: data doColon
    : data INTERPRET
    : data BRANCH
    : 0000 1111 1111 1010


FIND_link: data QUIT_link
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

`