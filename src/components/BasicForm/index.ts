import { FormItemRule } from 'element-plus'
type IElType =
  | 'input'
  | 'input-number'
  | 'select'
  | 'radio'
  | 'tree-select'
  | 'switch'
  | 'date'
  | 'upload'

export interface IFormSchema {
  el?: IElType
  prop: string
  label: string
  default?: string | number | Date | boolean
  attrs?: Partial<{
    [pro: string]: any
  }>
  options?: { value?: any; label?: any; [pro: string]: any }[]
  rule?: FormItemRule[]
  render?: () => VNode | string
}
