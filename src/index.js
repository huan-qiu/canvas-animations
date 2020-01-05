import validateUserConf from './validate';

// resolve whether the elem fall in range of [-offsetV, PH+offsetV] vertically
const PH = window.innerHeight || document.documentElement.clientHeight;
function _isElemHot(el, offsetV) {
  const { top, bottom } = el.getBoundingClientRect();
  return (
    (top >= 0 && top <= PH + offsetV) || (bottom <= PH && bottom >= -offsetV)
  );
}

function setCanvasAnimation(config) {
  const DEFAULT_OPTS = {
    autoPlay: true,
    onAnimationEnd: null,
    animationIterationCount: 1,
    fps: 30,
    _eco: false,
    _offsetV: 200,
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
    onAnimationEnd,
    _eco,
    _offsetV
  } = DEFAULT_OPTS;

  const dx = width;
  const dy = height;

  let rowFrameCounts;
  let isAutoPlay = autoPlay;
  let frame = 0;
  let hasIteratedCount = 0;
  let canvasNode;
  let ctx;
  let containerCompStyles;
  let rAF;
  let lastTs = 0;
  let currTs = 0;
  const IDEAL_MS_GAP = 16.66 * Math.round(60 / fps);

  function onError() {
    throw new Error('image of `setCanvasAnimation` spritesheet fails to load');
  }

  function onLoad() {
    function initRowFrameCounts() {
      rowFrameCounts = img.width / width;
    }

    function genCanvasNode() {
      canvasNode = document.createElement('canvas');
      containerCompStyles = window.getComputedStyle(container);
      // scale the canvas to fit its container
      canvasNode.width = width;
      canvasNode.height = height;
      canvasNode.style.cssText = `width: ${containerCompStyles.width}; height: ${containerCompStyles.height};`;

      ctx = canvasNode.getContext('2d');
      container.appendChild(canvasNode);
    }

    initRowFrameCounts();
    validateUserConf({
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
    });
    genCanvasNode();
    drawOneFrame();
    if (isAutoPlay) rAF = requestAnimationFrame(continueDrawing);
  }

  /* get next top-left coordinates for next frame to draw */
  function getSxSy(frame) {
    const currRow = Math.floor(frame / rowFrameCounts);
    const frameIdx = frame % rowFrameCounts;

    return {
      sx: frameIdx * width,
      sy: currRow * height
    };
  }

  function drawOneFrame() {
    /* init lastTs for the very first draw */
    if (!lastTs) lastTs = Date.now();
    const { sx, sy } = getSxSy(frame);
    ctx.clearRect(0, 0, dx, dy);
    ctx.drawImage(img, sx, sy, width, height, 0, 0, dx, dy);
    incrFrame();
  }

  function incrFrame() {
    frame = (frame + 1) % totalFrameCounts;
  }

  function continueDrawing() {
    if (!ctx) return false;
    /* decide whether now is the right time to draw */
    currTs = Date.now();
    const valideToDraw = currTs - lastTs >= IDEAL_MS_GAP;

    if (valideToDraw) {
      lastTs = currTs;
      /* experimental feature */
      if (_eco && !_isElemHot(container, _offsetV)) {
        rAF = requestAnimationFrame(continueDrawing);
        return false;
      }
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
    rAF = requestAnimationFrame(continueDrawing);
  }

  function play() {
    continueDrawing();
  }

  function stop() {
    hasIteratedCount = 0;
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
