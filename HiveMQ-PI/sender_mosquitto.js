const mqtt = require('mqtt');
const readline = require('readline');

// MQTT server options
const brokerUrl = 'mqtt://localhost:1883'; // Replace with your MQTT server URL and port
const topic = 'topic'; // Replace with the desired topic to publish

// Connect to the MQTT server
const client = mqtt.connect(brokerUrl);

// MQTT connection event handlers
client.on('connect', () => {
  console.log('Connected to MQTT server');
  client.subscribe(topic, (err) => {
    if (err) {
      console.error('Error subscribing to topic:', err);
    } else {
      console.log('Subscribed to topic:', topic);
    }
  });
});

// Set up terminal input interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to send a message to the MQTT server
function sendMessage(message) {
  client.publish(topic, message);
  console.log(`Message sent on topic '${topic}': ${message}`);
}

// Terminal input event handler
rl.on('line', (input) => {
  const message = input.trim();

  // Send the user input as a message
  sendMessage(message);

  // Continue waiting for more user inputs
  rl.prompt();
});

// Keep the program running until user interrupts
console.log('Enter messages to send: (Press Ctrl+C to quit)');
rl.prompt();
