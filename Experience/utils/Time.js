import { EventEmitter } from "events";

export default class Time extends EventEmitter {
    constructor() {
        super();
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;
        this.animatedTime = 0;

        this.update();
    }

    update() {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;

        //Used for shader animate
        this.animatedTime += .05;
        
        this.emit("update");
        window.requestAnimationFrame(() => this.update());
    }
}
