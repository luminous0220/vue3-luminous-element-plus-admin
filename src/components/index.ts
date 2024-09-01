import type { App } from 'vue'
import BasicDialog from '@/components/BasicDialog/BasicDialog.vue'
import BasicDrawer from '@/components/BasicDrawer/BasicDrawer.vue'
import BasicForm from '@/components/BasicForm/BasicForm.vue'
import EditForm from '@/components/EditForm/EditForm.vue'
import Motion from '@/components/Motion/Motion.vue'
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
import BasicTable from '@/components/BasicTable/BasicTable.vue'
import AvatarEditor from '@/components/AvatarEditor/AvatarEditor.vue'
import { UploadButton, ManualUpload } from '@/components/Upload'
import TreeSelect from '@/components/TreeSelect/TreeSelect.vue'
import { LoadingPrimay } from '@/components/Loading'
import { Icon } from '@iconify/vue'
/**
 * @description 注册全局组件
 */
export const setupGlobalComponent = (vue: App) => {
  vue.component('s-icon', SvgIcon)
  vue.component('Motion', Motion)
  vue.component('BasicTable', BasicTable)
  vue.component('BasicForm', BasicForm)
  vue.component('EditForm', EditForm)
  vue.component('BasicDrawer', BasicDrawer)
  vue.component('BasicDialog', BasicDialog)
  vue.component('TreeSelect', TreeSelect)
  vue.component('UploadButton', UploadButton)
  vue.component('ManualUpload', ManualUpload)
  vue.component('Icon', Icon)
}

export {
  AvatarEditor,
  BasicDialog,
  BasicDrawer,
  BasicForm,
  EditForm,
  Motion,
  SvgIcon,
  BasicTable,
  UploadButton,
  ManualUpload,
  TreeSelect,
  LoadingPrimay,
  Icon
}
export * from '@/components/BasicForm'
export * from '@/components/BasicTable'
export * from '@/components/EditForm'
