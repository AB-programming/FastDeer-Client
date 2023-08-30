<template>
	<view>
		<scroll-view :scroll-top="scrollTop" style="height: 100vh;" :scroll-y="true" class="chat" show-scrollbar>
			<view id="chat-list">
			<template v-for="(message, index) in chatRecord" :key="index">
				<uv-chat :content="message.content" @avatarClickDb="dbc" :me="message.isMe"
					:avatar="message.senderAvatar" :nick="message.senderName">
					<template v-slot:content="{ other, content }">
						<uv-chat-text :text="content"></uv-chat-text>
					</template>
				</uv-chat>
			</template>
			</view>
			<view class="space"></view>
		</scroll-view>
		<view class="input">
			<u--textarea :maxlength="240" v-model="value" placeholder="请输入内容" height="20" autoHeight
				count></u--textarea>
			&nbsp;
			<u-button @click="send" type="primary" text="发送" class="button"></u-button>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, Ref } from 'vue'
	import uvChat from '@/components/uv-chat/uv-chat/uv-chat.vue'
	import uvChatText from '@/components/uv-chat/uv-chat-text/uv-chat-text.vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { config } from '@/constant/config.js'
	import { Response, MessageView } from '@/util/type'

	interface Message {
		userId: String
		targetId: String
		content: String
	}

	const chatRecord: Ref<Array<MessageView>> = ref([])

	const value = ref('')
	const scrollTop: Ref<Number> = ref()
	let targetId: string = ""

	const dbc = (e) => {
		console.log('双击', e);
	}
	
	onMounted(() => {
		setTimeout(() => {
			uni.createSelectorQuery().in(this).select('#chat-list').boundingClientRect((res) => {
				// @ts-ignore
				scrollTop.value = res.height
			}).exec()
		}, 1000)
	})
	
	uni.$on('updateMessage', function(messageView: string) {
		chatRecord.value.push(JSON.parse(messageView) as MessageView)
		uni.createSelectorQuery().in(this).select('#chat-list').boundingClientRect((res) => {
			// @ts-ignore
			scrollTop.value = res.height
		}).exec()
	})
	
	const send = async () => {
		try {
			const openId = await uni.getStorage({
				key: 'openId'
			})
			const message: Message = {
				userId: openId.data,
				targetId: targetId,
				content: value.value
			}
			if (value.value == "") {
				uni.showToast({
					title: "请输入内容",
					duration: 2000
				})
				return
			}
			uni.sendSocketMessage({
				data: JSON.stringify(message)
			})
		} catch(e) {
			uni.showToast({
				title: "请先登录",
				duration: 2000
			})
		}
		value.value = ''
	}
	
	onLoad(async (options) => {
		try {
			const token = await uni.getStorage({key: 'token'})
			const openId = await uni.getStorage({key: 'openId'})
			if (options.id !== undefined) {
				targetId = options.id
				const res = await uni.request({
					url: config.address + '/chat/getChatRecord',
					method: 'GET',
					header: {
						"Authorization": token.data
					},
					data: {
						userId: openId.data,
						targetId: options.id
					}
				})
				const chatRecordRes = res.data as Response<Array<MessageView>>
				if (chatRecordRes.code === '200') {
					chatRecord.value = chatRecordRes.data
				} else {
					uni.showToast({
						title: chatRecordRes.msg,
						duration: 2000
					})
				}
			}
		} catch(e) {
			uni.showToast({
				title: "网络错误，获取聊天列表失败",
				duration: 2000
			})
		}
	})
</script>

<style scoped>
	.chat {
		display: flex;
		flex-direction: column;
		padding: 35rpx;
		box-sizing: border-box;
		background-color: #f4f5f7;
	}
	
	.space {
		height: 50px;
	}

	.input {
		position: fixed;
		padding: 8px;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		background-color: #fff;
	}

	.input u-textarea {
		flex-grow: 1;
		margin-right: 10px
	}

	.input .button {
		width: 20%;
		height: 37px;
	}
</style>