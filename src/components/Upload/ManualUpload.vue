<template>
  <el-upload
    class="w-full"
    ref="UploadRef"
    drag
    action="#"
    :show-file-list="true"
    :http-request="httpRequest"
    :limit="1"
    v-model:file-list="fileList"
    :on-exceed="handleExceed">
    <el-icon class="el-icon--upload"><i-ep-upload-filled /></el-icon>
    <div class="el-upload__text">拖拽单个文件至此，或者 <em>点击上传</em></div>
    <template #tip>
      <div class="el-upload__tip">
        仅支持<span class="text-red font-bold">{{ props.fileExt.join('、') }}</span
        >格式的文件，大小为<span class="text-orange font-bold">{{ size }}MB！</span>
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import type {
  UploadUserFile,
  UploadRequestOptions,
  UploadInstance,
  UploadRawFile,
  UploadProps
} from 'element-plus'
import { genFileId } from 'element-plus'

interface IProps {
  size?: number
  fileExt: string[]
}

const props = withDefaults(defineProps<IProps>(), {
  size: 5,
  fileExt: () => []
})

const UploadRef = ref<UploadInstance>()
// 文件列表
const fileList = ref<UploadUserFile[]>([])

// 限制上传
// * 当上传文件超过limit限制的时候调用该函数
const handleExceed: UploadProps['onExceed'] = (files) => {
  // 清除列表
  UploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  // 手动上传选择文件
  UploadRef.value!.handleStart(file)
}

const httpRequest = async (upload: UploadRequestOptions) => {
  let name = upload.file.name.replace(/.+\./, '')

  if (props.fileExt.indexOf(name.toLowerCase()) === -1) {
    window.$message.error({ message: `请上传${props.fileExt.join('、')}格式的文件!` })
    return false
  }

  const bool = upload.file.size / 1024 / 1024 < 20

  if (!bool) {
    window.$message.error({ message: `文件大小不能超过${props.size}MB!` })
    return false
  }

  emit('update:value', upload.file)
}

const emit = defineEmits<{ 'update:value': [file: UploadRawFile] }>()
</script>
