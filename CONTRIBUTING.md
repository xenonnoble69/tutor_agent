# Contributing to Agentic AI Tutor

Thank you for your interest in contributing! Here's how you can help:

## Development Setup

1. Fork the repository
2. Clone your fork
3. Follow the setup instructions in QUICKSTART.md
4. Create a new branch for your feature

## Code Style

### Python (Backend)
- Follow PEP 8
- Use type hints where possible
- Add docstrings to functions
- Maximum line length: 100 characters

### JavaScript (Frontend)
- Use ESLint configuration provided
- Use functional components with hooks
- Follow component naming conventions

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Pull Request Process

1. Update documentation for any changed functionality
2. Add tests for new features
3. Ensure all tests pass
4. Update the README if needed
5. Create a pull request with a clear description

## Feature Requests & Bug Reports

- Use GitHub Issues
- Provide detailed description
- Include steps to reproduce (for bugs)
- Add screenshots if applicable

## Agent Development Guidelines

When adding new AI agents:
1. Create agent class in `backend/agents/`
2. Define clear prompt templates
3. Add error handling
4. Document expected inputs/outputs
5. Add to main agents collection

## Architecture Principles

- Keep agents modular and reusable
- Use async/await for I/O operations
- Implement proper error handling
- Cache expensive operations
- Log important events

Thank you for contributing! 🎓
