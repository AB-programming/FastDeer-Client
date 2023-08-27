<template>
	<view>
		<u-toast ref="uToast"></u-toast>
		<u-navbar title="发布帖子" placeholder @leftClick="toIndex">
			<template #right>
				<view>
					<u-button text="发布" shape="circle" color="#31B96E" @click="pushPost"
						style="width: 120rpx;height: 50rpx;margin-top: 10rpx;"></u-button>
				</view>
			</template>
		</u-navbar>

		<u--input placeholder="标题非必填(0-20字)" border="bottom" v-model="title" maxlength="20"></u--input>
		<u--textarea v-model="text" placeholder="请输入正文(1000字以内)" count border="bottom" maxlength="1000" autoHeight
			height="300rpx"></u--textarea>

		<u-upload name="1" :fileList="fileList" multiple :maxCount="3" @afterRead="afterRead" @delete="deletePic"
			deletable>
		</u-upload><br>
		<u-tag text="目前最多支持上传3张图片" plain size="large" type="warning"></u-tag>
	</view>
</template>


<script setup lang="ts">
	import { ref } from 'vue';
	import { useDate } from '@/hooks/useDate'
	import { config } from '../../constant/config';
	import { Response } from '@/util/type'

	const fileList = ref([])

	const title = ref("");
	const text = ref("");

	const toIndex = () => {
		uni.switchTab({
			url: "/pages/index/index"
		});
	};

	const deletePic = (event : any) => {
		fileList.value.splice(event.index, 1);
	}

	// add Pic
	const afterRead = async (event : any) => {
		[].concat(event.file).map((item) => {
			fileList.value.push({
				...item,
				status: 'success',
				message: 'success'
			});
		});
	}

	const uploadFilePromise = (url : any, token : String, postId : String, idx : number) => {
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: config.address + '/post/uploadPostFile',
				filePath: url,
				name: 'file',
				header: {
					"Authorization": token
				},
				formData: {
					postId: postId,
					idx: idx
				},
				success: (res) => {
					// @ts-ignore
					resolve(res.data.data)
				},
				fail: (err) => {
					reject(err)
				}
			})
		})
	}

	const pushPost = async () => {
		try {
			const token = await uni.getStorage({ key: 'token' })
			const openId = await uni.getStorage({ key: 'openId' })

			const res = await uni.request({
				url: config.address + "/post/publishPost",
				method: "POST",
				header: {
					"Authorization": token.data
				},
				data: {
					date: useDate(),
					title: title.value,
					text: text.value,
					userId: openId.data
				}
			})

			const publishPostRes = res.data as Response<String>

			if (publishPostRes.code === '200' && fileList.value.length > 0) {
				let idx = 1;
				for (const file of fileList.value) {
					await uploadFilePromise(file.url, token.data,
						publishPostRes.data, idx)
					idx++;
				}

				uni.showToast({
					title: publishPostRes.msg,
					duration: 2000
				})
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/index/index'
					})
				}, 1000)
			} else {
				uni.showToast({
					title: publishPostRes.msg,
					duration: 2000
				})
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/index/index'
					})
				}, 1000)
			}
		} catch (err) {
			uni.showToast({
				title: "网络异常，请稍后再试",
				duration: 2000
			})
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}, 1000)
		}
	};
</script>

<style>
</style>