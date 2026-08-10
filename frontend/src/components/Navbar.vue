<template>
  <header class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
    <div class="navbar__container container">
      <!-- Logo -->
      <router-link to="/" class="navbar__logo">
        <img src="/images/logo lazis pln.png" alt="Lazis PLN Batam" class="navbar__logo-img" />
      </router-link>

      <!-- Desktop Nav -->
      <nav class="navbar__nav" :class="{ 'navbar__nav--open': menuOpen }">
        <a href="#programs" class="navbar__link" @click="closeMenu">Program Kami</a>
        <a href="#about" class="navbar__link" @click="closeMenu">Tentang Kami</a>
        <a href="#zakat-calculator" class="navbar__link" @click="closeMenu">Hitung Zakat</a>
        <a href="#faq" class="navbar__link" @click="closeMenu">FAQ</a>
        <a href="#" class="navbar__link" @click="closeMenu">Login</a>
        <a href="#zakat-calculator" class="btn btn-gold navbar__cta-mobile" @click="closeMenu">Donasi Sekarang</a>
      </nav>

      <!-- CTA Button -->
      <a href="#zakat-calculator" class="btn btn-gold navbar__cta">
        Donasi Sekarang
      </a>

      <!-- Hamburger -->
      <button class="navbar__hamburger" @click="toggleMenu" :class="{ 'navbar__hamburger--open': menuOpen }" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const menuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}

const closeMenu = () => {
  menuOpen.value = false
  document.body.style.overflow = ''
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  transition: all var(--transition-base);
  background: transparent;
}

.navbar--scrolled {
  background: rgba(10, 46, 60, 0.95);
  backdrop-filter: blur(12px);
  padding: 0.6rem 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.navbar__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar__logo {
  display: flex;
  align-items: center;
  z-index: 1001;
}

.navbar__logo-img {
  height: 40px;
  width: auto;
  padding: 0.35rem 0.6rem;
  background: var(--color-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.navbar__nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.navbar__link {
  color: rgba(255, 255, 255, 0.85);
  font-size: var(--text-sm);
  font-weight: 500;
  position: relative;
  padding: 0.25rem 0;
  transition: color var(--transition-fast);
}

.navbar__link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-gold);
  transition: width var(--transition-base);
}

.navbar__link:hover {
  color: var(--color-white);
}

.navbar__link:hover::after {
  width: 100%;
}

.navbar__cta {
  padding: 0.6rem 1.5rem;
  font-size: var(--text-sm);
}

.navbar__cta-mobile {
  display: none;
}

/* Hamburger */
.navbar__hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
  z-index: 1001;
}

.navbar__hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-white);
  border-radius: 2px;
  transition: all var(--transition-base);
}

.navbar__hamburger--open span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.navbar__hamburger--open span:nth-child(2) {
  opacity: 0;
}

.navbar__hamburger--open span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Mobile */
@media (max-width: 900px) {
  .navbar__nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    justify-content: center;
    background: rgba(10, 46, 60, 0.98);
    backdrop-filter: blur(16px);
    gap: 1.5rem;
    transform: translateX(100%);
    transition: transform var(--transition-slow);
  }

  .navbar__nav--open {
    transform: translateX(0);
  }

  .navbar__link {
    font-size: var(--text-lg);
  }

  .navbar__cta {
    display: none;
  }

  .navbar__cta-mobile {
    display: inline-flex;
    margin-top: 1rem;
  }

  .navbar__hamburger {
    display: flex;
  }
}
</style>
