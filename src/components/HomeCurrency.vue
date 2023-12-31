<script setup>
import { ref, computed } from "vue";
import {useStore} from 'vuex'
import {useI18n} from 'vue-i18n'

const store = useStore();
const { t, locale } = useI18n({useScope: 'global'})

const myLocale = computed(() => store.getters.info.locale)

locale.value = myLocale.value

const { rates, date } = defineProps(["rates", "date"]);
const currencies = ref(["UAH", "USD", "EUR"]);
</script>

<template>
  <div class="col s12 m6 l8">
    <div class="card orange darken-3 bill-card">
      <div class="card-content white-text">
        <div class="card-header">
          <span class="card-title">{{ t('exchangeRate') }}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>{{ t('currency') }}</th>
              <th>{{ t('rate') }}</th>
              <th>{{ t('date') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cur in currencies" :key="cur">
              <td>{{ cur }}</td>
              <td>{{ rates[cur].toFixed(3) }}</td>
              <td>{{ date.toLocaleString(("en-GB", { timeZone: "UTC" })) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
