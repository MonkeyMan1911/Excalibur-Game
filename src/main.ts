import { Color, DisplayMode, Engine, FadeInOut, vec } from "excalibur";
import { loader, Resources } from "./resources";
import { MyLevel } from "./level";

// Goal is to keep main.ts small and just enough to configure the engine

const game = new Engine({
  width: 800, // Logical width and height in game pixels
  height: 600,
  displayMode: DisplayMode.FitScreenAndFill, // Display mode tells excalibur how to fill the window
  pixelArt: true, // pixelArt will turn on the correct settings to render pixel art without jaggies or shimmering artifacts
  scenes: {
    start: MyLevel
  },
  // fixedUpdateTimestep: 16 // Turn on fixed update timestep when consistent physic simulation is important
});



game.start('start', { // name of the start scene 'start'
  loader, // Optional loader (but needed for loading images/sounds)
  inTransition: new FadeInOut({ // Optional in transition
    duration: 0,
    direction: 'in',
    color: Color.ExcaliburBlue
  })
}).then(() => {
  Resources.tiledMap.addToScene(game.currentScene, {pos: vec(0, 0 )});
  game.screen.canvas.style.imageRendering = "pixelated";
  game.graphicsContext.scale(3, 3)
});
