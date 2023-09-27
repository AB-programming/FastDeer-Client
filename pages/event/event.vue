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
		<view class="cu-card article no-card margin-top-lg" v-for="event in eventList" :key="event.eventId">
			<view class="cu-item shadow" @click="toInfo(event)">
				<view class="content flex justify-between">
					<view class="">
						<view class="">
							<text class="text-black text-bold text-lg text-cut-2">{{event.title}}</text>
						</view>
						<view class="flex justify-between margin-top">
							<view class="text-gray text-sm">经验 | 2.1万观看</view>
						</view>
					</view>
					<view>
						<image :src="event.cover" mode="aspectFill" class="radius"
							style="height: 180rpx;width: 230rpx;">
						</image>
					</view>
				</view>
				<view class="flex justify-between">
					<view class="text-gray text-sm padding-left flex align-center">
						<view class="cu-avatar sm round" :style="{backgroundImage: 'url('+event.avatar+')'}">
						</view> <text class="padding-left-xs text-df text-bold">{{event.name}}</text>
					</view>
					<view class="text-gray text-sm padding-right flex align-center">{{event.date}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { Ref, ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import { config } from '@/constant/config';
	import { Response } from '@/util/type';

	export interface EventDisplay {
		eventId : string;
		userId : string;
		name : string;
		avatar : string;
		title : string;
		cover : string;
		date : string;
	}

	const fetchEventList = async () => {
		try {
			const eventListRes = (await uni.request({ url: config.address + '/event/selectEventList' })).data as Response<Array<EventDisplay>>;
			if (eventListRes.code === '200') {
				eventList.value = eventListRes.data
			} else {
				uni.showToast({
					title: eventListRes.msg,
					duration: 2000
				})
			}
		} catch (e) {
			uni.showToast({
				title: "网络异常，请稍后再试",
				duration: 2000
			})
		}
	}

	const fetchEventListBySchoolId = async (schoolId : string) => {
		try {
			const eventListRes = (await uni.request({
				url: config.address + '/event/selectEventListBySchoolId', data: {
					schoolId: schoolId
				}
			})).data as Response<Array<EventDisplay>>;
			if (eventListRes.code === '200') {
				eventList.value = eventListRes.data
			} else {
				uni.showToast({
					title: eventListRes.msg,
					duration: 2000
				})
			}
		} catch (e) {
			uni.showToast({
				title: "网络异常，请稍后再试",
				duration: 2000
			})
		}
	}

	onShow(() => {
		fetchEventList()
	})

	const eventList : Ref<Array<EventDisplay>> = ref([])

	const tabList = [{
		id: 0,
		name: '推荐'
	}, {
		id: 1,
		name: '本校'
	}]
	const tabCur = ref(0)
	const changetap = (id : number) => {
		switch (id) {
			case 0: {
				fetchEventList()
				break;
			}
			case 1: {
				fetchEventListBySchoolId('100')
				break;
			}
		}
		tabCur.value = id
	}

	const toInfo = (event : EventDisplay) => {
		uni.navigateTo({
			url: '/pages/event/info?event=' + JSON.stringify(event),
			animationType: 'zoom-fade-out',
			animationDuration: 400
		})
	}
</script>

<style>

</style>