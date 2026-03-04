export default class Renderer {

    constructor(ctx){
        this.ctx = ctx;
    }

    clear(){

        this.ctx.fillStyle="#3a7d3a";
        this.ctx.fillRect(0,0,900,600);
    }

    drawCourse(course){

        this.ctx.fillStyle="#4caf50";

        this.ctx.fillRect(
            course.fairway.x,
            course.fairway.y,
            course.fairway.width,
            course.fairway.height
        );

        this.ctx.fillStyle="black";

        this.ctx.beginPath();
        this.ctx.arc(
            course.hole.x,
            course.hole.y,
            course.hole.radius,
            0,
            Math.PI*2
        );
        this.ctx.fill();
    }

  drawBall(ball){

    const visualY = ball.y - ball.height;

    /*
     skugga
    */

    this.ctx.fillStyle="rgba(0,0,0,0.4)";

    this.ctx.beginPath();
    this.ctx.arc(ball.x,ball.y,5,0,Math.PI*2);
    this.ctx.fill();

    /*
     boll
    */

    this.ctx.fillStyle="white";

    this.ctx.beginPath();
    this.ctx.arc(ball.x,visualY,6,0,Math.PI*2);
    this.ctx.fill();
}

    drawAim(ball,angle,state){

        if(state !== "AIMING") return;

        const length = 60;

        const x2 = ball.x + Math.cos(angle)*length;
        const y2 = ball.y + Math.sin(angle)*length;

        this.ctx.strokeStyle="white";

        this.ctx.beginPath();
        this.ctx.moveTo(ball.x,ball.y);
        this.ctx.lineTo(x2,y2);
        this.ctx.stroke();
    }

    /*
     Power-mätare (visas alltid)
    */

    drawPowerScale(){

        const x = 200;
        const y = 550;
        const width = 400;

        this.ctx.strokeStyle="white";

        this.ctx.strokeRect(x,y,width,20);

        this.ctx.font="14px monospace";
        this.ctx.fillStyle="white";

        this.ctx.fillText("0",x,y-5);
        this.ctx.fillText("50",x+200,y-5);
        this.ctx.fillText("75",x+300,y-5);
        this.ctx.fillText("100",x+380,y-5);
    }

    drawSwing(swing,state){

        if(state !== "SWINGING") return;

        this.ctx.fillStyle="white";

        this.ctx.fillRect(200,550,swing.power*4,20);
    }

    /*
     HUD (Head-Up Display)
    */

    drawHUD(game){

        this.ctx.fillStyle="white";
        this.ctx.font="18px monospace";

        this.ctx.fillText("Pay-and-Play Golf",20,30);
        this.ctx.fillText("Hål 1 - Par 3",20,60);
        this.ctx.fillText("Avstånd: "+game.holeDistance+" meter",20,90);
        this.ctx.fillText("Klubba: PW (Pitching Wedge)",20,120);
        this.ctx.fillText("Slag: "+game.strokes,20,150);

        this.ctx.fillText("← → Sikta   Klicka för slag",20,180);

        if(game.result){

            this.ctx.font="28px monospace";
            this.ctx.fillText(game.result,350,300);
        }
    }
}
