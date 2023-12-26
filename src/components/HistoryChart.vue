<template>
    <Pie
      v-if="!loading"
      :data="charData"
      :options="charOptions"
    />
</template>

<script setup>
import {Chart as ChartJS, Title, Tooltip, Legend, ArcElement} from 'chart.js'
import {Pie} from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const {charData, charOptions, loading} = defineProps(['charData', 'charOptions', 'loading'])

</script>