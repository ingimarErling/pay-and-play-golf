export default class Ball {

    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;

        this.friction = 0.98;
    }

    hit(power) {
        this.vx = power * 0.5;
        this.vy = 0;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        this.vx *= this.friction;
        this.vy *= this.friction;
    }

    isStopped() {
        return Math.abs(this.vx) < 0.05 && Math.abs(this.vy) < 0.05;
    }
}
