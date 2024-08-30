<template>
  <div class="w-full h-full">
    <el-card body-class="flex h-full p-0! overflow-auto" class="w-full h-full">
      <!-- 个人信息 -->
      <div class="h-full w-360px py-22px px-28px relative" style="border-right: 1px solid #e5e7eb">
        <div class="flex flex-col flex-center text-[#555]">
          <div class="mt-38px cursor-pointer mask lt-md:(mt-0)" @click="openAvatarEditor">
            <el-avatar class="" :size="148" :src="user.avatar"></el-avatar>
            <input
              class="hidden"
              id="avatar-upload"
              @input="createCropper"
              type="file"
              :limit="1"
              accept="image/*" />
          </div>
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
    <basic-dialog
      :hideFooter="true"
      v-model="editShow"
      title="修改密码"
      draggable
      @close="closeAvatarEditor">
      <el-tabs type="border-card" class="w-full! h-full">
        <el-tab-pane label="基础信息">
          <Info @confirm="editShow = false" />
        </el-tab-pane>
        <el-tab-pane label="密码管理">
          <EditPwd @confirm="editShow = false" />
        </el-tab-pane>
      </el-tabs>
    </basic-dialog>

    <!-- 头像裁剪弹窗 -->
    <basic-dialog
      v-model="visiable"
      title="头像上传"
      class="rounded-22px lt-lg:w-100%! lt-xl:w-80%! w-688px!"
      draggable
      @close="closeAvatarEditor">
      <div class="flex justify-around lt-md:flex-col">
        <div class="flex items-center lt-md:(justify-center mb-12px)">
          <div id="preview-avatar" class="w-188px h-188px overflow-hidden rounded-50%" />
        </div>
        <div class="w-409px h-330px lt-md:(w-full h-300px)">
          <img id="avatar-canvas" class="block w-100% max-w-100%" />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visiable = false">关闭</el-button>
          <el-button type="primary" v-debounce @click="confirmCrop">修改</el-button>
        </span>
      </template>
    </basic-dialog>
  </div>
</template>

<script setup lang="ts">
import Info from './components/Info.vue'
import EditPwd from './components/EditPwd.vue'
import { useAuthStore } from '@/stores'
import { storeToRefs } from 'pinia'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { UploadApi } from '@/apis/upload.api'
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const editShow = ref(false)
const visiable = ref(false)
let cropperInstance: any = null
let avatarCanvas: any = null

// 打开头像编辑
const openAvatarEditor = () => {
  const el = document.querySelector('#avatar-upload') as HTMLInputElement
  el.value = '' // 防止重复上传同一张图片时不会打开裁剪弹窗
  el?.click()
}

// 创建cropper实例
const createCropper = (e: Event) => {
  const file: File = (e.target as any).files[0]
  if (file.size > 3000000) {
    return window.$message.warning({ message: '图片大小不能大于3M' })
  }
  visiable.value = true
  nextTick(() => {
    avatarCanvas = document.querySelector('#avatar-canvas') as HTMLImageElement
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      avatarCanvas.src = reader.result as string
      cropperInstance = new Cropper(avatarCanvas, {
        aspectRatio: 1 / 1,
        preview: '#preview-avatar'
      })
    })
    reader.readAsDataURL(file)
  })
}

// 关闭
const closeAvatarEditor = () => {
  avatarCanvas && (avatarCanvas.src = '')
  if (cropperInstance) {
    cropperInstance.destroy()
  }
}

// 裁剪上传
const confirmCrop = () => {
  cropperInstance
    .getCroppedCanvas({
      fillColor: '#fff',
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'high'
    })
    .toBlob(async (blob: Blob) => {
      const formData = new FormData()
      formData.set('image', blob, 'avatar.png')

      await UploadApi.uploadImage(formData)
      window.$notice.success({ message: '修改成功' })
      await authStore.getUserInfo()
      visiable.value = false
    })
}
</script>

<style lang="scss">
.cropper-drag-box,
.cropper-bg {
  border-radius: 18px !important;
}
</style>
