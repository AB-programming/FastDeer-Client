<template>
	<view>
		<plaoyiEditor :values="values" :maxlength="3000" @changes="saveContens" :readOnly="readOnly"
			:photoUrl="photoUrl" :api="api" :name="name" />
	</view>
</template>

<script setup lang="ts">
	import plaoyiEditor from '@/components/piaoyi-editor/piaoyi-editor.vue'
	const readOnly = false //是否只读
	const photoUrl = '' //服务器图片域名或者ip
	const api = '' //上传图片接口地址
	const name = 'file' //上传图片接口的key值
	const values = '' //默认值
	const saveContens = (e) => {
		console.log(e)
	}
</script>

<style>

</style>