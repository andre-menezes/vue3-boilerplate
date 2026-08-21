<template>
  <component
    :is="targetIcon"
    :weight="weight"
    :color="color"
    :size="size"
    :mirrored="mirrored"
    :alt="alt"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as SolarIcons from '@solar-icons/vue';
import type { Props } from '@/types/icons';

const props = withDefaults(defineProps<Props>(), {
  weight: 'Linear',
  color: 'currentColor',
  size: 16,
  mirrored: false,
  alt: undefined,
});

defineOptions({
  inheritAttrs: false,
});

const targetIcon = computed(() => {
  const icon = SolarIcons[props.name];

  if (!icon) {
    console.warn(`[SIcon] O ícone "${props.name}" não existe no @solar-icons/vue.`);
  }

  return icon;
});
</script>
