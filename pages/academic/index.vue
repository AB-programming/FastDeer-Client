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

		<view class="cu-card article no-card margin-top-lg" v-for="(item,index) in newsList" :key="index">
			<view class="cu-item shadow" @click="toInfo">
				<view class="content">
					<view class="">
						<view class="">
							<text class="text-black text-bold text-lg text-cut-2">{{item.title}}</text>
						</view>
						<view class="flex justify-between margin-top">
							<view class="text-gray text-sm">经验 | 2.1万观看 99赞 12评论</view>
						</view>
					</view>
					<view>
						<image :src="item.url" mode="aspectFill" class="radius" style="height: 180rpx;width: 230rpx;">
						</image>
					</view>
				</view>
				<view class="flex justify-between">
					<view class="text-gray text-sm padding-left flex align-center">
						<view class="cu-avatar sm round" :style="{backgroundImage: 'url('+item.url+')'}">
						</view> <text class="padding-left-xs text-df text-bold">{{item.user}}</text>
					</view>
					<view class="text-gray text-sm padding-right flex align-center">24分钟前</view>
				</view>
			</view>
		</view>
		<u-button class="button" type="primary" shape="circle" icon="plus-circle" @click="writeArticle">写文章</u-button>
	</view>
</template>

<script setup lang="ts">
	import { ref } from "vue";
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
	const newsList = [{
		title: "矢量插画师：通过摄影作品学习建筑的空间语言",
		user: "飞屋瑞",
		date: "2018-05-12",
		collection: 97,
		url: "/static/images/design01.png"
	}, {
		title: "微信大改版之UI设计分析！分析点啥？",
		user: "moxiao",
		date: "2019-05-12",
		collection: 21,
		url: "/static/images/design02.png"
	}, {
		title: "如何合理创建间距系统，来更快地实现设计方案？",
		user: "毒眸",
		date: "2019-05-12",
		collection: 17,
		url: "/static/images/design03.png"
	}, {
		title: "百度如何成为小程序生态的最大变量？",
		user: "罗超频道",
		date: "2019-05-12",
		collection: 23,
		url: "/static/images/design04.png"
	}]

	const changetap = (id : number) => {
		tabCur.value = id
	}

	const toInfo = () => {
		uni.navigateTo({
			url: '/pages/academic/info',
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