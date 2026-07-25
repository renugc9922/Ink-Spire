import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function list() {
    console.log("Testing Gemini Key (Text)...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent("Hello! Are you working?");
        const response = await result.response;
        console.log("Success! Response:", response.text());

    } catch (e) {
        console.error("SDK Error:", e.message);
    }
}

list();
