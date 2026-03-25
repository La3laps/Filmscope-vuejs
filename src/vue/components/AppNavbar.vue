<template>
  <header>
    <div class="container">
      <div class="logo">
        <span class="threeD-icon">
          <div class="container-logo logo-title">
            <img class="logo-img" src="/FilmSCOPE_no_bg.png" alt="logo" />
          </div>
          <div class="container-logo tree-container">
            <RotatingTreeIcon />
          </div>
        </span>
      </div>

      <nav>
        <ul>
          <li>
            <RouterLink to="/">Home</RouterLink>
          </li>
          <li>
            <RouterLink to="/favorites">Favorites</RouterLink>
          </li>
        </ul>
      </nav>
      <SearchBar
        v-model="searchStore.query"
        :disabled="route.path !== '/'"
        :class="{ disabled: route.path !== '/' }"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSearchStore } from '@/typescript/stores/search'
import SearchBar from '@/vue/components/SearchBar.vue'
import RotatingTreeIcon from '@/vue/components/RotatingTreeIcon.vue'

const route = useRoute()
const searchStore = useSearchStore()
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  font-family: 'Work Sans', sans-serif;
}
header {
  position: sticky;
  background: var(--main-green-darker);
  z-index: 9999;
}
.container {
  width: 80%;
  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 12px 0;
}

.logo {
  color: #fff;
}

.threeD-icon {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container-logo {
  width: 200px;
  height: 200px;
  position: absolute;
}

.logo-title {
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Wild Wood', sans-serif;
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--main-green-light);
  text-shadow:
    2px 2px 4px rgba(0, 0, 0, 0.5),
    0 0 8px rgba(45, 80, 22, 0.3);
}

.tree-container {
  z-index: 1;
}

nav ul {
  margin: 0;
  padding: 0;
  list-style: none;

  display: flex;
  gap: 40px;
}

nav li {
  position: relative;
}

nav a {
  color: #ddd;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 600;

  position: relative;
  padding: 5px 0;
  z-index: 3;
  transition: color 0.2s ease;
}

/* Hover color */
nav a:hover {
  color: #fff;
}

/* Underline animation */
nav a::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;

  height: 2px;
  width: 0%;

  background: #fff;

  transition: width 0.25s ease-in-out;
}

nav a:hover::before {
  width: 100%;
}

.logo-img {
  filter: invert(1);
  width: 80%;
  height: auto;
}

.router-link-active {
  color: #fff;
}

.router-link-active::before {
  width: 100%;
}
</style>
