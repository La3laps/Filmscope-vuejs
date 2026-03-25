<template>
  <div class="home">
    <AppPagination
      v-show="totalPages > 1"
      v-model:page="currentPage"
      :has-next-page="hasNextPage"
      :total-pages="totalPages"
    />

    <div v-if="isLoading || (!allImagesLoaded && films.length > 0)" class="spinner">
      <AppSpinner />
    </div>

    <TransitionGroup name="stagger" tag="div" class="film-grid">
      <FilmCard
        v-for="(film, index) in films"
        :key="film.id + '-' + currentPage"
        :film="film"
        :isFav="favoritesStore.isFavorite(film.id)"
        :style="{ transitionDelay: `${index * 35}ms` }"
        @toggle-favorite="toggleFavorite"
        @loaded="onFilmLoaded"
      />
    </TransitionGroup>

    <div v-if="!isLoading && films.length === 0" class="no-results">❌ No movies found ❌</div>

    <AppPagination
      v-show="totalPages > 1"
      v-model:page="currentPage"
      :has-next-page="hasNextPage"
      :total-pages="totalPages"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'

import { getPopularMovies, searchMovies } from '@/typescript/services/get-movies-service'
import { useFavoritesStore } from '@/typescript/stores/favorites'
import { useSearchStore } from '@/typescript/stores/search'

import type { Movie } from '@/typescript/models/types/movies'

import FilmCard from '@/vue/components/FilmCard.vue'
import AppSpinner from '@/vue/components/AppSpinner.vue'
import AppPagination from '@/vue/components/AppPagination.vue'

const films = ref<Movie[]>([])
const totalPages = ref(1)
const currentPage = ref(1)
const loadedImages = ref(0)
const isLoading = ref(false)

const favoritesStore = useFavoritesStore()
const searchStore = useSearchStore()

onMounted(() => {
  fetchMovies()
})

async function fetchMovies() {
  isLoading.value = true
  loadedImages.value = 0

  const data = searchStore.query.trim()
    ? await searchMovies(searchStore.query, currentPage.value)
    : await getPopularMovies(currentPage.value)

  films.value = data.results
  totalPages.value = Math.min(data.total_pages, 500)

  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
  isLoading.value = false
}
watchDebounced(
  () => [searchStore.query, currentPage.value],
  () => {
    fetchMovies()
  },
  { debounce: 300 },
)

watch(
  () => searchStore.query,
  () => {
    currentPage.value = 1
  },
)

function onFilmLoaded() {
  if (loadedImages.value < films.value.length) {
    loadedImages.value++
  }
}

const allImagesLoaded = computed(() => {
  if (films.value.length === 0) return true
  return loadedImages.value >= films.value.length
})

function toggleFavorite(film: Movie) {
  favoritesStore.toggleFavorite(film)
}

const hasNextPage = computed(() => {
  return currentPage.value < totalPages.value
})
</script>

<style lang="css">
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.film-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
}

.film-card {
  transition:
    transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
    box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.film-card:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
}

.spinner {
  position: fixed;
  top: 50%;
  left: 46%;
  align-items: center;
}

.no-results {
  color: var(--main-green-darker);
  margin-bottom: 30px;
  font-weight: 700;
  opacity: 0.85;
}

.stagger-enter-from {
  opacity: 0;
  transform: translateY(24px);
}
.stagger-enter-active {
  transition:
    opacity 280ms ease,
    transform 280ms ease;
}
.stagger-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.stagger-leave-from {
  opacity: 1;
}
.stagger-leave-active {
  transition: opacity 180ms ease;
}
.stagger-leave-to {
  opacity: 0;
}
</style>
