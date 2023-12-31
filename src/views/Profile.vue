<script setup>
import {ref, computed, onMounted} from 'vue'
import {useStore} from 'vuex'
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import {useI18n} from 'vue-i18n'

const store = useStore()

const { t, locale } = useI18n({useScope: 'global'})

const myLocale = computed(() => store.getters.info.locale)

locale.value = myLocale.value

const username = ref('')
const isUaLocale = ref(true)

const info = computed(() => store.getters.info)

onMounted(() => {
  username.value = info.value.username
  isUaLocale.value = info.value.locale === 'ua'
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
    await store.dispatch('updateInfo', {
      username: username.value,
      locale: isUaLocale.value ? 'ua' : 'en'
    })
  } catch (e) {}
};

</script>

<template>
  <div>
    <div class="page-title">
      <h3>{{ t('profile') }}</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input id="description" type="text" v-model.trim="username" 
          :class="{invalid: (v$.username.$dirty && v$.username.required.$invalid)}"
        />
        <label for="description">{{ t('name') }}</label>
        <small
          class="helper-text invalid"
          v-if="v$.username.$dirty && v$.username.required.$invalid"
          >{{ t('nameEnter') }}</small
        >
      </div>
      <div class="switch">
        <label>
          English
          <input type="checkbox" v-model="isUaLocale">
          <span class="lever"></span>
          Українська
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ t('update') }}
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
