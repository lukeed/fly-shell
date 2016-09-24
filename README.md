# fly-exec [![npm package][npm-ver-link]][npm-pkg-link] [![][travis-badge]][travis-link]
> Execute shell commands with Fly

## Install

```a
npm install --save-dev fly-exec
```

## API

`fly-exec` has the same options as [child_process.exec](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback).

### .exec(command, [options])

#### command
Type: `string`<br>
Any occurrences of `$file` will be replaced with the the relevant filepath or glob pattern.

#### options
Type: `object`<br>
See [child_process.exec](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback) for info.

#### options.glob
Type: `boolean`<br>
If the command should use the glob pattern within `source()`, you must set this to `true` or `1`. See [here](#iterate-once-per-glob) for example.


## Usage

#### Iterate Once Per File

You can apply a command to each file of your `glob` match. 

Instances of `$file` will be replaced by the file's path.

```js
exports.default = function * () {
  yield this.source('src/*.js')
    .exec('cat $file')
    //=> fly-exec: console.log('this is src/a.js')
    //=> fly-exec: console.log('this is src/b.js')
    //=> fly-exec: console.log('this is src/c.js')
    .dist('dist');
}
```

#### Iterate Once Per Glob

You can use the current glob within your shell command.

> **Note:** Currently, only one glob pattern is supported.

Instances of `$file` will be replaced by the glob:

```js
exports.default = function * () {
  yield this.source('src/*.js')
    .exec('cat $file', {glob: true})
    //=> fly-exec: 
    //=>     console.log('this is src/a.js')
    //=>     console.log('this is src/b.js')
    //=>     console.log('this is src/c.js')
    .dist('dist');
}
```

#### Passing Arguments

Of course, command arguments may be passed within your [command string](#command).

```js
exports.default = function * () {
  yield this.source('src')
    .exec('ls -alh $file', {glob: true})
    .dist('dist');
}
```

## License

MIT © [Luke Edwards](https://lukeed.com)

[npm-pkg-link]: https://www.npmjs.org/package/fly-exec
[npm-ver-link]: https://img.shields.io/npm/v/fly-exec.svg?style=flat-square
[travis-link]:  https://travis-ci.org/lukeed/fly-exec
[travis-badge]: http://img.shields.io/travis/lukeed/fly-exec.svg?style=flat-square
