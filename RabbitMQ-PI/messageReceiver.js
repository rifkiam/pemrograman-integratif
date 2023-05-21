const amqp = require('amqplib');
const rabbitmqURL = 'amqp://localhost:5672';
const queueName = 'myQueue';

async function receiveMessage() {
  try {
    const connection = await amqp.connect(rabbitmqURL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);
    console.log('Waiting for messages...');

    channel.consume(queueName, (message) => {
      if (message !== null) {
        const content = message.content.toString();
        console.log(`Received message: ${content}`);
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

receiveMessage();
