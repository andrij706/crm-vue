<script setup>
import { ref, onMounted, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { useStore } from "vuex";
import messages from "../utils/messages";
import {useI18n} from 'vue-i18n'

const router = useRouter();
const route = useRoute();
const store = useStore();

const { t, locale } = useI18n({useScope: 'global'})

const messagePlugin = inject("messagePlugin");

const userEmail = ref("");
const userPassword = ref("");

const isUaLocale = ref(true)
locale.value = isUaLocale.value ? 'ua' : 'en' 

const rules = {
  userEmail: { email, required },
  userPassword: { required, minLength: minLength(6) },
};

const v$ = useVuelidate(rules, { userEmail, userPassword });

const submitHandler = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }
  const formData = {
    email: userEmail.value,
    password: userPassword.value,
  };

  try {
    await store.dispatch("login", formData);
    router.push({ name: "home" });
  } catch (e) {}
};

onMounted(() => {
  if (messages[route.query.message]) {
    messagePlugin(messages[route.query.message]);
  }
});
</script>

<template>
  <form class="card auth-card" @submit.prevent="submitHandler">
    <div class="card-content">
      <span class="card-title">{{ t('title') }}</span>
      <div class="input-field">
        <input
          id="email"
          type="text"
          v-model.trim="userEmail"
          :class="{
            invalid:
              (v$.userEmail.$dirty && v$.userEmail.email.$invalid) ||
              (v$.userEmail.$dirty && v$.userEmail.required.$invalid),
          }"
        />
        <label for="email">Email</label>
        <small
          class="helper-text invalid"
          v-if="v$.userEmail.$dirty && v$.userEmail.required.$invalid"
          >{{ t('emailInvalid1') }}</small
        >
        <small
          class="helper-text invalid"
          v-else-if="v$.userEmail.$dirty && v$.userEmail.email.$invalid"
          >{{ t('emailInvalid2') }}</small
        >
      </div>
      <div class="input-field">
        <input
          id="password"
          type="password"
          v-model.trim="userPassword"
          :class="{
            invalid:
              (v$.userPassword.$dirty && v$.userPassword.required.$invalid) ||
              (v$.userPassword.$dirty && v$.userPassword.minLength.$invalid),
          }"
        />
        <label for="password">{{ t('password') }}</label>
        <small
          class="helper-text invalid"
          v-if="v$.userPassword.$dirty && v$.userPassword.required.$invalid"
          >{{ t('passwordInvalid1') }}</small
        >
        <small
          class="helper-text invalid"
          v-else-if="
            v$.userPassword.$dirty && v$.userPassword.minLength.$invalid
          "
          >{{ t('passwordInvalid2') }}
          {{ v$.userPassword.minLength.$params.min }} {{ t('passwordInvalid2_1') }} {{ userPassword.length }} {{ t('passwordInvalid2_2') }}</small>
      </div>
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          {{ t('enter') }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{ t('missAccaunt') }}
        <router-link :to="{ name: 'register' }">{{ t('signUp') }}</router-link>
      </p>
    </div>
  </form>
  <div class="switch">
        <label>
          English
          <input type="checkbox" v-model="isUaLocale" v-on:change="locale = isUaLocale ? 'ua' : 'en'">
          <span class="lever"></span>
          Українська
        </label>
      </div>
</template>
