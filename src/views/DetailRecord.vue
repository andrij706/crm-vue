<script setup>
import {ref, onMounted} from 'vue'
import {useStore} from 'vuex'
import {useRoute} from 'vue-router'

const store = useStore()
const route = useRoute()

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
        <router-link to="/history" class="breadcrumb">Історія</router-link>
        <a @click.prevent class="breadcrumb"> {{ record.type === 'income' ? 'Дохід' : 'Витрати' }}</a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div class="card" :class="{'red': record.type === 'outcome', 'green': record.type === 'income'}">
            <div class="card-content white-text">
              <p>Опис: {{ record.description }}</p>
              <p>Сума: {{ record.amount.toLocaleString("uk-UA", {
                style: "currency", currency: "UAH" }) }}</p>
              <p>Категорія: {{ record.categoryName }}</p>

              <small>{{ record.date.toLocaleString("uk-UA", { timeZone: "UTC" }) }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="center">Запис з id={{ route.params.id }} відсутній</p>
  </div>
</template>
