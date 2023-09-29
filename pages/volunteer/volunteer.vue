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

		<view class="cu-card article no-card margin-top-lg" v-for="volunteer in volunteerList"
			:key="volunteer.volunteerId">
			<view class="cu-item shadow" @click="toInfo(volunteer)">
				<view class="content flex justify-between">
					<view>
						<view>
							<text class="text-black text-bold text-lg text-cut-2">{{volunteer.title}}</text>
						</view>
					</view>
					<view>
						目前有 {{volunteer.members.length}} 位同学已报名
					</view>
				</view>
				<view class="flex justify-between">
					<view class="text-gray text-sm padding-left flex align-center">
						<view class="cu-avatar sm round" :style="{backgroundImage: 'url('+volunteer.avatar+')'}">
						</view>
						<text class="padding-left-xs text-df text-bold">{{volunteer.name}}</text>
					</view>
					<view class="text-gray text-sm padding-right flex align-center">发布日期: {{volunteer.date}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { Ref, ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app'
	import { config } from '../../constant/config';
	import { Response } from '@/util/type';

	export interface Member {
		avatar : string;
		gender : string;
		major : string;
		name : string;
		qualification : string;
		school : string;
		userId : string;
	}

	export interface VolunteerDisplay {
		volunteerId : string;
		userId : string;
		name : string;
		avatar : string;
		date : string;
		deadline : string;
		description : string;
		title : string;
		members : Array<Member>
	}

	onShow(async () => {
		const volunteerListRes = (await uni.request({ url: config.address + "/volunteer/selectAllVolunteer" })).data as Response<Array<VolunteerDisplay>>;
		if (volunteerListRes.code === '200') {
			console.log(volunteerListRes)
			volunteerList.value = volunteerListRes.data;
		} else {
			uni.showToast({
				title: "网络异常，请稍后再试",
				duration: 2000
			})
		}
	})

	const volunteerList : Ref<Array<VolunteerDisplay>> = ref([]);

	const tabCur = ref(0)
	const tabList = [{
		id: 0,
		name: '推荐'
	}, {
		id: 2,
		name: '本校'
	}]
	const changetap = (id : number) => {
		tabCur.value = id
	}
	
	const toInfo = (volunteer: VolunteerDisplay) => {
		uni.navigateTo({
			url: '/pages/volunteer/info?volunteer=' + JSON.stringify(volunteer),
			animationType: 'zoom-fade-out',
			animationDuration: 400
		})
	}
</script>

<style>

</style>