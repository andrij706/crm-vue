<script setup>
import { ref, onMounted, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { useStore } from "vuex";
import messages from "../utils/messages";

const router = useRouter();
const route = useRoute();
const store = useStore();

const messagePlugin = inject("messagePlugin");

const userEmail = ref("");
const userPassword = ref("");

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
      <span class="card-title">Домашня бухгалтерія</span>
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
          >Поле Email не може бути порожнім</small
        >
        <small
          class="helper-text invalid"
          v-else-if="v$.userEmail.$dirty && v$.userEmail.email.$invalid"
          >Введіть коректний Email</small
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
        <label for="password">Пароль</label>
        <small
          class="helper-text invalid"
          v-if="v$.userPassword.$dirty && v$.userPassword.required.$invalid"
          >Введіть пароль</small
        >
        <small
          class="helper-text invalid"
          v-else-if="
            v$.userPassword.$dirty && v$.userPassword.minLength.$invalid
          "
          >Мінімальна довжина пароля
          {{ v$.userPassword.minLength.$params.min }} символів. Довжина вашого
          паролю {{ userPassword.length }} символів</small>
      </div>
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          Ввійти
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Відсутній аккаунт?
        <router-link :to="{ name: 'register' }">Зареєструватися</router-link>
      </p>
    </div>
  </form>
</template>
