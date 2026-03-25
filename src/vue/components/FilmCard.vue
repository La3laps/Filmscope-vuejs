<template>
  <div class="film-card" @click="goToDetail">
    <img
      :src="film.poster_path ? IMAGE_URL + film.poster_path : '/background_black.jpg'"
      :alt="film.title"
      class="film-poster"
      @load="onImageLoad"
      @error="onImageLoad"
    />

    <div class="overlay">
      <div class="film-info">
        <h3>{{ film.title }}</h3>
        <p class="rating">
          {{ film.release_date?.slice(0, 4) }} &nbsp;
          <img
            v-for="(filled, i) in stars"
            :key="i"
            src="/star.svg"
            class="star-icon"
            :class="{ filled }"
          />
          <span class="tooltip">
            <span class="default-font">⭐</span> {{ film.vote_average?.toFixed(1) }}
          </span>
        </p>
      </div>

      <button class="fav-btn" :class="{ active: isFav }" @click.stop="toggleFavorite">
        {{ isFav ? '❤️' : '🤍' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Movie } from '@/typescript/models/types/movies'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useFilmDetailStore } from '@/typescript/stores/filmDetail'

const IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL
const emit = defineEmits(['toggle-favorite', 'loaded'])
const router = useRouter()
const filmDetailStore = useFilmDetailStore()

const props = defineProps<{
  film: Movie
  isFav?: boolean
}>()

function onImageLoad() {
  emit('loaded')
}

function goToDetail() {
  filmDetailStore.setCurrentFilm(props.film)
  router.push(`/film/${props.film.id}`)
}

function toggleFavorite() {
  emit('toggle-favorite', props.film)
}

const stars = computed(() => {
  const votes = props.film.vote_average ?? 0
  const nbrOfStars = Math.round(votes / 2)

  return Array.from({ length: 5 }, (_, i) => i < nbrOfStars)
})
</script>

<style lang="css">
.film-card {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
}

/* Image */
.film-poster {
  width: 100%;
  height: 270px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

/* Dark overlay (hidden initially) */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  padding: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* Show overlay on hover */
.film-card:hover .overlay {
  opacity: 1;
}

.film-card:hover .film-poster {
  transform: scale(1.02);
}

.film-info h3,
.film-info p {
  color: white;
  margin: 0;
}

.fav-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  padding: 6px;
  cursor: pointer;
}

.star-icon {
  width: 16px;
  height: 16px;
  filter: invert(1) brightness(0.6);
}

.star-icon.filled {
  filter: invert(79%) sepia(68%) saturate(5000%) hue-rotate(5deg) brightness(105%) contrast(105%);
}

.rating {
  position: relative;
  display: inline-flex;
  align-items: center;
  right: 0;
  gap: 4px;
}

/* Hidden by default */
.tooltip {
  position: absolute;
  transform: translateX(-50%);
  top: -150px;
  left: 50%;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 3em;

  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  white-space: nowrap;
}

.rating:hover .tooltip {
  opacity: 1;
}

.default-font {
  font-family: initial !important;
}
</style>
