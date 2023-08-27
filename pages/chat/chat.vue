<template>
	<view>
		<scroll-view :scroll-top="scrollTop" style="height: 100vh;" :scroll-y="true" class="chat" show-scrollbar>
			<view id="chat-list">
			<template v-for="(item,i) in 59" :key="i">
				<uv-chat content="hello" @avatarClickDb="dbc" :me="i % 2 == 1"
					avatar="https://img2.baidu.com/it/u=2833484760,1116678162&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1668704400&t=f1a5caae1807a6c83625a8a28991e829">
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

	interface Message {
		userId: String
		targetId: String
		content: String
	}

	const value = ref('')
	const scrollTop: Ref<Number> = ref()

	const dbc = (e) => {
		// console.log('双击', e);
	}
	
	onMounted(() => {
		uni.createSelectorQuery().in(this).select('#chat-list').boundingClientRect((res) => {
			// @ts-ignore
			scrollTop.value = res.height
		}).exec()
	})
	
	const send = async () => {
		const openId = await uni.getStorage({
			key: 'openId'
		})
		const message: Message = {
			userId: openId.data,
			targetId: openId.data === '1' ? '2' : '1',
			content: value.value
		}
		
		uni.sendSocketMessage({
			data: JSON.stringify(message)
		})
	}
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