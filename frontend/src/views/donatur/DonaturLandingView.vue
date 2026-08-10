<template>
  <div class="donatur-landing">
    <Navbar />
    <HeroSection />
    <ProgramSection />
    <ZakatCalculatorSection />
    <FaqSection />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '../../components/Navbar.vue'
import Footer from '../../components/Footer.vue'
import HeroSection from '../../components/landing/HeroSection.vue'
import ProgramSection from '../../components/landing/ProgramSection.vue'
import ZakatCalculatorSection from '../../components/landing/ZakatCalculatorSection.vue'
import FaqSection from '../../components/landing/FaqSection.vue'
</script>
