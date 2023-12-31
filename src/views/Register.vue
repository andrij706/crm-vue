<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import {useI18n} from 'vue-i18n'

const router = useRouter();
const store = useStore();

const { t, locale } = useI18n({useScope: 'global'})

const username = ref("");
const userEmail = ref("");
const userPassword = ref("");
const agree = ref(false);

const isUaLocale = ref(true)
locale.value = isUaLocale.value ? 'ua' : 'en'

const rules = {
  username: { required },
  userEmail: { email, required },
  userPassword: { required, minLength: minLength(6) },
  agree: { checked: (v) => v },
};

const v$ = useVuelidate(rules, { username, userEmail, userPassword, agree });

const submitHandler = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }
  const formData = {
    username: username.value,
    email: userEmail.value,
    password: userPassword.value,
    locale: locale.value
  };
  try {
    await store.dispatch("register", formData);
    router.push({ name: "home" });
  } catch (e) {}
};
</script>

<template>
  <form class="card auth-card" @submit.prevent="submitHandler" :key="locale">
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
          >{{ t(passwordInvalid1) }}</small
        >
        <small
          class="helper-text invalid"
          v-else-if="
            v$.userPassword.$dirty && v$.userPassword.minLength.$invalid
          "
          >{{ t(passwordInvalid2) }}
          {{ v$.userPassword.minLength.$params.min }} {{ passwordInvalid2_1 }} {{ userPassword.length }} {{ t(passwordInvalid2_2) }}</small
        >
      </div>
      <div class="input-field">
        <input
          id="name"
          type="text"
          v-model.trim="username"
          :class="{
            invalid: v$.username.$dirty && v$.username.required.$invalid,
          }"
        />
        <label for="name">{{ t('name') }}</label>
        <small
          v-if="v$.username.$dirty && v$.username.required.$invalid"
          class="helper-text invalid"
          >{{ t('nameInvalid') }}</small
        >
      </div>
      <p>
        <label>
          <input type="checkbox" v-model="agree" />
          <span>{{ t('checkRules') }}</span>
        </label>
      </p>
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          {{ t('signUp') }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{ t('readyAccount') }}
        <router-link :to="{ name: 'login' }">{{ t('enter') }}</router-link>
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
