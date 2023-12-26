<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { vTooltip } from "@/directives/tooltip.directive";

const store = useStore();

const loading = ref(true);
const categories = ref([]);

const info = computed(() => store.getters.info);

onMounted(async () => {
  try {
    const records = await store.dispatch("fetchRecords");
    const storeCategories = await store.dispatch("fetchCategories");

    categories.value = storeCategories.map((cat) => {
      const spend = records
        .filter((r) => r.categoryID === cat.id)
        .filter((r) => r.type === "outcome")
        .reduce((total, record) => {
          return (total += +record.amount);
        }, 0);

      const percent = (100 * spend) / cat.limit;
      const progressPercent = percent > 100 ? 100 : percent;
      const progressColor =
        percent < 60 ? "green" : percent < 100 ? "yellow" : "red";
      const tooltipValue = cat.limit - spend;
      const tooltip = `${
        tooltipValue < 0 ? "Перевищення на " : "Залишилося "
      }${Math.abs(tooltipValue).toLocaleString("uk-UA", {
        style: "currency",
        currency: "UAH",
      })}`;

      return {
        ...cat,
        progressPercent,
        progressColor,
        spend,
        tooltip,
      };
    });

    loading.value = false;
  } catch (e) {}
});
</script>

<template>
  <div>
    <div class="page-title">
      <h3>Планування</h3>
      <h4>
        {{
          info.bill.toLocaleString("en-US", {
            style: "currency",
            currency: "UAH",
          })
        }}
      </h4>
    </div>
    <Loader v-if="loading" />
    <p v-else-if="!categories.length" class="center">
      Категорій ще нема
      <RouterLink :to="{ name: 'categories' }"
        >Додати нову категорію</RouterLink
      >
    </p>
    <section v-else>
      <div v-for="cat in categories" :key="cat.id">
        <p>
          <strong>{{ cat.title }}:</strong>
          {{
            cat.spend.toLocaleString("en-US", {
              style: "currency",
              currency: "UAH",
            })
          }}
          з
          {{
            cat.limit.toLocaleString("en-US", {
              style: "currency",
              currency: "UAH",
            })
          }}
        </p>
        <div class="progress" v-tooltip="cat.tooltip">
          <div
            class="determinate"
            :class="[cat.progressColor]"
            :style="{ width: cat.progressPercent + '%' }"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>
