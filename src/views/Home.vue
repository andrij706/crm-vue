<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import HomeBill from "@/components/HomeBill.vue";
import HomeCurrency from "@/components/HomeCurrency.vue";

const store = useStore();

const loading = ref(true);
const currency = ref(null);

onMounted(async () => {
  currency.value = await store.dispatch("fetchCurrency");
  loading.value = false;
});

const refresh = async () => {
  loading.value = true;
  currency.value = await store.dispatch("fetchCurrency");
  loading.value = false;
};
</script>

<template>
  <div>
    <div class="page-title">
      <h3>Рахунок</h3>
      <button class="btn waves-effect waves-light btn-small" @click="refresh">
        <i class="material-icons">refresh</i>
      </button>
    </div>
    <Loader v-if="loading" />
    <div class="row" v-else>
      <HomeBill :rates="currency.rates" />
      <HomeCurrency :rates="currency.rates" :date="currency.date" />
    </div>
  </div>
</template>
