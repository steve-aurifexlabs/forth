var Cpu = {}

Cpu.new = function() {
    var cpu = {}
    cpu.state = {}
    Cpu.reset(cpu)
    return cpu
}

Cpu.reset = function(cpu) {
    var state = cpu.state

    state.controlState = Bits.zero(1)

    state.pc = Bits.zero(12)
    state.instruction = Bits.zero(16)
    state.accumulator = Bits.zero(12)
    state.accumulator2 = state.accumulator

    state.memory = {}
}

Cpu.loadMemory = function(cpu, binary) {
    var lines = binary.split('\n')
    lines.forEach(function(line) {
        line = line.split('|')[0]
        var address = line.split(': ')[0]
        if(!address) {
            return
        }

        var value = line.split(': ')[1]
        cpu.state.memory[address] = value
    })
}

Cpu.readMemory = function(memory, address) {
    return Bits.value(memory[Bits.toString(address)])
}

Cpu.writeMemory = function(memory, address, value) {
    memory[Bits.toString(address)] = Bits.toString(value)
}

Cpu.step = function(cpu) {
    var state = cpu.state

    if(Bits.equal(state.controlState, Bits.value('0'))) {
        state.instruction = Cpu.readMemory(state.memory, state.pc)
        state.controlState = Bits.value('1')
    }

    else if(Bits.equal(state.controlState, Bits.value('1'))) {
        var opcode = state.instruction.slice(0, 4)
        var address = state.instruction.slice(4)

        // 0000 data (skip)
        if(Bits.equal(opcode, Bits.value('0000'))) {
            state.pc = Bits.add(state.pc, Bits.value('0000 0000 0010')).sum
        }

        // 0001 immediate
        else if(Bits.equal(opcode, Bits.value('0001'))) {
            var immediate = state.instruction.slice(4)
            state.accumulator2 = state.accumulator
            state.accumulator = immediate
            state.pc = Bits.add(state.pc, Bits.value('0000 0000 0010')).sum
        }

        // 0010 add
        else if(Bits.equal(opcode, Bits.value('0010'))) {
            var dataIn = Cpu.readMemory(state.memory, address)
            dataIn = dataIn.slice(4)
            state.accumulator2 = state.accumulator
            state.accumulator = Bits.add(dataIn, state.accumulator, false).sum
            state.pc = Bits.add(state.pc, Bits.value('0000 0000 0010')).sum
        }

        // 0011 subtract
        else if(Bits.equal(opcode, Bits.value('0011'))) {
            var dataIn = Cpu.readMemory(state.memory, address)
            dataIn = dataIn.slice(4)
            state.accumulator2 = state.accumulator
            state.accumulator = Bits.subtract(state.accumulator, dataIn)
            state.pc = Bits.add(state.pc, Bits.value('0000 0000 0010')).sum
        }

        // 0100 and
        else if(Bits.equal(opcode, Bits.value('0100'))) {
            var dataIn = Cpu.readMemory(state.memory, address)
            dataIn = dataIn.slice(4)
            state.accumulator2 = state.accumulator
            state.accumulator = Bits.and(dataIn, state.accumulator)
            state.pc = Bits.add(state.pc, Bits.value('0000 0000 0010')).sum
        }

        // 0101 or
        else if(Bits.equal(opcode, Bits.value('0101'))) {
            var dataIn = Cpu.readMemory(state.memory, address)
            dataIn = dataIn.slice(4)
            state.accumulator2 = state.accumulator
            state.accumulator = Bits.or(dataIn, state.accumulator)
            state.pc = Bits.add(state.pc, Bits.value('0000 0000 0010')).sum
        }

        // 0110 not
        else if(Bits.equal(opcode, Bits.value('0110'))) {
            var dataIn = Cpu.readMemory(state.memory, address)
            dataIn = dataIn.slice(4)
            state.accumulator2 = state.accumulator
            state.accumulator = Bits.not(dataIn, state.accumulator)
            state.pc = Bits.add(state.pc, Bits.value('0000 0000 0010')).sum
        }

        // 0111 load
        else if(Bits.equal(opcode, Bits.value('0111'))) {
            var dataIn = Cpu.readMemory(state.memory, address)
            //console.log(dataIn)
            dataIn = dataIn.slice(4)
            state.accumulator2 = state.accumulator
            state.accumulator = dataIn
            state.pc = Bits.add(state.pc, Bits.value('0000 0000 0010')).sum
        }

        // 1000 store
        else if(Bits.equal(opcode, Bits.value('1000'))) {
            //console.log(state.accumulator)
            Cpu.writeMemory(state.memory, address, Bits.zero(4).concat(state.accumulator))
            state.pc = Bits.add(state.pc, Bits.value('0000 0000 0010')).sum
        }

        // 1001 jump
        else if(Bits.equal(opcode, Bits.value('1001'))) {
            state.pc = address
        }
        
        // 1010 branchZero
        else if(Bits.equal(opcode, Bits.value('1010'))) {
            if(Bits.equal(state.accumulator, Bits.zero(8))) {
                state.pc = address
            } else {
                state.pc = Bits.add(state.pc, Bits.value('0000 0000 0010')).sum
            }
        }
        
        // 1011 branchNegative
        else if(Bits.equal(opcode, Bits.value('1011'))) {
            if(Bits.equal(state.accumulator[0], Bits.value('1'))) {
                state.pc = address
            } else {
                state.pc = Bits.add(state.pc, Bits.value('0000 0000 0010')).sum
            }
        }

        // 1100 loadIndirect
        else if(Bits.equal(opcode, Bits.value('1100'))) {
            var dataIn = Cpu.readMemory(state.memory, state.accumulator2)
            dataIn = dataIn.slice(4)
            state.accumulator2 = state.accumulator
            state.accumulator = dataIn
            state.pc = Bits.add(state.pc, Bits.value('0000 0000 0010')).sum
        }

        // 1101 storeIndirect
        else if(Bits.equal(opcode, Bits.value('1101'))) {
            Cpu.writeMemory(state.memory, state.accumulator2, Bits.zero(4).concat(state.accumulator))
            state.pc = Bits.add(state.pc, Bits.value('0000 0000 0010')).sum
        }

        // 1110 jumpIndirect
        else if(Bits.equal(opcode, Bits.value('1110'))) {
            state.pc = state.accumulator2
        }

        // 1111 storeOpcode
        else if(Bits.equal(opcode, Bits.value('1111'))) {
            var writeValue = state.accumulator.slice(8).concat(Bits.zero(8))
            Cpu.writeMemory(state.memory, address, writeValue)
            state.pc = Bits.add(state.pc, Bits.value('0000 0000 0010')).sum
        }

        state.controlState = Bits.value('0')
    }
}