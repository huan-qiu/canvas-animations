## canvas-animations

Canvas-Animations does one single thing; it turns a spritesheet into an animation. Meanwhile, it offers controls like `fps`, `animationIteraionCount`, `play`, `stop`, `destroy` to suit your particular needs, together with an optional `onAnimationEnd` handler.

### 🍾 Features

1. Light as a feather, zero dependency.
2. JS framework free, can be used with any JS framework.
3. Support 3 forms of spritesheet: spritesheet with multiple rows, spritesheet with single row, spritesheet with single column.
4. Configurable animation speed, animation iteration count, autoplay mode.
5. The canvas element generated would be automatically scale to match the dimension of `container` element you have set.

### 🔦 How to use?

#### Step 1: Installation

Using npm:

```shell
  npm install canvas-animations
```

Using yarn:

```shell
  yarn add canvas-animations
```

#### Step 2: Import helper `setCanvasAnimation` and pass down your config

```javascript
import setCanvasAnimation from 'canvas-animations';

const config = {
  // config whatever you need
};
const anims = setCanvasAnimation(config);
```

⁉️ What can go in the `config` above 🧩?

| Property Name               | Type     | required | default | description                                                               |
| --------------------------- | -------- | -------- | ------- | ------------------------------------------------------------------------- |
| **container**               | Object   | Yes      | -       | the html element that the generated canvas animation would be appended to |
| **autoPlay**                | Boolean  | No       | true    | whether to autoplay animation or not                                      |
| **spriteSheet**             | String   | Yes      | -       | the image url of your spritesheet                                         |
| **totalFrameCounts**        | Number   | Yes      | -       | the total frames of your spritesheet                                      |
| **animationIterationCount** | Number   | No       | 1       | iteration count for your spritesheet                                      |
| **width**                   | Number   | Yes      | -       | the width of each frame in your spritesheet                               |
| **height**                  | Number   | Yes      | -       | the height of each frame in your spritesheet                              |
| **fps**                     | Number   | No       | 30      | the fps for your animation, valid range between 0 and 60                  |
| **onAnimationEnd**          | Function | No       | null    | onAnimationEnd handler for your animation                                 |

#### Step 3: Control your animation

```javascript
anims.play(); // start to play your anims
anims.stop(); // stop your anims from playing
anims.destroy(); // destroy your animsonAnimationEnd
```

### 🍻 You're all set! Have fun animating 🍻
