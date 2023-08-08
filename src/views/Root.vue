<script setup>
import { useRouter } from 'vue-router';
import { styleKey } from '@/config.js';

const router = useRouter();

if (localStorage[styleKey]) {
  router.push('/dashboard');
} else {
  router.push('/style');
}
</script>
