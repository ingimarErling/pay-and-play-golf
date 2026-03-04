export default class Ball {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;

        this.friction = 0.98;

        this.maxDistance = 0;
        this.travel = 0;
    }

    hit(power, angle, maxDistance) {

        const speed = power * 0.15;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.maxDistance = maxDistance;
        this.travel = 0;
    }

    update(canvasWidth, canvasHeight) {

        this.x += this.vx;
        this.y += this.vy;

        this.travel += Math.sqrt(this.vx*this.vx + this.vy*this.vy);

        if(this.travel > this.maxDistance){

            this.vx = 0;
            this.vy = 0;
        }

        this.vx *= this.friction;
        this.vy *= this.friction;

        /*
         Stoppa bollen vid canvas-kanter
        */

        if(this.x < 5) this.x = 5;
        if(this.y < 5) this.y = 5;

        if(this.x > canvasWidth-5) this.x = canvasWidth-5;
        if(this.y > canvasHeight-5) this.y = canvasHeight-5;
    }

    isStopped(){

        return Math.abs(this.vx) < 0.05 && Math.abs(this.vy) < 0.05;
    }
}
