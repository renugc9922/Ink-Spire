import fetch from 'node-fetch';

async function testProxy() {
    console.log("Testing Pollinations Proxy...");

    const prompt = "Book cover of fantasy story. Digital art, cinematic lighting, 8k";
    // Using the exact URL construction from server.js
    const cleanPrompt = prompt.replace(/[^\w\s,.?!]/g, ' ').substring(0, 250);
    const seed = Math.floor(Math.random() * 100000);
    const timestamp = Date.now();
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=768&height=432&seed=${seed}&nologo=true&model=turbo&t=${timestamp}`;

    console.log("Fetching URL:", url);

    try {
        const start = Date.now();
        const imageRes = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
            }
        });
        if (!imageRes.ok) throw new Error(`Pollinations Fetch Failed: ${imageRes.status}`);

        const arrayBuffer = await imageRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const dataUri = `data:${imageRes.headers.get('content-type') || 'image/jpeg'};base64,${base64}`;

        console.log(`Success! Image Size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Base64 Length: ${base64.length}`);
        console.log(`Time Taken: ${(Date.now() - start) / 1000}s`);

    } catch (error) {
        console.error("Proxy Failed:", error.message);
    }
}

testProxy();
