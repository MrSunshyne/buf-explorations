import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

// Calculate __dirname equivalent for ES modules - Re-add
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Calculate the paths dynamically
const protosPath = path.resolve(__dirname, '../protos');

export default defineConfig({
  // plugins: [tsconfigPaths()], // Remove plugin usage
  resolve: {
    alias: {
      '@protos': protosPath,
      '../google/api/annotations_pb': path.resolve(__dirname, 'src/virtual-modules.ts'),
      '@buf-explorations/protos/gen/ts/google/api/annotations_pb': path.resolve(__dirname, 'src/virtual-modules.ts')
    },
    extensions: ['.ts', '.js']
  },
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    deps: {
      inline: [/virtual:google-api-annotations/]
    }
  },
}); 