<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const { value } = defineProps(["value"]);

const links = ref([
  { title: "Рахунок", url: "/", exact: true },
  { title: "Історія", url: "/history" },
  { title: "Планування", url: "/planning" },
  { title: "Новий запис", url: "/record" },
  { title: "Категорії", url: "/categories" },
]);
</script>

<template>
  <ul class="sidenav app-sidenav" :class="{ open: value }">
    <RouterLink
      v-for="link in links"
      :key="link.url"
      :to="link.url"
      active-class="active"
      :exact="link.exact"
    >
      <li>
        <a href="#" class="waves-effect waves-orange pointer">{{
          link.title
        }}</a>
      </li>
    </RouterLink>
  </ul>
</template>
