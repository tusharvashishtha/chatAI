// Import the Pinecone library
const { Pinecone } =  require('@pinecone-database/pinecone')
require('dotenv').config();

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const chatai = pc.Index(process.env.PINECONE_INDEX);

async function createMemory({vectors, metadata, messageId}){
    await chatai.upsert([{
        id : messageId,
        values: vectors,
        metadata
    }])
}

async function queryMemory({queryVector , limit = 5 , metadata}){
    const data = await chatai.query({
        vector : queryVector,
        topK: limit, // number of most similar vectors to return from Pinecone
        filter: metadata ? metadata : undefined,
        includeMetadata: true
    })
    return data.matches;
}

module.exports = { createMemory , queryMemory };