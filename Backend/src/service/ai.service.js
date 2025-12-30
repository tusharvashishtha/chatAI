require("dotenv").config();
const Groq = require("groq-sdk");
const { InferenceClient } = require("@huggingface/inference");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const hfClient = new InferenceClient(process.env.HF_TOKEN);

async function generateResponse(chatHistory) {
  const messages = [
    {
      role: "system",
      content:
        "You are a helpful AI assistant. Use provided memory as factual user information.",
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
}

async function generateVector(content) {
  const embedding = await hfClient.featureExtraction({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    inputs: content,
  });

  if (!embedding || !Array.isArray(embedding)) return null;
  return embedding;
}

module.exports = {
  generateResponse,
  generateVector,
};
