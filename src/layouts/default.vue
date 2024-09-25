<template>
  <Suspense>
    <v-main>
      <AppHeader />
      <router-view />
      <AppFooter />
    </v-main>
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>
</template>

<script setup>
//
</script>
<style scoped></style>
