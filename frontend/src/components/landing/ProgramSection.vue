<template>
  <section id="programs" class="programs">
    <div class="programs__container container">
      <!-- Header -->
      <div class="programs__header">
        <div>
          <p class="section-label">Bukti Nyata</p>
          <h2 class="section-title">
            Program yang <span>Tersalurkan</span>
          </h2>
        </div>
        <a href="#" class="btn btn-coral programs__btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Lihat Semua Video
        </a>
      </div>

      <!-- Video Grid -->
      <div class="programs__grid">
        <div
          v-for="(program, i) in programs"
          :key="i"
          class="program-card"
          :style="{ animationDelay: `${i * 0.15}s` }"
        >
          <div class="program-card__thumb">
            <img :src="program.image" :alt="program.title" />
            <div class="program-card__play">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <span class="program-card__badge">{{ program.badge }}</span>
          </div>
          <div class="program-card__body">
            <h3 class="program-card__title">{{ program.title }}</h3>
            <p class="program-card__desc">{{ program.desc }}</p>
            <a href="#" class="program-card__link">
              Selengkapnya
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const programs = ref([
  {
    image: '/images/program-1.png',
    badge: 'Donasi',
    title: 'Penyaluran Bantuan ke Panti Asuhan',
    desc: 'Bantuan kebutuhan pokok dan pendidikan untuk anak-anak di panti asuhan se-Kota Batam.',
    link: '#'
  },
  {
    image: '/images/program-2.png',
    badge: 'Pendidikan',
    title: 'Beasiswa Pendidikan Anak Dhuafa',
    desc: 'Program beasiswa untuk anak-anak kurang mampu agar tetap bisa melanjutkan pendidikan.',
    link: '#'
  },
  {
    image: '/images/program-3.png',
    badge: 'Ramadhan',
    title: 'Program Buka Puasa Bersama',
    desc: 'Penyaluran paket buka puasa untuk masyarakat kurang mampu selama bulan Ramadhan.',
    link: '#'
  },
  {
    image: '/images/program-4.png',
    badge: 'Kesehatan',
    title: 'Bakti Sosial Kesehatan Gratis',
    desc: 'Pemeriksaan kesehatan gratis dan pembagian obat-obatan untuk masyarakat yang membutuhkan.',
    link: '#'
  }
])
</script>

<style scoped>
.programs {
  padding: var(--space-4xl) 0;
  background: var(--color-gray-50);
}

.programs__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: var(--space-2xl);
  gap: var(--space-lg);
}

.programs__btn {
  flex-shrink: 0;
}

.programs__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-xl);
}

/* Program Card */
.program-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.program-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
}

.program-card__thumb {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.program-card__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.program-card:hover .program-card__thumb img {
  transform: scale(1.08);
}

.program-card__play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  background: var(--color-coral);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 4px 20px rgba(231, 76, 60, 0.4);
}

.program-card__play svg {
  width: 24px;
  height: 24px;
  color: var(--color-white);
  margin-left: 3px;
}

.program-card:hover .program-card__play {
  transform: translate(-50%, -50%) scale(1.15);
}

.program-card__badge {
  position: absolute;
  top: var(--space-md);
  left: var(--space-md);
  padding: 4px 12px;
  background: var(--color-primary);
  color: var(--color-white);
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-full);
}

.program-card__body {
  padding: var(--space-lg);
}

.program-card__title {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-navy);
  margin-bottom: var(--space-sm);
  line-height: 1.3;
}

.program-card__desc {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  line-height: 1.6;
  margin-bottom: var(--space-md);
}

.program-card__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-primary);
  transition: all var(--transition-fast);
}

.program-card__link:hover {
  color: var(--color-primary-dark);
  gap: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .programs__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .programs__grid {
    grid-template-columns: 1fr;
  }
}
</style>
