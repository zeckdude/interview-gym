export const starterTs = `function padString(str: string, length: number, char?: string, side?: 'left' | 'right') {
  // Implement this function
  
}

export { padString };`;

export const starterJs = `function padString(str, length, char = " ", side = "right") {
  // Implement this function
  
}

module.exports = { padString };`;

export const solutionTs = `function padString(str: string, length: number, char?: string, side?: 'left' | 'right') {
  const padChar = char ?? ' ';
    const padSide = side ?? 'right';
    const padLen = Math.max(0, length - str.length);
    const pad = padChar.repeat(padLen);
    return padSide === 'left' ? pad + str : str + pad;
}

export { padString };`;

export const solutionJs = `function padString(str, length, char = " ", side = "right") {
  const padChar = char ?? ' ';
    const padSide = side ?? 'right';
    const padLen = Math.max(0, length - str.length);
    const pad = padChar.repeat(padLen);
    return padSide === 'left' ? pad + str : str + pad;
}

module.exports = { padString };`;
