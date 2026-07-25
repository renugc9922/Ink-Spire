import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';

const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;

console.log("🔑 Testing API Key:", HF_API_KEY ? "Found (Starts with " + HF_API_KEY.substring(0, 5) + ")" : "MISSING");

const models = [
    "HuggingFaceH4/zephyr-7b-beta",
    "mistralai/Mistral-7B-Instruct-v0.2",
    "mistralai/Mistral-7B-Instruct-v0.3",
    "google/flan-t5-large", // Very reliable backup
    "gpt2" // Absolute baseline
];

const capabilities = ["text-generation", "text2text-generation", "text-generation", "text2text-generation", "text-generation"];

async function checkModel(model, type) {
    const url = `https://api-inference.huggingface.co/models/${model}`; // Standard Endpoint
    const routerUrl = `https://router.huggingface.co/models/${model}`; // Router Endpoint

    console.log(`\n🔎 Probing ${model}...`);

    async function tryUrl(u, label) {
        try {
            const res = await fetch(u, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${HF_API_KEY}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ inputs: "Hello world", parameters: { max_new_tokens: 5 } })
            });
            
            if (res.ok) {
                console.log(`   ✅ [${label}] SUCCESS: ${res.status}`);
                return true;
            } else {
                console.log(`   ❌ [${label}] FAILED: ${res.status} - ${res.statusText}`);
                if (res.status === 404 || res.status === 410) return false;
                // 503 means loading, which counts as "exists but busy" -> Good candidate
                if (res.status === 503) {
                    console.log(`   ⚠️ [${label}] MODEL LOADING (Valid but cold)`);
                    return true;
                }
                return false;
            }
        } catch (e) {
            console.log(`   ❌ [${label}] ERROR: ${e.message}`);
            return false;
        }
    }

    const standard = await tryUrl(url, "Standard");
    const router = await tryUrl(routerUrl, "Router");

    if (standard || router) return { model, working: true };
    return { model, working: false };
}

(async () => {
    for (let i = 0; i < models.length; i++) {
        await checkModel(models[i], capabilities[i]);
    }
})();
