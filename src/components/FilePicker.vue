<script setup>
import { mdiUpload, mdiTrashCan, mdiCloudUpload } from '@mdi/js';
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { useLoading } from 'vue-loading-overlay';
import JbButton from '@/components/JbButton.vue';
import JbButtons from '@/components/JbButtons.vue';

const props = defineProps({
  modelValue: {
    type: [Object, File, Array],
    default: null,
  },
  label: {
    type: String,
    default: 'Upload',
  },
  icon: {
    type: String,
    default: mdiUpload,
  },
  accept: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    default: 'info',
  },
  multiple: Boolean,
  canSubmit: Boolean,
});

const store = useStore();

const $loading = useLoading();

const emit = defineEmits(['update:modelValue', 'uploaded']);

const token = computed(() => store.state.token);

const root = ref(null);

const file = ref(props.modelValue);

const modelValueProp = computed(() => props.modelValue);

const isMultiple = computed(() => props.multiple);

watch(modelValueProp, (value) => {
  file.value = value;

  if (!value) {
    root.value.input.value = null;
  }
});

const displayFileName = (file) => {
  const arr = file.name.split('.');
  if (arr[0] > 15) {
    return file.name.substr(0, 10) + '...' + arr[0].substr(-5) + '.' + arr[1];
  }
  return file.name;
};

const getImageSrc = (file) => {
  return URL.createObjectURL(file);
};

const input = (event) => {
  const value = event.target.files || event.dataTransfer.files;
  if (isMultiple.value) {
    file.value = file.value.concat([...value]);
  } else {
    file.value = [...value];
  }

  emit('update:modelValue', file.value);

  // Use this as an example for handling file uploads
  // let formData = new FormData()
  // formData.append('file', file.value)

  // const mediaStoreRoute = `/your-route/`

  // axios
  //   .post(mediaStoreRoute, formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     },
  //     onUploadProgress: progressEvent
  //   })
  //   .then(r => {
  //
  //   })
  //   .catch(err => {
  //
  //   })
};

// const uploadPercent = ref(0)
//
// const progressEvent = progressEvent => {
//   uploadPercent.value = Math.round(
//     (progressEvent.loaded * 100) / progressEvent.total
//   )
// }

const upload = async (file) => {
  let formData = new FormData();
  formData.append('file', file);
  try {
    const res = await axios.post(
      'https://www.alpha-stock.com/wp-json/wp/v2/media',
      formData,
      { headers: { authorization: 'Bearer ' + token.value } }
    );
    return res.data.source_url;
  } catch (error) {
    if (error.response) {
      store.dispatch('notif', {
        message: error.response.data.code + ' | ' + error.response.data.code,
        color: 'danger',
      });
    }
  }
};

const uploadImages = async () => {
  const loader = $loading.show({
    color: '#ffffff',
    backgroundColor: '#000000',
    canCancel: true,
  });

  if (file.value.length) {
    for (const f of file.value) {
      if (f.src) continue;
      const res = await upload(f);
      if (res) f.src = res;
    }
  }
  emit('uploaded');
  loader.hide();
};
</script>

<template>
  <div class="flex items-stretch justify-start relative">
    <table class="place-items-center">
      <thead>
        <tr>
          <th />
          <th>تصویر</th>
          <th>اسم</th>
          <th>وضعیت</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-if="!file.length">
          <td colspan="5" class="text-center">موردی وجود ندارد!</td>
        </tr>
        <tr v-for="(f, i) in file" :key="f.name">
          <td>{{ i }}</td>
          <td>
            <img
              :src="f.src ? f.src : getImageSrc(f)"
              height="50"
              width="50"
              loading="lazy"
            />
          </td>
          <td class="ltr">{{ displayFileName(f) }}</td>
          <td v-if="f.src">آپلود شد ✅</td>
          <td v-else>🔴 در انتظار آپلود</td>
          <td>
            <jb-buttons type="justify-start lg:justify-end" no-wrap>
              <jb-button
                color="danger"
                :icon="mdiTrashCan"
                small
                @click="file.splice(i, 1)"
              />
            </jb-buttons>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="flex items-stretch justify-center relative mt-3">
    <jb-buttons>
      <label class="inline-block">
        <jb-button as="a" :label="label" :icon="icon" :color="color" />
        <input
          ref="root"
          type="file"
          class="absolute top-0 left-0 w-full h-full opacity-0 outline-none cursor-pointer -z-1"
          :accept="accept"
          @input="input"
          :multiple="multiple"
        />
      </label>
      <jb-button
        @click="uploadImages"
        color="info"
        outline
        label="آپلود تصاویر"
        :icon="mdiCloudUpload"
        :disabled="canSubmit"
      />
    </jb-buttons>
  </div>
</template>
