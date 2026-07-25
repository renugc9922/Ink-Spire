import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;
const USE_LOCAL_LLM = process.env.USE_LOCAL_LLM === 'true';
const LOCAL_LLM_URL = process.env.LOCAL_LLM_URL || 'http://localhost:5000/generate';

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// --- Pollinations.ai Integration ---

async function generateTextPollinations(prompt) {
    // Pollinations Text API (Simple GET/POST)
    // We construct a URL-safe prompt
    const cleanPrompt = prompt.replace(/[^\w\s,.?!]/g, ' ').substring(0, 1000); // safety cap
    const url = `https://text.pollinations.ai/${encodeURIComponent(cleanPrompt)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Pollinations Service Busy");
    const text = await response.text();
    return text;
}

async function generateImagePollinations(prompt) {
    // Pollinations Image API
    const cleanPrompt = prompt.replace(/[^\w\s,.?!]/g, ' ').substring(0, 250);
    // Add seed, nologo, and dimensions to ensure robust generation
    const seed = Math.floor(Math.random() * 100000);
    // Use 768x432 (16:9) and Turbo model for reliable generation
    const timestamp = Date.now();
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=768&height=432&seed=${seed}&nologo=true&model=turbo&t=${timestamp}`;
    return url;
}

async function generateTextLocal(prompt, config) {
    // Local Flask Inference Server
    try {
        const response = await fetch(LOCAL_LLM_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                constraints: config || {}
            })
        });

        if (!response.ok) throw new Error(`Local Service Error: ${response.statusText}`);
        const data = await response.json();
        return data.text || data.full_generation;
    } catch (error) {
        console.error("Local LLM Local Error:", error.message);
        throw error;
    }
}

// Fallback logic if everything breaks
function fallbackStory(userInput) {
    return "The winds of fate shift... (Simulated Response: The connection was weak, but the story moves forward. Please try again or describe what happens next!)";
}

// --- Gemini Vision Helper ---
async function analyzeImageWithGemini(base64Image, genre, context) {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("Gemini API Key missing, skipping vision analysis.");
        return null;
    }

    try {
        console.log("Analyzing image with Gemini Vision...");
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use flash for fast analysis
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Strip the data:image prefix if present
        const base64Data = base64Image.replace(/^data:image\/(png|jpeg|webp);base64,/, "");

        const prompt = `Describe this image in precisely 1-2 short sentences as it relates to a ${genre} story. Focus on the most important objects or atmosphere.`;

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: "image/jpeg" // Gemini handles jpeg/png/webp interchangeably here
            }
        };

        const result = await model.generateContent([prompt, imagePart]);
        const text = result.response.text();
        console.log("Gemini Vision Result:", text);
        return text.trim();
    } catch (e) {
        console.error("Gemini Vision Failed:", e.message);
        return null;
    }
}

// --- Endpoints ---

app.post('/api/generate', async (req, res) => {
    try {
        const { userInput, context, config, image } = req.body;

        // Context Building
        const genre = config?.genre || 'fantasy';
        const tone = config?.tone || 'adventurous';

        // Simplified Prompt for 0.5B Model - Narrative Focus
        let prompt = `Write a ${genre} story in a ${tone} tone. `;

        if (context) {
            const cleanContext = context.substring(Math.max(0, context.length - 500));
            prompt += `Current Story: "${cleanContext}"\n\n`;
        }

        if (userInput) {
            prompt += `Instruction: ${userInput}\n\n`;
        }

        prompt += `Continue the story naturally with 3 sentences.`;

        // Image Handling (True Vision)
        if (image) {
            const imageDescription = await analyzeImageWithGemini(image, genre, context);
            if (imageDescription) {
                prompt += `\n\n(The user uploaded an image depicting: "${imageDescription}". Incorporate this scene/object naturally into the next event.)`;
            } else {
                // Fallback if APIs fail
                prompt += ` (Incorporate a visual element based on an uploaded image).`;
            }
        }

        let text;
        if (USE_LOCAL_LLM) {
            console.log("Asking Local Qwen Model...");
            try {
                text = await generateTextLocal(prompt, config);
            } catch (e) {
                console.warn("Local model failed, falling back to Pollinations...");
                text = await generateTextPollinations(prompt);
            }
        } else {
            console.log("Asking Pollinations API...");
            text = await generateTextPollinations(prompt);
        }

        // Basic cleanup
        if (!text || text.length < 5) text = fallbackStory();

        // Aggressive Global Cleanup of all meta-labels
        text = text.replace(/\[?Response:?\]?/gi, '');
        text = text.replace(/Next Event:?/gi, '');
        text = text.replace(/Action:?/gi, '');
        text = text.replace(/Instruction:?/gi, '');
        text = text.replace(/User Direction:?/gi, '');
        // Cleanup leftover brackets or whitespace
        text = text.replace(/[\[\]]/g, '');
        text = text.trim();

        res.json({ text });

    } catch (error) {
        console.error("Text Gen Error:", error.message);
        // "Flawless" mode: return a safe fallback instead of an error
        res.json({ text: fallbackStory() });
    }
});

app.post('/api/generate-cover', async (req, res) => {
    try {
        const { storyText, config, mode } = req.body;
        const genre = config?.genre || 'fantasy';
        const tone = config?.tone || 'cinematic';

        // --- USE GEMINI FLASH FOR SVG COVER GENERATION ---
        console.log("Generating Cover with Gemini SVG...");
        if (!process.env.GEMINI_API_KEY) {
            return res.json({ imageUrl: null, error: "GEMINI_API_KEY is missing." });
        }

        try {
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const prompt = `You are an expert SVG designer. Create a beautiful, minimalist, modern book cover as an SVG graphic.
Story Context: ${storyText.substring(0, 300)}
Genre: ${genre}
Tone: ${tone}

Requirements:
1. ONLY output raw, valid <svg> code. No markdown, no backticks, no HTML wrappers.
2. The root element MUST be <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 432" width="100%" height="100%">
3. Include a solid background <rect width="768" height="432" fill="#..." /> suited to the genre.
4. Add 2-3 simple, elegant geometric/abstract vector shapes (circles, paths, polygons) that represent the tone.
5. Add a stylized <text> element near the center or bottom with a placeholder title like "A ${genre} Tale" or a motif.
6. Keep it clean and scalable.`;

            const result = await model.generateContent(prompt);
            let text = result.response.text();

            // Extract just the SVG part, removing markdown if the model hallucinates it
            const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/);
            if (svgMatch) {
                const rawSvg = svgMatch[0];
                const base64 = Buffer.from(rawSvg).toString('base64');
                const dataUri = `data:image/svg+xml;base64,${base64}`;
                console.log("Gemini SVG Cover Generated Successfully.");
                return res.json({ imageUrl: dataUri });
            } else {
                throw new Error("No <svg> tag found in Gemini response.");
            }
        } catch (e) {
            console.error("Gemini SVG Creation Failed:", e.message);
            return res.json({ imageUrl: null, error: "AI Generation is currently overloaded. Please try again." });
        }

    } catch (error) {
        console.error("Cover Error:", error.message);
        res.json({ imageUrl: null, error: "Image Gen Failed" });
    }
});

app.post('/api/generate-title', async (req, res) => {
    try {
        const { storyText, config } = req.body;
        const genre = config?.genre || 'fantasy';

        // Use Local LLM for smarter title generation if available
        if (USE_LOCAL_LLM) {
            // STRICT ChatML format to force the 0.5B model to obey
            const systemPrompt = "You are a creative editor. Read the story summary and generate a short, catchy title. Do not output anything else. No conversation.";
            const userPrompt = `Genre: ${genre}.\nStory: ${storyText.substring(0, 500)}...\n\nTask: Generate a title.`;

            // Construct raw prompt if the inference server doesn't apply templates automatically for "raw" requests,
            // BUT our inference server usually expects just "prompt". 
            // Let's try to be very direct.
            const prompt = `<|im_start|>system\n${systemPrompt}<|im_end|>\n<|im_start|>user\n${userPrompt}<|im_end|>\n<|im_start|>assistant\nTitle:`;

            try {
                let title = await generateTextLocal(prompt, config);
                // Cleanup potentially noisy output
                title = title.replace(/Title:/gi, '').replace(/['"]/g, '').trim();
                // If it still chatters "Here is a title:", remove that.
                if (title.includes('\n')) title = title.split('\n')[0];

                res.json({ title });
                return;
            } catch (e) {
                console.warn("Local title gen failed, falling back...", e);
            }
        }

        // Fallback or if Local LLM disabled
        const prompt = `Create a short title for a ${genre} story about: ${storyText.substring(0, 100)}`;
        const title = await generateTextPollinations(prompt);
        res.json({ title: title.replace(/['"]/g, '').trim() });
    } catch (e) {
        res.json({ title: "The Unnamed Adventure" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (Pollinations.ai Mode)`);
});

// --- Story Persistence (Simple JSON) ---
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORIES_FILE = path.join(__dirname, 'stories.json');

// Helper to load stories
function getStories() {
    if (!fs.existsSync(STORIES_FILE)) return [];
    try {
        const data = fs.readFileSync(STORIES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error("Error reading stories.json", e);
        return [];
    }
}

// Helper to save stories
function saveStories(stories) {
    fs.writeFileSync(STORIES_FILE, JSON.stringify(stories, null, 2));
}

// GET all stories (summary only)
app.get('/api/stories', (req, res) => {
    const stories = getStories();
    // Return localized summary (id, title, cover, excerpt, date)
    const summary = stories.map(s => ({
        id: s.id,
        title: s.title || "Untitled Story",
        coverImageUrl: s.coverImageUrl,
        lastUpdated: s.lastUpdated,
        excerpt: s.segments.find(seg => seg.author === 'ai')?.content.substring(0, 100) + "..." || "New story..."
    })).sort((a, b) => b.lastUpdated - a.lastUpdated);
    res.json(summary);
});

// GET single story
app.get('/api/stories/:id', (req, res) => {
    const stories = getStories();
    const story = stories.find(s => s.id === req.params.id);
    if (!story) return res.status(404).json({ error: "Story not found" });
    res.json(story);
});

// POST (Create or Update) story
app.post('/api/stories', (req, res) => {
    const { id, title, segments, coverImageUrl, config } = req.body;
    let stories = getStories();

    const existingIndex = stories.findIndex(s => s.id === id);

    const storyData = {
        id: id || Date.now().toString(),
        title: title || "Untitled",
        segments: segments || [],
        coverImageUrl: coverImageUrl || null,
        config: config || {},
        lastUpdated: Date.now()
    };

    if (existingIndex >= 0) {
        stories[existingIndex] = { ...stories[existingIndex], ...storyData };
    } else {
        stories.push(storyData);
    }

    saveStories(stories);
    res.json(storyData);
});