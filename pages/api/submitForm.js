import client from '../../config/client';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { question1, question2 } = req.body;

    try {
      await client.connect();
      const database = client.db('youth-in');
      const collection = database.collection('form');
      const result = await collection.insertOne({ question1, question2 });
      res.status(200).json({ message: 'Form data inserted successfully!', insertedId: result.insertedId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error inserting data into the database.' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
