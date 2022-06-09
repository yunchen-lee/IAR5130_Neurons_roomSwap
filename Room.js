class Room {
    constructor(args) {
        this.p = args.p || createVector(width / 2, height / 2);
        this.r = args.r | 40;
        this.centerDia = 25;
        this.id = args.id;
        this.linkList = [];
        this.weightList = [];
        this.active = 255;
        this.flash = 255;
        this.pretime;
        this.wMax = 800;
    }

    run() {
        // if (this.active < 100) {
        //     //if (this.id == "0002") console.log("active: " + str(this.active));
        //     this.weightList.forEach(w => {
        //         w = 0;
        //         //if (this.id == "0002") console.log(w);
        //     })
        // }
        this.active--;
        if (this.active < 0) this.active = 0;
        if (this.active > 255) this.active = 255;
    }


    draw() {
        push();
        noFill();
        stroke(this.active + 40);
        strokeWeight(2);
        if (this.id == "0002") this.p = createVector(250, height / 2);
        else this.p = createVector(width - 250, height / 2);
        translate(this.p.x, this.p.y);
        rectMode(CENTER);
        rect(0, 0, 250, 250);
        pop();
    }


    updateLinkList(msg) {
        //id,weight+id,weight+id,weight...
        //2,1.03+3,2.05+5,3.02...
        this.linkList = [];
        this.weightList = [];
        let pairs = msg.split("+");
        pairs.forEach(pair => {
            let index = pair.split(",")[0].padStart(4, '0');
            let value = pair.split(",")[1];
            this.linkList.push(index);
            this.weightList.push(value);
        })
        this.active = 255;
    }
}