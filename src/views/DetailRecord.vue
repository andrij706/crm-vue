<script setup>
import {ref, onMounted, computed} from 'vue'
import {useStore} from 'vuex'
import {useRoute} from 'vue-router'
import {useI18n} from 'vue-i18n'

const store = useStore()
const route = useRoute()

const { t, locale } = useI18n({useScope: 'global'})

const myLocale = computed(() => store.getters.info.locale)

locale.value = myLocale.value

const record = ref(null)
const loading = ref(true)

onMounted( async () => {
  try {
    const recordId = route.params.id
    const storeRecord = await store.dispatch('fetchRecordById', recordId)
    const category = await store.dispatch('fetchCategoryById', storeRecord.categoryID)

    record.value = {
      ...storeRecord,
      categoryName: category.title
    }

    loading.value = false
  } catch(e) {}
})
</script>

<template>
  <div>
    <Loader v-if="loading"/>
    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">{{ t('history') }}</router-link>
        <a @click.prevent class="breadcrumb"> {{ record.type === 'income' ? t('income') : t('outcome') }}</a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div class="card" :class="{'red': record.type === 'outcome', 'green': record.type === 'income'}">
            <div class="card-content white-text">
              <p>{{ t('description') }}: {{ record.description }}</p>
              <p>{{ t('total') }}: {{ record.amount.toLocaleString(t('currencyType'), {
                style: "currency", currency: "UAH" }) }}</p>
              <p>{{ t('category') }}: {{ record.categoryName }}</p>

              <small>{{ record.date.toLocaleString("uk-UA", { timeZone: "UTC" }) }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="center">{{ t('recordWI') }}={{ route.params.id }} {{ t('missing') }}</p>
  </div>
</template>
