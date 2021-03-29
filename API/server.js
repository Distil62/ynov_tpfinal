const express = require('express')
const app = express()

const MongoClient = require('mongodb').MongoClient;

const uri = "";

MongoClient.connect(uri, { useUnifiedTopology: true })
  .then(client => {
    // ...
    const db = client.db('AdminBddProject')
    const user = db.collection('user')
    app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000, function(){
    console.log('listening on 3000')
})
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
app.post('/user', (req, res) => {
  user.insertOne(req.body)
    .then(result => {
      res.redirect('/')
    })
    .catch(error => console.error(error))
})
  })
  .catch(console.error)




