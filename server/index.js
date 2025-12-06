import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateVideo } from './services/freepik.js';
import { generateImage, generateAudio, chatWithAgent } from './services/gemini.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Content Generation Routes

app.post('/api/generate/video', async (req, res) => {
    try {
        const { prompt, image } = req.body;
        // Call Freepik Kling
        const result = await generateVideo(prompt, image);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/generate/image', async (req, res) => {
    try {
        const { prompt } = req.body;
        // Call Gemini (Nano Banana)
        // Fallback Mock for Hackathon if Keys fail
        // const result = await generateImage(prompt);

        // MOCK RESPONSE FOR DEMO UI STABILITY
        const mockImage = `https://placehold.co/1024x1024/png?text=${encodeURIComponent(prompt.slice(0, 30))}`;
        res.json({ success: true, url: mockImage });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Direct Audio Generation (TTS)
app.post('/api/generate/audio', async (req, res) => {
    try {
        const { text } = req.body;
        const audioUrl = await generateAudio(text);
        res.json({ success: true, url: audioUrl });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Conversational Agent (Voice Interaction)
app.post('/api/agent/speak', async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Get Text Reply
        const replyText = await chatWithAgent(message);

        // 2. Convert Reply to Audio
        const audioUrl = await generateAudio(replyText);

        res.json({ success: true, reply: replyText, audioUrl });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
