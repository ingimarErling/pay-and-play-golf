export default class Ball {

    constructor(x,y){

        this.startX = x;
        this.startY = y;

        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;

        this.friction = 0.99;

        this.maxDistance = 0;
        this.travel = 0;

        this.height = 0;
    }

    hit(power,angle,maxDistance){

        const speed = power * 0.35;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.maxDistance = maxDistance;
        this.travel = 0;

        this.startX = this.x;
        this.startY = this.y;
    }

    update(canvasWidth,canvasHeight){

        this.x += this.vx;
        this.y += this.vy;

        this.travel += Math.sqrt(this.vx*this.vx + this.vy*this.vy);

        /*
         skapa en enkel parabol
        */

        const t = this.travel / this.maxDistance;

        this.height = 80 * (1 - Math.pow((t*2-1),2));

        if(this.height < 0) this.height = 0;

        if(this.travel > this.maxDistance){

            this.vx = 0;
            this.vy = 0;
        }

        this.vx *= this.friction;
        this.vy *= this.friction;

        if(this.x < 6) this.x = 6;
        if(this.y < 6) this.y = 6;

        if(this.x > canvasWidth-6) this.x = canvasWidth-6;
        if(this.y > canvasHeight-6) this.y = canvasHeight-6;
    }

    isStopped(){

        return Math.abs(this.vx) < 0.05 && Math.abs(this.vy) < 0.05;
    }
}
