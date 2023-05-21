const amqp = require('amqplib');
const rabbitmqURL = 'amqp://localhost:5672';
const queueName = 'myQueue';

async function sendMessage() {
    try {
        const connection = await amqp.connect(rabbitmqURL);
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName);
    
        console.log('Type messages to send, press Ctrl+C to exit.');
        while (true) {
          const data = await new Promise((resolve) => {
            process.stdin.once('data', (chunk) => {
              resolve(chunk.toString().trim());
            });
          });
    
          await channel.sendToQueue(queueName, Buffer.from(data));
          console.log(`Sent message: ${data}`);
        }
    } 
    catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

sendMessage();
