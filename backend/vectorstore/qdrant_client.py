from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from typing import List, Dict, Any
import google.generativeai as genai
from config import settings
import uuid

# Configure Gemini
genai.configure(api_key=settings.gemini_api_key)

# Global client
qdrant_client = None


async def init_vector_db():
    """Initialize Qdrant vector database"""
    global qdrant_client
    
    qdrant_client = QdrantClient(url=settings.qdrant_url)
    
    # Create collection if it doesn't exist
    collections = qdrant_client.get_collections().collections
    collection_names = [c.name for c in collections]
    
    if settings.collection_name not in collection_names:
        qdrant_client.create_collection(
            collection_name=settings.collection_name,
            vectors_config=VectorParams(
                size=settings.vector_size,
                distance=Distance.COSINE
            )
        )


def get_embedding(text: str) -> List[float]:
    """Generate embedding using Gemini"""
    result = genai.embed_content(
        model=settings.embedding_model,
        content=text,
        task_type="retrieval_document"
    )
    return result['embedding']


def get_query_embedding(text: str) -> List[float]:
    """Generate query embedding using Gemini"""
    result = genai.embed_content(
        model=settings.embedding_model,
        content=text,
        task_type="retrieval_query"
    )
    return result['embedding']


async def add_chunks_to_vectorstore(chunks: List[Dict[str, Any]]) -> int:
    """Add document chunks to vector store"""
    points = []
    
    for chunk in chunks:
        embedding = get_embedding(chunk['text'])
        
        point = PointStruct(
            id=str(uuid.uuid4()),
            vector=embedding,
            payload={
                "chunk_id": chunk['chunk_id'],
                "text": chunk['text'],
                "source": chunk['source'],
                "metadata": chunk.get('metadata', {})
            }
        )
        points.append(point)
    
    qdrant_client.upsert(
        collection_name=settings.collection_name,
        points=points
    )
    
    return len(points)


async def search_similar_chunks(query: str, limit: int = 5) -> List[Dict[str, Any]]:
    """Search for similar chunks in vector store"""
    query_vector = get_query_embedding(query)
    
    search_result = qdrant_client.search(
        collection_name=settings.collection_name,
        query_vector=query_vector,
        limit=limit
    )
    
    results = []
    for hit in search_result:
        results.append({
            "chunk_id": hit.payload['chunk_id'],
            "text": hit.payload['text'],
            "source": hit.payload['source'],
            "score": hit.score,
            "metadata": hit.payload.get('metadata', {})
        })
    
    return results


async def get_chunks_for_topic(topic: str, threshold: float = 0.5, limit: int = 10) -> Dict[str, Any]:
    """Get relevant chunks for a syllabus topic"""
    chunks = await search_similar_chunks(topic, limit=limit)
    
    # Filter by threshold
    relevant_chunks = [c for c in chunks if c['score'] >= threshold]
    
    # Calculate confidence
    avg_score = sum(c['score'] for c in relevant_chunks) / len(relevant_chunks) if relevant_chunks else 0
    has_sufficient_content = len(relevant_chunks) >= 3 and avg_score >= 0.6
    
    return {
        "topic": topic,
        "relevant_chunks": [c['chunk_id'] for c in relevant_chunks],
        "chunks_data": relevant_chunks,
        "confidence_score": avg_score,
        "has_sufficient_content": has_sufficient_content
    }
