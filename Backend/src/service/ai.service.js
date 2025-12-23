require("dotenv").config();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateResponse(chatHistory) {
  try {
    const messages = [
      {
        role: "system",
        content: "You are a helpful AI assistant. Provide clear, accurate, and friendly responses."
      }
    ];

    chatHistory.forEach(item => {
      messages.push({
        role: item.role === 'model' ? 'assistant' : item.role,
        content: item.content
      });
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Groq Error:", error);
    return "AI is temporarily unavailable.";
  }
}

module.exports = {
  generateResponse,
};