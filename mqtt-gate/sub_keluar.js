const { error } = require('console');
const mqtt = require('mqtt')
const mssql = require('mssql')
const readline = require('readline')

const config = {
    host: '10.199.14.47',
    port: 1433,
    server: '10.199.14.47',
    user: 'integratif',
    password: 'G3rb4ng!',
    database: 'GATE_DEV',
    options: {
      encrypt: true,
      trustServerCertificate: true,
    }
};

const port = 1883
const broker = `mqtt://broker.hivemq.com:${port}`
const topic = 'gate_mqtt_in'

const client = mqtt.connect(broker)

client.on('connect', () => {
    console.log("Connected to HiveMQ public broker")
    client.subscribe(topic)
    mssql.connect(config, err => {
        if (err)
        {
          console.log(err)
        }
        else
        {
          console.log('Connected to SQL Server')
        }
    });
})

client.on('message', (topic, message) => {
    console.log(`message received from ${topic}: ${message}`)

    let msg_string = message.toString()

    console.log(typeof msg_string)
    
    let parts = msg_string.split(",")
    let part1 = parts[0];
    let part2 = parts[1];

    console.log("Sending data to SQL Server...")
    
    mssql.query(`INSERT INTO log_keluar (id_kartu_akses, id_register_gate, date_time, is_valid) VALUES (${part1}, ${part2}, GETDATE(), 1);`, (err) => {
      // console.log(err)
      if (err) {
        console.log(0)
        client.publish('keluar_result', "0")
      }
      else
      {
        console.log(1)
        client.publish('keluar_result', "1")
      }
    })

})