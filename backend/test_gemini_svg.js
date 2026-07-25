import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testSVG() {
    console.log("Testing Gemini SVG Generation...");
    try {
        // Fallback to standard alias which usually works for all keys
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
        You are an artist. Generate an SVG code for a book cover.
        Genre: Fantasy.
        Scene: A glowing sword in a stone.
        Style: Minimalist, geometric, vibrant colors.
        Output ONLY the <svg> code. No markdown code blocks, no text.
        Make it 16:9 aspect ratio (viewBox="0 0 768 432").
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Response Length:", text.length);
        if (text.includes("<svg")) {
            console.log("Success! SVG generated.");
            console.log("Snippet:", text.substring(0, 100));
        } else {
            console.log("Failed. Output:", text);
        }

    } catch (e) {
        console.error("SDK Error:", e.message);
    }
}

testSVG();
