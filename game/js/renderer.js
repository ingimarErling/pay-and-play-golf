export default class Renderer {

    constructor(ctx) {
        this.ctx = ctx;
    }

    /*
     * Clear the canvas before drawing the next frame.
     * This is called once per frame from the game loop.
     */
    clear() {
        this.ctx.fillStyle = "#3a7d3a";
        this.ctx.fillRect(0, 0, 900, 600);
    }

    /*
     * Draw the golf course.
     * Currently consists of a simple fairway rectangle
     * and a circular hole on the green.
     */
    drawCourse(course) {

        // Draw fairway
        this.ctx.fillStyle = "#4caf50";
        this.ctx.fillRect(
            course.fairway.x,
            course.fairway.y,
            course.fairway.width,
            course.fairway.height
        );

        // Draw hole
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

    /*
     * Draw the golf ball.
     */
    drawBall(ball) {

        this.ctx.fillStyle = "white";

        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /*
     * Draw the swing power meter at the bottom of the screen.
     * Only visible while the player is swinging.
     */
    drawSwing(swing, state) {

        if (state !== "SWINGING") return;

        this.ctx.fillStyle = "white";
        this.ctx.fillRect(200, 550, swing.power * 4, 20);
    }

    /*
     * HUD (Head-Up Display)
     *
     * Displays game information such as:
     * - Title
     * - Hole information
     * - Instructions for the player
     *
     * The HUD is rendered on top of the game scene.
     */
    drawHUD() {

        this.ctx.fillStyle = "white";
        this.ctx.font = "18px monospace";

        this.ctx.fillText("Welcome to Pay-and-Play Golf", 20, 30);
        this.ctx.fillText("Hole 1 - Par 3", 20, 60);
        this.ctx.fillText("Click to swing", 20, 90);
    }
}
