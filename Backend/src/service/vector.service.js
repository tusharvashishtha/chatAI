require("dotenv").config();
const { Pinecone } = require("@pinecone-database/pinecone");

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pc.Index(process.env.PINECONE_INDEX);

async function createMemory({ vectors, metadata, messageId }) {
  try {
    if (!vectors || !Array.isArray(vectors)) {
      console.warn("⚠️ Pinecone skipped: Invalid vectors");
      return;
    }

    await index.upsert([
      {
        id: messageId.toString(),
        values: vectors,
        metadata,
      },
    ]);
  } catch (error) {
    console.error("Pinecone upsert failed:", error.message);
  }
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
  try {
    if (!queryVector || !Array.isArray(queryVector)) {
      return [];
    }

    const result = await index.query({
      vector: queryVector,
      topK: limit,
      filter: metadata || undefined,
      includeMetadata: true,
    });

    return result.matches || [];
  } catch (error) {
    console.error("Pinecone query failed:", error.message);
    return [];
  }
}

module.exports = {
  createMemory,
  queryMemory,
};
