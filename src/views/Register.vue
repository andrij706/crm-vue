<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";

const router = useRouter();
const store = useStore();

const username = ref("");
const userEmail = ref("");
const userPassword = ref("");
const agree = ref(false);

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
  };
  try {
    await store.dispatch("register", formData);
    router.push({ name: "home" });
  } catch (e) {}
};
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
          паролю {{ userPassword.length }} символів</small
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
        <label for="name">Ім'я</label>
        <small
          v-if="v$.username.$dirty && v$.username.required.$invalid"
          class="helper-text invalid"
          >Введіть ваше ім"я</small
        >
      </div>
      <p>
        <label>
          <input type="checkbox" v-model="agree" />
          <span>Згідний з правилами</span>
        </label>
      </p>
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          Зареєструватися
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Вже є аккаунт?
        <router-link :to="{ name: 'login' }">Ввійти!</router-link>
      </p>
    </div>
  </form>
</template>
