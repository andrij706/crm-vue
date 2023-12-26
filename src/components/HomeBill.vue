<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";

const currencies = ref(["UAH", "USD", "EUR"]);

const store = useStore();

const { rates } = defineProps(["rates"]);

const base = computed(() => {
  return store.getters.info.bill / (rates["UAH"] / rates["EUR"]);
});

const getCurrency = (currency) => {
  return Math.floor(base.value * rates[currency]);
};
</script>

<template>
  <div class="col s12 m6 l4">
    <div class="card light-blue bill-card">
      <div class="card-content white-text">
        <span class="card-title">Рахунок у валюті</span>
        <p v-for="cur in currencies" :key="cur" class="currency-line">
          <span>{{
            getCurrency(cur).toLocaleString("en-US", {
              style: "currency",
              currency: cur,
            })
          }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
