export default class Ball {

    constructor(x, y){

        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;

        this.friction = 0.99;

        this.maxDistance = 0;
        this.travel = 0;
    }

    hit(power, angle, maxDistance){

        /*
         Bättre slaglängd
        */

        const speed = power * 0.35;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.maxDistance = maxDistance;
        this.travel = 0;
    }

    update(canvasWidth, canvasHeight){

        this.x += this.vx;
        this.y += this.vy;

        this.travel += Math.sqrt(this.vx*this.vx + this.vy*this.vy);

        /*
         stoppa efter maxlängd
        */

        if(this.travel > this.maxDistance){

            this.vx = 0;
            this.vy = 0;
        }

        /*
         friktion
        */

        this.vx *= this.friction;
        this.vy *= this.friction;

        /*
         stoppa vid canvas
        */

        if(this.x < 6) this.x = 6;
        if(this.y < 6) this.y = 6;

        if(this.x > canvasWidth-6) this.x = canvasWidth-6;
        if(this.y > canvasHeight-6) this.y = canvasHeight-6;
    }

    isStopped(){

        return Math.abs(this.vx) < 0.05 && Math.abs(this.vy) < 0.05;
    }
}
