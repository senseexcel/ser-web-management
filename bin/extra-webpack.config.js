const path = require('path');

console.log (path.resolve(process.cwd(), 'src/polyfills.ts'));

module.exports = {

    node: {
        crypto: true,
        stream: true
    }
}
