import fetch from 'node-fetch';

async function testHF() {
    console.log("Testing HuggingFace Inference API (Free)...");
    // Flux Schnell is fast and often open
    const model = 'black-forest-labs/FLUX.1-schnell';
    const url = `https://api-inference.huggingface.co/models/${model}`;

    const body = {
        inputs: "A futuristic city with flying cars, digital art, 8k",
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer hf_...' // Trying without key first
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.error(`Error ${response.status}: ${response.statusText}`);
            // verify 503 (loading) vs 401 (unauth)
            console.error(await response.text());
            return;
        }

        const arrayBuffer = await response.arrayBuffer();
        console.log("Success! Image received.");
        console.log("Size:", arrayBuffer.byteLength);

    } catch (e) {
        console.error("Test Failed:", e.message);
    }
}

testHF();
