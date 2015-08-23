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
	$(NODE) ./node_modules/gulp/bin/gulp.js watch &
	cp samples/*.json dist
	open http://localhost:8080/webpack-dev-server/index.html
	./node_modules/.bin/webpack-dev-server --content-base dist --hot

# CLEAN ########################################################################

.PHONY: clean
clean:
	rm -rf dist
