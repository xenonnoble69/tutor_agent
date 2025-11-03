import re
from typing import List, Dict
from models.schemas import SyllabusUnit


class SyllabusParser:
    """Parse syllabus text into structured format"""
    
    def parse(self, syllabus_text: str) -> List[SyllabusUnit]:
        """Parse syllabus text into units and topics"""
        lines = syllabus_text.split('\n')
        units = []
        current_unit = None
        current_topics = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Check if line is a unit header
            if self._is_unit_header(line):
                # Save previous unit if exists
                if current_unit and current_topics:
                    units.append(SyllabusUnit(
                        unit=current_unit,
                        topics=current_topics
                    ))
                
                # Start new unit
                current_unit = self._extract_unit_name(line)
                current_topics = []
            
            # Check if line is a topic
            elif self._is_topic(line):
                topic = self._extract_topic_name(line)
                if topic:
                    current_topics.append(topic)
        
        # Add last unit
        if current_unit and current_topics:
            units.append(SyllabusUnit(
                unit=current_unit,
                topics=current_topics
            ))
        
        return units
    
    def _is_unit_header(self, line: str) -> bool:
        """Check if line is a unit header"""
        patterns = [
            r'^Unit\s+\d+',
            r'^Module\s+\d+',
            r'^Chapter\s+\d+',
            r'^Section\s+\d+',
            r'^\d+\.',
        ]
        
        for pattern in patterns:
            if re.match(pattern, line, re.IGNORECASE):
                return True
        
        # Check if line is all caps or ends with colon
        if line.isupper() or line.endswith(':'):
            return True
        
        return False
    
    def _is_topic(self, line: str) -> bool:
        """Check if line is a topic"""
        # Topics usually start with bullets, dashes, or numbers
        if re.match(r'^[-•*]\s+', line):
            return True
        if re.match(r'^\d+\.\d+', line):
            return True
        
        return False
    
    def _extract_unit_name(self, line: str) -> str:
        """Extract unit name from header"""
        # Remove common prefixes
        line = re.sub(r'^(Unit|Module|Chapter|Section)\s+\d+\s*[:–-]?\s*', '', line, flags=re.IGNORECASE)
        line = re.sub(r'^\d+\.\s*', '', line)
        line = line.rstrip(':')
        
        return line.strip()
    
    def _extract_topic_name(self, line: str) -> str:
        """Extract topic name from line"""
        # Remove bullets, dashes, numbers
        line = re.sub(r'^[-•*]\s+', '', line)
        line = re.sub(r'^\d+\.\d+\s*', '', line)
        line = re.sub(r'^\d+\)\s*', '', line)
        
        return line.strip()


# Singleton instance
syllabus_parser = SyllabusParser()
