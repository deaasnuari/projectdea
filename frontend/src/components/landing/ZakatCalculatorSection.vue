<template>
  <section id="zakat-calculator" class="zcalc">
    <div class="zcalc__container container">
      <!-- Left: intro + nisab -->
      <div class="zcalc__intro">
        <p class="section-label" style="color: var(--color-gold)">Kalkulator Zakat</p>
        <h2 class="zcalc__title">
          Hitung Zakat Anda<br />sebagai Karyawan PLN
        </h2>
        <p class="zcalc__desc">
          Masukkan data penghasilan dan harta untuk mengetahui kewajiban zakat Anda.
        </p>

        <div class="zcalc__nisab">
          <span class="zcalc__nisab-label">Nisab Zakat Maal (85 gr emas)</span>
          <span class="zcalc__nisab-value">{{ formatRp(NISAB_MAAL) }}</span>
        </div>
        <div class="zcalc__nisab">
          <span class="zcalc__nisab-label">Nisab Zakat Profesi / Bulan</span>
          <span class="zcalc__nisab-value">{{ formatRp(NISAB_PROFESI) }}</span>
        </div>
      </div>

      <!-- Right: form card -->
      <div class="zcalc__card">
        <h3 class="zcalc__card-title">Data Penghasilan &amp; Harta</h3>

        <div class="zcalc__field">
          <label>Gaji Pokok / Bulan</label>
          <span class="zcalc__hint">Gaji pokok karyawan PLN Batam</span>
          <div class="zcalc__input">
            <span>Rp</span>
            <input v-model.number="gajiPokok" type="number" min="0" placeholder="0" />
          </div>
        </div>

        <div class="zcalc__field">
          <label>Tunjangan Tetap / Bulan</label>
          <span class="zcalc__hint">Tunjangan jabatan, keluarga, dll.</span>
          <div class="zcalc__input">
            <span>Rp</span>
            <input v-model.number="tunjangan" type="number" min="0" placeholder="0" />
          </div>
        </div>

        <div class="zcalc__field">
          <label>Tabungan &amp; Deposito</label>
          <span class="zcalc__hint">Total saldo rekening</span>
          <div class="zcalc__input">
            <span>Rp</span>
            <input v-model.number="tabungan" type="number" min="0" placeholder="0" />
          </div>
        </div>

        <div class="zcalc__field">
          <label>Nilai Emas &amp; Perhiasan</label>
          <span class="zcalc__hint">Emas &gt; 85gr wajib dizakati</span>
          <div class="zcalc__input">
            <span>Rp</span>
            <input v-model.number="emas" type="number" min="0" placeholder="0" />
          </div>
        </div>

        <div class="zcalc__result" :class="{ 'zcalc__result--due': zakatProfesi }">
          <span class="zcalc__result-label">Zakat Profesi (Bulanan)</span>
          <strong>{{ zakatProfesi ? formatRp(zakatProfesi) : 'Belum mencapai nisab' }}</strong>
        </div>
        <div class="zcalc__result" :class="{ 'zcalc__result--due': zakatMaal }">
          <span class="zcalc__result-label">Zakat Maal (Tahunan)</span>
          <strong>{{ zakatMaal ? formatRp(zakatMaal) : 'Belum mencapai nisab' }}</strong>
        </div>

        <a href="#faq" class="btn btn-primary zcalc__submit">Konsultasikan Perhitungan Ini</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const NISAB_MAAL = 80750000
const NISAB_PROFESI = Math.round(NISAB_MAAL / 12)
const ZAKAT_RATE = 0.025

const gajiPokok = ref(0)
const tunjangan = ref(0)
const tabungan = ref(0)
const emas = ref(0)

const penghasilanBulanan = computed(() => (gajiPokok.value || 0) + (tunjangan.value || 0))
const hartaMaal = computed(() => (tabungan.value || 0) + (emas.value || 0))

const zakatProfesi = computed(() =>
  penghasilanBulanan.value >= NISAB_PROFESI ? penghasilanBulanan.value * ZAKAT_RATE : 0
)
const zakatMaal = computed(() => (hartaMaal.value >= NISAB_MAAL ? hartaMaal.value * ZAKAT_RATE : 0))

function formatRp(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID')
}
</script>

<style scoped>
.zcalc {
  background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-primary-dark) 100%);
  padding: var(--space-4xl) 0;
  color: var(--color-white);
}

.zcalc__container {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: var(--space-2xl);
  align-items: start;
}

.zcalc__title {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--color-white);
  margin: var(--space-sm) 0 var(--space-md);
  line-height: 1.25;
}

.zcalc__desc {
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
  margin-bottom: var(--space-xl);
  max-width: 380px;
}

.zcalc__nisab {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-lg);
  padding: var(--space-md) var(--space-lg);
  margin-bottom: var(--space-md);
  max-width: 380px;
}

.zcalc__nisab-label {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.zcalc__nisab-value {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 800;
  color: var(--color-gold);
}

/* Card */
.zcalc__card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--space-xl) clamp(1.25rem, 3vw, var(--space-2xl));
  box-shadow: var(--shadow-xl);
  color: var(--color-gray-800);
}

.zcalc__card-title {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-navy);
  margin-bottom: var(--space-lg);
}

.zcalc__field {
  margin-bottom: var(--space-lg);
}

.zcalc__field label {
  display: block;
  font-weight: 600;
  font-size: var(--text-sm);
  color: var(--color-gray-800);
  margin-bottom: 2px;
}

.zcalc__hint {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-gray-500);
  margin-bottom: var(--space-sm);
}

.zcalc__input {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  padding: 0.7rem var(--space-md);
  transition: border-color var(--transition-fast);
}

.zcalc__input:focus-within {
  border-color: var(--color-primary);
}

.zcalc__input span {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  font-weight: 600;
}

.zcalc__input input {
  flex: 1;
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-gray-800);
}

.zcalc__result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  margin-bottom: var(--space-sm);
}

.zcalc__result-label {
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: var(--color-gray-500);
}

.zcalc__result strong {
  font-size: var(--text-sm);
  color: var(--color-gray-400);
}

.zcalc__result--due {
  background: rgba(10, 126, 126, 0.08);
}

.zcalc__result--due strong {
  color: var(--color-primary-dark);
  font-size: var(--text-base);
}

.zcalc__submit {
  width: 100%;
  justify-content: center;
  margin-top: var(--space-lg);
}

@media (max-width: 900px) {
  .zcalc__container {
    grid-template-columns: 1fr;
  }
}
</style>
