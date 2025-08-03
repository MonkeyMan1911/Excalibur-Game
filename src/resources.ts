import { ImageSource, Loader} from "excalibur";
import * as ex from "excalibur";
import { TiledResource } from "@excaliburjs/plugin-tiled";


// It is convenient to put your resources in one place
export const Resources = {
  Sword: new ImageSource("./images/sword.png"), // Vite public/ directory serves the root images
  tiledMap: new TiledResource("./Test Map.tmx", {strict: false}),
  PlayerSpriteSheetImg: new ex.ImageSource("./RPG Assets/Characters/Puny-Characters/Archers/Archer-Green.png") 
} as const; // the 'as const' is a neat typescript trick to get strong typing on your resources. 
// So when you type Resources.Sword -> ImageSource

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
