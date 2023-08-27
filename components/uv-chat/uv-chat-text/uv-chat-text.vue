<template>
	<view class="content">
		<text>{{ text }}</text>
	</view>
</template>

<script setup>
	const props = defineProps({
		text: {
			type: String,
			default: () => ''
		}
	})
</script>

<style scoped>
	.content {
		background-color: #fff;
		padding: 20rpx;
		border-radius: 14rpx;
		color: #333;
		font-size: 32rpx;
		max-width: 50vw;
		white-space: break-spaces;
		word-wrap: break-word;
	}
</style>