import google.generativeai as genai
from typing import List, Dict, Any
from config import settings

genai.configure(api_key=settings.gemini_api_key)


class PlannerAgent:
    """Agent that creates lesson plans from syllabus topics"""
    
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro')
    
    async def create_lesson_plan(self, topics: List[str], context_chunks: Dict[str, List[str]]) -> List[Dict[str, Any]]:
        """Create a sequential lesson plan"""
        
        prompt = f"""You are a curriculum planner.
        
Given the following syllabus topics and available content, create a sequential lesson plan.

Topics:
{chr(10).join(f"- {topic}" for topic in topics)}

For each topic, create a lesson with:
1. Lesson number
2. Title (engaging and clear)
3. Topic name
4. Estimated duration (e.g., "45 minutes")

Organize lessons in a logical learning sequence.
Output as a numbered list.

Example format:
1. Introduction to Networks (Networks Basics) - 30 minutes
2. Understanding OSI Model (OSI Model) - 45 minutes
"""
        
        response = self.model.generate_content(prompt)
        lessons = self._parse_lesson_plan(response.text, topics)
        
        return lessons
    
    def _parse_lesson_plan(self, text: str, topics: List[str]) -> List[Dict[str, Any]]:
        """Parse lesson plan from text"""
        lessons = []
        lines = text.split('\n')
        
        lesson_num = 1
        for line in lines:
            line = line.strip()
            if line and (line[0].isdigit() or line.startswith('-')):
                # Simple parsing - in production, use more robust parsing
                lessons.append({
                    "lesson_number": lesson_num,
                    "title": f"Lesson {lesson_num}",
                    "topic": topics[lesson_num - 1] if lesson_num <= len(topics) else "General",
                    "estimated_duration": "45 minutes"
                })
                lesson_num += 1
        
        # Fallback: create basic plan from topics
        if not lessons:
            for i, topic in enumerate(topics, 1):
                lessons.append({
                    "lesson_number": i,
                    "title": f"Understanding {topic}",
                    "topic": topic,
                    "estimated_duration": "45 minutes"
                })
        
        return lessons


class TeachingAgent:
    """Agent that teaches topics interactively"""
    
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro')
    
    async def teach_topic(
        self,
        topic: str,
        chunks: List[str],
        user_message: str = None,
        conversation_history: List[Dict[str, str]] = None
    ) -> Dict[str, str]:
        """Teach a topic using provided content chunks"""
        
        context = "\n\n".join(chunks)
        
        if not user_message:
            # Initial teaching
            prompt = f"""You are an expert tutor teaching the topic: {topic}

Use ONLY the following content to teach this concept:

{context}

Your task:
1. Explain the concept clearly for a beginner
2. Use examples from the provided content
3. Break down complex ideas into simple terms
4. End with an engaging follow-up question to check understanding

Keep your explanation concise (2-3 paragraphs).
"""
        else:
            # Continuing conversation
            prompt = f"""You are an expert tutor teaching the topic: {topic}

Reference content:
{context}

Student's message: {user_message}

Respond to the student's question or comment:
1. Answer their question using the provided content
2. Clarify any misconceptions
3. Provide additional explanation if needed
4. Ask a follow-up question to deepen understanding
"""
        
        response = self.model.generate_content(prompt)
        
        # Extract follow-up question (simple heuristic)
        text = response.text
        follow_up = None
        
        if '?' in text:
            sentences = text.split('.')
            for sentence in reversed(sentences):
                if '?' in sentence:
                    follow_up = sentence.strip()
                    break
        
        return {
            "message": text,
            "follow_up_question": follow_up
        }


class QuizAgent:
    """Agent that generates and evaluates quizzes"""
    
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro')
    
    async def generate_quiz(
        self,
        topic: str,
        chunks: List[str],
        num_questions: int = 5,
        difficulty: str = "medium"
    ) -> List[Dict[str, Any]]:
        """Generate quiz questions from content"""
        
        context = "\n\n".join(chunks[:3])  # Use top 3 chunks
        
        prompt = f"""Generate {num_questions} multiple choice questions about: {topic}

Difficulty level: {difficulty}

Base your questions ONLY on this content:
{context}

For each question, provide:
1. Question text
2. Four options (A, B, C, D)
3. Correct answer (letter)
4. Brief explanation

Format each question as:
Q: [question]
A) [option]
B) [option]
C) [option]
D) [option]
Answer: [letter]
Explanation: [explanation]

---
"""
        
        response = self.model.generate_content(prompt)
        questions = self._parse_questions(response.text, topic)
        
        return questions
    
    def _parse_questions(self, text: str, topic: str) -> List[Dict[str, Any]]:
        """Parse questions from generated text"""
        questions = []
        current_q = {}
        
        lines = text.split('\n')
        question_num = 0
        
        for line in lines:
            line = line.strip()
            
            if line.startswith('Q:') or line.startswith(f'{question_num + 1}.'):
                if current_q:
                    questions.append(current_q)
                question_num += 1
                current_q = {
                    "question_id": f"{topic}_q{question_num}",
                    "question": line.replace('Q:', '').replace(f'{question_num}.', '').strip(),
                    "options": [],
                    "correct_answer": "",
                    "explanation": ""
                }
            elif line and line[0] in ['A', 'B', 'C', 'D'] and ')' in line:
                option = line[3:].strip()
                current_q["options"].append(option)
            elif line.startswith('Answer:'):
                answer = line.replace('Answer:', '').strip()
                if current_q["options"]:
                    # Convert letter to actual answer text
                    letter_idx = {'A': 0, 'B': 1, 'C': 2, 'D': 3}
                    idx = letter_idx.get(answer[0].upper(), 0)
                    current_q["correct_answer"] = current_q["options"][idx] if idx < len(current_q["options"]) else current_q["options"][0]
            elif line.startswith('Explanation:'):
                current_q["explanation"] = line.replace('Explanation:', '').strip()
        
        if current_q and current_q.get("question"):
            questions.append(current_q)
        
        return questions
    
    async def evaluate_answer(
        self,
        question: str,
        correct_answer: str,
        student_answer: str
    ) -> Dict[str, Any]:
        """Evaluate a student's answer"""
        
        is_correct = student_answer.strip().lower() == correct_answer.strip().lower()
        score = 1.0 if is_correct else 0.0
        
        if not is_correct:
            prompt = f"""Question: {question}
Correct Answer: {correct_answer}
Student's Answer: {student_answer}

Briefly explain why the student's answer is incorrect and what the right concept is.
Keep it to 2-3 sentences."""
            
            response = self.model.generate_content(prompt)
            feedback = response.text
        else:
            feedback = "Correct! Well done."
        
        return {
            "is_correct": is_correct,
            "score": score,
            "feedback": feedback
        }


class EvaluationAgent:
    """Agent that evaluates overall student performance"""
    
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro')
    
    async def analyze_performance(
        self,
        topic: str,
        quiz_results: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyze student performance and provide recommendations"""
        
        total_score = sum(r['score'] for r in quiz_results)
        max_score = len(quiz_results)
        percentage = (total_score / max_score * 100) if max_score > 0 else 0
        
        incorrect_questions = [r for r in quiz_results if not r['is_correct']]
        
        if percentage >= 80:
            recommendation = "Excellent work! You've mastered this topic. Ready to move on."
        elif percentage >= 60:
            recommendation = "Good progress! Review the topics you missed and try again."
        else:
            recommendation = "This topic needs more attention. Review the material and practice more."
        
        return {
            "topic": topic,
            "score_percentage": percentage,
            "total_correct": int(total_score),
            "total_questions": max_score,
            "weak_areas": [q.get('topic', topic) for q in incorrect_questions],
            "recommendation": recommendation
        }


# Singleton instances
planner_agent = PlannerAgent()
teaching_agent = TeachingAgent()
quiz_agent = QuizAgent()
evaluation_agent = EvaluationAgent()
