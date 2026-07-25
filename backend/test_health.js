import fetch from 'node-fetch';

async function checkHealth() {
    try {
        const res = await fetch('http://localhost:5000/health');
        if (res.ok) {
            const data = await res.json();
            console.log("Inference Server is UP:", data);
        } else {
            console.log("Inference Server returned:", res.status, res.statusText);
        }
    } catch (e) {
        console.log("Inference Server is DOWN:", e.message);
    }
}

checkHealth();
