import fetch from 'node-fetch';

async function test() {
    try {
        const response = await fetch('http://localhost:5000/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: 'Write a fantasy story in a adventurous tone. Instruction: Ajay begins his first day. Continue the story naturally with 3 sentences.',
                constraints: { genre: 'fantasy', tone: 'adventurous' }
            })
        });
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Response:", text);
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
