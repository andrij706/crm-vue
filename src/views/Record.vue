<script setup>
import { ref, onMounted, onBeforeUnmount, computed, inject } from "vue";
import { useStore} from "vuex";
import { useVuelidate } from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import messages from "@/utils/messages";
import {useI18n} from 'vue-i18n'

const store = useStore();
const messagePlugin = inject("messagePlugin");

const { t, locale } = useI18n({useScope: 'global'})

const myLocale = computed(() => store.getters.info.locale)

locale.value = myLocale.value

const loading = ref(true);
const categories = ref([]);
const selectMat = ref(null);
const select = ref(null);
const category = ref(null);
const type = ref("outcome");
const amount = ref(1);
const description = ref("");

onMounted(async () => {
  categories.value = await store.dispatch("fetchCategories");
  loading.value = false;

  setTimeout(() => {
    M.updateTextFields();
    select.value = M.FormSelect.init(selectMat.value);
  }, 0);

  if (categories.value.length) {
    category.value = categories.value[0].id;
  }
});

const rules = {
  amount: { minValue: minValue(1) },
  description: { required },
};

const v$ = useVuelidate(rules, { amount, description });

const info = computed(() => store.getters.info);

const canCreateRecord = computed(() => {
  if (type.value === "income") {
    return true;
  }
  return info.value.bill >= amount.value;
});

const submitHandler = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch();
    return;
  }
  if (canCreateRecord.value) {
    try {
      await store.dispatch("createRecord", {
        categoryID: category.value,
        amount: amount.value,
        description: description.value,
        type: type.value,
        date: new Date().toJSON(),
      });
      const bill =
        type.value === "income"
          ? info.value.bill + amount.value
          : info.value.bill - amount.value;

      await store.dispatch("updateInfo", { bill });
      messagePlugin(messages["recordCreate"]);
      v$.value.$reset();
      amount.value = 1;
      description.value = "";
    } catch (e) {}
  } else {
    messagePlugin(
      `${t('notEnough')} (${amount.value - info.value.bill})`,
    );
  }
};

onBeforeUnmount(() => {
  if (select.value && select.value.destroy) {
    select.value.destroy();
  }
});
</script>

<template>
  <div>
    <div class="page-title">
      <h3>{{ t('newRecord') }}</h3>
    </div>
    <Loader v-if="loading" />
    <p v-else-if="!categories.length" class="center">
      {{ t('emptyCategories') }}
      <RouterLink :to="{ name: 'categories' }"
        >{{ t('createCategory') }}</RouterLink
      >
    </p>
    <form v-else @submit.prevent="submitHandler" class="form">
      <div class="input-field">
        <select ref="selectMat" v-model="category">
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.title }}
          </option>
        </select>
        <label>{{ t('choiceCategory') }}</label>
      </div>
      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>{{ t('income') }}</span>
        </label>
      </p>
      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>{{ t('outcome') }}</span>
        </label>
      </p>
      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{ invalid: v$.amount.$dirty && v$.amount.minValue.$invalid }"
        />
        <label for="amount">{{ t('total') }}</label>
        <span
          class="helper-text invalid"
          v-if="v$.amount.$dirty && v$.amount.minValue.$invalid"
          >{{ t('invalidLimit') }} {{ v$.amount.minValue.$params.min }}</span
        >
      </div>
      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{
            invalid: v$.description.$dirty && v$.description.required.$invalid,
          }"
        />
        <label for="description">{{ t('description') }}</label>
        <span
          class="helper-text invalid"
          v-if="v$.description.$dirty && v$.description.required.$invalid"
          >{{ t('addDesc') }}</span
        >
      </div>
      <button class="btn waves-effect waves-light" type="submit">
        {{ t('create') }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>
