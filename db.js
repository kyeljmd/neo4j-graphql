const { Client } = require('pg')

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  database: 'dms'
})
client.connect();

exports.client = client;