import Ball from "./ball.js";
import Course from "./course.js";
import Renderer from "./renderer.js";
import Swing from "./swing.js";

export default class Game {

    constructor(canvas) {

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // Game objects
        this.ball = new Ball(150, 300);
        this.course = new Course();
        this.swing = new Swing();

        // Renderer handles all drawing
        this.renderer = new Renderer(this.ctx);

        /*
         * Game state machine
         *
         * AIMING       Player prepares the shot
         * SWINGING     Power meter active
         * BALL_MOVING  Ball physics simulation
         */
        this.state = "AIMING";

        this.lastTime = 0;

        this.registerEvents();
    }

    /*
     * Register player input events.
     * Currently we only use mouse click.
     */
    registerEvents() {

        window.addEventListener("click", () => {

            if (this.state === "AIMING") {

                this.swing.start();
                this.state = "SWINGING";

            } else if (this.state === "SWINGING") {

                const power = this.swing.stop();

                this.ball.hit(power);

                this.state = "BALL_MOVING";
            }
        });
    }

    /*
     * Start the main game loop.
     */
    start() {
        requestAnimationFrame(this.loop.bind(this));
    }

    /*
     * Main game loop.
     * Runs continuously via requestAnimationFrame.
     */
    loop(timestamp) {

        const delta = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(delta);
        this.render();

        requestAnimationFrame(this.loop.bind(this));
    }

    /*
     * Update game logic.
     */
    update(delta) {

        if (this.state === "BALL_MOVING") {

            this.ball.update();

            if (this.ball.isStopped()) {
                this.state = "AIMING";
            }
        }

        if (this.state === "SWINGING") {
            this.swing.update(delta);
        }
    }

    /*
     * Render the current frame.
     */
    render() {

        this.renderer.clear();

        this.renderer.drawCourse(this.course);
        this.renderer.drawBall(this.ball);
        this.renderer.drawSwing(this.swing, this.state);

        // Draw text / UI on top of game
        this.renderer.drawHUD();
    }
}
