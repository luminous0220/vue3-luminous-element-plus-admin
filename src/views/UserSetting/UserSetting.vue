<template>
  <div class="w-full h-full">
    <el-card body-class="flex h-full p-0! overflow-auto" class="w-full h-full">
      <!-- 个人信息 -->
      <div class="h-full w-360px py-22px px-28px relative" style="border-right: 1px solid #e5e7eb">
        <div class="flex flex-col flex-center text-[#555] pt-38px">
          <!-- 头像裁剪 -->
          <avatar-editor />

          <div class="mt-28px text-18px lt-md:(mt-18px)">{{ user.nickname }}</div>
          <div class="mt-18px text-14px text-[#95aac9]">{{ user.email }}</div>
          <div class="text-14px mt-18px line-clamp-5">
            {{ user.sign || `你还没有签名呢 ~` }}
          </div>

          <div class="mt-32px w-full lt-md:(mt-18px)">
            <div class="flex justify-between w-60% mx-auto">
              <span class="whitespace-nowrap text-[#95aac9]">性别</span>

              <el-tag type="success">{{ user.sex === 1 ? '男' : '女' }}</el-tag>
            </div>
            <div class="flex justify-between w-60% mx-auto mt-18px">
              <span class="whitespace-nowrap text-[#95aac9]">年龄</span>
              <el-tag type="primary">{{ user.age || '无' }}</el-tag>
            </div>
            <div class="flex justify-between w-60% mx-auto mt-18px">
              <span class="whitespace-nowrap text-[#95aac9]">生日</span>
              <el-tag type="warning">{{ user.birthday || '无' }}</el-tag>
            </div>
            <div class="flex justify-between w-60% mx-auto mt-18px">
              <span class="whitespace-nowrap text-[#95aac9]">手机</span>
              <el-tag type="danger">{{ user.phone || '无' }}</el-tag>
            </div>
          </div>
        </div>

        <div class="text-center mt-22px md:hidden">
          <el-button type="danger" @click="editShow = true">修改个人信息</el-button>
        </div>
      </div>

      <!-- 表单 -->
      <div class="py-22px px-28px lt-md:hidden" style="width: calc(100% - 360px)">
        <el-tabs type="border-card" class="w-full! h-full">
          <el-tab-pane label="基础信息">
            <Info />
          </el-tab-pane>
          <el-tab-pane label="密码管理">
            <EditPwd />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

    <!-- 修改信息弹窗（移动端） -->
    <basic-dialog :hideFooter="true" v-model="editShow" title="修改密码" draggable>
      <el-tabs type="border-card" class="w-full! h-full">
        <el-tab-pane label="基础信息">
          <Info @confirm="editShow = false" />
        </el-tab-pane>
        <el-tab-pane label="密码管理">
          <EditPwd @confirm="editShow = false" />
        </el-tab-pane>
      </el-tabs>
    </basic-dialog>
  </div>
</template>

<script setup lang="ts">
import Info from './components/Info.vue'
import EditPwd from './components/EditPwd.vue'
import { useAuthStore } from '@/stores'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const editShow = ref(false)
</script>

<style lang="scss">
.cropper-drag-box,
.cropper-bg {
  border-radius: 18px !important;
}
</style>
