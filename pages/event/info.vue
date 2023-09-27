<template>
	<view class="cu-timeline margin-xs radius-lg">

		<view class="padding-sm text-center">
			<text class="text-xxl text-bold text-black">{{eventDisplay.title}}</text>
		</view>

		<view class="flex justify-between margin-top-xs">
			<view class="flex padding-left-sm">
				<view class="cu-avatar round" :style="`background-image:url(${eventDisplay.avatar});`">
				</view>
				<view class="text-gray text-sm padding-left-sm">
					<view class="text-lg text-black">{{eventDisplay.name}}</view>
					<view class="">{{eventDisplay.date}}</view>
				</view>
			</view>

			<view class="padding-right flex align-center">
				<button class="cu-btn round bg-blue"><text class="cuIcon-add"></text>关注</button>
			</view>
		</view>
		<view class="padding-sm text-lg margin-top-sm">
			<view class="bg-white margin-tb-sm">
				<view class="bg-img radius" :style="`background-image: url(${eventDisplay.cover});height: 360rpx;`">
				</view>
			</view><br>
			<view class="u-content">
				<u-parse lazyLoad :content="content">
				</u-parse>
			</view>
		</view><br>
		<view class="padding-left-sm flex align-center">
			<u-tag text="技术" shape="circle" size="large"></u-tag>&nbsp;
			<u-tag text="基础内容" type="warning" shape="circle" size="large"></u-tag>&nbsp;
			<u-tag text="学术杂刊" type="error" shape="circle" size="large"></u-tag>
		</view>

		<view class="flex justify-between margin-tb bg-gray margin-lr-sm padding-tb-sm radius">
			<view class="flex padding-left-sm">
				<view class="cu-avatar round" :style="`background-image:url(${eventDisplay.avatar});`">
				</view>
				<view class="text-gray text-sm padding-left-sm">
					<view class="text-lg text-black">{{eventDisplay.name}}</view>
					<view class="">{{eventDisplay.title.substring(0, 16)}}...</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { onLoad } from '@dcloudio/uni-app'
	import { EventDisplay } from '@/pages/event/event.vue'
	import { Ref, ref } from "vue";
	import { config } from '@/constant/config';
	import { Response } from '@/util/type'
	import text from '../../uni_modules/uview-plus/libs/config/props/text';

	const eventDisplay : Ref<EventDisplay> = ref()

	let content = ref("");

	onLoad(async (option) => {
		if (option.event !== undefined) {
			eventDisplay.value = JSON.parse(option.event);
			try {
				const fetchUrlRes = (await uni.request({
					url: config.address + "/event/getEventUrlByEventId",
					method: 'GET',
					data: {
						eventId: eventDisplay.value.eventId
					}
				})).data as Response<string>;
				if (fetchUrlRes.code === '200') {
					const res = await uni.request({ url: fetchUrlRes.data, method: 'GET' });
					content.value = res.data as string;
				} else {
					uni.showToast({
						title: fetchUrlRes.msg,
						duration: 2000
					})
				}
			} catch (e) {
				console.error(e)
				uni.showToast({
					title: "网络异常，请稍后再试",
					duration: 2000
				})
			}
		}
	})
</script>

<style>

</style>