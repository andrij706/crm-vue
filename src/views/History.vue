<script setup>
import {onMounted, ref, computed} from 'vue'
import {useStore} from 'vuex'
import HistoryTable from '@/components/HistoryTable.vue';
import Paginate from 'vuejs-paginate-next'
import {useRoute, useRouter} from 'vue-router'
import HistoryChart from '@/components/HistoryChart.vue';
import {useI18n} from 'vue-i18n'

const store = useStore()
const route = useRoute()
const router = useRouter()

const { t, locale } = useI18n({useScope: 'global'})

const myLocale = computed(() => store.getters.info.locale)

locale.value = myLocale.value

const loading = ref(true)
const records = ref([])
const categories = ref([])

const page = ref(+route.query.page || 1)
const pageSize = ref(5)
const pageCount = ref(0)
const allItems = ref([])
const items = ref([])

const charData = ref(null)
const charOptions = ref(null)

const getColors = () => {
        const r = Math.floor(Math.random() * 256)
        const g = Math.floor(Math.random() * 256)
        const b = Math.floor(Math.random() * 256)
        return (`rgb(${r}, ${g}, ${b})`)
      }

const setupPagination = () => {
  allItems.value = records.value.reduce((pArray, item, index) => {
      const chunkIndex = Math.floor(index/pageSize.value)
      if(!pArray[chunkIndex]){
        pArray[chunkIndex] = []
      }
      pArray[chunkIndex].push(item)
      return pArray
    }, [])
    
    pageCount.value = allItems.value.length

    items.value = allItems.value[page.value - 1] || allItems.value[0]
}

onMounted( async () => {
  try{
    const storeRecords = await store.dispatch("fetchRecords");
    categories.value = await store.dispatch("fetchCategories");
    

    records.value  = storeRecords.map(record => {
      return {
            ...record,
            categoryName: categories.value.find(c => c.id === record.categoryID).title,
            typeClass: record.type === 'income' ? 'green' : 'red',
            typeText: record.type === 'income' ? 'Дохід' : 'Витрати'
        }
    })

    setupPagination()

    charOptions.value = categories.value.map(c => c.title)

    const colors = charOptions.value.map(() => getColors())

    charData.value = {
      labels : charOptions.value,
      datasets: [{
        data: categories.value.map(c => {
          return records.value.reduce((total, r) => {
            if(r.categoryID === c.id && r.type === 'outcome'){
              total += +r.amount
            }
            return total
          }, 0)
        }),
        backgroundColor: colors
      }]
    }
    loading.value = false

  }catch(e) {}
})

const pageChangeHandler = () => {
  router.push(`${route.path}?page=${page.value}`)
  items.value = allItems.value[page.value - 1] || allItems.value[0]
}

</script>

<template>
  <div>
    <div class="page-title">
      <h3>{{ t('recHistory') }}</h3>
    </div>
    <Loader v-if="loading"/>
    <p v-else-if="!records.length" class="center">
      {{ t('emptyHis') }}
      <RouterLink :to="{ name: 'categories' }"
        >{{ t('createNewRec') }}</RouterLink
      ></p>
    <section v-else>
      <div class="history-chart">
      <section>
        <HistoryChart :loading="loading" :charData="charData" :charOptions="charOptions" :style="{ maxHeight: '300px' }" />
      </section>
    </div>
      <HistoryTable :records="items"/>
      <Paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="t('prev')"
        :next-text="t('next')"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      />
    </section>
  </div>
</template>