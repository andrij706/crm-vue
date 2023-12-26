<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import CategoryCreate from "@/components/CategoryCreate.vue";
import CategoryEdit from "@/components/CategoryEdit.vue";

const store = useStore();

const categories = ref([]);
const loading = ref(true);
const updateCount = ref(0);

const addNewCategory = (category) => {
  categories.value.push(category);
};

const updateCategories = (category) => {
  const idx = categories.value.findIndex((c) => c.id === category.id);
  categories.value[idx].title = category.title;
  categories.value[idx].limit = category.limit;
  updateCount.value++;
};

onMounted(async () => {
  categories.value = await store.dispatch("fetchCategories");
  loading.value = false;
});
</script>

<template>
  <div>
    <div class="page-title">
      <h3>Категорії</h3>
    </div>
    <section>
      <Loader v-if="loading" />
      <div class="row" v-else>
        <CategoryCreate @created="addNewCategory" />
        <CategoryEdit
          v-if="categories.length"
          @updated="updateCategories"
          :categories="categories"
          :key="categories.length + updateCount"
        />
        <p v-else class="center">Категорій ще нема</p>
      </div>
    </section>
  </div>
</template>
