class Scene {
    // =============================================================
    // /* constructor */
    constructor(args) {
        this.nodes = [];
        this.edges = [];
        this.rooms = [];
    }

    // =============================================================
    // -------------------------------------------------------------
    // /* setup */
    setup() {
        //create nodes 
        // for (let i = 0; i < 3; i++) {
        //     let newNode = new Node({
        //             p: createVector(width / 2 + random(100), height / 2 + random(100)),
        //             r: random(30, 40),
        //             id: i
        //         })
        //         //newNode.setup();
        //     this.nodes.push(newNode);
        // }

        // this.addOneEdge(1, 2, 700);
        // this.addOneEdge(2, 1, 100);

    }

    // -------------------------------------------------------------
    // /* run loop */
    run() {
        // circle packing
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = 0; j < this.nodes.length; j++) {
                if (i == j) continue;
                else {
                    this.nodes[i].checkIntersec(this.nodes[j]);
                }
            }
        }

        this.nodes.forEach(n => {
            n.run();
        })

        this.rooms.forEach(m => { m.run(); })
        this.updateLocation();

    }

    // -------------------------------------------------------------
    // /* draw loop */
    draw() {

        this.rooms.forEach(m => {
            m.draw();
        })

        // draw edges
        this.edges.forEach(eg => {
            eg.draw();
        })

        // draw nodes 
        this.nodes.forEach(p => {
            p.draw();
        })



    }

    // =============================================================
    // -------------------------------------------------------------
    // /* add new node */
    addNode(topic) {

        let topicArr = topic.split("/");
        let _id = topicArr.pop();

        let notExisted = true;
        this.nodes.forEach(n => {
            if (n.id == _id) notExisted = false;
        })
        if (notExisted) {
            let newNode = new Node({
                p: createVector(width / 2 + random(100), height / 2 + random(100)),
                r: random(30, 40),
                id: _id,
                active: 255
            })
            this.nodes.push(newNode);
        }
    }

    createRoom(idstr) {
        let notExisted = true;
        this.rooms.forEach(m => {
            if (m.id == idstr) notExisted = false;
        })
        if (notExisted) {
            let newRoom = new Room({
                id: idstr
            })
            this.rooms.push(newRoom);
        }
        //console.log(this.rooms);
    }

    // =============================================================
    // -------------------------------------------------------------
    // /* update nodes linklist */
    update_NodesLinklist(idstr, msg) {
        this.nodes.forEach(n => {
            if (n.id == idstr) {
                n.updateLinkList(msg);
                //console.log(n);
            }
        })
        this.updateEdges(idstr)

    }

    update_RoomsLinklist(idstr, msg) {
        this.rooms.forEach(m => {
            if (m.id == idstr) {
                m.updateLinkList(msg);
                // console.log(m);
            }
        });
        //this.updateLocation();
    }



    updateEdges(idstr) {
        for (let i = this.edges.length - 1; i >= 0; i--) {
            if (this.edges[i].node1.id == idstr) {
                this.edges.splice(i, 1);
            }
        }
        //console.log(this.edges);

        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].id == idstr) {
                //console.log(this.nodes[i].linkList);
                for (let j = 0; j < this.nodes[i].linkList.length; j++) {
                    //idstr = idstr.replace(/(^[0]*)/g, "");
                    for (let k = 0; k < this.nodes.length; k++) {
                        if (this.nodes[k].id == this.nodes[i].linkList[j]) {
                            this.addOneEdge(i, k, this.nodes[i].weightList[j]);
                        }
                    }
                }
            }
        }
        //console.log(this.edges);

    }

    addOneEdge(idx1, idx2, w) {
        let eg = new Edge({
            node1: this.nodes[idx1],
            node2: this.nodes[idx2],
            weight: w
        })
        this.edges.push(eg);
        //console.log(this.edges);
    }

    // =============================================================
    // -------------------------------------------------------------
    // /* update nodes linklist */
    update_NodesBroadcast(idstr) {
        this.nodes.forEach(n => {
            if (n.id == idstr) {
                n.flash = 255;
            }
        })
    }


    // =============================================================
    // -------------------------------------------------------------
    // /* moving to room */
    updateLocation() {
        this.rooms.forEach(m => {
            if (m.active > 10) {
                //console.log(m.p)
                // m.linkList.forEach(ml => {
                for (let i = 0; i < m.linkList.length; i++) {
                    this.nodes.forEach(n => {
                            // console.log(ml)
                            if (m.linkList[i] == n.id) {
                                // console.log("move")
                                // let rndp = createVector(m.p.x + random(-10, 10), m.p.y + random(-10, 10));
                                let scale = this.remap(m.weightList[i], 0, m.wMax, 0, 0.05);
                                // let direct = createVector(rndp.x - n.p.x, rndp.y - n.p.y);
                                let direct = createVector(m.p.x - n.p.x, m.p.y - n.p.y);
                                //this.drawArrow(n.p, direct, "red");
                                n.p = p5.Vector.add(n.p, direct.copy().mult(scale * scale));
                            }
                        })
                        // })
                }
            }

        })


    }

    // =============================================================
    // /* remap */
    remap(val, sMin, sMax, tMin, tMax) {
        if (val < sMin) val = sMin;
        else if (val > sMax) val = sMax;
        return (val - sMin) * (tMax - tMin) / (sMax - sMin) + tMin;
    }


    drawArrow(base, vec, myColor) {
        push();
        stroke(myColor);
        strokeWeight(3);
        fill(myColor);
        translate(base.x, base.y);
        line(0, 0, vec.x, vec.y);
        rotate(vec.heading());
        let arrowSize = 7;
        translate(vec.mag() - arrowSize, 0);
        triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        pop();
    }



}