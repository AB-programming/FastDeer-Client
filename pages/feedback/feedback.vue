<template>
	<view class="padding">
		<u--form labelPosition="center" ref="form" :rules="rules" :model="models">
			<u-form-item label="类型" borderBottom>
				<u-radio-group v-model="tag" placement="column">
					<u-radio :customStyle="{marginBottom: '8px'}" v-for="(item, index) in tags" :key="index"
						:label="item.name" :name="item.name">
					</u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="内容" borderBottom prop="content">
				<u--textarea placeholder="请输入遇到的问题或建议" v-model="models.content"></u--textarea>
			</u-form-item>
			<u-form-item label="评分" borderBottom>
				<u-rate :count="count" v-model="rate" size="60rpx"></u-rate>
			</u-form-item>
			<u-form-item label="联系方式" borderBottom>
				<u-input shape="circle" placeholder="请输入联系方式" type="number" v-model="phone" />
			</u-form-item><br>
			<u-button @click="submit" type="primary">提交</u-button><br>
			<u-button @click="reset" type="warning">重置</u-button>
		</u--form>
		<u-modal :show="show" :title="title" :content='content' @confirm="confirm"></u-modal>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue'
	import { useLoginStatus } from '@/hooks/useLoginStatus'
	import { config } from '@/constant/config.js'
	import { useDate } from '@/hooks/useDate'
	import { Response } from '@/util/type'

	const show = ref(false)
	const title = ref('提交结果')
	const content = ref('')

	const tags = reactive([
		{
			name: '问题',
			disabled: false,
		},
		{
			name: '建议',
			disabled: false,
		},
	]);

	const tag = ref('问题');

	const count = ref(5)
	const rate = ref(3)
	const phone = ref('')

	const rules = ref({
		content: [
			{
				type: 'string',
				required: true,
				message: "请输入内容",
				trigger: ['blur', 'change']
			}
		]
	})

	const models = reactive({
		content: '',
	})

	const submit = async () => {
		if (models.content === '') {
			uni.showToast({
				title: "请输入问题或建议",
				duration: 2000
			})
			return;
		}
		try {
			if (!await useLoginStatus()) {
				uni.showToast({
					title: "请先登录",
					duration: 2000
				})
			}
			const token = await uni.getStorage({ key: 'token' })
			const openId = await uni.getStorage({ key: 'openId' })

			const res = await uni.request({
				url: config.address + '/feedback/submitFeedback',
				method: 'POST',
				header: {
					"Authorization": token.data
				},
				data: {
					userId: openId.data,
					date: useDate(),
					tag: tag.value,
					rate: rate.value,
					content: models.content,
					phone: phone.value
				}
			})
			const submitRes = res.data as Response<Boolean>

			content.value = submitRes.msg
			show.value = true
		} catch (e) {
			uni.showToast({
				title: "网络异常，请稍后再试",
				duration: 2000
			})
		}
	}

	const reset = () => {
		models.content = '',
			tag.value = '问题',
			rate.value = 3,
			phone.value = ''
	}

	const confirm = () => {
		show.value = false
		uni.navigateBack()
	}

	const formSubmit = (e) => {
		console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
		var formdata = e.detail.value
		uni.showModal({
			content: '表单数据内容：' + JSON.stringify(formdata),
			showCancel: false
		});
	}

	const formReset = () => {
		console.log('清空数据')
	}
</script>

<style scoped>
	.uni-form-item .title {
		padding: 20rpx 0;
	}
</style>