import { defineConfig } from 'vite'

export default defineConfig({
  base: '/kodehode/',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        movie: './movie.html'
      }
    }
  }
})
