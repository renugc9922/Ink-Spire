import fetch from 'node-fetch';

async function test() {
    try {
        console.log("Sending Request to Generate Cover...");
        const response = await fetch('http://localhost:3001/api/generate-cover', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                storyText: "Ajay walked into the dark forest, his sword glowing with a blue light. The trees seemed to whisper ancient secrets.",
                config: { genre: 'fantasy', tone: 'mysterious' }
            })
        });
        const json = await response.json();
        console.log("Response Type:", typeof json.imageUrl);
        if (json.imageUrl && json.imageUrl.length > 50) {
            console.log("Success! Received valid Data URI. Length:", json.imageUrl.length);
            console.log("Preview:", json.imageUrl.substring(0, 50));
        } else {
            console.log("Failed:", json);
        }
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
