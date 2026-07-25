import fetch from 'node-fetch';

async function testTextGen() {
    console.log("Testing /api/generate endpoint...");
    try {
        const res = await fetch('http://localhost:3001/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userInput: "Rahul walked into the office.",
                config: { genre: "thriller", tone: "suspenseful" }
            })
        });

        if (!res.ok) {
            console.error(`Status: ${res.status} ${res.statusText}`);
            const text = await res.text();
            console.error("Body:", text);
            return;
        }

        const data = await res.json();
        console.log("Success!");
        console.log("Generated Text:", data.text);

    } catch (e) {
        console.error("Request Failed:", e.message);
    }
}

testTextGen();
