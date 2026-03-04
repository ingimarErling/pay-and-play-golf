import Ball from "./ball.js";
import Course from "./course.js";
import Renderer from "./renderer.js";
import Swing from "./swing.js";

export default class Game {

    constructor(canvas) {

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        /*
         Game objects
        */

        this.ball = new Ball(150, 300);
        this.course = new Course();
        this.swing = new Swing();

        this.renderer = new Renderer(this.ctx);

        /*
         Game state machine
        */

        this.state = "AIMING";

        /*
         Timing
        */

        this.lastTime = 0;

        /*
         Aim direction (radians)
        */

        this.angle = 0;

        /*
         Score system
        */

        this.strokes = 0;
        this.par = 3;
        this.result = null;

        /*
         Hole information
        */

        this.holeDistance = 120;      // yards
        this.maxShotDistance = 140;   // maximum travel

        this.registerEvents();
    }

    /*
     Input handling
    */

    registerEvents() {

        window.addEventListener("click", () => {

            if (this.state === "AIMING") {

                this.swing.start();
                this.state = "SWINGING";
            }

            else if (this.state === "SWINGING") {

                const power = this.swing.stop();

                this.ball.hit(power, this.angle, this.maxShotDistance);

                this.strokes++;

                this.state = "BALL_MOVING";
            }

        });

        /*
         Aim left/right with arrow keys
        */

        window.addEventListener("keydown", (e) => {

            if (this.state !== "AIMING") return;

            if (e.key === "ArrowLeft") {
                this.angle -= 0.1;
            }

            if (e.key === "ArrowRight") {
                this.angle += 0.1;
            }

        });
    }

    /*
     Start game loop
    */

    start() {

        requestAnimationFrame(this.loop.bind(this));
    }

    /*
     Main loop
    */

    loop(timestamp) {

        const delta = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(delta);
        this.render();

        requestAnimationFrame(this.loop.bind(this));
    }

    /*
     Update game logic
    */

    update(delta) {

        if (this.state === "BALL_MOVING") {

            this.ball.update();

            if (this.ball.isStopped()) {

                if (this.isBallInHole()) {

                    this.calculateScore();
                    this.state = "FINISHED";
                }
                else {

                    this.state = "AIMING";
                }
            }
        }

        if (this.state === "SWINGING") {

            this.swing.update(delta);
        }
    }

    /*
     Detect if ball reached the hole
    */

    isBallInHole() {

        const dx = this.ball.x - this.course.hole.x;
        const dy = this.ball.y - this.course.hole.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < this.course.hole.radius;
    }

    /*
     Calculate golf score
    */

    calculateScore() {

        const diff = this.strokes - this.par;

        if (this.strokes === 1) {
            this.result = "HOLE IN ONE!";
        }
        else if (diff === -1) {
            this.result = "BIRDIE";
        }
        else if (diff === 0) {
            this.result = "PAR";
        }
        else if (diff === 1) {
            this.result = "BOGEY";
        }
        else {
            this.result = "DOUBLE BOGEY+";
        }
    }

    /*
     Render frame
    */

    render() {

        this.renderer.clear();

        this.renderer.drawCourse(this.course);
        this.renderer.drawBall(this.ball);

        this.renderer.drawAim(this.ball, this.angle, this.state);
        this.renderer.drawSwing(this.swing, this.state);

        this.renderer.drawHUD(this);
    }
}
