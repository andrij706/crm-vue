<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <component :is="route.meta.layout || 'div'">
    <RouterView />
  </component>
</template>

<style lang="scss">
@import "../node_modules/materialize-css/dist/css/materialize.min.css";
@import "assets/index.css";
</style>
