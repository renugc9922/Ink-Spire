
import fetch from 'node-fetch';

async function testPollinations() {
    console.log("Testing Pollinations.ai (Text)...");
    try {
        const res = await fetch('https://text.pollinations.ai/Write a one sentence story about a cat.');
        if (res.ok) {
            const text = await res.text();
            console.log("✅ Pollinations Text Success:", text);
        } else {
            console.log("❌ Pollinations Text Failed:", res.status);
        }
    } catch (e) {
        console.log("❌ Pollinations Text Error:", e.message);
    }

    console.log("\nTesting Pollinations.ai (Image)...");
    try {
        const res = await fetch('https://image.pollinations.ai/prompt/A%20cat%20in%20space');
        if (res.ok) {
            console.log("✅ Pollinations Image Success (Returns Blob)");
        } else {
            console.log("❌ Pollinations Image Failed:", res.status);
        }
    } catch (e) {
        console.log("❌ Pollinations Image Error:", e.message);
    }
}

testPollinations();
