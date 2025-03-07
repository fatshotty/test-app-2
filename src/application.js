import Path from 'node:path';
import Express from 'express';
import WebpackConfig from '../webpack.config.js';
import Webpack from 'webpack';
import WebpackMiddleware from 'webpack-dev-middleware';
import BodyParser from 'body-parser';
import { ROOT_FOLDER } from './configuration.js';

import { closeDatabase, getPizza, initDatabase } from './services/database.js';

import UsersRoutes from './routes/users.js';
import ChefRoutes from './routes/chef.js';
import { getPizzasMenu } from './services/actions.js';

const WebpackCompiler = Webpack(WebpackConfig);

const App = Express();
App.use( WebpackMiddleware(WebpackCompiler) );
App.use( BodyParser.json() );

App.get('/', async (req, res, next) => {
  res.sendFile( Path.resolve( Path.join(ROOT_FOLDER, 'dist/index.html')) );
})


App.get('/pizzas', async function getMenu(req, res, next) {
  const pizzas = getPizzasMenu();
  res.set('content-type', 'application/json');
  res.send( pizzas );
});

App.use( '/chef', ChefRoutes);
App.use( '/users', UsersRoutes);

async function startApplication() {
  await initDatabase();

  App.listen(3000, () => {
    console.log("Application started on port 3000")
  });
}

startApplication();