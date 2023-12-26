<script setup>
import {ref, computed, onMounted} from 'vue'
import {useStore} from 'vuex'
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const store = useStore()

const username = ref('')

const info = computed(() => store.getters.info)

onMounted(() => {
  username.value = info.value.username
  setTimeout(() => {
    M.updateTextFields()
  }, 0)
  
})

const rules = {
  username: { required },
};

const v$ = useVuelidate(rules, {username});

const submitHandler = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }

  try {
    await store.dispatch('updateInfo', {username: username.value})
  } catch (e) {}
};

</script>

<template>
  <div>
    <div class="page-title">
      <h3>Профіль</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input id="description" type="text" v-model.trim="username" 
          :class="{invalid: (v$.username.$dirty && v$.username.required.$invalid)}"
        />
        <label for="description">І'мя</label>
        <small
          class="helper-text invalid"
          v-if="v$.username.$dirty && v$.username.required.$invalid"
          >Введіть ім'я</small
        >
      </div>
      <div class="switch">
        <label>
          English
          <input type="checkbox">
          <span class="lever"></span>
          Українська
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Оновити
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<style scoped>
.switch{
  margin-bottom: 2rem;
}
</style>
