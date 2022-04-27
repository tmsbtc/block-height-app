<template>
  <div class="home">
    <BlockHeight />
  </div>
</template>

<script>
// @ is an alias to /src
import BlockHeight from "@/components/BlockHeight.vue";

export default {
  name: "HomeView",
  components: {
    BlockHeight,
  },
};
</script>
