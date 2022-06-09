// Project:
// Author: Yun-Chen Lee yclee@arch.nycu.edu.tw
// Date: 2022/06/05
// Description:

// ================================================
var scene;
let mouseDragging = false;




// -------------------
// /* MQTT */
// MQTT broker setting
let broker = {
    hostname: 'public.cloud.shiftr.io',
    port: 443
};

// MQTT client:
let client;

let creds = {
    clientID: 'p5Client', // client id
    userName: 'public',
    password: 'public'
}

let subscribeTopics = ['neuronsDV'];
let serverTopic = 'neuronsDV';
let neurons_TopicHeader = "HA/Human/Neuron/";

// millis setting
let currentTime;
let preTime = 0;
let timePeriod = 1000; //ms


// ===============================================
function setup() {
    createCanvas(windowWidth, windowHeight);
    // create scene
    scene = new Scene({});
    scene.setup();


    // mode
    angleMode(DEGREES);
    colorMode(HSB, 255);

    // MQTT --------------------------
    // Create an MQTT client:
    client = new Paho.MQTT.Client(broker.hostname, broker.port, creds.clientID);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect to the MQTT broker:
    client.connect({
        onSuccess: onConnect, // callback function for when you connect
        userName: creds.userName, // username
        password: creds.password, // password
        //useSSL: true // use SSL
        useSSL: true
    });
}

function draw() {
    background(0);

    mouseDragging = false;

    scene.run();
    scene.draw();

    // MQTT ------------------------
    // send message every timePeriod
    // currentTime = int(millis() / timePeriod);
    // if (preTime != currentTime) {
    //     preTime = currentTime;
    //     // send message
    //     let msg = random().toFixed(3);
    //     sendMqttMessage(msg, serverTopic);
    // }
}

// ===============================================
// -------------------
// /* MOUSE EVENT */
function mouseDragged() {
    scene.nodes.forEach(n => {
        if (n.ifInside(mouseX, mouseY)) {
            n.setPosition(mouseX, mouseY);
        }
    })
    mouseDragging = true;
}


// ------------------------------
// /* MQTT Standard*/
// called when the client connects
function onConnect() {
    console.log('client is connected');
    subscribeTopics.forEach(topic => {
        client.subscribe(topic)
        console.log("done subscribe: " + topic);
    });
}

// called when the client loses its connection
function onConnectionLost(response) {
    if (response.errorCode !== 0) console.log('onConnectionLost:' + response.errorMessage);
}

// called when a message arrives
function onMessageArrived(message) {
    //console.log('message arrived from topic[' + message.destinationName + "]: " + message.payloadString);

    // scene check if need to add a new node
    if (message.destinationName == serverTopic) {
        let topicArr = message.payloadString.split("/");
        let index = topicArr.pop();
        if (index == "0001" || index == "0002") scene.createRoom(index);
        else scene.addNode(message.payloadString);
        subNewTopic(message.payloadString);
    }
    if (message.destinationName.includes(neurons_TopicHeader)) {
        let index = message.destinationName.split("/").pop();
        if (message.payloadString == '0') {
            scene.update_NodesBroadcast(index);
        } else {
            if (index == "0001" || index == "0002") {
                scene.update_RoomsLinklist(index, message.payloadString);
            } else scene.update_NodesLinklist(index, message.payloadString);
        }
    }

}

// called when you want to send a message:
function sendMqttMessage(msg, topic) {
    // if the client is connected to the MQTT broker:
    if (client.isConnected()) {
        // start an MQTT message:
        message = new Paho.MQTT.Message(msg);
        message.destinationName = topic;
        client.send(message);
        console.log('message send to topic[' + topic + "]: " + message.payloadString);
    }
}


// ------------------------------
// /* MQTT Addition */
// subscribe new topic by ID of new addded node
function subNewTopic(topic) {
    client.subscribe(topic)
}