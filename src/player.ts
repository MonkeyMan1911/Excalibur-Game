import { Actor, Collider, CollisionContact, Engine, Side, vec, Keys, Vector, } from "excalibur";
import * as ex from "excalibur"
import { Resources } from "./resources";
import { AnimationManager } from "./Animations/AnimationManager";

// Actors are the main unit of composition you'll likely use, anything that you want to draw and move around the screen
// is likely built with an actor

// They contain a bunch of useful components that you might use
// actor.transform
// actor.motion
// actor.graphics
// actor.body
// actor.collider
// actor.actions
// actor.pointer

enum Directions {
	Up = "up",
	Down = "down",
	Left = "left",
	Right = "right",
	UpLeft = "up_left",
	UpRight = "up_right",
	DownLeft = "down_left",
	DownRight = "down_right",
}
enum MovementStates {
	Idle = "idle",
	Walk = "walk"
}

export class Player extends Actor {

	private spriteSheet = ex.SpriteSheet.fromImageSource({
		image: Resources.PlayerSpriteSheetImg,
		grid: {
			rows: 8,
			columns: 24,
			spriteHeight: 32,
			spriteWidth: 32
		}
	})
 
	private direction: Directions = Directions.Down
	private movementState: MovementStates = MovementStates.Idle
	animationManager: AnimationManager = new AnimationManager({
		spritesheet: this.spriteSheet,
		actor: this
	})

	releaseTimer: number = 0;

	constructor() {
		super({
			name: 'Player',
			pos: vec(150, 150),
			width: 16,
			height: 16,
			// collisionType: CollisionType.Active, // Collision Type Active means this participates in collisions read more https://excaliburjs.com/docs/collisiontypes
		});
		
	}

	override onInitialize() {
		this.animationManager.play("idle-down")
	}

	private movementLogic(engine: Engine, elapsedMs: number) {
		const keyboard = engine.input.keyboard

		let moveDir: Vector = Vector.Zero
		let speed: number = 1

		const ignoredKeys: Keys[] = [Keys.ShiftLeft, Keys.ShiftRight]

		if (keyboard.getKeys().length > 2 && ignoredKeys.every(key => !keyboard.getKeys().includes(key))) {
			moveDir = Vector.Zero;
			this.movementState = MovementStates.Idle;
			this.animationManager.goToIdle(this.direction);
			return;
		}
		if (keyboard.isHeld(Keys.Down) || keyboard.isHeld(Keys.S)) {
			this.direction = Directions.Down
			moveDir = moveDir.add(Vector.Down)
		}
		if (keyboard.isHeld(Keys.Up) || keyboard.isHeld(Keys.W)) {
			this.direction = Directions.Up
			moveDir = moveDir.add(Vector.Up)
		}
		if (keyboard.isHeld(Keys.Right) || keyboard.isHeld(Keys.D)) {
			this.direction = Directions.Right
			moveDir = moveDir.add(Vector.Right)
		}
		if (keyboard.isHeld(Keys.Left) || keyboard.isHeld(Keys.A)) {
			this.direction = Directions.Left
			moveDir = moveDir.add(Vector.Left)
		}


		if (keyboard.isHeld(Keys.ShiftLeft) || keyboard.isHeld(Keys.ShiftRight)) { speed *= 1.3 } // Sprint

		if (!moveDir.equals(Vector.Zero)) {
				moveDir = moveDir.normalize().scale(speed);
				this.pos = this.pos.add(moveDir);

				// #region Handle diagonal movements
				if (moveDir.x > -speed && moveDir.x < 0 && moveDir.y < 0 && moveDir.y > -speed) {
					this.direction = Directions.UpLeft
				}
				if (moveDir.x > 0 && moveDir.x < speed && moveDir.y < 0 && moveDir.y > -speed) {
					this.direction = Directions.UpRight
				}
				if (moveDir.x > -speed && moveDir.x < 0 && moveDir.y < speed && moveDir.y > 0) {
					this.direction = Directions.DownLeft
				}
				if (moveDir.x > 0 && moveDir.x < speed && moveDir.y < speed && moveDir.y > 0) {
					this.direction = Directions.DownRight
				}
				// #endregion
				else {
					this.animationManager.currentAnimationPriority = 1 // Diagonal > Normal -> Change priority back to one
				}
				this.movementState = MovementStates.Walk
				this.animationManager.play(`walk-${this.direction}`)
		}

		// Return to idle if not moving anymore
		if (moveDir.equals(Vector.Zero) && this.movementState !== MovementStates.Idle) {
			if (keyboard.wasReleased(Keys.A)) { 
			}
			this.animationManager.goToIdle(this.direction)
			this.movementState = MovementStates.Idle
		}
	}

	override onPreUpdate(engine: Engine, elapsedMs: number): void {
		// Only allow movement if no high-priority animation is playing
		if (this.animationManager.currentAnimationPriority < 10) {
		this.movementLogic(engine, elapsedMs);
		}
		if (engine.input.keyboard.wasPressed(Keys.Space)) { 
			this.animationManager.play("melee-down");
			this.movementState = MovementStates.Idle;
		}

	}

	override onPostUpdate(engine: Engine, elapsedMs: number): void {
		// Put any update logic here runs every frame after Actor builtins
	}

	override onPreCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
		// Called before a collision is resolved, if you want to opt out of this specific collision call contact.cancel()
	}

	override onPostCollisionResolve(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
		// Called every time a collision is resolved and overlap is solved
	}

	override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
		// Called when a pair of objects are in contact
		this.pos
	}

	override onCollisionEnd(self: Collider, other: Collider, side: Side, lastContact: CollisionContact): void {
		// Called when a pair of objects separates
	}
}
