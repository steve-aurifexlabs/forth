var Cpu = {}

Cpu.new = function() {
    var state = {}
    reset(state)
    return state
}

Cpu.reset = function(state) {
    state.controlState = Bits.zero(1)

    state.pc = Bits.zero(12)
    state.instruction = Bits.zero(16)
    state.accumulator = Bits.zero(12)
    state.accumulator2 = state.accumulator

    state.memory = {}
}

Cpu.readMemory = function(memory, address) {
    return Bits.value(memory[Bits.toString(address)])
}

Cpu.writeMemory = function(memory, address, value) {
    memory[Bits.toString(address)] = Bits.toString(value)
}

function step(state) {
    if(Bits.equal(state.controlState, Bits.value('0'))) {
        state.instruction = Cpu.readMemory(state.memory, state.pc)
        state.controlState = Bits.value('1')
    }

    else if(Bits.equal(state.controlState, Bits.value('1'))) {
        var opcode = state.instruction.slice(0, 4)
        var address = state.instruction.slice(4)

        // 0000 data (skip)
        if(Bits.equal(opcode, Bits.value('0000'))) {
            // noop
        }

        // 0001 immediate
        else if(Bits.equal(opcode, Bits.value('0001'))) {
            var immediate = state.instruction.slice(4)
            state.accumulator = immediate
        }

        // 0010 add
        else if(Bits.equal(opcode, Bits.value('0010'))) {
            var dataIn = Cpu.readMemory(state.memory, address)
            state.accumulator = Bits.add(dataIn, state.accumulator, false).sum
        }

        // 0011 subtract
        else if(Bits.equal(opcode, Bits.value('0011'))) {
            var dataIn = Cpu.readMemory(state.memory, address)
            state.accumulator = Bits.subtract(dataIn, state.accumulator)
        }

        // 0100 and
        else if(Bits.equal(opcode, Bits.value('0100'))) {
            var dataIn = Cpu.readMemory(state.memory, address)
            state.accumulator = Bits.and(dataIn, state.accumulator)
        }

        // 0101 or
        else if(Bits.equal(opcode, Bits.value('0101'))) {
            var dataIn = Cpu.readMemory(state.memory, address)
            state.accumulator = Bits.or(dataIn, state.accumulator)
        }

        // 0110 not
        else if(Bits.equal(opcode, Bits.value('0110'))) {
            var dataIn = Cpu.readMemory(state.memory, address)
            state.accumulator = Bits.not(dataIn, state.accumulator)
        }

        // 0111 load
        else if(Bits.equal(opcode, Bits.value('0111'))) {
            var dataIn = Cpu.readMemory(state.memory, address)
            state.accumulator = dataIn
        }

        // 1000 store
        else if(Bits.equal(opcode, Bits.value('1000'))) {
            Cpu.writeMemory(state.memory, address, state.accumulator)
        }

        // 1001 jump
        else if(Bits.equal(opcode, Bits.value('1001'))) {
            state.pc = address
        }
        
        // 1010 branchZero
        else if(Bits.equal(opcode, Bits.value('1010'))) {
            if(Bits.equal(state.accumulator, Bits.zero(8))) {
                state.pc = Bits.add(state.pc, address)
            }
        }
        
        // 1011 branchNegative
        else if(Bits.equal(opcode, Bits.value('1011'))) {
            if(Bits.equal(state.accumulator[0], Bits.value('1'))) {
                state.pc = Bits.add(state.pc, address)
            }
        }

        // 1100 loadIndirect
        else if(Bits.equal(opcode, Bits.value('1100'))) {
            var dataIn = Cpu.readMemory(state.memory, state.accumulator)
            state.accumulator = dataIn
        }

        // 1101 storeIndirect
        else if(Bits.equal(opcode, Bits.value('1101'))) {
            Cpu.writeMemory(state.memory, state.accumulator2, state.accumulator)
        }

        // 1110 jumpIndirect
        else if(Bits.equal(opcode, Bits.value('1110'))) {
            state.pc = accumulator
        }

        // 1111 storeOpcode
        else if(Bits.equal(opcode, Bits.value('1111'))) {
            var writeValue = state.accumulator.slice(8).concat(Bits.zero(8))
            Cpu.writeMemory(state.memory, address, writeValue)
        }

        state.accumulator2 = state.accumulator
        state.pc = Bits.add(state.pc, Bits.value('0000 0000 0010'))
        state.controlState = Bits.value('1')
    }
}