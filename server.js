// IM USING NPX SERVE TO RUN REACT WITH PHOTO.HTML
// I INSTALL CORS, SERVE, EXPRESS MONGOOSE
// open http://localhost:port/photo

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;


mongoose.connect('mongodb://localhost:27017/ArtList', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});


const artRecordSchema = new mongoose.Schema({
  artName: { type: String },
  serial: { type: Number },
  src: { type: String, required: true },
  alt: { type: String },
  bids: [{ user: { type: String, required: true }, bid: { type: Number, required: true } }],
});
const ArtRecord = mongoose.model('ArtRecord', artRecordSchema);


app.use(cors()); 
app.use(bodyParser.json());


app.get('/', async (req, res) => {
  try {
    const artRecords = await ArtRecord.find();
    res.json(artRecords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/:id', async (req, res) => {
    const { user, bid } = req.body;
    const artRecordId = req.params.id;
  
    try {
      const artRecord = await ArtRecord.findByIdAndUpdate(
        artRecordId,
        { $push: { bids: { user, bid } } },
        { new: true }
      );
  
      if (!artRecord) {
        return res.status(404).json({ message: 'Art record not found' });
      }
  
      res.status(201).json(artRecord);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
