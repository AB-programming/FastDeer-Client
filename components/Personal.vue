<template>
	<view class="">
		<view class="bg-white">
			<view class="flex padding">
				<view class="padding-lr-xs">
					<view class="cu-avatar lg round"
						:style="{'background-image': `url(${store.avatarUrl}?${avatarPoke})`}">
					</view>
				</view>
				<view class="padding-xs text-xl text-black">
					<view>{{ store.nickName }}</view>
					<view class="cu-tag round sm">
						<u-icon :name="store.gender === '男' ? 'man' : 'woman'"
							:color="store.gender === '男' ? '#2979ff' : '#fab6b6'" size="20"></u-icon>
					</view>
					<view class="cu-tag round line-green sm">普通用户</view>
				</view>
			</view>
		</view>
		<!-- 基本数据 -->
		<view class="cu-list grid col-4 no-border padding-lr-xs radius-lg-bottom">
			<view class="cu-item">
				<view class="text-black text-bold text-xxl">
					{{socialCount.likeCount | 0}}
				</view>
				<text>喜欢</text>
			</view>
			<view class="cu-item">
				<view class="text-black text-bold text-xxl">
					{{socialCount.commentCount | 0}}
				</view>
				<text>评论</text>
			</view>
			<view class="cu-item">
				<view class="text-black text-bold text-xxl">
					{{socialCount.bookmarkCount | 0}}
				</view>
				<text>收藏</text>
			</view>
			<view class="cu-item">
				<view class="text-black text-bold text-xxl">
					{{socialCount.attentionCount | 0}}
				</view>
				<text>关注</text>
			</view>
		</view>
		<!-- 助力/推荐/邀请 -->
		<view class="margin-top-sm padding-lr-xs">
			<view class="bg-brown light radius-lg shadow-blur">
				<view class="flex padding-tb-sm padding-lr-sm justify-between">
					<view class="padding-xs">
						<view>9.9元开通超级会员</view>
					</view>
					<view class="">
						<view class="cu-btn round bg-black">开通会员</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 常用功能 -->
		<view class="cu-bar margin-lr-xs margin-top-sm grid col-4 no-border bg-white radius-lg-top">
			<view class="action">
				<text class="text-xl text-black">我的设置</text>
			</view>
			<view class="action">
				<text class="text-lg">全部功能<text class="cuIcon-right"></text></text>
			</view>
		</view>
		<view class="cu-list grid col-4 no-border text-black margin-lr-xs padding-bottom radius-lg-bottom">
			<view class="cu-item" v-for="(item,index) in iconList" :key="index" :bindtap="item.bindtap">
				<view @click="toSetting(index)" :class="['cuIcon-'+item.icon,'text-'+item.color,'text-shadow']"
					style="font-size: 56rpx;">
					<view class="cu-tag badge" v-if="item.badge!=0">
						<block v-if="item.badge!=1">{{item.badge>99?"99+":item.badge}}</block>
					</view>
				</view>
				<text>{{item.name}}</text>
			</view>
		</view>

		<view class="margin-top-sm padding-lr-xs">
			<view class="bg-white light radius-lg shadow-blur">
				<view class="flex padding-tb-sm padding-lr-sm justify-between">
					<view class="padding-xs">
						<view class="text-xl text-black">最新活动</view>
						<view class="padding-top-xs">全新面试资源<text class="text-red text-bold"> 6.6折 </text><text
								class="cuIcon-roundrightfill text-red"></text></view>
					</view>
					<view class="">
						<view class="cu-btn round bg-gradual-pinknew margin-top-sm">6折优惠</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 其他功能 -->
		<view class="cu-bar margin-lr-xs margin-top grid col-4 no-border bg-white radius-lg-top">
			<view class="action">
				<text class="text-xl">其他功能</text>
			</view>
		</view>
		<view class="cu-list grid col-4 no-border text-black margin-lr-xs padding-bottom radius-lg-bottom">
			<view class="cu-item" v-for="(item,index) in iconOtherList" :key="index" :bindtap="item.bindtap"
				@click="other(index)">
				<view :class="['cuIcon-'+item.icon,'text-'+item.color,'text-shadow']" style="font-size: 56rpx;">
					<view class="cu-tag badge" v-if="item.badge!=0">
						<block v-if="item.badge!=1">{{item.badge>99?"99+":item.badge}}</block>
					</view>
				</view>
				<text>{{item.name}}</text>
			</view>
		</view>

	</view>
</template>

<script setup lang="ts">
	import { onLoad } from '@dcloudio/uni-app'
	import { useStore } from '../stores/index.js'
	import { reactive, ref } from 'vue'
	import { useLoginStatus } from '@/hooks/useLoginStatus'
	import { config } from '@/constant/config.js'
	import { Response } from '@/util/type'

	const store = useStore()

	// avatar update in real time
	const avatarPoke = ref(Date.now())

	// Make sure your avatar is up to date every time you switch back to me page
	uni.$on('updateAvatar', function () {
		avatarPoke.value = Date.now()
	})
	
	interface SocialCount {
		likeCount: Number,
		commentCount: Number,
		bookmarkCount: Number,
		attentionCount: Number
	}
	
	const socialCount: SocialCount = reactive({
		likeCount: 0,
		commentCount: 0,
		bookmarkCount: 0,
		attentionCount: 0
	})

	const iconList = [{
		icon: 'form',
		color: 'blue',
		badge: 0,
		name: '我的简历'
	}, {
		icon: 'pullup',
		color: 'red',
		badge: 0,
		name: '我的发布',
		bindtap: "bindZan"
	}, {
		icon: 'edit',
		color: 'green',
		badge: 0,
		name: '我的帖子',
		bindtap: "bindPoint"
	}, {
		icon: 'read',
		color: 'purple',
		badge: 0,
		name: '面试宝典',
		bindtap: "showResource"
	}]

	const iconOtherList = [{
		icon: 'location',
		color: 'blue',
		badge: 0,
		name: '地址管理'
	}, {
		icon: 'mark',
		color: 'blue',
		badge: 0,
		name: '在线客服',
		bindtap: "showResource"
	}, {
		icon: 'mail',
		color: 'blue',
		badge: 0,
		name: '投诉',
		bindtap: "bindCollect"
	}, {
		icon: 'settings',
		color: 'blue',
		badge: 0,
		name: '设置',
		bindtap: "bindZan"
	}]

	const toSetting = async (idx : number) => {
		if (idx == 2) {
			if (await useLoginStatus()) {
				uni.navigateTo({
					url: "/pages/detail/myPost",
					animationType: 'zoom-fade-out',
					animationDuration: 500
				})
			} else {
				uni.showToast({
					title: "请先登录",
					duration: 2000
				})
			}
		}
	}

	const other = (id : number) => {
		if (id === 3) {
			store.isShowFloatWindow = true
		}
	}
	
	onLoad(async () => {
		try {
			const token = await uni.getStorage({key: 'token'})
			const openId = await uni.getStorage({key: 'openId'})
			const attentionCountRes = (await uni.request({
				url: config.address + '/user/selectUserRelateCountByUserId',
				method: 'GET',
				header: {
					"Authorization": token.data
				},
				data: {
					userId: openId.data
				}
			})).data as Response<Number>
			socialCount.attentionCount = attentionCountRes.data
			
			const postLikeCountRes = (await uni.request({
				url: config.address + '/post/selectPostLkeCountByUserId',
				method: 'GET',
				header: {
					"Authorization": token.data
				},
				data: {
					userId: openId.data
				},
			})).data as Response<Number>
			socialCount.likeCount = postLikeCountRes.data
			
			const postBookmarkCountRes = (await uni.request({
				url: config.address + '/post/selectPostBookmarkCountByUserId',
				method: 'GET',
				header: {
					"Authorization": token.data
				},
				data: {
					userId: openId.data
				}
			})).data as Response<Number>
			socialCount.bookmarkCount = postBookmarkCountRes.data
			
			const commentCountRes = (await uni.request({
				url: config.address + '/comment/selectCommentCountByUserId',
				method: 'GET',
				header: {
					"Authorization": token.data
				},
				data: {
					userId: openId.data
				}
			})).data as Response<Number>
			socialCount.commentCount = commentCountRes.data
		} catch(e) {
			uni.showToast({
				title: "服务端异常，数据获取失败，请稍后再试",
				duration: 2000
			})
		}
	}) 
</script>

<style>

</style>