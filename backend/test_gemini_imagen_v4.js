import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function testImagenV4() {
    console.log("Testing Imagen 4.0 Fast...");
    // Using the 'fast' model for speed/cost (though free tier quotas apply)
    const model = 'imagen-4.0-fast-generate-001';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${API_KEY}`;

    const body = {
        instances: [
            { prompt: "A cyberpunk detective in a rainy neon city, digital art, 8k, highly detailed" }
        ],
        parameters: {
            sampleCount: 1,
            aspectRatio: "16:9" // Verify if this param is supported by V4
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
            console.error(await response.text());
            return;
        }

        const data = await response.json();
        if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
            console.log("Success! Image generated.");
            console.log("Base64 Length:", data.predictions[0].bytesBase64Encoded.length);
        } else {
            console.log("Unexpected Response:", JSON.stringify(data, null, 2));
        }

    } catch (e) {
        console.error("Test Failed:", e.message);
    }
}

testImagenV4();
