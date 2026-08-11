<script setup lang="ts">
const api = useApi();

async function testApi() {
  try {
    const result = await api("/documents");
    console.log("API works:", result);
  } catch (error) {
    console.log("API error:", error);
  }
}
</script>

<template>
  <q-page class="q-pa-lg">
    <q-btn label="Test API" color="primary" @click="testApi" />
  </q-page>
</template>
