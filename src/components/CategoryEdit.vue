<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  inject,
  defineEmits,
} from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import { useStore } from "vuex";
import messages from "@/utils/messages";

const store = useStore();
const emit = defineEmits();
const messagePlugin = inject("messagePlugin");

const selectMat = ref(null);
const select = ref(null);

const { categories } = defineProps(["categories"]);

const current = ref(null);
const newTitle = ref(null);
const newLimit = ref(null);

const rules = {
  newTitle: { required },
  newLimit: { minValue: minValue(10) },
};

const v$ = useVuelidate(rules, { newTitle, newLimit });

watch(current, () => {
  const { title, limit } = categories.find((c) => c.id === current.value);
  newTitle.value = title;
  newLimit.value = limit;
});

onMounted(() => {
  if (categories.length) {
    current.value = categories[0].id;
    newTitle.value = categories[0].title;
    newLimit.value = categories[0].limit;
  }

  setTimeout(() => {
    M.updateTextFields();
    select.value = M.FormSelect.init(selectMat.value);
  }, 0);
});

onBeforeUnmount(() => {
  if (select.value && select.value.destroy) {
    select.value.destroy();
  }
});

const submitHandler = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }
  try {
    const categoryData = {
      id: current.value,
      title: newTitle.value,
      limit: newLimit.value,
    };

    await store.dispatch("updateCategory", categoryData);
    messagePlugin(messages["categoryUpdate"]);
    emit("updated", categoryData);
  } catch (e) {}
};
</script>

<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Редагувати</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <select v-model="current" ref="selectMat">
            <option v-for="cat of categories" :key="cat.id" :value="cat.id">
              {{ cat.title }}
            </option>
          </select>
          <label>Виберіть категорію</label>
        </div>

        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="newTitle"
            :class="{
              invalid: v$.newTitle.$dirty && v$.newTitle.required.$invalid,
            }"
          />
          <label for="name">Назва</label>
          <span
            v-if="v$.newTitle.$dirty && v$.newTitle.required.$invalid"
            class="helper-text invalid"
            >Введіть назву</span
          >
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="newLimit"
            :class="{
              invalid: v$.newLimit.$dirty && v$.newLimit.minValue.$invalid,
            }"
          />
          <label for="limit">Ліміт</label>
          <span
            v-if="v$.newLimit.$dirty && v$.newLimit.minValue.$invalid"
            class="helper-text invalid"
            >Мінімальне значення {{ v$.newLimit.minValue.$params.min }}</span
          >
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          Оновити
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>
