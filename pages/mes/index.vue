<template>
	<view>
		<view class="bg-white margin-xs radius-lg" style="min-height: 86vh;">
			<view class="radius-lg" style="background-image: linear-gradient(to top, #fffcf8 0%, #fae7c9 100%);">
				<view class="flex padding-sm justify-between">
					<view class="flex padding-top-xs text-xl text-black">
						消息
					</view>
					<view class="text-lg">
						<view class="cu-avatar round margin-left bg-gray" @click="searchShow = true">
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

			<view v-for="chat in chatList" :key="chat.senderId">
				<view class="cu-list menu-avatar" @click="toChat(chat.senderId)">
					<view class="cu-item">
						<view class="cu-avatar round lg">
							<image :src="chat.senderAvatar" style="width: 80rpx;height: 80rpx;border-radius: 50%;">
							</image>
						</view>
						<view class="content">
							<view class="text-lg text-black">
								{{ chat.senderName }}
							</view>
							<view class="text-gray text-sm">
								{{ chat.latestMessage }}
							</view>
						</view>
						<view v-if="chat.unreadCount !== 0" class="cu-tag round sm bg-red">{{ chat.unreadCount }}
						</view>&nbsp;&nbsp;&nbsp;
						<view class="action text-xl text-gray">
							<view @click.stop="() => {delMesShow = true; delId = chat.senderId}"><u-icon
									name="close-circle" size="28px"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<u-modal :show="searchShow" :showConfirmButton="false" closeOnClickOverlay @close="closeSearchFriend"
			width="600rpx">
			<view class="slot-content" height="400">
				<u-search placeholder="请输入openId或昵称" shape="square" @custom="search" :show-action="true" actionText="搜索"
					:animation="true"></u-search>
				<view class="u-page">
					<u-list height="300" :pagingEnabled="true" scrollWithAnimation>
						<u-list-item v-for="user in users" :key="user.id">
							<u-cell :title="user.nickName" @click="toUserInfo(user.id)">
								<template #icon>
									<u-avatar shape="square" size="35" :src="user.avatarUrl"
										customStyle="margin: -3px 5px -3px 0"></u-avatar>
									<u-icon :name="user.gender === '男' ? 'man' : 'woman'"
										:color="user.gender === '男' ? '#2979ff' : '#fab6b6'" size="20"></u-icon>
								</template>
							</u-cell>
						</u-list-item>
					</u-list>
				</view>
			</view>
		</u-modal>
		<u-modal :show="delMesShow" title="删除聊天记录" content='确定要删除此条聊天记录吗？' showCancelButton closeOnClickOverlay
			@close="delMesShow = false" @cancel="delMesShow = false" @confirm="delMes" width="300"></u-modal>
	</view>
</template>

<script setup lang="ts">
	import { ref, Ref } from "vue";
	import { onShow } from '@dcloudio/uni-app'
	import { config } from '@/constant/config.js'
	import { Response, MessageView, User } from '@/util/type'

	interface Chat {
		senderId : string,
		senderName : string,
		senderAvatar : string,
		latestMessage : string,
		unreadCount : number
	}

	const chatList : Ref<Array<Chat>> = ref([])

	const searchValue = ref("")

	const users : Ref<Array<User>> = ref([])

	const toChat = (id : string) => {
		uni.navigateTo({
			url: '/pages/chat/chat?id=' + id,
			animationType: 'slide-in-right',
			animationDuration: 500
		})
	}

	onShow(async () => {
		try {
			const openId = await uni.getStorage({ key: 'openId' })
			const token = await uni.getStorage({ key: 'token' })

			const res = await uni.request({
				url: config.address + '/chat/getChatList',
				method: 'GET',
				data: {
					userId: openId.data
				},
				header: {
					"Authorization": token.data
				}
			})
			const chatListRes = res.data as Response<Array<Chat>>
			if (chatListRes.code === '200') {
				chatList.value = chatListRes.data
			} else {
				uni.showToast({
					title: chatListRes.msg,
					duration: 2000
				})
			}
		} catch (e) {
			uni.showToast({
				title: "网络错误，获取聊天列表失败",
				duration: 2000
			})
		}
	})

	uni.$on('readMessage', function (targetId : string) {
		const chat = chatList.value.find(chat => chat.senderId === targetId)
		if (chat) {
			chat.unreadCount = 0
		}
	})

	uni.$on("updateChatList", async function (message : string) {
		const messageView = JSON.parse(message) as MessageView
		const openId = await uni.getStorage({ key: 'openId' })
		if (messageView.senderId === openId.data) {
			return
		}
		const chat = chatList.value.find(chat => chat.senderId === messageView.senderId)
		if (chat) {
			chat.latestMessage = messageView.content
			chat.unreadCount++
		} else {
			// if not chatRecord
			const chat : Chat = {
				senderId: messageView.senderId,
				senderName: messageView.senderName,
				senderAvatar: messageView.senderAvatar,
				latestMessage: messageView.content,
				unreadCount: 1
			}
			chatList.value.push(chat)
		}
	})

	const searchShow = ref(false)
	const search = async (keyword : string) => {
		if (keyword === '') {
			uni.showToast({
				title: "请输入内容",
				duration: 2000
			})
			return
		}
		try {
			const token = await uni.getStorage({ key: 'token' })
			const res = await uni.request({
				url: config.address + "/user/selectUserByKeyword",
				method: 'GET',
				header: {
					"Authorization": token.data
				},
				data: {
					keyword
				}
			})
			const userRes = res.data as Response<Array<User>>

			if (userRes.code === '200') {
				users.value = userRes.data
			} else {
				uni.showToast({
					title: userRes.msg,
					duration: 2000
				})
			}
		} catch (e) {
			uni.showToast({
				title: "网络错误，请稍后再试",
				duration: 2000
			})
		}
	}

	const closeSearchFriend = () => {
		users.value = []
		searchShow.value = false
	}

	const toUserInfo = (userId : String) => {
		uni.navigateTo({
			url: "/pages/userInfo/userInfo?userId=" + userId,
			animationType: 'zoom-fade-out',
			animationDuration: 400
		});
		searchShow.value = false
	}

	const delMesShow = ref(false)
	let delId = ""

	const delMes = async () => {
		try {
			const token = await uni.getStorage({ key: 'token' })
			const openId = await uni.getStorage({ key: 'openId' })

			const res = await uni.request({
				url: config.address + '/chat/deleteChat',
				method: 'DELETE',
				header: {
					"Authorization": token.data
				},
				data: {
					userId: openId.data,
					targetId: delId
				},
			})
			// @ts-ignore
			if (res.data.code === '200') {
				chatList.value.splice(chatList.value.findIndex(chat => chat.senderId === delId), 1)
				uni.showToast({
					// @ts-ignore
					title: res.data.msg,
					duration: 2000
				})
			} else {
				uni.showToast({
					title: "网络错误，请稍后再试",
					duration: 2000
				})
			}
		} catch (e) {
			uni.showToast({
				title: "网络错误，请稍后再试",
				duration: 2000
			})
		}
		delMesShow.value = false
	}
</script>

<style>

</style>