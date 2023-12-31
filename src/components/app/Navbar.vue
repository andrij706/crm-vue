<script setup>
import M from "materialize-css";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import {useI18n} from 'vue-i18n'

const router = useRouter();
const store = useStore();

const { t, locale } = useI18n({useScope: 'global'})

const myLocale = computed(() => store.getters.info.locale)

locale.value = myLocale.value

const username = computed(() => {
  return store.getters.info.username;
});

const dropdown = ref(null);

const logOut = async () => {
  await store.dispatch("logout");
  router.push("/login?message=logout");
};

const date = ref(new Date());

onMounted(() => {
  M.Dropdown.init(dropdown.value, {
    constrainWidth: true,
  });
});

const interval = onMounted(() => {
  setInterval(() => {
    date.value = new Date();
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(interval);
  if (dropdown.value && dropdown.value.destroy) {
    dropdown.value.destroy();
  }
});
</script>

<template>
  <nav class="navbar orange lighten-1">
    <div class="nav-wrapper">
      <div class="navbar-left">
        <a href="#" @click.prevent="$emit('press')">
          <i class="material-icons black-text">dehaze</i>
        </a>
        <span class="black-text">{{
          date.toLocaleString(("en-GB", { timeZone: "UTC" }))
        }}</span>
      </div>

      <ul class="right hide-on-small-and-down">
        <li>
          <a
            class="dropdown-trigger black-text"
            href="#"
            data-target="dropdown"
            ref="dropdown"
          >
            {{ username }}
            <i class="material-icons right">arrow_drop_down</i>
          </a>

          <ul id="dropdown" class="dropdown-content">
            <li>
              <router-link :to="{ name: 'profile' }" class="black-text">
                <i class="material-icons">account_circle</i>{{ t('profile') }}
              </router-link>
            </li>
            <li class="divider" tabindex="-1"></li>
            <li>
              <a @click.prevent="logOut" href="#" class="black-text">
                <i class="material-icons">assignment_return</i>{{ t('exit') }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>
