import axios from 'axios';

// Freepik Kling Video Generation
export async function generateVideo(prompt, imageBase64 = null) {
    if (!process.env.FREEPIK_API_KEY) {
        throw new Error("Missing FREEPIK_API_KEY");
    }

    const url = 'https://api.freepik.com/v1/ai/active-generation/video-generation'; // Check latest endpoint

    // Note: Actual endpoint might vary. Freepik Kling API is new. 
    // Assuming standard POST structure for now.
    const payload = {
        prompt: prompt,
        // If imageBase64 is provided, it's image-to-video
        image: imageBase64 ? { type: 'base64', data: imageBase64 } : undefined,
        model: 'kling-v2', // or appropriate model ID
        duration: 5
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'x-freepik-api-key': process.env.FREEPIK_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        // Assume response returns a URL or a task ID
        return response.data;
    } catch (error) {
        console.error("Freepik API Error:", error.response ? error.response.data : error.message);
        throw new Error("Video generation failed");
    }
}
