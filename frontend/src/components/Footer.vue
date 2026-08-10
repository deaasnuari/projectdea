<template>
  <footer class="footer">
    <div class="footer__container container">
      <div class="footer__grid">
        <!-- Brand Column -->
        <div class="footer__brand">
          <div class="footer__logo">
            <img src="/images/logo lazis pln.png" alt="Lazis PLN Batam" class="footer__logo-img" />
          </div>
          <p class="footer__desc">
            Lembaga Amil Zakat, Infaq dan Shadaqah PLN Batam. 
            Menyalurkan kebaikan untuk kesejahteraan masyarakat.
          </p>
          <div class="footer__social">
            <a href="#" class="footer__social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" class="footer__social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" class="footer__social-link" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="footer__col">
          <h4 class="footer__col-title">Navigasi</h4>
          <ul class="footer__links">
            <li><a href="#">Beranda</a></li>
            <li><a href="#programs">Program Kami</a></li>
            <li><a href="#zakat-calculator">Hitung Zakat</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>

        <!-- Services Links -->
        <div class="footer__col">
          <h4 class="footer__col-title">Layanan</h4>
          <ul class="footer__links">
            <li><a href="#">Zakat Penghasilan</a></li>
            <li><a href="#">Zakat Fitrah</a></li>
            <li><a href="#">Infaq</a></li>
            <li><a href="#">Shadaqah</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer__col">
          <h4 class="footer__col-title">Kontak</h4>
          <ul class="footer__links footer__contact">
            <li>
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <span>Jl. PLN Batam, Kepulauan Riau, Indonesia</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              <span>(0778) 123-456</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              <span>lazis@plnbatam.co.id</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="footer__bottom">
        <p>&copy; {{ currentYear }} Lazis PLN Batam. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: var(--color-navy-dark);
  color: rgba(255, 255, 255, 0.7);
  padding: var(--space-xl) 0 0;
}

.footer__grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.3fr;
  gap: var(--space-lg);
}

.footer__logo {
  margin-bottom: var(--space-sm);
}

.footer__logo-img {
  height: 28px;
  width: auto;
  padding: 0.3rem 0.55rem;
  background: var(--color-white);
  border-radius: var(--radius-sm);
}

.footer__desc {
  font-size: var(--text-sm);
  line-height: 1.55;
  margin-bottom: var(--space-sm);
  max-width: 280px;
}

.footer__social {
  display: flex;
  gap: var(--space-sm);
}

.footer__social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
  transition: all var(--transition-base);
}

.footer__social-link svg {
  width: 18px;
  height: 18px;
}

.footer__social-link:hover {
  background: var(--color-primary);
  color: var(--color-white);
  transform: translateY(-2px);
}

.footer__col-title {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: var(--space-sm);
}

.footer__links li {
  margin-bottom: var(--space-sm);
}

.footer__links a {
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.6);
  transition: color var(--transition-fast);
}

.footer__links a:hover {
  color: var(--color-gold);
}

.footer__contact li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.footer__contact svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--color-primary);
}

.footer__contact span {
  font-size: var(--text-sm);
}

.footer__bottom {
  margin-top: var(--space-md);
  padding: var(--space-sm) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  font-size: var(--text-sm);
}

@media (max-width: 768px) {
  .footer__grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
  }

  .footer__brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .footer__grid {
    grid-template-columns: 1fr;
  }
}
</style>
