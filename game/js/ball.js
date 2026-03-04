export default class Ball {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;

        this.friction = 0.98;
    }

    hit(power, angle, maxDistance) {

        const speed = power * 0.15;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.maxDistance = maxDistance;
        this.travel = 0;
    }

    update() {

        this.x += this.vx;
        this.y += this.vy;

        this.travel += Math.sqrt(this.vx*this.vx + this.vy*this.vy);

        if(this.travel > this.maxDistance){

            this.vx = 0;
            this.vy = 0;
        }

        this.vx *= this.friction;
        this.vy *= this.friction;
    }

    isStopped(){

        return Math.abs(this.vx) < 0.05 && Math.abs(this.vy) < 0.05;
    }
}
