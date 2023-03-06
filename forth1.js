var forth1 = `

HIDE_link: data HIDE_link
HIDE_flags: 0000 0000 0000 0000
HIDE_length: 0000 0000 0000 1000
HIDE_name0: 0000 0000 0101 0001  // H
HIDE_name1: 0000 0000 0101 0101  // I
HIDE_name2: 0000 0000 0100 1001  // D
HIDE_name3: 0000 0000 0101 0100  // E
HIDE: data doColon
    : data WORD
    : data FIND
    : data HIDDEN
    : data EXIT

`