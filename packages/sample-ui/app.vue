<template>
  <div class="container">
    <el-row justify="space-between">
      <el-col :span="8">
        <!-- 项目模版 增量模块  快速导航-->
        <ListArea title="demo" :ctxArr="projectArr">
          <template #icon>
            <el-icon @click.stop="openFn('project')">
              <el-tooltip content="exec">
                <el-icon><VideoPlay /></el-icon>
              </el-tooltip>
            </el-icon>
          </template>
        </ListArea>
      </el-col>
      <el-col :span="8">
        <ListArea title="demo" :ctxArr="moduleArr">
          <template #icon>
            <el-tooltip content="exec">
              <el-icon><VideoPlay /></el-icon>
            </el-tooltip>
          </template>
        </ListArea>
      </el-col>
      <el-col :span="8">
        <ListArea title="demo" :ctxArr="openArr" name="title" value="submary">
          <template #icon>
            <el-tooltip content="github">
              <el-icon><Link /></el-icon>
            </el-tooltip>
            <el-tooltip content="website">
              <el-icon style="margin-left: 12px;"><Connection /></el-icon>
            </el-tooltip>
          </template>
        </ListArea>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {
  VideoPlay,
  Link,
  Connection
} from '@element-plus/icons-vue'


const dialogVisible = ref<boolean>(false)
const projectArr = ref<Template.CreateRow[]>([])
const moduleArr = ref([])
const openArr = ref<Template.RowLink[]>([])


onMounted(() => {
  init()
})

async function init() {
  const [projectList, openList] =  await Promise.all([
    getProjectTemplete(),
    getOpensource()
  ])

  projectArr.value = projectList
  openArr.value = openList
  console.log(projectList, openList);
}

const openFn = (type: CardType) => {
  dialogVisible.value = true
}

// get Templete of project
async function getProjectTemplete() {
  const { data } = await useFetch('/api/config', {
    params: {
      type: 'project'
    }
  })
  const { template } = data.value as Template.ConfigCreateType
  return template
}

// get Templete of Opensource
async function getOpensource() {
  const { data } = await useFetch('/api/config', {
    params: {
      type: 'open'
    }
  })

  const { template } = data.value as Template.ConfigOpenType
  return template
}

</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: calc(100vh - 16px);
  /* padding-top: 40px; */

  box-sizing: border-box;
  overflow: hidden;
}
</style>
