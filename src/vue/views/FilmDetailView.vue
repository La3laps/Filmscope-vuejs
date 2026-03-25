<template>
  <div class="film-detail-container">
    <button class="back-btn" @click="router.back()">« Go back</button>

    <div v-if="film" class="film-detail">
      <div class="film-header">
        <img
          :src="film.poster_path ? IMAGE_URL + film.poster_path : '/background_black.jpg'"
          :alt="film.title"
          class="film-poster"
        />

        <div class="film-info">
          <h1>{{ film.title }}</h1>

          <div class="film-meta">
            <span class="release-date"><strong>Release date:</strong> {{ film.release_date }}</span>
            <span class="rating">
              <strong>Rating:</strong> {{ film.vote_average?.toFixed(1) }} / 10
            </span>
          </div>

          <button class="favorite-btn" :class="{ active: isFav }" @click="toggleFavorite">
            {{ isFav ? '🤍' : '❤️' }}
          </button>
        </div>
      </div>

      <div class="film-overview">
        <h2>Synopsis</h2>
        <p>{{ film.overview || 'No description available.' }}</p>
      </div>

      <div v-if="film.youtube_id" class="film-trailer">
        <h2>Movie Trailer</h2>
        <div class="video-container">
          <iframe
            :src="`https://www.youtube.com/embed/${film.youtube_id}?autoplay=1&mute=1&loop=1&playlist=${film.youtube_id}&controls=0&modestbranding=1&rel=0&showinfo=0&playsinline=1&iv_load_policy=3`"
            frameborder="0"
            allow="
              accelerometer;
              autoplay;
              clipboard-write;
              encrypted-media;
              gyroscope;
              picture-in-picture;
            "
            allowfullscreen
            class="youtube-video"
          ></iframe>
        </div>
      </div>
    </div>

    <div v-else class="loading">
      <p>Loading movie...</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import type { Movie } from '@/typescript/models/types/movies'
import { useFavoritesStore } from '@/typescript/stores/favorites'
import { useFilmDetailStore } from '@/typescript/stores/filmDetail'
import { getMovieVideos } from '@/typescript/services/get-movies-service'

interface Video {
  key: string
  site: string
  type: string
}

const IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL
const router = useRouter()
const favoritesStore = useFavoritesStore()
const filmDetailStore = useFilmDetailStore()

const film = ref<Movie | null>(null)

const isFav = computed(() => {
  if (!film.value) return false
  return favoritesStore.favorites.some((f) => f.id === film.value?.id)
})

function toggleFavorite() {
  if (film.value) {
    favoritesStore.toggleFavorite(film.value)
  }
}

onMounted(async () => {
  if (filmDetailStore.currentFilm) {
    film.value = { ...filmDetailStore.currentFilm }

    try {
      const videosData = await getMovieVideos(film.value.id)
      const youtubeVideo = videosData.results.find(
        (video: Video) => video.site === 'YouTube' && video.type === 'Trailer',
      )
      if (youtubeVideo) {
        film.value.youtube_id = youtubeVideo.key
      }
    } catch (error) {
      console.error('Failed to fetch movie videos:', error)
    }
  } else {
    router.back()
  }
})
</script>

<style scoped>
.film-detail-container {
  width: 100%;
  height: 100%;
  right: 0;
  display: flex;
  flex-direction: column;
  max-width: 700px;
  position: absolute;
  background: rgba(0, 0, 0);
}

.film-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.film-header {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  padding: 0 20px;
}

.film-poster {
  width: 180px;
  height: 270px;
  border-radius: 10px;
  object-fit: cover;
}

.film-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.film-info h1 {
  color: #eee;
  font-size: 28px;
  margin-bottom: 12px;
}

.film-meta {
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 15px;
}

.release-date,
.rating {
  color: #eee;
  display: flex;
  align-items: center;
  gap: 8px;
}

.favorite-btn {
  margin: 10px 100px;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
}

.favorite-btn.active {
  background: #e63946;
}

.favorite-btn:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

.film-overview {
  margin-top: 20px;
  padding: 18px;
  border-radius: 10px;

  background: rgba(255, 255, 255, 0);
  color: #eee;
}

.film-overview h2 {
  margin-bottom: 10px;
}

.film-overview p {
  line-height: 1.6;
  color: #eee;
  margin: 0;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: var(--main-green-dark);
}

.film-trailer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: -1000;
  pointer-events: none;
}

.film-trailer h2 {
  display: none;
}

.video-container {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 0;
}

.youtube-video {
  position: relative;
  top: 50%;
  left: 50%;
  width: 150vw;
  height: 150vh;
  transform: translate(-50%, -50%);
  border: none;
  pointer-events: none;
}

.back-btn {
  position: relative;
  align-self: center;
  display: flex;
  width: auto;
  background: none;
  border: none;

  color: #eee;
  font-size: 16px;
  cursor: pointer;

  margin-bottom: 20px;

  padding: 5px 0;

  transition: color 0.2s ease;
}
.back-btn:hover {
  color: #fff;
}
.back-btn::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;

  height: 2px;
  width: 0%;

  background: #fff;

  transition: width 0.25s ease-in-out;
}

.back-btn:hover::before {
  width: 100%;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .film-header {
    flex-direction: column;
    gap: 20px;
  }

  .film-poster {
    width: 100%;
    height: auto;
  }

  .film-info h1 {
    font-size: 24px;
  }
}
</style>
