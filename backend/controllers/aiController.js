const Plant = require("../models/Plant");
const ai = require("../config/gemini");

const askPlantAI = async (req, res) => {
    try {
        const { question, plantId } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                message: "Question is required"
            });
        }

        let plant = null;

        // Plant selection is optional.
        // If provided, make sure it belongs to the logged-in user.
        if (plantId) {
            plant = await Plant.findOne({
                _id: plantId,
                userId: req.user.id
            });

            if (!plant) {
                return res.status(404).json({
                    message: "Plant not found"
                });
            }
        }

        const plantContext = plant
            ? `
The user is asking about their plant:

Plant name: ${plant.name}
Species: ${plant.species || "Unknown"}

Use this information when answering the question.
`
            : `
The user has not selected a specific plant.
Answer the question generally and mention when the advice
may vary depending on the plant species.
`;

        const prompt = `
You are a helpful AI plant-care assistant.

${plantContext}

User's question:
${question.trim()}

Give a clear, practical and easy-to-understand answer.

Guidelines:
- Focus on plant care and plant health.
- Explain the likely reason when relevant.
- Give practical steps the user can follow.
- Do not invent information.
- If the question cannot be answered confidently without more
  information, say what additional information would help.
- Keep the response reasonably concise.
`;

        const response = await ai.interactions.create({
            model: "gemini-3.6-flash",
            input: [
                {
                    type: "user_input",
                    content: [
                        {
                            type: "text",
                            text: prompt
                        }
                    ]
                }
            ]
        });

        const answer = response.output_text;

        if (!answer) {
            return res.status(500).json({
                message: "AI did not return an answer"
            });
        }

        res.status(200).json({
            answer,
            plant: plant
                ? {
                    id: plant._id,
                    name: plant.name,
                    species: plant.species
                }
                : null
        });

    } catch (error) {
        console.error("Plant AI error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    askPlantAI
};