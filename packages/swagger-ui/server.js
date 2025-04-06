import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// Read the swagger file
const swaggerFile = await readFile(
  join(__dirname, '../server/api/swagger/v1/todo.swagger.json'),
  'utf8'
);
const swaggerDocument = JSON.parse(swaggerFile);

// Configure Swagger UI
const options = {
  swaggerOptions: {
    url: '/api-docs/swagger.json',
  },
};

// Serve the swagger JSON
app.get('/api-docs/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

// Redirect root to Swagger UI
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.listen(port, () => {
  console.log(`Swagger UI is running at http://localhost:${port}/api-docs`);
}); 