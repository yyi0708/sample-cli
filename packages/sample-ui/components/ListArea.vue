<template>
    <div class="wrap">
        <el-card shadow="hover">
            <template #header>
                <div class="card-header">
                    <slot name="header-name">
                        <span>{{ title }}</span>
                    </slot>
                    <slot name="header-opt">
                        <el-button text>
                            <el-icon :size="18"><Plus /></el-icon>
                        </el-button>
                    </slot>
                </div>
            </template>
            <div class="item-wrap">
                <div v-for="(v,i) in ctxArr" :key="i" class="text-item">
                    <div class="item-left">
                        <div class="title">
                            <slot name="item-title">{{ v[name] }}</slot>
                        </div>
                        <div class="describe">
                            <slot name="item-describe">
                                <span>{{ v[value] || 'No description yet！' }}</span>
                            </slot>
                        </div>
                    </div>
                    <div class="item-opt">
                        <slot name="icon" :type="v"></slot>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import {
    Plus
} from '@element-plus/icons-vue'

interface Props {
  title: string
  ctxArr?: Array<any>
  name?: 'name' | 'title'
  value?: 'submary' | 'tips'
}

const props = withDefaults(defineProps<Props>(), {
    title: 'project',
    ctxArr: () => [],
    name: 'name',
    value: 'tips'
})

const { title, ctxArr, name, value } = toRefs(props)

</script>

<style scoped lang="scss">
.wrap {
    width: 100%;
    height: 100%;
    padding: 12px;

    box-sizing: border-box;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-wrap {
    width: 100%;
    height: calc(100vh - 70px - 80px);

    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    overflow-x: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
    }
    ::-webkit-scrollbar {
        display: none;
    }
    
    .text-item {
        padding: 18px 0;
        border-bottom: 1px solid #cccccc8e;

        display: flex;
        justify-content: space-between;
        align-items: center;

        &:nth-last-child(1) {
            border-bottom: none;
        }

        .item-left {
            max-width: 70%;

            // background-color: gray;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .title {
                font-weight: bold;
                font-size: 18px;

                margin-bottom: 5px;
            }

            .describe {
                width: 100%;

                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;

                font-size: 14px;
                color: #666;
            }
        }

        .item-opt {
            cursor: pointer;
        }
    }
}

</style>