const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Cors paketini import edin

const app = express();
app.use(bodyParser.json());

// MongoDB'ye bağlanmak için MongoDB Atlas Connection String'i
const connectionString = 'mongodb+srv://altanomerkor:691520.Mm@cluster0.ks90kgl.mongodb.net/todo-db?retryWrites=true&w=majority';
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB bağlantısı başarıyla sağlandı.');
  })
  .catch((error) => {
    console.error('MongoDB bağlantısı sırasında bir hata oluştu:', error);
  });

// MongoDB Schema ve Model tanımı
const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

// Cors politikalarını uygun şekilde ayarlayın
app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}));

app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Görev metni boş olamaz.' });
    }

    const newTodo = new Todo({ text, completed: false });
    await newTodo.save();

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Görev eklenirken bir hata oluştu.' });
  }
});

app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Todo listesi alınırken bir hata oluştu.' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Todo'yu silmek için backend'den veritabanından kaldırın
    await Todo.findByIdAndRemove(id);
    res.status(200).json({ message: 'Görev başarıyla silindi.' });
  } catch (error) {
    res.status(500).json({ error: 'Görev silinirken bir hata oluştu.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});
