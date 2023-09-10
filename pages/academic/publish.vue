<template>
	<view class="padding">
		<u--form labelPosition="top">
			<u-form-item label="标题" prop="title" borderBottom>
				<u-input placeholder="请输入标题" border="surround" v-model="title"></u-input>
			</u-form-item>
			<u-form-item label="封面" prop="cover" borderBottom>
				<u-upload name="1" :maxCount="1" :fileList="fileList" @delete="deletePic" @afterRead="afterRead"></u-upload>
			</u-form-item>
			<u-form-item label="内容" prop="content" borderBottom>
					<plaoyiEditor values="" :maxlength="3000" @changes="saveContens" :readOnly="readOnly"
					:photoUrl="photoUrl" :api="api" :name="name"/>
			</u-form-item>
		</u--form>
		<u-button type="primary" size="large" shape="circle" @click="publish" :disabled="disabled">
			发布
		</u-button><br>
		<u-button type="error" size="large" shape="circle">
			重置
		</u-button>
	</view>
</template>

<script setup lang="ts">
	import plaoyiEditor from '@/components/piaoyi-editor/piaoyi-editor.vue'
	import { ref } from "vue";
	import { config } from '@/constant/config.js'
	import { useDate } from '@/hooks/useDate'
	import { Response} from '@/util/type'
		
	const fileList = ref([])
	const disabled = ref(false)
	
	const deletePic = (event: any) => {
		fileList.value.splice(event.index, 1);
	}
	
	const afterRead = async (event: any) => {
		fileList.value.push(event.file)
	}
	
	const title = ref('')
	const readOnly = false //是否只读
	const photoUrl = '' //服务器图片域名或者ip
	const api = '' //上传图片接口地址
	const name = 'file' //上传图片接口的key值
	const content = ref('')
	
	const saveContens = (e: any) => {
		content.value = e.html
	}
	
	const publish = async () => {
		if (fileList.value.length === 0) {
			uni.showToast({
				title: "请选择封面",
				duration: 2000
			})
			return;
		}
		disabled.value = true
		try {
			const token = await uni.getStorage({key: 'token'})
			const openId = await uni.getStorage({key: 'openId'})
			const res = await uni.uploadFile({
				url: config.address + '/academic/publish',
				name: "file",
				filePath: fileList.value[0].url,
				header: {
					"Authorization": token.data
				},
				formData: {
					openId: openId.data,
					date: useDate(),
					title: title.value,
					content: content.value
				}
			})
			const publishRes = JSON.parse(res.data) as Response<Boolean>
			
			if (publishRes.code === '200' && publishRes.data) {
				disabled.value = false
				uni.showToast({
					title: publishRes.msg,
					duration: 2000
				})
				uni.navigateBack()
			} else {
				uni.showToast({
					title: publishRes.msg,
					duration: 2000
				})
			}
		} catch(e) {
			uni.showToast({
				title: "网络异常，请稍后再试",
				duration: 2000
			})
		}
	}
</script>

<style>

</style>