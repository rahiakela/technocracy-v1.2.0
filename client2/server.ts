const domino = require('domino');
const fs = require('fs');
const path = require('path');
const template = fs.readFileSync(path.join(__dirname, '.', 'dist/browser', 'index.html')).toString();
const win = domino.createWindow(template);
//const files = fs.readdirSync(`${process.cwd()}/dist-server`);
import fetch from 'node-fetch';

win.fetch = fetch;
global['window'] = win;
Object.defineProperty(win.document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true
    };
  },
});
global['document'] = win.document;
global['CSS'] = null;
// global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;
global['Prism'] = null;

import * as express from 'express';
import {join} from 'path';
import {ngExpressEngine} from '@nguniversal/express-engine';
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';

const PORT = process.env.PORT || 8080;
const staticRoot = join(process.cwd(), 'dist', 'browser');
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main.bundle');
const app = express();

// Define the view engine. This will let Express.js know which function it uses to render HTML files
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

// set our default view engine to , the engine we defined in the previous step.
// Next, we set the root directory for our views
app.set('view engine', 'html');
app.set('views', staticRoot);

// we want to statically serve all other files than of type ,
// and that the default route ( ) is to render the index.html file
app.get('*.*', express.static(staticRoot));
app.get('*', (req, res) => {
  global['navigator'] = req['headers']['user-agent'];
  res.render('index', { req });
});

// Start the server and log a message with the host and port
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
