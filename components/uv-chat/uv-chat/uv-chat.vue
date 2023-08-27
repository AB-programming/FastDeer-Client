<template>
	<view class="uv-chat" :style="chatStyle">
		<view @click="onAvatarClick" class="avatar-view" :style="avatarStyle">
			<image :src="avatar" mode="aspectFill"></image>
		</view>
		<view class="msg">
			<view v-if="showNick" class="nick" :style="nickStyle"><text>{{ nick }}</text></view>
			<slot name="content" :other="props.other" :content="props.content"></slot>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { defineProps, defineEmits, computed } from 'vue'
	import { config } from '@/constant/config.js'
	
	const props = defineProps({
		me: {
			type: Boolean,
			default: () => false
		},
		avatar: {
			type: String,
			default: () => config.address + '/static/logo.png'
		},
		nick: {
			type: String,
			default: () => '快鹿用户'
		},
		nickColor: {
			type: String,
			default: () => '#aaa'
		},
		content: {
			type: String,
			default: () => ''
		},
		other: {
			type: Object,
			default: () => { return {} }
		},
		showNick: {
			type: Boolean,
			default: () => true
		}

	})
	const emits = defineEmits(['avatarClick', 'avatarClickDb'])
	let avatarStyle = computed(() => {
		if (props.me) {
			return {
				'order': 1
			}
		}
		return {
			'order': 0
		}
	})
	let chatStyle = computed(() => {
		if (props.me) {
			return {
				'justify-content': 'flex-end'
			}
		}
		return {}
	})
	let nickStyle = computed(() => {

		let style = {
			'color': props.nickColor
		}
		if (props.me) {
			style = {
				...style,
				// @ts-ignore
				'text-align': 'end'
			}
		}

		return style
	})


	let lastAvatarClickTime = 0;
	const onAvatarClick = () => {
		lastAvatarClickTime += 1;
		setTimeout(() => {
			
			if (lastAvatarClickTime == 1) {
				emits('avatarClick',props.other)
			}
			if (lastAvatarClickTime >= 2) {
				emits('avatarClickDb',props.other)
			}
			lastAvatarClickTime = 0
		}, 200)
		
	}
</script>
<style scoped lang="scss">
	.uv-chat {
		display: flex;
		margin-bottom: 35rpx;

		.avatar-view {
			font-size: 0px;
			order: 0;

			image {
				width: 76rpx;
				height: 76rpx;
				border-radius: 14rpx;
			}
		}
		.msg {
			display: flex;
			flex-direction: column;
			margin: 0px 10rpx;

			.nick {
				margin-bottom: 12rpx;
				font-size: 21rpx;
				color: #aaa;
			}	
		}
	}
	.left {
		justify-content: flex-end;
	}
</style>
