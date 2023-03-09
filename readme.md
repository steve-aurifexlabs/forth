

To Run
------

[Live demo](https://aurifexlabs.com/forth/computer.html)

or

- Clone repo
- Open computer.html


Forth
-----

[Based on Jones Forth.](https://github.com/nornagon/jonesforth/blob/master/jonesforth.S)



CPU
---

See cpu.js. It's under 200 lines of straightforward Javascript.

Cpu is a simple accumulator machine with a few quirks.

- 12 bit data and 12 bit address, but 16 bit instructions.
- data instructions have opcode 0 so data in memory is 16 bits: 0000 dddd dddd dddd
- chars fill lower 8 bits of 12 bit parameter (so 16 bits in memory)
- accumulator2 for data -> address. See 3 indirect instructions.
- branches are absolute.
- See storeOpcode for code writing code
- loadMemory, readMemory, and writeMemory operate use the bits string format

Bits
----

The cpu and assembler depend on this tiny library for bit vector representation,
arithmetic, and logic.

See bits.js. It's also around 200 lines of JS and designed to be ultra portable.

- Simple array of booleans
- Truth table based arithmetic and logic (add, subtract, and, or, not, equal)
- value <-> toString
- [false, false, false, false, true, true, false false] <-> '0000 1100'
- string format uses groups of 4 bits
- toNumber should be used for debugging not math