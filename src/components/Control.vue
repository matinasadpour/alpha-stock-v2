<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import ControlIcon from '@/components/ControlIcon.vue';

const props = defineProps({
  name: {
    type: String,
    default: null,
  },
  id: {
    type: String,
    default: null,
  },
  autocomplete: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  options: {
    type: Array,
    default: null,
  },
  type: {
    type: String,
    default: 'text',
  },
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: '',
  },
  required: Boolean,
  borderless: Boolean,
  transparent: Boolean,
  ctrlKFocus: Boolean,
  disabled: Boolean,
});

const emit = defineEmits(['update:modelValue', 'right-icon-click', 'barcode']);

const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

const inputElClass = computed(() => {
  const base = [
    'px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full',
    'dark:placeholder-gray-400',
    computedType.value === 'textarea' ? 'h-24' : 'h-12',
    props.borderless ? 'border-0' : 'border',
    props.transparent ? 'bg-transparent' : 'bg-white dark:bg-gray-800',
  ];

  if (props.icon) {
    base.push('pr-10');
  }

  return base;
});

const computedType = computed(() => (props.options ? 'select' : props.type));

const controlIconH = computed(() =>
  props.type === 'textarea' ? 'h-full' : 'h-12'
);

const store = useStore();

const inputEl = ref(null);

if (props.ctrlKFocus) {
  const fieldFocusHook = (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      inputEl.value.focus();
    } else if (e.key === 'Escape') {
      inputEl.value.blur();
    }
  };

  onMounted(() => {
    if (!store.state.isFieldFocusRegistered) {
      window.addEventListener('keydown', fieldFocusHook);

      store.commit('basic', {
        key: 'isFieldFocusRegistered',
        value: true,
      });
    } else {
      // console.error('Duplicate field focus event')
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', fieldFocusHook);

    store.commit('basic', {
      key: 'isFieldFocusRegistered',
      value: false,
    });
  });
}
</script>

<template>
  <div class="relative">
    <select
      v-if="computedType === 'select'"
      :id="id"
      v-model="computedValue"
      :name="name"
      :class="inputElClass"
      :disabled="disabled"
    >
      <option :value="null">(عدم انتخاب)</option>
      <option
        v-for="option in options"
        :key="option.id ?? option"
        :value="option"
      >
        {{ option.label ?? option.name ?? option }}
      </option>
    </select>
    <textarea
      v-else-if="computedType === 'textarea'"
      :id="id"
      v-model="computedValue"
      :class="inputElClass"
      :name="name"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
    />
    <input
      v-else
      :id="id"
      ref="inputEl"
      v-model="computedValue"
      :name="name"
      :autocomplete="autocomplete"
      :required="required"
      :placeholder="placeholder"
      :type="computedType"
      :class="inputElClass"
      :disabled="disabled"
    />
    <control-icon v-if="icon" :icon="icon" :h="controlIconH" />
  </div>
</template>
