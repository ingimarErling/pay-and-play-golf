export default class Swing {

    constructor() {
        this.power = 0;
        this.direction = 1;
        this.active = false;
    }

    start() {
        this.active = true;
        this.power = 0;
    }

    stop() {
        this.active = false;
        return this.power;
    }

    update(delta) {

        if (!this.active) return;

        this.power += this.direction * 0.4;

        if (this.power > 100 || this.power < 0) {
            this.direction *= -1;
        }
    }
}
