<template>
  <section class="app-main">
    <router-view v-slot="{ Component}">
      <transition name="fade" mode="out-in">
        <div>
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
  </section>
</template>

<script setup lang="ts">
</script>
