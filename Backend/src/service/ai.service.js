require("dotenv").config();
const Groq = require("groq-sdk");
const { InferenceClient } = require("@huggingface/inference");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const hfClient = new InferenceClient(process.env.HF_TOKEN);

async function generateResponse(chatHistory) {
  try {
    const messages = [
      {
        role: "system",
        content: "You are a helpful AI assistant. Provide clear, accurate, and friendly responses.",
      },
    ];

    chatHistory.forEach((item) => {
      messages.push({
        role: item.role === "model" ? "assistant" : item.role,
        content: item.content,
      });
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return "AI is temporarily unavailable.";
  }
}

async function generateVector(content) {
  try {
    const embedding = await hfClient.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: content,
    });

    return embedding;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  generateResponse,
  generateVector,
};
 