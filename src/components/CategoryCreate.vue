<script setup>
import { ref, onMounted, inject, defineEmits, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import { useStore } from "vuex";
import messages from "@/utils/messages";
import {useI18n} from 'vue-i18n'

const store = useStore();
const emit = defineEmits();
const messagePlugin = inject("messagePlugin");

const { t, locale } = useI18n({useScope: 'global'})

const myLocale = computed(() => store.getters.info.locale)

locale.value = myLocale.value

const title = ref("");
const limit = ref(10);

const rules = {
  title: { required },
  limit: { minValue: minValue(10) },
};

const v$ = useVuelidate(rules, { title, limit });

onMounted(() => {
  M.updateTextFields();
});

const submitHandler = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }
  try {
    const category = await store.dispatch("createCategory", {
      title: title.value,
      limit: limit.value,
    });
    title.value = "";
    limit.value = 10;
    v$.value.$reset();
    messagePlugin(messages["categoryCreate"]);
    emit("created", category);
  } catch (e) {}
};
</script>

<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ t('create') }}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="title"
            :class="{ invalid: v$.title.$dirty && v$.title.required.$invalid }"
          />
          <label for="name">{{ t('catName') }}</label>
          <span
            v-if="v$.title.$dirty && v$.title.required.$invalid"
            class="helper-text invalid"
            >{{ t('enterCatName') }}</span
          >
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="limit"
            :class="{ invalid: v$.limit.$dirty && v$.limit.minValue.$invalid }"
          />
          <label for="limit">{{ t('limit') }}</label>
          <span
            v-if="v$.limit.$dirty && v$.limit.minValue.$invalid"
            class="helper-text invalid"
            >{{ t('invalidLimit') }} {{ v$.limit.minValue.$params.min }}</span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{ t('create') }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>
