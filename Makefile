NODE := "node"

# RUN ##########################################################################

.PHONY: all
all: build

# BUILD ########################################################################

.PHONY: build
build: depends
	$(NODE) ./node_modules/gulp/bin/gulp.js

.PHONY: depends
depends:
	@ echo "Installing component dependencies..."
	@ echo
	npm install

.PHONY: run
run:
	@echo "====="
	@echo "Open a web browser pointing to:"
	@echo "http://localhost:8080/webpack-dev-server/ to hack or,"
	@echo "http://localhost:8080 to play"
	@echo "====="

	$(NODE) ./node_modules/gulp/bin/gulp.js && $(NODE) ./node_modules/webpack-dev-server/bin/webpack-dev-server.js --hot --content-base dist

# CLEAN ########################################################################

.PHONY: clean
clean:
	rm -rf dist
