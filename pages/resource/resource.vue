<template>
	<view>
		<u-tabs :list="list" @click="click"></u-tabs>
		<view class="u-page padding-lr-xs">
			<u-list @scrolltolower="scrolltolower">
				<u-list-item v-for="resource in resourceList" :key="resource.resourceId">
					<u-cell :title="resource.name" size="large" :border="false">
						<template #icon>
							<u-avatar shape="square" size="35" :src="resource.avatar"
								customStyle="margin: -3px 5px -3px 0"></u-avatar>
						</template>
					</u-cell>
					<u-text class="padding-lr-sm" :lines="2" :text="resource.description"></u-text>
					<view class="flex">
						<u-text class="padding" bold type="primary" style="text-decoration: underline;"
							:text="resource.fileName" @click="open(resource.url)"></u-text>
						<u-text bold text="点击此处下载" color="#dd6161" style="text-decoration: underline;"></u-text>
					</view>
				</u-list-item>
			</u-list>
		</view>
		<u-button class="button" type="primary" shape="circle" icon="plus-circle" @click="show = true">发布资源</u-button>
		<u-popup :show="show" @close="show = false" mode="bottom" :round="30" :overlayOpacity="0.6" safeAreaInsetTop
			closeable :closeOnClickOverlay="false">
			<view class="padding">
				<u--form labelPosition="top">
					<u-form-item label="描述" prop="description" borderBottom>
						<u-input placeholder="请输入资源描述" border="surround"></u-input>
					</u-form-item>
					<u-form-item label="资源" prop="resource" borderBottom>
						<u-button type="primary" style="width: 50%;" @click="chooseFile">上传文件</u-button>
					</u-form-item>
				</u--form>
				<br><br>
			</view>
		</u-popup>
	</view>
</template>

<script setup lang="ts">
	import { ref, Ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app'
	import { config } from '@/constant/config.js'
	import { Response } from '@/util/type'

	const show = ref(false)

	interface Resource {
		resourceId : string,
		userId : string,
		name : string,
		avatar : string,
		date : string,
		description : string,
		fileName : string,
		url : string
	}

	const resourceList : Ref<Array<Resource>> = ref([])

	onLoad(async () => {
		try {
			const res = await uni.request({
				url: config.address + '/resource/selectResourceList',
				method: 'GET'
			})
			const fetchResourceListRes = res.data as Response<Array<Resource>>
			if (fetchResourceListRes.code === '200') {
				resourceList.value = fetchResourceListRes.data
			}
		} catch (e) {
			uni.showToast({
				title: "网络异常，请稍后再试",
				duration: 2000
			})
		}
	})

	const open = async (url : string) => {
		try {
			const res = await uni.downloadFile({ url });
			uni.openDocument({
				filePath: res.tempFilePath,
				showMenu: true,
			});
		} catch (e) {
			uni.showToast({
				title: "网络异常，请稍后再试",
				duration: 2000
			})
		}
	}
	
	const chooseFile = () => {
		uni.chooseFile({
		  count: 1, //默认100
		  extension:['.zip','.doc'],
			success: function (res) {
				console.log(JSON.stringify(res.tempFilePaths));
			}
		});
	}

	const list = [
		{
			name: '全部'
		},
		{
			name: '本校'
		}
	]

	const click = (item : any) => {
		console.log(item)
	}

	const scrolltolower = () => {

	};
</script>

<style scoped>
	.button {
		position: fixed;
		left: 25%;
		bottom: 5%;
		width: 50%;
	}
</style>