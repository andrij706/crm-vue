<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { vTooltip } from '@/directives/tooltip.directive'
import {useI18n} from 'vue-i18n'

const store = useStore();

const { t, locale } = useI18n({useScope: 'global'})

const myLocale = computed(() => store.getters.info.locale)

locale.value = myLocale.value

const {records} = defineProps(['records'])

</script>

<template>
    <table>
        <thead>
          <tr>
            <th>#</th>
            <th>{{ t('total') }}</th>
            <th>{{ t('date') }}</th>
            <th>{{ t('category') }}</th>
            <th>{{ t('type') }}</th>
            <th>{{ t('open') }}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(record, idx) in records" :key="record.id">
            <td>{{ idx + 1 }}</td>
            <td>{{ record.amount.toLocaleString("uk-UA", {
                style: "currency", currency: "UAH" }) }}
            </td>
            <td>{{ record.date.toLocaleString(("en-GB", { timeZone: "UTC" })) }}</td>
            <td>{{ record.categoryName }}</td>
            <td>
              <span class="white-text badge" :class="[record.typeClass]">{{ record.typeText === 'Витрати'? t('outcome') : t('income') }}</span>
            </td>
            <td>
              <button
                v-tooltip="t('openRec')"
                class="btn-small btn" 
                @click="$router.push('/detail/' + record.id)"
              >
                <i class="material-icons">open_in_new</i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
</template>