
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

coldStartPointer: data QUIT
nextPointer: data coldStartPointer
codeword: 0000 0000 0000 0000
currentPointer: 0000 0000 0000 0000

latestPointer: data NUMBER_link
herePointer: data hereStartsHere
compilingState: 0000 0000 0000 0000

returnStackPointer: 0000 1111 0000 0000
parameterStackPointer: 0000 1110 0000 0000

literal: 0000 0000 0000 0000
offset: 0000 0000 0000 0000

NEXT: load nextPointer  // advance the next pointer
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

DOCOL: load returnStackPointer  // push address onto return stack
    : subtract pointerSize
    : store returnStackPointer
    : load nextPointer
    : storeIndirect

    : load codeword
    : add pointerSize
    : store nextPointer
    
    : jump NEXT

EXIT_link: 0000 0000 0000 0000
EXIT_flags: 0000 0000 0000 0000
EXIT_length: 0000 0000 0000 1000
EXIT_name0: 0000 0000 0100 0101  // E
EXIT_name1: 0000 0000 0101 1000  // X
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

    : jump NEXT

LIT_link: data EXIT_link
LIT_flags: 0000 0000 0000 0000
LIT_length: 0000 0000 0000 0110
LIT_name0: 0000 0000 0100 1100  // L
LIT_name1: 0000 0000 0100 1001  // I
LIT_name2: 0000 0000 0101 0100  // T
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

    : jump NEXT

DUP_link: data LIT_link
DUP_flags: 0000 0000 0000 0000
DUP_length: 0000 0000 0000 0110
DUP_name0: 0000 0000 0100 0100  // D
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

    : jump NEXT

ADD_link: data DUP_link
ADD_flags: 0000 0000 0000 0000
ADD_length: 0000 0000 0000 0010
ADD_name0: 0000 0000 0010 1011  // +
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

    : jump NEXT
    
DOUBLE_link: data ADD_link
DOUBLE_flags: 0000 0000 0000 0000
DOUBLE_length: 0000 0000 0000 1100
DOUBLE_name0: 0000 0000 0101 0100  // D
DOUBLE_name1: 0000 0000 0100 1111  // O
DOUBLE_name2: 0000 0000 0101 0101  // U
DOUBLE_name3: 0000 0000 0100 0010  // B
DOUBLE_name4: 0000 0000 0100 1100  // L
DOUBLE_name5: 0000 0000 0100 0101  // E
DOUBLE: data DOCOL
    : data DUP
    : data ADD
    : data EXIT

QUAD_link: data DOUBLE_link
QUAD_flags: 0000 0000 0000 0000
QUAD_length: 0000 0000 0000 1000
QUAD_name0: 0000 0000 0101 0001  // Q
QUAD_name1: 0000 0000 0101 0101  // U
QUAD_name2: 0000 0000 0100 0001  // A
QUAD_name3: 0000 0000 0100 0100  // D
QUAD: data DOCOL
QUAD_0: data DOUBLE
QUAD_1: data DOUBLE
QUAD_2: data EXIT

TEST_link: data QUAD_link
TEST_flags: 0000 0000 0000 0000
TEST_length: 0000 0000 0000 1000
TEST_name0: 0000 0000 0101 0100  // T
TEST_name1: 0000 0000 0100 0101  // E
TEST_name2: 0000 0000 0101 0011  // S
TEST_name3: 0000 0000 0101 0100  // T
TEST: data DOCOL
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
FETCH_name0: 0000 0000 0100 0000  // @
FETCH: data FETCH_assembly
FETCH_assembly: load parameterStackPointer
    : load zero
    : loadIndirect

    : load parameterStackPointer
    : loadIndirect

    : storeIndirect

    : jump NEXT

BRANCH_link: data FETCH_link
BRANCH_flags: 0000 0000 0000 0000
BRANCH_length: 0000 0000 0000 1100
BRANCH_name0: 0000 0000 0100 0010  // B
BRANCH_name1: 0000 0000 0101 0010  // R
BRANCH_name2: 0000 0000 0100 0001  // A
BRANCH_name3: 0000 0000 0100 1110  // N
BRANCH_name4: 0000 0000 0100 0011  // C
BRANCH_name5: 0000 0000 0100 1000  // H
BRANCH: data BRANCH_assembly
BRANCH_assembly: load nextPointer  // load offset
    : load zero
    : loadIndirect
    : store offset
    
    : load nextPointer
    : add offset
    : store nextPointer

    : jump NEXT

ZBRANCH_link: data BRANCH_link
ZBRANCH_flags: 0000 0000 0000 0000
ZBRANCH_length: 0000 0000 0000 1110
ZBRANCH_name0: 0000 0000 0011 0000  // 0
ZBRANCH_name1: 0000 0000 0100 0010  // B
ZBRANCH_name2: 0000 0000 0101 0010  // R
ZBRANCH_name3: 0000 0000 0100 0001  // A
ZBRANCH_name4: 0000 0000 0100 1110  // N
ZBRANCH_name5: 0000 0000 0100 0011  // C
ZBRANCH_name6: 0000 0000 0100 1000  // H
ZBRANCH: data ZBRANCH_assembly
ZBRANCH_assembly: load parameterStackPointer
    : load zero
    : loadIndirect
    
    : branchZero ZBRANCH_true

ZBRANCH_false: load nextPointer  // skip offset
    : add pointerSize
    : store nextPointer

    : jump NEXT

ZBRANCH_true: jump BRANCH_assembly

KEY_link: data ZBRANCH_link
KEY_flags: 0000 0000 0000 0000
KEY_length: 0000 0000 0000 0110
KEY_name0: 0000 0000 0100 1011  // K
KEY_name1: 0000 0000 0100 0101  // E
KEY_name2: 0000 0000 0101 1001  // Y
KEY: data DOCOL
    : data LIT
    : data input
    : data FETCH
    : data ZBRANCH
    : 0000 0000 0000 0100
    : data EXIT
KEY_null: data DROP
    : data BRANCH
    : 0000 1111 1111 0000

SUB_link: data KEY_link
SUB_flags: 0000 0000 0000 0000
SUB_length: 0000 0000 0000 0010
SUB_name0: 0000 0000 0010 1101  // -
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
    : add parameterSize
    : store parameterStackPointer

    : load temp0
    : storeIndirect

    : jump NEXT

DROP_link: data SUB_link
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

    : jump NEXT

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
    : store temp1

    : load parameterStackPointer
    : load temp1
    : storeIndirect

    : load parameterStackPointer
    : add parameterSize
    : load temp0
    : storeIndirect

    : jump NEXT

INCR_link: data SWAP_link
INCR_flags: 0000 0000 0000 0000
INCR_length: 0000 0000 0000 0100
INCR_name0: 0000 0000 0011 0001  // 1
INCR_name1: 0000 0000 0100 0001  // +
INCR: data DOCOL
    : data LIT
    : 0000 0000 0000 0001
    : data ADD
    : data EXIT
    
TWODROP_link: data INCR_link
TWODROP_flags: 0000 0000 0000 0000
TWODROP_length: 0000 0000 0000 1010
TWODROP_name0: 0000 0000 0011 0010  // 2
TWODROP_name1: 0000 0000 0100 0100  // D
TWODROP_name2: 0000 0000 0101 0010  // R
TWODROP_name3: 0000 0000 0100 1111  // O
TWODROP_name4: 0000 0000 0101 0000  // P
TWODROP: data DOCOL
    : data DROP
    : data DROP
    : data EXIT

WORD_link: data TWODROP_link
WORD_flags: 0000 0000 0000 0000
WORD_length: 0000 0000 0000 1000
WORD_name0: 0000 0000 0101 0111  // W
WORD_name1: 0000 0000 0100 1111  // O
WORD_name2: 0000 0000 0101 0010  // R
WORD_name3: 0000 0000 0100 0100  // D
WORD: data DOCOL
    : data LIT  // Put string length (0) on stack 
    : 0000 0000 0000 0000

WORD_key_loop: data KEY  // Read input
    : data DUP
    : data LIT
    : 0000 0000 0010 0000  // compare to " " (ascii decimal 32)
    : data SUB
    : data ZBRANCH
    : 0000 0000 0000 1100

WORD_continue: data DROP
    : data SWAP
    : data INCR
    : data BRANCH
    : 0000 1111 1110 1010

WORD_space: data TWODROP
    : data EXIT


INTERPRET_link: data WORD_link
INTERPRET_flags: 0000 0000 0000 0000
INTERPRET_length: 0000 0000 0001 0010
INTERPRET_name0: 0000 0000 0100 1001  // I
INTERPRET_name1: 0000 0000 0100 1110  // N
INTERPRET_name2: 0000 0000 0101 0100  // T
INTERPRET_name3: 0000 0000 0100 0101  // E
INTERPRET_name4: 0000 0000 0101 0010  // R
INTERPRET_name5: 0000 0000 0101 0000  // P
INTERPRET_name6: 0000 0000 0101 0010  // R
INTERPRET_name7: 0000 0000 0100 0101  // E
INTERPRET_name8: 0000 0000 0101 0100  // T
INTERPRET: data DOCOL
    : data WORD // TODO - FIND NUMBER COMMA
    : data EXIT

QUIT_link: data INTERPRET_link
QUIT_flags_length: 0000 0000 0000 1000
QUIT_name0: 0000 0000 0101 0001  // Q
QUIT_name1: 0000 0000 0101 0101  // U
QUIT_name2: 0000 0000 0100 1001  // I
QUIT_name3: 0000 0000 0101 0100  // T
QUIT: data DOCOL
    : data INTERPRET
    : data BRANCH
    : 0000 1111 1111 1100

FIND_link: data QUIT_link
FIND_flags: 0000 0000 0000 0000
FIND_length: 0000 0000 0000 1000
FIND_name0: 0000 0000 0100 0110  // F
FIND_name1: 0000 0000 0100 1001  // I
FIND_name2: 0000 0000 0100 1110  // N
FIND_name3: 0000 0000 0100 0100  // D
FIND: data DOCOL



load latestPointer
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
TCFA_name0: 0000 0000 0011 1110  // >
TCFA_name1: 0000 0000 0100 0011  // C
TCFA_name2: 0000 0000 0100 0110  // F
TCFA_name3: 0000 0000 0100 0001  // A
TCFA: data TCFA_assembly
TCFA_assembly: jump NEXT


NUMBER_link: data TCFA_link
NUMBER_flags: 0000 0000 0000 0000
NUMBER_length: 0000 0000 0000 1100
NUMBER_name0: 0000 0000 0100 1110  // N
NUMBER_name1: 0000 0000 0101 0101  // U
NUMBER_name2: 0000 0000 0100 1101  // M
NUMBER_name3: 0000 0000 0100 0010  // B
NUMBER_name4: 0000 0000 0100 0101  // E
NUMBER_name5: 0000 0000 0101 0010  // R
NUMBER: data NUMBER_assembly
NUMBER_assembly: jump NEXT


`