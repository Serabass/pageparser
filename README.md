
Pageparser is a small CLI tool for easy access to HTML/XML elements on local/remote pages

# Installation
`$ npm install pageparser`

or

`$ npm install -g pageparser`

# Script example

## Import Parser

### Javascript:
```js
var Parser = require('pageparser').Parser;
```

### Typescript:
```typescript
import {Parser} from "pageparser"
```

### Javascript:
```js
    var parser = new Parser('http://example.com'); // argument may be a ReadStream or String (URL or File Path)
    var $ = await parser.load(); // Do you love JQuery? <3
    var element = $('h1');
    console.log(element.html()); // Example Domain
```

or

```js
    var data = await Parser.process('http://example.com', 'h1', ':html');
    console.log(data); // Example Domain
```

# Cheerio Docs
Pageparser using `cheerio`.
You can get additional info about it [here](https://github.com/cheeriojs/cheerio)

# Writing custom processors

1. Call this from needed directory
`$ pageparser --init-config`
to  place `.parserconfig.js` file to it

2. Write your own processor function in `processors` section

# Running from command line
`$ pageparser http://example.com/ "h1" :html`
> Example Domain


`$ cat tests\testpage.html | pageparser "h1" :html`
> Example Page


`$ pageparser "h1" :html < tests\testpage.html`
> Example Page


# Running tests
`$ npm test`