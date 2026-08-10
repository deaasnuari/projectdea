<template>
  <section class="hero">
    <!-- Background -->
    <div class="hero__bg">
      <img src="/images/hero-bg.png" alt="Masjid" class="hero__bg-img" />
      <div class="hero__overlay"></div>
    </div>

    <div class="hero__container container">
      <!-- Content -->
      <div class="hero__content">
        <p class="hero__label">LAZIS PLN BATAM — LEMBAGA ZAKAT, INFAQ & SHADAQAH</p>
        <h1 class="hero__title">
          Bergabunglah Bersama<br />
          kami dalam Misi <span class="hero__title-accent">Kebaikan</span>
        </h1>
        <p class="hero__desc">
          Kami berkomitmen untuk menyalurkan kebaikan bagi yang membutuhkan melalui program-program sosial transparan dan terpercaya.
        </p>
        <div class="hero__actions">
          <a href="#zakat-calculator" class="btn btn-gold">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/></svg>
            Tunaikan Zakat
          </a>
          <a href="#programs" class="btn btn-primary">Jelajahi Kami</a>
          <a href="#" class="btn btn-outline">Infaq / Shodaqoh</a>
        </div>
      </div>

      <!-- Feature Cards -->
      <div class="hero__features">
        <div class="hero__feature-card">
          <div class="hero__feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div>
            <h4>Lembaga Amil Zakat</h4>
            <p>Resmi terdaftar dan diakui sebagai lembaga amil zakat yang amanah dan profesional.</p>
          </div>
        </div>
        <div class="hero__feature-card">
          <div class="hero__feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <div>
            <h4>Donasi Mudah</h4>
            <p>Proses donasi yang mudah dan cepat untuk menyalurkan zakat, infaq, dan shadaqah Anda.</p>
          </div>
        </div>
        <div class="hero__feature-card">
          <div class="hero__feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <h4>Transparan</h4>
            <p>Laporan penyaluran dana yang transparan dan dapat diakses oleh seluruh donatur.</p>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="hero__stats">
        <div class="hero__stat" v-for="stat in stats" :key="stat.label">
          <span class="hero__stat-value" ref="statRefs">{{ stat.display }}</span>
          <span class="hero__stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stats = ref([
  { value: 3800000000, prefix: 'Rp ', suffix: ' M', display: 'Rp 0', label: 'Dana Terkumpul ZIS', divisor: 1000000 },
  { value: 1240, prefix: '', suffix: '+', display: '0', label: 'Donatur Aktif' },
  { value: 5600, prefix: '', suffix: '+', display: '0', label: 'Penerima Manfaat' },
  { value: 100, prefix: '', suffix: '%', display: '0%', label: 'Transparansi Dana' }
])

const animateCountUp = () => {
  stats.value.forEach((stat, index) => {
    let current = 0
    const target = stat.divisor ? stat.value / stat.divisor : stat.value
    const increment = target / 60
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      if (stat.divisor) {
        stat.display = `${stat.prefix}${(current / 1000).toFixed(1)}${stat.suffix}`
      } else {
        stat.display = `${stat.prefix}${Math.floor(current).toLocaleString('id-ID')}${stat.suffix}`
      }
    }, 16)
  })
}

onMounted(() => {
  setTimeout(animateCountUp, 500)
})
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: flex-end;
  padding-bottom: var(--space-2xl);
  overflow: hidden;
}

.hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero__bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(10, 46, 60, 0.92) 0%,
    rgba(10, 126, 126, 0.75) 50%,
    rgba(10, 46, 60, 0.85) 100%
  );
}

.hero__container {
  position: relative;
  z-index: 1;
  padding-top: 120px;
}

.hero__content {
  max-width: 650px;
  animation: fadeInUp 0.8s ease forwards;
}

.hero__label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-gold);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: var(--space-md);
}

.hero__title {
  font-family: var(--font-heading);
  font-size: var(--text-5xl);
  font-weight: 800;
  color: var(--color-white);
  line-height: 1.15;
  margin-bottom: var(--space-lg);
}

.hero__title-accent {
  color: var(--color-gold);
  font-style: italic;
}

.hero__desc {
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  margin-bottom: var(--space-xl);
  max-width: 520px;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-bottom: var(--space-3xl);
}

/* Feature Cards */
.hero__features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
  animation: fadeInUp 0.8s ease 0.3s forwards;
  opacity: 0;
}

.hero__feature-card {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.hero__feature-card:hover {
  background: rgba(255, 255, 255, 0.14);
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.hero__feature-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: rgba(232, 185, 48, 0.15);
  color: var(--color-gold);
}

.hero__feature-icon svg {
  width: 22px;
  height: 22px;
}

.hero__feature-card h4 {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 4px;
}

.hero__feature-card p {
  font-size: var(--text-xs);
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
}

/* Stats */
.hero__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
  padding: var(--space-xl) var(--space-2xl);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  animation: fadeInUp 0.8s ease 0.6s forwards;
  opacity: 0;
}

.hero__stat {
  text-align: center;
}

.hero__stat-value {
  display: block;
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--color-white);
  margin-bottom: 4px;
}

.hero__stat-label {
  font-size: var(--text-xs);
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

/* Responsive */
@media (max-width: 900px) {
  .hero__features {
    grid-template-columns: 1fr;
  }

  .hero__stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .hero {
    min-height: auto;
    padding: 0 0 var(--space-2xl);
  }

  .hero__container {
    padding-top: 100px;
  }

  .hero__actions {
    flex-direction: column;
  }

  .hero__stats {
    padding: var(--space-lg);
  }

  .hero__stat-value {
    font-size: var(--text-xl);
  }
}
</style>
