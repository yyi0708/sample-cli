<template>
    <div class="wrap">
        <el-input class="input" size="large" v-model="input" placeholder="Search" />

        <el-tag
            class="tag"
            v-for="tag in tags"
            :key="tag.name"
            closable
        >
            {{ tag.name }}
        </el-tag>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tags = ref([
  { name: 'Tag 1', type: '' },
  { name: 'Tag 4', type: 'warning' },
  { name: 'Tag 5', type: 'danger' },
])
const input = ref('')
</script>

<style scoped>
.wrap {
    width: 100%;
    padding: 10px 0;

    box-sizing: border-box;
}
.input {
    margin-bottom: 12px;
}
.tag {
    margin-right: 8px;
    margin-bottom: 8px;
}
</style>