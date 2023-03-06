function assemble(source) {
    const wordSize = Bits.value('0000 0000 0010')
    var cursor = Bits.value('0000 0000 0000')

    var labels = {}

    var sourceLines = source.split('\n')
    var lines = source.split('\n')
    
    lines.forEach(function(line, i) {
        if(line.split(':').length > 1) {
            var label = line.split(':')[0].trim()
            var instruction = line.split(':')[1].split('//')[0].trim()

            if(label) {
                labels[label] = Bits.toString(cursor)
            }

            lines[i] = Bits.toString(cursor) + ': '

            var op = instruction.split(' ')[0]
            var rest = instruction.split(' ').slice(1).join(' ')
            if(!rest) {
                rest = '0000 0000 0000'
            }
            lines[i] += getOpcode(op) + ' ' + rest
            
            cursor = Bits.add(cursor, wordSize, false).sum
        }
    })

    console.log('labels:', labels)

    lines.forEach(function(line, i) {
        if(!line) {
            return
        }

        var label = line.split(' ')[4]
        var address = labels[label]
        if(address !== undefined) {
            lines[i] = line.split(' ').slice(0, 4).join(' ') + ' ' + address
        }

        lines[i] += ' | ' + sourceLines[i]
    })

    source = lines.join('\n')

    return source
}

function getOpcode(op) {
    var opcode

    if(op == 'data') {
        opcode = '0000'
    } else if(op == 'immediate') {
        opcode = '0001'
    } else if(op == 'add') {
        opcode = '0010'
    } else if(op == 'subtract') {
        opcode = '0011'
    } else if(op == 'and') {
        opcode = '0100'
    } else if(op == 'or') {
        opcode = '0101'
    } else if(op == 'not') {
        opcode = '0110'
    } else if(op == 'load') {
        opcode = '0111'
    } else if(op == 'store') {
        opcode = '1000'
    } else if(op == 'jump') {
        opcode = '1001'
    } else if(op == 'branchZero') {
        opcode = '1010'
    } else if(op == 'branchNegative') {
        opcode = '1011'
    } else if(op == 'loadIndirect') {
        opcode = '1100'
    } else if(op == 'storeIndirect') {
        opcode = '1101'
    } else if(op == 'jumpIndirect') {
        opcode = '1110'
    } else if(op == 'storeOpcode') {
        opcode = '1111'
    } else {
        opcode = op
    }

    return opcode
}