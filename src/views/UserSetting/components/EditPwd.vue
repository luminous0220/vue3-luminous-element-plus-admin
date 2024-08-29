<template>
  <section class="p-0!">
    <div class="text-center text-20px mb-16px">更改密码</div>
    <el-radio-group v-model="radio" size="large">
      <el-radio-button label="旧密码修改" :value="1" />
      <el-radio-button label="邮箱修改" :value="2" />
    </el-radio-group>
    <section class="mt-24px flex justify-between">
      <section class="w-50% lt-md:(w-full)" v-load="loading">
        <!-- 通过旧密码修改 -->
        <basic-form
          v-if="radio === 1"
          :label-width="0"
          :schema="oldPwdSchema"
          :model="oldPwdModel"
          ref="oldPwdFormRef">
          <el-button
            type="warning"
            plain
            class="w-full! h-48px! text-18px!"
            v-debounce
            @click="editByPwd"
            >修改密码</el-button
          >
        </basic-form>

        <!-- 通过邮箱修改 -->
        <basic-form
          v-else
          :label-width="0"
          :schema="emailSchema"
          :model="emailModel"
          ref="emailFormRef">
          <el-button
            type="warning"
            plain
            class="w-full! h-48px! text-18px!"
            v-debounce
            @click="editByEmail"
            >修改密码</el-button
          >
        </basic-form>
      </section>

      <section class="p-16px rounded-16px bg-#f8f9fa text-#95aac9 lt-md:hidden">
        <div class="text-22px text-black">密码要求</div>

        <div class="mt-12px">要创建一个新的密码，你必须满足以下所有要求。</div>
        <ul class="mt-12px">
          <li>● 最少6个字符</li>
          <li>● 最多32个字符</li>
        </ul>
      </section>
    </section>
  </section>
</template>

<script setup lang="tsx">
import { useCountDown } from '@/hooks'
import { AuthApi } from '@/apis'
import { EMAIL_AUTH_ENUM, PASSWORD_RESET_ENUM } from '@/constants'
import { BasicForm, IFormSchema } from '@/components'

const emit = defineEmits<{ (e: 'confirm'): void }>()

const { timeLeft, startCountDown, isEnd } = useCountDown()

const loading = ref(false)
const radio = ref(1)

//旧密码修改
const oldPwdFormRef = ref<InstanceType<typeof BasicForm>>()
const oldPwdModel = reactive({
  oldPwd: '',
  newPwd: '',
  repeatPwd: ''
})
const oldPwdSchema = reactive<IFormSchema[]>([
  {
    el: 'input',
    prop: 'oldPwd',
    label: '',
    attrs: {
      type: 'password',
      placeholder: '请输入旧密码',
      prefixRender: () => <i-ep-lock />
    },
    rule: [{ required: true, message: '该项必填', trigger: 'change' }]
  },
  {
    el: 'input',
    prop: 'newPwd',
    label: '',
    attrs: {
      type: 'password',
      placeholder: '请输入新密码',
      prefixRender: () => <i-ep-lock />
    },
    rule: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        min: 6,
        max: 32,
        message: '密码长度必须在6~32个字符之间',
        trigger: 'blur'
      }
    ]
  },
  {
    el: 'input',
    prop: 'repeatPwd',
    label: '',
    attrs: {
      type: 'password',
      placeholder: '请再次确认新密码',
      prefixRender: () => <i-ep-lock />
    },
    rule: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        validator(rule: any, value: string, callback: any) {
          const { newPwd, repeatPwd } = oldPwdModel
          if (newPwd !== repeatPwd) {
            callback(new Error('两次输入的密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
])

// 邮箱修改
const emailFormRef = ref<InstanceType<typeof BasicForm>>()
const emailModel = reactive({
  email: '',
  code: '',
  codeId: 0,
  newPwd: '',
  repeatPwd: ''
})
const emailSchema = reactive<IFormSchema[]>([
  {
    el: 'input',
    prop: 'email',
    label: '',
    attrs: {
      placeholder: '请输入邮箱',
      prefixRender: () => <i-carbon-email />
    },
    rule: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      {
        validator(rule: any, value: string, callback: any) {
          const valid = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)
          if (!valid) {
            callback(new Error('邮箱格式错误'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  },
  {
    prop: 'code',
    label: '',
    attrs: {
      placeholder: '请输入邮箱',
      prefixRender: () => <i-carbon-email />
    },
    render: () => {
      return (
        <div class="w-full flex justify-between items-center">
          <el-input
            vModel={emailModel.code}
            placeholder="邮箱验证码"
            type="text"
            class="w-65%! lt-md:(w-50% mr-5px)"
            clearable
            autocomplete="new-password"
            v-slots={{
              prefix: () => <i-carbon-security />
            }}></el-input>

          <el-button size="large" disabled={!isEnd} v-debounce={2000} onClick={sendCode}>
            {isEnd ? '获取验证码' : timeLeft + ' s'}
          </el-button>
        </div>
      )
    },
    rule: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
  },
  {
    el: 'input',
    prop: 'newPwd',
    label: '',
    attrs: {
      type: 'password',
      placeholder: '请输入新密码',
      prefixRender: () => <i-ep-lock />
    },
    rule: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        min: 6,
        max: 32,
        message: '密码长度必须在6~32个字符之间',
        trigger: 'blur'
      }
    ]
  },
  {
    el: 'input',
    prop: 'repeatPwd',
    label: '',
    attrs: {
      type: 'password',
      placeholder: '请再次确认新密码',
      prefixRender: () => <i-ep-lock />
    },
    rule: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        validator(rule: any, value: string, callback: any) {
          const { newPwd, repeatPwd } = emailModel
          if (newPwd !== repeatPwd) {
            callback(new Error('两次输入的密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
])

// 发送验证码
const sendCode = async () => {
  if (!emailModel.email) {
    return window.$notice.warning({ message: '请填写邮箱' })
  }
  const { data } = await AuthApi.sendEmailCode({
    email: emailModel.email,
    type: EMAIL_AUTH_ENUM.PASSWORD_RESET
  })
  emailModel.codeId = data.codeId
  window.$notice.success({ message: '发送成功，请前往邮箱检查' })
  startCountDown()
}

const editByPwd = () => {
  oldPwdFormRef.value?.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    const { oldPwd, newPwd, repeatPwd } = oldPwdModel
    try {
      await AuthApi.updatePwd({
        oldPwd,
        newPwd,
        repeatPwd,
        type: PASSWORD_RESET_ENUM.PWD
      })
      loading.value = false
      emit('confirm')
      window.$notice.success({ message: '密码修改成功' })
      oldPwdFormRef.value?.resetFields()
    } catch (error) {
      loading.value = false
    }
  })
}
const editByEmail = () => {
  emailFormRef.value?.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    const { email, code, codeId, newPwd, repeatPwd } = emailModel
    try {
      await AuthApi.updatePwd({
        email,
        code,
        codeId,
        newPwd,
        repeatPwd,
        type: PASSWORD_RESET_ENUM.EMAIL
      })
      loading.value = false
      emit('confirm')
      window.$notice.success({ message: '密码修改成功' })
      emailFormRef.value?.resetFields()
    } catch (error) {
      loading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
:deep(.el-input) {
  .el-input__inner {
    height: 38px;
    font-size: 16px;
  }
}
</style>
