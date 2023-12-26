<script setup>
import { computed, watch, inject } from "vue";
import { useStore } from "vuex";
import messages from "@/utils/messages";

const errorPlugin = inject("errorPlugin");

const store = useStore();

const error = computed(() => {
  return store.getters.error;
});

watch(error, (fbEroor) => {
  errorPlugin(messages[fbEroor.code] || "Щось пішло не так!");
});
</script>

<template>
  <div class="grey darken-1 empty-layout">
    <RouterView />
  </div>
</template>
