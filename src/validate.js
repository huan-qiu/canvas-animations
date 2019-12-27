function validateUserConf({
  img,
  container,
  totalFrameCounts,
  rowFrameCounts,
  width,
  height,
  fps,
  animationIterationCount,
  autoPlay,
  onAnimationEnd
}) {
  /* integer check */
  const isNotInteger = value => {
    const isNumber = typeof value === 'number';
    let isFloats = false;
    if (isNumber) {
      const s = value.toString();
      const n = s.length;
      const idx = s.indexOf('.');
      isFloats = idx !== -1 && idx < n - 1;
    }
    const isInteger = isNumber && !isFloats;
    return !isInteger;
  };

  if (
    isNotInteger(width) ||
    isNotInteger(height) ||
    isNotInteger(totalFrameCounts) ||
    isNotInteger(fps)
  ) {
    throw new SyntaxError(
      "Values of `width`, `height`, `totalFrameCounts`, 'fps` should all be integers!"
    );
  }

  if (fps > 60 || fps < 1) {
    throw new SyntaxError('`fps` should range between 0 and 60!');
  }

  if (
    animationIterationCount !== 'infinite' &&
    isNotInteger(animationIterationCount)
  ) {
    throw new SyntaxError(
      "Values of `animationIterationCount` should be either type of Number or 'infinite'!"
    );
  }

  if (
    typeof container !== 'object' ||
    !container.nodeType ||
    !container.nodeName
  ) {
    throw new SyntaxError('`container` should be a DOM node!');
  }

  /*  get lines of row */
  const lines = Math.ceil(totalFrameCounts / rowFrameCounts);
  const intrinsicHeight = img.height;
  if (height !== intrinsicHeight / lines) {
    throw new Error(
      "Value of `height` doesn't match with dimension of `spritesheet` passed in!"
    );
  }

  if (typeof autoPlay !== 'boolean') {
    throw new SyntaxError('`autoPlay` should be type of Boolean!');
  }

  if (onAnimationEnd && onAnimationEnd instanceof Function === false) {
    throw new SyntaxError('`onAnimationEnd` should be a function!');
  }
}

export default validateUserConf;
