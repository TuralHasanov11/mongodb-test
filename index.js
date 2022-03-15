require('./config.js')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@cluster0.vlwau.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }, { connectTimeoutMS: 120000 }, { keepAlive: 1});
client.connect(async err => {
  const collection = client.db("sample_weatherdata").collection("data");
  // perform actions on the collection object

  // pipeline including aggregation filters
  const pipeline=[
        {
            '$match': {
                'airTemperature.value': {
                    '$gt': 1
                }, 
                'dewPoint.value': {
                    '$lt': 2
                }
            }
        }, {
            '$sort': {
                'pressure.value': -1
            }
        }, {
            '$project': {
                'position': 1, 
                'pressure': 1, 
                'dewPoint': 1, 
                'aiairTemperature': 1, 
                'posposition': 1
            }
        }, {
            '$limit': 20
        }
    ]

    // get data using pipeline
    const agg =await collection.aggregate(pipeline).toArray()
    console.log(agg)
    
    client.close();
});
