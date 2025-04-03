import { defineConfig } from 'vitest/config';
import path from 'path'; // Re-add
import { fileURLToPath } from 'url'; // Re-add

// Calculate __dirname equivalent for ES modules - Re-add
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Calculate the path dynamically
const protosPath = path.resolve(__dirname, '../protos/gen/ts/protos');

export default defineConfig({
  // plugins: [tsconfigPaths()], // Remove plugin usage
  resolve: {
    alias: {
      // Use dynamically resolved path
      '@protos': protosPath
    }
  },
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
}); 