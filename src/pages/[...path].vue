<!-- NotFoundPage.vue -->
<template>
  <v-main class="mt-16">
    <v-empty-state
      headline="404 "
      image="https://vuetifyjs.b-cdn.net/docs/images/components/v-empty-state/astro-dog.svg"
      size="300"
      text-width="250"
    >
      <template #media>
        <v-img class="mb-8"></v-img>
      </template>

      <template #title>
        <div class="text-h6 text-high-emphasis">Page Not Found</div>
      </template>

      <template #text>
        <div class="text-body-1">페이지를 찾을 수 없습니다.</div>
      </template></v-empty-state
    >
  </v-main>
</template>
