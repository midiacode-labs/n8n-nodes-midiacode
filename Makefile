.PHONY: build

build:
	npm run build
	mkdir -p ~/.n8n/custom/
	cp -r dist/* ~/.n8n/custom/
