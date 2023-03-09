var newCodeMacro = function(name, previousName, forthWord) {
    
    return `
${name}_link: data _link
${name}_flags: 0000 0000 0000 0000
${name}_length: 0000 0000 0000 1000
${name}_name0: 0000 0000 0101 0001  // F
${name}_name1: 0000 0000 0101 0101  // I
${name}_name2: 0000 0000 0100 1001  // N
${name}_name3: 0000 0000 0101 0100  // D
${name}: data ${name}_assembly
${name}_assembly:
    : jump NEXT
`

}

