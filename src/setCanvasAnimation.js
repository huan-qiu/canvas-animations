function setCanvasAnimation(config) {
  const DEFAULT_OPTS = {
    autoPlay: true,
    onAnimationEnd: null,
    animationIterationCount: 1,
    fps: 30,
    ...config
  };
  const {
    container,
    autoPlay,
    spriteSheet,
    totalFrameCounts,
    animationIterationCount,
    width,
    height,
    fps,
    onAnimationEnd
  } = DEFAULT_OPTS;

  const dx = width;
  const dy = height;
  const skipCounts = Math.floor(60 / fps);
  let rowFrameCounts;
  let isAutoPlay = autoPlay;
  let frame = 0;
  let speed = 0;
  let hasIteratedCount = 0;
  let canvasNode;
  let ctx;
  let containerCompStyles;
  let rAF;

  function onLoad() {
    function initRowFrameCounts() {
      rowFrameCounts = img.width / width;
    }

    function validateConfiguration() {
      const isNotNumber = value => {
        return typeof value !== 'number';
      };
      const lines = Math.ceil(totalFrameCounts / rowFrameCounts);
      const intrinsicHeight = img.height;
      if (
        isNotNumber(width) ||
        isNotNumber(height) ||
        isNotNumber(totalFrameCounts) ||
        isNotNumber(fps)
      ) {
        throw new SyntaxError(
          "Values of `width`, `height`, `totalFrameCounts`, 'fps` should all be type of Number!"
        );
      }

      if (fps > 60 || fps < 1) {
        throw new SyntaxError('`fps` should range between 0 and 60!');
      }

      if (
        animationIterationCount !== 'infinite' &&
        isNotNumber(animationIterationCount)
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
        throw new SyntaxError('`container` should be an element!');
      }

      if (height !== intrinsicHeight / lines) {
        throw new Error(
          "Value of `height` don't match with dimension of `spritesheet` passed in!"
        );
      }

      if (typeof autoPlay !== 'boolean') {
        throw new SyntaxError('`autoPlay` should be type of Boolean!');
      }

      if (onAnimationEnd && onAnimationEnd instanceof Function === false) {
        throw new SyntaxError('`onAnimationEnd` should be a function!');
      }
    }

    function genCanvasNode() {
      canvasNode = document.createElement('canvas');
      containerCompStyles = window.getComputedStyle(container);
      canvasNode.width = width;
      canvasNode.height = height;
      canvasNode.style.cssText = `width: ${containerCompStyles.width}; height: ${containerCompStyles.height};`;

      ctx = canvasNode.getContext('2d');
      container.appendChild(canvasNode);
    }
    initRowFrameCounts();
    validateConfiguration();
    genCanvasNode();
    drawOneFrame();
    if (isAutoPlay) rAF = requestAnimationFrame(continueDrawing);
  }

  function getSxSy(frame) {
    const currRow = Math.floor(frame / rowFrameCounts);
    const frameIdx = frame % rowFrameCounts;

    return {
      sx: frameIdx * width,
      sy: currRow * height
    };
  }

  function drawOneFrame() {
    const { sx, sy } = getSxSy(frame);
    ctx.clearRect(0, 0, dx, dy);
    ctx.drawImage(img, sx, sy, width, height, 0, 0, dx, dy);
    frame = (frame + 1) % totalFrameCounts;
    incrSpeed();
  }

  function incrSpeed() {
    speed = (speed + 1) % skipCounts;
  }

  function continueDrawing() {
    if (!ctx) return false;
    if (speed % skipCounts === 0) {
      drawOneFrame();
      if (frame === 0) {
        if (++hasIteratedCount === animationIterationCount) {
          // stop at the first frame
          stop();
          drawOneFrame();
          onAnimationEnd && onAnimationEnd();
          return false;
        }
      }
    }

    incrSpeed();
    rAF = requestAnimationFrame(continueDrawing);
  }

  function onError() {
    throw new Error('image of `setCanvasAnimation` spritesheet fails to load');
  }

  function play() {
    continueDrawing();
  }

  function stop() {
    cancelAnimationFrame(rAF);
  }

  function destroy() {
    stop();
    container.removeChild(canvasNode);
  }

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = spriteSheet;
  img.addEventListener('load', onLoad);
  img.addEventListener('error', onError);

  return {
    stop,
    play,
    destroy
  };
}

export default setCanvasAnimation;
