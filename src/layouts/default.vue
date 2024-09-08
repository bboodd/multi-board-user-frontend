<template>
  <v-app>
    <ErrorBoundary>
      <AppHeader />

      <Suspense>
        <v-main>
          <router-view />
        </v-main>
        <template #fallback>
          <SpinnerLoading />
        </template>
      </Suspense>

      <AppFooter />
    </ErrorBoundary>
  </v-app>
</template>

<script setup>
//
</script>
<style scoped></style>
