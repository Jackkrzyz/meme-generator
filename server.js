require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/generate-image', async (req, res) => {
    
    try {
        const prompt = req.body.prompt;
        const response = await client.images.generate({
            model: 'dall-e-3',
            prompt: prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json'
        });
        res.json({ imageUrl: `data:image/png;base64,${response.data[0].b64_json}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));