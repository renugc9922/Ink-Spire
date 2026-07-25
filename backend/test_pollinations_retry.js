import fetch from 'node-fetch';

async function retryPollinations() {
    console.log("Retrying Pollinations...");
    const prompt = "A futuristic city with flying cars, digital art, 8k";
    const cleanPrompt = encodeURIComponent(prompt);

    // Try different models
    const models = ['flux', 'turbo', 'flux-realism', 'any'];

    for (const model of models) {
        const url = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=768&height=432&nologo=true&model=${model}`;
        console.log(`Testing Model: ${model}`);

        try {
            const res = await fetch(url, {
                headers: {
                    // Mimic a real browser precisely
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Referer': 'https://pollinations.ai/'
                }
            });

            if (res.ok) {
                console.log(`SUCCESS! Model ${model} works.`);
                console.log(`Status: ${res.status}`);
                return;
            } else {
                console.log(`Failed ${model}: ${res.status} ${res.statusText}`);
            }
        } catch (e) {
            console.log(`Error ${model}: ${e.message}`);
        }
    }
}

retryPollinations();
