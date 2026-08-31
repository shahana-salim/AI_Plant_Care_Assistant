require("dotenv").config();
const ai = require("./config/gemini");

async function testGemini() {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: "Say hello and briefly explain what you can do for a plant care application."
        });

        console.log("\nGemini response:\n");
        console.log(response.text);
    } catch (error) {
        console.error("\nGemini test failed:");
        console.error(error.message);
    }
}

testGemini();