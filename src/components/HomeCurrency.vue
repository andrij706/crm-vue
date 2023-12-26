<script setup>
import { ref } from "vue";

const { rates, date } = defineProps(["rates", "date"]);
const currencies = ref(["UAH", "USD", "EUR"]);
</script>

<template>
  <div class="col s12 m6 l8">
    <div class="card orange darken-3 bill-card">
      <div class="card-content white-text">
        <div class="card-header">
          <span class="card-title">Курс валют</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Валюта</th>
              <th>Курс</th>
              <th>Дата</th>
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
