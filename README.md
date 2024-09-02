

<h1 align="center">vue3-luminous-element-plus-admin
</h1>

<br/>

## 🚀简介
`vue3-luminous-element-plus-admin`是一个基于(RBAC)角色的权限访问控制的后台管理项目。前端使用 `Vue3.2、TypeScript`进行开发

## 🌟技术栈

 `vue3` 、 `typescript` 、 `element-plus` 、 `unocss` 、 `pinia` 、 `JSX` 等等。



## 🎉特点
二次封装了 `BasicTable、BasicForm、BasicDialog、BasicDrawer` 等与表格相关的组件，开发者引入这些组件后只需传入简单的对象数据便可轻松地渲染表格，而表格在后台系统中的占比非常之大，使用这种方式渲染能够节省非常多的时间成本

## 🎈预览

`yun-ding-server`

账号：`admin`，密码：`123456`


## 🎨使用

支持现代浏览器, 不支持 `IE`，使用 `pnpm` 进行依赖安装

| Node 版本 | PNPM 版本 | Vue 版本 |
| ------- | ------- | ------ |
| 20.10.0 | latest  | latest |




## 🌸表格组件的使用

比如开发一个用户管理页面：

引入 `basic-table` 组件：

```html

<basic-table
  ref="BasicTableRef"
  :columns="columns"
  showOverflowTooltip
  :req-api="reqApi">
  <template #leftHeaderButton="scope">
	<el-button type="primary" @click="handleOpen('新增')">
	  新增用户
	  <template #icon>
		<i-carbon-add-alt />
	  </template>
	</el-button>

	<el-button type="danger" @click="batchRemove(scope.selectedList)">
	  批量删除
	  <template #icon>
		<i-ep-delete />
	  </template>
	</el-button>

	<!-- 导出按钮 -->
	<el-button v-debounce type="warning" @click="exportFile">
	  导出上传模版
	  <template #icon>
		<i-carbon-document-export />
	  </template>
	</el-button>

	<!-- 批量上传 -->
	<Upload
	  text="批量新增"
	  url="http://localhost:8182/api/upload/users"
	  :fileExt="['xlsx']"
	  @success="BasicTableRef?.loadData" />
  </template>
  <template #operation="scope">
	<div>
	  <el-button
		class="mr-10px"
		type="primary"
		plain
		size="small"
		@click="handleOpen('授权', scope.row)">授权</el-button>
	</div>
  </template>
</basic-table>
```

表格列的相关配置：

```js
const colums = reactive([
  {
    el: 'input',
    prop: 'username',
    label: '用户名',
    attrs: {
      placeholder: '请填写用户名'
    },
    rule: [{ required: true, message: '该项必填', trigger: 'change' }]
  },
  {
    el: 'input',
    prop: 'email',
    label: '邮箱',
    attrs: {
      placeholder: '请填写邮箱'
    },
    rule: [{ required: true, message: '该项必填', trigger: 'change' }]
  },
  {
    el: 'input',
    prop: 'nickname',
    label: '昵称',
    attrs: {
      placeholder: '请填写昵称'
    }
  },
  {
    el: 'radio',
    prop: 'sex',
    label: '性别',
    options: GENDER_OPIONS,
    rule: [{ required: true, message: '该项必填', trigger: 'change' }]
  },
  {
    el: 'date',
    prop: 'birthday',
    label: '生日'
  },
  {
    el: 'input',
    prop: 'avatar',
    label: '上传头像'
  },
  {
    el: 'input',
    label: '签名',
    attrs: {
      type: 'textarea'
    },
    prop: 'sign'
  }
])
```

