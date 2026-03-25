import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Movie } from '@/typescript/models/types/movies'

export const useFilmDetailStore = defineStore('filmDetail', () => {
  const currentFilm = ref<Movie | null>(null)

  function setCurrentFilm(film: Movie) {
    currentFilm.value = film
  }

  function clearCurrentFilm() {
    currentFilm.value = null
  }

  return { currentFilm, setCurrentFilm, clearCurrentFilm }
})
