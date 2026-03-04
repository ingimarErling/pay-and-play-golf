export default class Renderer {

    constructor(ctx) {
        this.ctx = ctx;
    }

    clear() {

        this.ctx.fillStyle = "#3a7d3a";
        this.ctx.fillRect(0,0,900,600);
    }

    drawCourse(course) {

        this.ctx.fillStyle = "#4caf50";

        this.ctx.fillRect(
            course.fairway.x,
            course.fairway.y,
            course.fairway.width,
            course.fairway.height
        );

        this.ctx.fillStyle = "black";

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

    drawBall(ball) {

        this.ctx.fillStyle = "white";

        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, 6, 0, Math.PI*2);
        this.ctx.fill();
    }

   drawSwing(swing,state){

    if(state !== "SWINGING") return;

    const baseX = 200;
    const baseY = 550;
    const width = 400;

    this.ctx.fillStyle="white";

    this.ctx.fillRect(baseX,baseY,swing.power*4,20);

    this.ctx.font="14px monospace";

    this.ctx.fillText("0",baseX,baseY-5);
    this.ctx.fillText("50",baseX+200,baseY-5);
    this.ctx.fillText("75",baseX+300,baseY-5);
    this.ctx.fillText("100",baseX+380,baseY-5);
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
     HUD (Head-Up Display)
    */

   drawHUD(game){

    this.ctx.fillStyle="white";
    this.ctx.font="18px monospace";

    this.ctx.fillText("Pay-and-Play Golf",20,30);
    this.ctx.fillText("Hole 1 - Par 3",20,60);
    this.ctx.fillText("Distance: "+game.holeDistance+" yards",20,90);
    this.ctx.fillText("Club: PW (Pitching Wedge)",20,120);
    this.ctx.fillText("Strokes: "+game.strokes,20,150);

    this.ctx.fillText("← → Aim   Click Swing",20,180);

    if(game.result){

        this.ctx.font="28px monospace";
        this.ctx.fillText(game.result,350,300);
    }
}
}
