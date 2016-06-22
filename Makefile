.PHONY: clean build bin test dev-dev dev-build dev-bin

clean:
	rm -rf ./dist

dev-dev:
	rm -rf ./test/sample/dist
	STATIC_BUILD_SRC='./test/sample/src' \
	STATIC_BUILD_DIST='./test/sample/dist' \
	babel-node ./node_modules/.bin/gulp \
	--cwd . \
	--gulpfile ./src/gulpfile.js \
	dev

dev-build:
	rm -rf ./test/sample/dist
	STATIC_BUILD_SRC='./test/sample/src' \
	STATIC_BUILD_DIST='./test/sample/dist' \
	babel-node ./node_modules/.bin/gulp \
	--cwd . \
	--gulpfile ./src/gulpfile.js

dev-bin: build
	node ./dist/static-build.js \
	-s ./test/sample/src

build: clean
	babel ./src -d ./dist


test:
	rm -rf ./test/sample/dist
	./node_modules/.bin/mocha --require babel-register --timeout 10000 ./test/index.js
