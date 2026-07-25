import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
    console.log("Listing Available Models...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error ${response.status}: ${response.statusText}`);
            const text = await response.text();
            console.error(text);
            return;
        }

        const data = await response.json();
        console.log("--------------------------------------------------");
        if (data.models) {
            data.models.forEach(m => {
                console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
            });
        } else {
            console.log("No models found.");
        }
        console.log("--------------------------------------------------");

    } catch (e) {
        console.error("Fetch Failed:", e.message);
    }
}

listModels();
