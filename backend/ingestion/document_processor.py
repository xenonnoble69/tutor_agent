import fitz  # PyMuPDF
from docx import Document as DocxDocument
from typing import List, Dict, Any
import re
from config import settings


class DocumentProcessor:
    """Process documents and extract text"""
    
    def __init__(self):
        self.chunk_size = settings.chunk_size
        self.chunk_overlap = settings.chunk_overlap
    
    def process_pdf(self, file_path: str) -> str:
        """Extract text from PDF"""
        text = ""
        doc = fitz.open(file_path)
        
        for page_num, page in enumerate(doc):
            page_text = page.get_text()
            text += f"\n[Page {page_num + 1}]\n{page_text}"
        
        doc.close()
        return self.clean_text(text)
    
    def process_docx(self, file_path: str) -> str:
        """Extract text from DOCX"""
        doc = DocxDocument(file_path)
        text = "\n".join([para.text for para in doc.paragraphs])
        return self.clean_text(text)
    
    def process_txt(self, file_path: str) -> str:
        """Extract text from TXT"""
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
        return self.clean_text(text)
    
    def clean_text(self, text: str) -> str:
        """Clean extracted text"""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters (keep basic punctuation)
        text = re.sub(r'[^\w\s.,!?;:()\-\[\]]', '', text)
        
        # Remove page numbers patterns
        text = re.sub(r'\[Page \d+\]', '', text)
        
        return text.strip()
    
    def chunk_text(self, text: str, source: str) -> List[Dict[str, Any]]:
        """Split text into overlapping chunks"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), self.chunk_size - self.chunk_overlap):
            chunk_words = words[i:i + self.chunk_size]
            chunk_text = ' '.join(chunk_words)
            
            if len(chunk_text.strip()) > 50:  # Minimum chunk size
                chunk_id = f"{source}_chunk_{len(chunks)}"
                chunks.append({
                    "chunk_id": chunk_id,
                    "text": chunk_text,
                    "source": source,
                    "metadata": {
                        "chunk_index": len(chunks),
                        "word_count": len(chunk_words)
                    }
                })
        
        return chunks
    
    def process_document(self, file_path: str, filename: str) -> List[Dict[str, Any]]:
        """Process document and return chunks"""
        # Determine file type
        if filename.lower().endswith('.pdf'):
            text = self.process_pdf(file_path)
        elif filename.lower().endswith('.docx'):
            text = self.process_docx(file_path)
        elif filename.lower().endswith('.txt'):
            text = self.process_txt(file_path)
        else:
            raise ValueError(f"Unsupported file type: {filename}")
        
        # Chunk the text
        chunks = self.chunk_text(text, filename)
        
        return chunks


# Singleton instance
document_processor = DocumentProcessor()
