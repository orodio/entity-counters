npm install wont work as it uses some modules that are currently private.

You should be able to see working output by servering up the `dist` directory.

A possible way of serving up the dist directory

```
$ npm install -g http-server
$ http-server dist/
```
