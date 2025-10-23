# Contributing Guide

Thank you for considering contributing to this project! This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Maintain professionalism

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker (for local development)
- PostgreSQL >= 15
- Redis >= 7

### Setup Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd platform-compliance-observability

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate encryption keys
echo "ENCRYPTION_MASTER_KEY=$(openssl rand -base64 32)" >> .env
echo "ENCRYPTION_SALT=$(openssl rand -base64 32)" >> .env

# Start dependencies with Docker
docker-compose up -d postgres redis

# Run in development mode
npm run dev
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or changes
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Follow existing code style
- Write tests for new features
- Update documentation as needed
- Keep commits focused and atomic

### 3. Test Your Changes

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type check
npm run typecheck

# Build
npm run build
```

### 4. Commit Your Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve issue with X"
git commit -m "docs: update README"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Pull Request Guidelines

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] No merge conflicts
- [ ] CI/CD checks passing

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How the changes were tested

## Screenshots (if applicable)

## Related Issues
Closes #issue-number
```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define interfaces for data structures
- Use meaningful variable names
- Avoid `any` type where possible

### Naming Conventions

- **Classes**: PascalCase (`HealthCheckService`)
- **Functions**: camelCase (`createLogger`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Interfaces**: PascalCase with `I` prefix optional (`LogContext`)
- **Files**: kebab-case (`health-check.ts`)

### Code Organization

```
src/
├── index.ts              # Entry point
├── logging/              # Logging utilities
├── metrics/              # Metrics collection
├── tracing/              # Distributed tracing
├── health/               # Health checks
├── security/             # Security utilities
├── audit/                # Audit logging
├── middleware/           # Express middleware
└── __tests__/            # Tests
```

### Comments

- Write self-documenting code
- Add comments for complex logic
- Use JSDoc for public APIs
- Keep comments up to date

Example:
```typescript
/**
 * Encrypts sensitive field data using AES-256-GCM
 * @param plaintext - The data to encrypt
 * @param context - Encryption context for key derivation
 * @returns Base64-encoded encrypted data
 */
encryptField(plaintext: string, context: string): string
```

## Testing Guidelines

### Test Structure

```typescript
describe('ComponentName', () => {
  let component: ComponentType;

  beforeEach(() => {
    // Setup
    component = new ComponentType();
  });

  afterEach(() => {
    // Cleanup
  });

  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = component.method(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Testing Best Practices

- Write unit tests for all business logic
- Write integration tests for API endpoints
- Mock external dependencies
- Test error cases
- Aim for 80%+ code coverage
- Keep tests fast and focused

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- logger.test.ts

# Run in watch mode
npm run test:watch
```

## Documentation

### What to Document

- Public APIs and functions
- Configuration options
- Deployment procedures
- Troubleshooting steps
- Architecture decisions

### Documentation Format

- Use Markdown
- Include code examples
- Add diagrams where helpful
- Keep it up to date

### Where to Document

- **README.md** - Overview and quick start
- **docs/** - Detailed documentation
- **Code comments** - Implementation details
- **CHANGELOG.md** - Version history

## Security

### Reporting Security Issues

Do NOT create public issues for security vulnerabilities.

Instead, email: security@example.com

### Security Best Practices

- Never commit secrets or credentials
- Use environment variables for configuration
- Validate all user input
- Follow OWASP guidelines
- Keep dependencies updated
- Use security linting tools

## Review Process

### What Reviewers Look For

1. **Correctness**: Does it work as intended?
2. **Testing**: Are there adequate tests?
3. **Code Quality**: Is it readable and maintainable?
4. **Documentation**: Is it properly documented?
5. **Security**: Are there security concerns?
6. **Performance**: Any performance issues?

### Responding to Feedback

- Be open to suggestions
- Ask questions if unclear
- Make requested changes promptly
- Thank reviewers for their time

## Getting Help

- **Documentation**: Check docs/ folder
- **Issues**: Search existing issues
- **Discussions**: Use GitHub Discussions
- **Slack**: Join project Slack channel

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
