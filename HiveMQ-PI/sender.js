const mqtt = require('mqtt');
const mqttURL = 'mqtt://broker.hivemq.com';
const topic = 'topik_PI_035';

async function sendMessage() {
  try {
    const client = mqtt.connect(mqttURL);

    client.on('connect', () => {
      console.log('Connected to HiveMQ');
      console.log('Type messages to send, or type "exit" to quit.');

      process.stdin.on('data', (data) => {
        const input = data.toString().trim();
        if (input.toLowerCase() === 'exit') {
          client.end();
          console.log('Exiting...');
          process.exit(0);
        } else {
          client.publish(topic, input);
          console.log(`Sent message: ${input}`);
        }
      });
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

sendMessage();