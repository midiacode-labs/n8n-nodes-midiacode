.PHONY: build test lint lint-fix ci install

# Install dependencies
install:
	npm ci

# Run linter
lint:
	npm run lint

# Fix linter errors automatically
lint-fix:
	npm run lint:fix

# Run tests
test:
	npm test

# Run tests with coverage
test-coverage:
	npm run test:coverage

# Run CI pipeline (same as GitHub Actions)
ci: install lint test build
	@echo "✓ CI pipeline completed successfully"

# Build the project
build:
	npm run build
	mkdir -p ~/.n8n/custom/
	cp -r dist/* ~/.n8n/custom/

# Help command
help:lint-fix       - Fix linter errors automatically"
	@echo "  make 
	@echo "Available commands:"
	@echo "  make install        - Install dependencies (npm ci)"
	@echo "  make lint           - Run linter"
	@echo "  make test           - Run tests"
	@echo "  make test-coverage  - Run tests with coverage"
	@echo "  make ci             - Run full CI pipeline (install, lint, test, build)"
	@echo "  make build          - Build and copy to n8n custom folder"
	@echo "  make help           - Show this help message"
