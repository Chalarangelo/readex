import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const config = {
    build: {
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, 'src/index.js'),
        name: 'readex',
        fileName: 'readex',
        formats: ['es'],
      },
      minify: false,
    },
  };

  if (mode === 'min') {
    config.build.lib.fileName = 'readex.min';
    config.build.minify = true;
  }

  return config;
});
