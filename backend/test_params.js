import fetch from 'node-fetch';

async function testParams() {
    // Exact prompt from user's failure
    const prompt = "Book cover of fantasy story, suspenseful. It was first day of Rahul at office Rahul sat down on his desk with a sigh not sure what to do next. Digital art, cinematic lighting, 8k";
    const seed = Math.floor(Math.random() * 100000);

    // Explicitly test potential models
    const models = ['flux', 'turbo', 'flux-realism', 'any'];

    console.log(`Testing with seed: ${seed}`);

    for (const m of models) {
        // Construct URL
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=432&seed=${seed}&nologo=true&model=${m}`;
        console.log(`\nTesting model='${m}'`);
        console.log(`URL: ${url}`);

        try {
            const res = await fetch(url);
            const contentType = res.headers.get('content-type');
            const contentLength = res.headers.get('content-length');

            console.log(`Status: ${res.status}`);
            console.log(`Type: ${contentType}`);
            console.log(`Size: ${contentLength}`);

            if (parseInt(contentLength) < 100000) {
                console.log("⚠️  WARNING: Size < 100KB -> Likely Placeholder");
            } else {
                console.log("✅  SUCCESS: Likely Real Image");
            }

        } catch (e) {
            console.log(`Error: ${e.message}`);
        }
    }
}

testParams();
