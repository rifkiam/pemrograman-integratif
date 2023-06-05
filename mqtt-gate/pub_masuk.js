const mqtt = require("mqtt");
const readline = require("readline");

const brokerHost = "broker.hivemq.com";
const brokerPort = 1883;
// Define topic
const topic = "gate_mqtt_in";
const res_topic = "masuk_result"

// Create MQTT client
const client = mqtt.connect(`mqtt://${brokerHost}:${brokerPort}`);

// Connect to MQTT broker
client.on("connect", () => {
  console.log("Connected to MQTT broker");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  client.subscribe(res_topic);

  // Handle received messages
  client.on("message", (receivedTopic, message) => {
    // console.log(`Received message from topic '${receivedTopic}': ${message}`)
    let msg = message.toString()
    console.log(msg)
    if (msg == "1") {
      console.log("buka")
    }
    else if (msg == "0") {
      console.log("invalid")
    }

  });

  const askForMessage = () => {
    rl.question("Masukkan pesan (ketik 'exit' untuk keluar): ", (message) => {
      if (message === "exit") {
        rl.close();
        client.end(); // Disconnect from MQTT broker
      } else {
        // Publish the message to the topic
        client.publish(topic, message);
        askForMessage(); // Ask for another message
      }
    });
  };

  askForMessage(); // Start asking for message input
});
