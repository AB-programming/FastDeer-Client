<template>
	<view>
		<view class="bg-white margin-xs radius-lg" style="min-height: 86vh;">
			<view class="radius-lg" style="background-image: linear-gradient(to top, #fffcf8 0%, #fae7c9 100%);">
				<view class="flex padding-sm justify-between">
					<view class="flex padding-top-xs text-xl text-black">
						消息
					</view>
					<view class="text-lg">
						<view class="cu-avatar round margin-left bg-gray">
							<view class="flex justify-center cuIcon-peoplelist text-blace"></view>
						</view>
					</view>
				</view>
				<view class="box-serach">
					<view class="cu-bar">
						<view class="search-form round">
							<u-search placeholder="搜索聊天" shape="square" v-model="searchValue"></u-search>
						</view>
					</view>
				</view>
			</view>
			<view class="padding flex justify-between margin-lr-sm" @click="toChat">
				<view class="text-center">
					<view class="cu-avatar lg radius bg-gradual-orange">
						<text class="cuIcon-noticefill"></text>
					</view>
					<view class="flex justify-center padding-tb-xs text-black">通知</view>
				</view>
				<view class="text-center">
					<view class="cu-avatar lg radius bg-gradual-blue">
						<text class="cuIcon-radiobox"></text>
					</view>
					<view class="flex justify-center padding-tb-xs text-black">回复</view>
				</view>
				<view class="text-center">
					<view class="cu-avatar lg radius bg-gradual-green">
						<text class="cuIcon-commentfill"></text>
					</view>
					<view class="flex justify-center padding-tb-xs text-black">评论</view>
				</view>
				<view class="text-center">
					<view class="cu-avatar lg radius bg-gradual-pink">
						<text class="cuIcon-appreciatefill"></text>
					</view>
					<view class="flex justify-center padding-tb-xs text-black">赞</view>
				</view>
			</view>

			<view class="cu-list menu-avatar padding-tb-sm" @click="toChat">
				<view class="cu-item">
					<view class="cu-avatar round lg bg-oc-blue-3">
						<view class="cuIcon-notice text-white"></view>
					</view>
					<view class="content">
						<view class="text-lg text-black">
							互动消息
						</view>
						<view class="text-gray text-sm">
							暂无通知消息
						</view>
					</view>
				</view>
				<view class="cu-item" @click="toChat">
					<view class="cu-avatar round lg bg-oc-pink-4">
						<view class="cuIcon-deliver text-white"></view>
					</view>
					<view class="content">
						<view class="text-lg text-black">
							天天抢车位
						</view>
						<view class="text-gray text-sm">
							你的车车再不停就要生锈了
						</view>
					</view>
					<view class="action text-xl text-gray">
						<view class="cuIcon-moreandroid"></view>
						<view class="cu-tag round sm bg-red">4</view>
					</view>
				</view>
				<view class="cu-item" @click="toChat">
					<view class="cu-avatar round lg bg-oc-indigo-5">
						<view class="cuIcon-mark text-white"></view>
					</view>
					<view class="content">
						<view class="text-lg text-red">
							陌陌
						</view>
						<view class="text-gray text-sm">
							12.90km · [语音]
						</view>
					</view>
					<view class="action text-gray">
						<view>6-17</view>
						<view class="cu-tag round sm bg-red">2</view>
					</view>
				</view>
				<view class="cu-item" @click="toChat">
					<view class="cu-avatar round lg bg-oc-orange-4">
						<view class="cuIcon-service text-white"></view>
					</view>
					<view class="content">
						<view class="text-lg text-blue">
							ColorUI GA 客服
						</view>
						<view class="text-gray text-sm">
							欢迎使用ColorUI GA组件库！
						</view>
					</view>
					<view class="action text-gray">
						<view>9-15</view>
						<view class="cu-tag round sm bg-grey">3</view>
					</view>
				</view>
				<view class="cu-item" @click="toChat">
					<view class="cu-avatar round lg bg-oc-green-4">
						<view class="cuIcon-discover text-white"></view>
					</view>
					<view class="content">
						<view class="text-lg text-green">
							小宇宙
						</view>
						<view class="text-gray text-sm">
							欢迎来到小宇宙！
						</view>
					</view>
					<view class="action text-gray">
						<view>12-15</view>
						<view class="cu-tag round sm bg-grey">2</view>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script setup lang="ts">
import { ref } from "vue";
	
	const searchValue = ref("")
	
	const toChat = () => {
		uni.navigateTo({
			url: '/pages/chat/chat',
			animationType: 'slide-in-right',
			animationDuration: 500
		})
	}
	
</script>

<style>

</style>