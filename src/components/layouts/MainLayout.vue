<script setup>
import { ref, onMounted, computed, watch, inject} from "vue";
import { useStore } from "vuex";
import Sidebar from "../app/Sidebar.vue";
import Navbar from "../app/Navbar.vue";
import { vTooltip } from "@/directives/tooltip.directive";
import messages from '@/utils/messages'
import {useI18n} from 'vue-i18n'

const store = useStore();
const errorPlugin = inject("errorPlugin");

const { t, locale } = useI18n({useScope: 'global'})

const myLocale = computed(() => store.getters.info.locale)

locale.value = myLocale.value

const isOpen = ref(true);
const loading = ref(true);

const navLocale = computed(() => store.getters.info)

onMounted(async () => {
  if (!Object.keys(store.getters.info).length) {
    await store.dispatch("fetchInfo");
  }
  loading.value = false;
});

const error = computed(() => {
  return store.getters.error;
});

watch(error, (fbEroor) => {
  errorPlugin(messages[fbEroor.code] || "Щось пішло не так!");
});

</script>

<template>
  <div>
    <Loader v-if="loading" />
    <div class="app-main-layout" v-else>
      <Navbar @press="isOpen = !isOpen"/>
      <Sidebar v-if="Object.keys(store.getters.info).length" :value="isOpen" :key="navLocale"/>
      <main class="app-content" :class="{ full: !isOpen }">
        <div class="app-page">
          <RouterView />
        </div>
      </main>
      <div class="fixed-action-btn">
        <router-link
          class="btn-floating btn-large blue"
          :to="{ name: 'record' }"
          
        >
          <i class="large material-icons" v-tooltip="`${t('createNewRec')}`">add</i>
        </router-link>
      </div>
    </div>
  </div>
</template>
