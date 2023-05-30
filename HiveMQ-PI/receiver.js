const mqtt = require('mqtt');
const mqttURL = 'mqtt://broker.hivemq.com';
const topic = 'topik_PI_035';

function receiveMessages() {
  try {
    const client = mqtt.connect(mqttURL);

    client.on('connect', () => {
      console.log('Connected to HiveMQ');
      client.subscribe(topic);
      console.log(`Subscribed to topic: ${topic}`);
    });

    client.on('message', (receivedTopic, message) => {
      console.log(`Received message from topic ${receivedTopic}: ${message.toString()}`);
    });

    client.on('error', (error) => {
      console.error('Error:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

receiveMessages();