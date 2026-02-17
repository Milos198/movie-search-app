import { defineConfig } from 'vite'

export default defineConfig({
  base: '/movie-search-app/',

  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        movie: './movie.html'
      }
    }
  }
})
