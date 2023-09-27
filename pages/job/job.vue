<template>
	<view class="bg-gray cu-timeline margin-xs radius-lg" style="min-height: 92vh;">
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view v-for="item in tabList" @click="changetap(item.id)"
					:class="['cu-item', 'flex-sub ', item.id==tabCur?'text-blue cur text-bold':'']" :key="item.id"
					:data-id="item.id">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		<u-list scrollWithAnimation showScrollbar>
			<u-list-item v-for="job in jobList" :key="job.jobId">
				<view class="card radius-lg margin-tb-sm">
					<view class="title padding">
						<u-text :text="job.jobName" size='16' type="primary" bold></u-text>
					</view>

					<view class="cu-list menu-avatar comment solids-top">
						<view class="cu-item">
							<view class="cu-avatar round" :style="`background-image:url(${job.avatar});`">
							</view>
							<view class="content">
								<view class="text-center">山东交通学院</view>
								<view class="bg-grey padding-sm radius margin-top-sm text-sm">
									<view class="flex">
										<view>学历要求：</view>
										<view class="flex-sub">{{job.degree}}</view>
									</view>
								</view>
								<view class="bg-grey padding-sm radius margin-top-sm text-sm">
									<view class="flex">
										<view>薪资情况：</view>
										<view class="flex-sub">{{job.salary}}</view>
									</view>
								</view>
								<view class="bg-grey padding-sm radius margin-top-sm text-sm">
									<view class="flex">
										<view>职位描述：</view>
										<view class="flex-sub">
											<u-parse lazyLoad :content="job.description">
											</u-parse>
										</view>
									</view>
								</view>
								<view class="bg-grey padding-sm radius margin-top-sm text-sm">
									<view class="flex">
										<view>所属公司：</view>
										<view class="flex-sub">{{job.company}}</view>
									</view>
								</view>
								<view class="bg-grey padding-sm radius margin-top-sm text-sm">
									<view class="flex">
										<view>截止日期：</view>
										<view class="flex-sub">{{job.deadline}}</view>
									</view>
								</view>
								<view class="bg-grey padding-sm radius margin-top-sm text-sm">
									<view class="flex">
										<view>联系方式：</view>
										<view class="flex-sub">{{job.contact}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</u-list-item>
		</u-list>
	</view>
</template>

<script setup lang="ts">
	import { Ref, ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import { config } from '../../constant/config';
	import { Response } from '@/util/type';

	export interface JobDisplay {
		avatar : string;
		company : string;
		contact : string;
		date : string;
		deadline : string;
		degree : string;
		description : string;
		jobId : string;
		jobName : string;
		nickName : string;
		salary : string;
		userId : string;
	}

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
				fetchJobList()
				break;
			}
			case 1: {
				fetchJobListBySchoolId("100")
				break;
			}
		}
		tabCur.value = id
	}

	const jobList : Ref<Array<JobDisplay>> = ref([]);

	const fetchJobList = async () => {
		try {
			const jobListRes = (await uni.request({ url: config.address + "/job/selectAllJob" })).data as Response<Array<JobDisplay>>
			if (jobListRes.code === '200') {
				jobList.value = jobListRes.data
			}
		} catch (e) {
			uni.showToast({
				title: "网络异常，请稍后再试",
				duration: 2000
			})
		}
	}

	const fetchJobListBySchoolId = async (schoolId : string) => {
		try {
			const jobListRes = (await uni.request({
				url: config.address + "/job/selectJobListBySchoolId", data: {
					schoolId: schoolId
				}
			})).data as Response<Array<JobDisplay>>
			if (jobListRes.code === '200') {
				jobList.value = jobListRes.data
			}
		} catch (e) {
			uni.showToast({
				title: "网络异常，请稍后再试",
				duration: 2000
			})
		}
	}

	onShow(async () => {
		fetchJobList()
	})
</script>

<style scoped>
	.card {
		background-color: #fff;
		margin-left: 10%;
		margin-right: 10%;
		height: 900rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
		height: auto;
	}

	.card .title {
		width: 50%;
		text-align: center;
	}

	.card .info {
		display: flex;
		margin-left: 0;
	}
</style>