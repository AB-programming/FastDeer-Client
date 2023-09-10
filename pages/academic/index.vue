<template>
	<view class="cu-timeline margin-xs radius-lg" style="min-height: 92vh;">
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view v-for="item in tabList" @click="changetap(item.id)"
					:class="['cu-item', 'flex-sub ', item.id==tabCur?'text-blue cur text-bold':'']" :key="item.id"
					:data-id="item.id">
					{{item.name}}
				</view>
			</view>
		</scroll-view>

		<view class="cu-card article no-card margin-top-lg" v-for="academic in academicList" :key="academic.academicId">
			<view class="cu-item shadow" @click="toInfo(academic)">
				<view class="content flex justify-between">
					<view class="">
						<view class="">
							<text class="text-black text-bold text-lg text-cut-2">{{academic.title}}</text>
						</view>
						<view class="flex justify-between margin-top">
							<view class="text-gray text-sm">经验 | 2.1万观看</view>
						</view>
					</view>
					<view>
						<image :src="academic.cover" mode="aspectFill" class="radius" style="height: 180rpx;width: 230rpx;">
						</image>
					</view>
				</view>
				<view class="flex justify-between">
					<view class="text-gray text-sm padding-left flex align-center">
						<view class="cu-avatar sm round" :style="{backgroundImage: 'url('+academic.avatar+')'}">
						</view> <text class="padding-left-xs text-df text-bold">{{academic.name}}</text>
					</view>
					<view class="text-gray text-sm padding-right flex align-center">{{academic.date}}</view>
				</view>
			</view>
		</view>
		<u-button class="button" type="primary" shape="circle" icon="plus-circle" @click="writeArticle">写文章</u-button>
	</view>
</template>

<script setup lang="ts">
	import { Ref, ref } from "vue";
	import { onShow } from '@dcloudio/uni-app'
	import { config } from '@/constant/config.js'
	import { Response } from '@/util/type'
	import { AcademicDisplay } from '@/util/type'
	
	const academicList: Ref<Array<AcademicDisplay>> = ref([])

	onShow(async () => {
		try {
			const res = await uni.request({ url: config.address + '/academic/selectAcademicDisplayList' })
			const academicListRes = res.data as Response<Array<AcademicDisplay>>
			if (academicListRes.code === '200') {
				academicList.value = academicListRes.data
			} else {
				uni.showToast({
					title: "网络异常，请稍后再试",
					duration: 2000
				})
			}
		} catch (e) {
			uni.showToast({
				title: "网络异常，请稍后再试",
				duration: 2000
			})
		}
	})

	const tabCur = ref(0)
	const tabList = [{
		id: 0,
		name: '推荐'
	}, {
		id: 1,
		name: '关注'
	}, {
		id: 2,
		name: '本校'
	}]

	const changetap = (id : number) => {
		tabCur.value = id
	}

	const toInfo = (academic: AcademicDisplay) => {
		uni.navigateTo({
			url: '/pages/academic/info?academic=' + JSON.stringify(academic),
			animationType: 'zoom-fade-out',
			animationDuration: 400
		})
	}

	const writeArticle = () => {
		uni.navigateTo({
			url: '/pages/academic/publish',
			animationType: 'zoom-fade-out',
			animationDuration: 400
		})
	}
</script>

<style scoped>
	.button {
		position: fixed;
		left: 25%;
		bottom: 5%;
		width: 50%;
	}
</style>