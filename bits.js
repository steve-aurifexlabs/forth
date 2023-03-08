// bits is just an array of booleans

var Bits = {}

Bits.zero = function(length) {
    var result = []
    
    for(var i = 0; i < length; i++) {
        result.push(false)
    }

    return result
}

Bits.value = function(value) {
    var result = []

    if(!value) {
       return undefined
    }

    Array.from(value).forEach(function(bit) {
        if(bit == ' ') {
            return
        }
        else if(Number(bit)) {
            result.push(true)
        } else {
            result.push(false)
        }
    })

    return result
}

Bits.toString = function(bits) {
    var result = []

    if(!bits) {
        return undefined
    }

    bits.forEach(function(bit, n) {
        if(bit) {
            result.push('1')
        } else {
            result.push('0')
        }

        if(n % 4 == 3) {
            result.push(' ')
        }
    })

    if(result.length % 5 == 0) {
        result = result.slice(0, -1)
    }

    return result.join('')
}

Bits.toNumber = function(bits) {
    if(!bits) {
        return undefined
    }

    var result = 0
    var sig = 0
    bits.reverse().forEach(function(bit, n) {
        if(bit) {
            result += 2 ** sig
        }
        sig += 1
    })

    return result
}

Bits.equal = function(operandA, operandB) {
    var result = true

    operandA.forEach(function(bit, i) {
        if(!operandA[i] && operandB[i]) {
            result = false
        }
        else if(operandA[i] && !operandB[i]) {
            result = false
        }
    })

    return result
}

Bits.not = function(operand) {
    var result = Bits.zero(operand.length)

    operand.forEach(function(bit, i) {
        if(!operand[i]) {
            result[i] = true
        }
        else if(operand[i]) {
            result[i] = false
        }
    })

    return result
}

Bits.and = function(operandA, operandB) {
    var result = Bits.zero(operandA.length)

    operandA.forEach(function(bit, i) {
        if(!operandA[i] && !operandB[i]) {
            result[i] = false
        }
        else if(operandA[i] && !operandB[i]) {
            result[i] = false
        }
        else if(!operandA[i] && operandB[i]) {
            result[i] = false
        }
        else if(operandA[i] && operandB[i]) {
            result[i] = true
        }
    })

    return result
}

Bits.or = function(operandA, operandB) {
    var result = Bits.zero(operandA.length)

    operandA.forEach(function(bit, i) {
        if(!operandA[i] && !operandB[i]) {
            result[i] = false
        }
        else if(operandA[i] && !operandB[i]) {
            result[i] = true
        }
        else if(!operandA[i] && operandB[i]) {
            result[i] = true
        }
        else if(operandA[i] && operandB[i]) {
            result[i] = true
        }
    })

    return result
}

Bits.subtract = function(operandA, operandB) {
    var operandB_inv = Bits.not(operandB)
    return Bits.add(operandA, operandB_inv, true).sum
}

Bits.add = function(operandA, operandB, carry) {
    var sum = Bits.zero(operandA.length)

    operandA.forEach(function(bit, i) {
        var j = operandA.length - 1 - i
        if(!carry && !operandA[j] && !operandB[j]) {
            sum[j] = false
            carry = false
        }
        else if(carry && !operandA[j] && !operandB[j]) {
            sum[j] = true
            carry = false
        }
        else if(!carry && operandA[j] && !operandB[j]) {
            sum[j] = true
            carry = false
        }
        else if(carry && operandA[j] && !operandB[j]) {
            sum[j] = false
            carry = true
        }
        else if(!carry && !operandA[j] && operandB[j]) {
            sum[j] = true
            carry = false
        }
        else if(carry && !operandA[j] && operandB[j]) {
            sum[j] = false
            carry = true
        }
        else if(!carry && operandA[j] && operandB[j]) {
            sum[j] = false
            carry = true
        }
        else if(carry && operandA[j] && operandB[j]) {
            sum[j] = true
            carry = true
        }
    })

    return {
        sum: sum,
        carry: carry,
    }
}
