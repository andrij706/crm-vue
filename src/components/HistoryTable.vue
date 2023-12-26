<script setup>
import { vTooltip } from '@/directives/tooltip.directive'

const {records} = defineProps(['records'])

</script>

<template>
    <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Сума</th>
            <th>Дата</th>
            <th>Категорія</th>
            <th>Тип</th>
            <th>Відкрити</th>
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
              <span class="white-text badge" :class="[record.typeClass]">{{ record.typeText }}</span>
            </td>
            <td>
              <button
                v-tooltip="'Подивитися запис'"
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