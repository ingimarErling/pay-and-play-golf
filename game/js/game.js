import Ball from "./ball.js";
import Course from "./course.js";
import Renderer from "./renderer.js";
import Swing from "./swing.js";

export default class Game {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.ball = new Ball(150, 300);
        this.course = new Course();
        this.swing = new Swing();
        this.renderer = new Renderer(this.ctx);

        this.state = "AIMING"; // AIMING | SWINGING | BALL_MOVING

        this.lastTime = 0;

        this.registerEvents();
    }

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

    start() {
        requestAnimationFrame(this.loop.bind(this));
    }

    loop(timestamp) {

        const delta = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(delta);
        this.render();

        requestAnimationFrame(this.loop.bind(this));
    }

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

    render() {
        this.renderer.clear();

        this.renderer.drawCourse(this.course);
        this.renderer.drawBall(this.ball);
        this.renderer.drawSwing(this.swing, this.state);
    }
}
