<script setup>
import store from "@/store";
import { ref, computed } from "vue";
import {useI18n} from 'vue-i18n'
import { RouterLink } from "vue-router";

const { value } = defineProps(["value"]);

const { t, locale } = useI18n({useScope: 'global'})

const myLocale = computed(() => store.getters.info.locale)

locale.value = myLocale.value

const links = ref([
  { title: t('bill'), url: "/", exact: true },
  { title: t('history'), url: "/history" },
  { title: t('planning'), url: "/planning" },
  { title: t('newRecord'), url: "/record" },
  { title: t('categories'), url: "/categories" },
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
