require("dotenv").config();
const { Pinecone } = require("@pinecone-database/pinecone");

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pc.Index(process.env.PINECONE_INDEX);

async function createMemory({ vectors, metadata, messageId }) {
  if (!vectors || !Array.isArray(vectors)) return;

  await index.upsert([
    {
      id: messageId.toString(),
      values: vectors,
      metadata,
    },
  ]);
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
  if (!queryVector || !Array.isArray(queryVector)) return [];

  const result = await index.query({
    vector: queryVector,
    topK: limit,
    filter: metadata,
    includeMetadata: true,
  });

  return result.matches || [];
}

module.exports = {
  createMemory,
  queryMemory,
};
