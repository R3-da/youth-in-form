import { MongoClient } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017/youth-in?authSource=admin';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default client;
