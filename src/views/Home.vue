<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import HomeBill from "@/components/HomeBill.vue";
import HomeCurrency from "@/components/HomeCurrency.vue";
import {useI18n} from 'vue-i18n'

const store = useStore();
const { t, locale } = useI18n({useScope: 'global'})

const myLocale = computed(() => store.getters.info.locale)

locale.value = myLocale.value

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
      <h3>{{ t('bill') }}</h3>
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
