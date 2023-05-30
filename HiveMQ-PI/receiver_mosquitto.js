const mqtt = require('mqtt');

// MQTT server options
const brokerUrl = 'mqtt://localhost:1883'; // Replace with your MQTT server URL and port
const topic = 'topic'; // Replace with the desired topic to subscribe

// Connect to the MQTT server
const client = mqtt.connect(brokerUrl);

// MQTT connection event handlers
client.on('connect', () => {
  console.log('Connected to MQTT server');
  client.subscribe(topic);
});

client.subscribe(topic);

client.on('message', (receivedTopic, message) => {
  if (receivedTopic === topic) {
    console.log(`Received message on topic '${receivedTopic}': ${message.toString()}`);
  }
});

// Keep the program running until user interrupts
console.log(`Waiting for messages on topic '${topic}'... (Press Ctrl+C to quit)`);
