export const renderChm = (formulae:string) => {
  if (formulae.startsWith("'") && formulae.endsWith("'")) {
    let c = 1
    let el = []
    while (c < formulae.length - 1) {
      let char = formulae.charAt(c)
      if (char === '^') {
        el.push(<sup key={c}>{formulae.charAt(c+1)}</sup>)
        c += 2
      } else if (char === '_') {
        el.push(<sub key={c}>{formulae.charAt(c+1)}</sub>)
        c += 2
      } else {
        el.push(<span key={c}>{formulae.charAt(c)}</span>)
        c += 1
      }
    }
    return el
  }
  return formulae;
}
