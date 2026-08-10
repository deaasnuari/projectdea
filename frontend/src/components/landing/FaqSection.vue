<template>
  <section id="faq" class="faq">
    <div class="faq__container container">
      <div class="faq__intro">
        <p class="section-label">Konsultasi</p>
        <h2 class="section-title">
          Pertanyaan Seputar<br /><span>Zakat &amp; Shadaqah</span>
        </h2>
        <p class="faq__desc">
          Tim Lazis PLN Batam siap membantu Anda memahami kewajiban zakat dan cara penunaiannya.
        </p>

        <div class="faq__contact">
          <div class="faq__contact-item">
            <span class="faq__contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h4l2 5-2.5 1.5a11 11 0 005 5L14 14l5 2v4a2 2 0 01-2 2A16 16 0 014 6a2 2 0 012-2z" /></svg>
            </span>
            <span>(0778) 469 100 ext. 1234</span>
          </div>
          <div class="faq__contact-item">
            <span class="faq__contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16v16H4z" /><path d="M4 6l8 7 8-7" /></svg>
            </span>
            <span>lazis@plnbatam.com</span>
          </div>
          <div class="faq__contact-item">
            <span class="faq__contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-5.6-7-11a7 7 0 0114 0c0 5.4-7 11-7 11z" /><circle cx="12" cy="10" r="2.4" /></svg>
            </span>
            <span>Gedung PLN Batam, Lt. 2, Jl. Engku Putri No. 1</span>
          </div>
        </div>
      </div>

      <div class="faq__list">
        <div v-for="(item, i) in faqs" :key="item.q" class="faq__item" :class="{ 'faq__item--open': openIndex === i }">
          <button class="faq__q" @click="toggle(i)">
            <span>{{ item.q }}</span>
            <svg class="faq__chevron" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 7.5l5 5 5-5" />
            </svg>
          </button>
          <div class="faq__a" :style="{ maxHeight: openIndex === i ? panelHeight(i) : '0px' }">
            <p :ref="setPanelRef(i)">{{ item.a }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const faqs = [
  {
    q: 'Siapa saja yang wajib membayar zakat profesi?',
    a: 'Seluruh karyawan PLN Batam yang penghasilan bulanannya (gaji pokok + tunjangan tetap) telah mencapai nisab zakat profesi, yaitu setara 85 gram emas per tahun.'
  },
  {
    q: 'Bagaimana cara membayar zakat melalui LAZIS PLN Batam?',
    a: 'Anda dapat mendaftar sebagai donatur, menghitung kewajiban zakat melalui kalkulator di halaman ini, lalu melakukan pembayaran melalui transfer ke rekening resmi atau potong gaji otomatis.'
  },
  {
    q: 'Apakah pembayaran zakat mendapat bukti setor?',
    a: 'Ya. Setiap pembayaran akan mendapatkan bukti setor zakat resmi yang dapat diunduh melalui akun donatur Anda, sekaligus berlaku sebagai pengurang pajak penghasilan.'
  },
  {
    q: 'Bagaimana transparansi penyaluran dana zakat?',
    a: 'Setiap program penyaluran didokumentasikan dan dipublikasikan secara berkala, termasuk laporan triwulanan yang dapat diakses oleh seluruh donatur pada bagian Program Kami.'
  }
]

const openIndex = ref(0)
const panelRefs = ref({})

function setPanelRef(i) {
  return (el) => {
    if (el) panelRefs.value[i] = el
  }
}

function panelHeight(i) {
  const el = panelRefs.value[i]
  return el ? `${el.scrollHeight + 32}px` : '400px'
}

function toggle(i) {
  openIndex.value = openIndex.value === i ? -1 : i
}
</script>

<style scoped>
.faq {
  background: var(--color-white);
  padding: var(--space-4xl) 0;
}

.faq__container {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: var(--space-2xl);
}

.faq__desc {
  color: var(--color-gray-500);
  line-height: 1.7;
  margin: var(--space-md) 0 var(--space-xl);
  max-width: 380px;
}

.faq__contact {
  border-top: 1px solid var(--color-gray-200);
  padding-top: var(--space-lg);
  max-width: 380px;
}

.faq__contact-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
  font-size: var(--text-sm);
  color: var(--color-gray-600);
}

.faq__contact-icon {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  background: rgba(10, 126, 126, 0.1);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.faq__contact-icon svg {
  width: 17px;
  height: 17px;
}

.faq__list {
  border-top: 1px solid var(--color-gray-200);
}

.faq__item {
  border-bottom: 1px solid var(--color-gray-200);
}

.faq__q {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-lg) 0;
  text-align: left;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: var(--text-base);
  color: var(--color-navy);
}

.faq__chevron {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: var(--color-primary);
  transition: transform var(--transition-base);
}

.faq__item--open .faq__chevron {
  transform: rotate(180deg);
}

.faq__a {
  overflow: hidden;
  max-height: 0;
  transition: max-height var(--transition-base);
}

.faq__a p {
  padding: 0 0 var(--space-lg) 0;
  font-size: var(--text-sm);
  line-height: 1.75;
  color: var(--color-gray-600);
  max-width: 560px;
}

@media (max-width: 900px) {
  .faq__container {
    grid-template-columns: 1fr;
  }
}
</style>
