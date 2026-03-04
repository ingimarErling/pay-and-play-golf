export default class Renderer {

    constructor(ctx) {
        this.ctx = ctx;
    }

    clear() {
        this.ctx.fillStyle = "#3a7d3a";
        this.ctx.fillRect(0, 0, 900, 600);
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
            Math.PI * 2
        );
        this.ctx.fill();
    }

    drawBall(ball) {
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawSwing(swing, state) {

        if (state !== "SWINGING") return;

        this.ctx.fillStyle = "white";
        this.ctx.fillRect(200, 550, swing.power * 4, 20);
    }
}
