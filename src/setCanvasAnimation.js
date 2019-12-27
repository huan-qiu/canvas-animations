import validateUserConf from './validate';

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
