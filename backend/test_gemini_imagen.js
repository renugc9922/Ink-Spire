import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function testGeminiImagen() {
    console.log("Testing Google Imagen via Gemini API Key...");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${API_KEY}`;

    const body = {
        instances: [
            { prompt: "A futuristic city with flying cars, digital art, 8k" }
        ],
        parameters: {
            sampleCount: 1,
            aspectRatio: "16:9"
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.error(`Error ${response.status}: ${response.statusText}`);
            const errorText = await response.text();
            console.error("Details:", errorText);
            return;
        }

        const data = await response.json();
        console.log("Success!");
        if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
            console.log("Image Data Received (Base64). Length:", data.predictions[0].bytesBase64Encoded.length);
        } else {
            console.log("Response Structure:", JSON.stringify(data, null, 2));
        }

    } catch (e) {
        console.error("Fetch Failed:", e.message);
    }
}

testGeminiImagen();
