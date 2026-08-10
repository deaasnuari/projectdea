<template>
  <div id="app-root">
    <nav v-if="!route.meta.hideShellNav">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
  padding: 1rem 2rem;
  background: #1a1a2e;
}

nav a {
  color: #e0e0e0;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

nav a:hover,
nav a.router-link-active {
  color: #00d4ff;
}
</style>
