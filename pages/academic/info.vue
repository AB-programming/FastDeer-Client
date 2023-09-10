<template>
	<view>
		<view class="cu-timeline margin-xs radius-lg">

			<view class="padding-sm text-center">
				<text class="text-xxl text-bold text-black">{{academic.title}}</text>
			</view>

			<view class="flex justify-between margin-top-xs">
				<view class="flex padding-left-sm">
					<view class="cu-avatar round" :style="`background-image:url(${academic.avatar});`">
					</view>
					<view class="text-gray text-sm padding-left-sm">
						<view class="text-lg text-black">{{academic.name}}</view>
						<view class="">{{academic.date}}</view>
					</view>
				</view>

				<view class="padding-right flex align-center">
					<button class="cu-btn round bg-blue"><text class="cuIcon-add"></text>关注</button>
				</view>
			</view>
			<view class="padding-sm text-lg margin-top-sm">
				<view class="bg-white margin-tb-sm">
					<view class="bg-img radius"
						:style="`background-image: url(${academic.cover});height: 360rpx;`">
					</view>
				</view><br>
				<view class="u-content">
					<u-parse lazyLoad :content="content">
					</u-parse>
				</view>
			</view><br>
			<view class="padding-left-sm flex align-center">
				<u-tag text="评测" shape="circle" size="large"></u-tag>&nbsp;
				<u-tag text="原创视频" type="warning" shape="circle" size="large"></u-tag>&nbsp;
				<u-tag text="新车上市" type="error" shape="circle" size="large"></u-tag>
			</view>

			<view class="flex justify-between margin-tb bg-gray margin-lr-sm padding-tb-sm radius">
				<view class="flex padding-left-sm">
					<view class="cu-avatar round" style="background-image:url('/static/images/design04.png');">
					</view>
					<view class="text-gray text-sm padding-left-sm">
						<view class="text-lg text-black">真相实验室</view>
						<view class="">讲得清事实，HOLD得住真相!</view>
					</view>
				</view>
			</view>

			<view class="bg-white">
				<view class="cu-bar">
					<view class="text-blue text-lg padding-lr-sm">
						全部评论
					</view>
				</view>
				<view class="cu-list menu-avatar">
					<view class="cu-item">
						<view class="cu-avatar round lg" style="background-image:url('/static/images/design05.png');">
						</view>
						<view class="content">
							<view class="text-lg text-bold">
								谦和钢笔
							</view>
							<view class="text-gray text-sm">
								05-08
							</view>
						</view>
					</view>
					<view class="margin-left-sm padding-left text-black">
						<view class="margin-lr-sm padding-left">
							<text>从卡罗拉和雷凌的配置就可以看出丰田在中国为了缩减生产成本手段真是无所不用其极。混动卡罗拉全系只有一个型号带雷达，再高配有了视频倒车影像就把雷达取消了。车内的按钮连疏油层都不涂，轻轻蹭一下就是个印子...</text>
						</view>
					</view>
				</view>

				<view class="cu-list menu-avatar no-padding">
					<view class="cu-item">
						<view class="cu-avatar round lg" style="background-image:url('/static/images/design01.png');">
						</view>
						<view class="content">
							<view class="text-lg text-bold">
								飞奔移动电源
							</view>
							<view class="text-gray text-sm">
								05-08
							</view>
						</view>
					</view>
					<view class="margin-left-sm padding-left text-black">
						<view class="margin-lr-sm padding-left">
							<text>内饰设计不太养眼，但是实际我坐过一次，感觉还可以，没有想象的那么差，可能广汽做工不错的原因。</text>
						</view>
					</view>
				</view>

				<view class="cu-list menu-avatar no-padding padding-bottom" style="height: 210px;">
					<view class="cu-item">
						<view class="cu-avatar round lg" style="background-image:url('/static/images/design02.png');">
						</view>
						<view class="content">
							<view class="text-lg text-bold">
								性感的大象
							</view>
							<view class="text-gray text-sm">
								05-08
							</view>
						</view>
					</view>
					<view class="margin-left-sm padding-left text-black">
						<view class="margin-lr-sm padding-left">
							<text>国产之光。外观设计无可挑剔,全系列车型国产车里面显得高端大气上档次。MG6和550开始及以上的车型底盘和用料值得称赞。</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { Ref, ref } from "vue";
	import { onLoad } from '@dcloudio/uni-app'
	import { AcademicDisplay } from '@/util/type'
	import { config } from '@/constant/config.js'
	import { Response } from '@/util/type'
	
	const content = ref('加载中...')
	const academic: Ref<AcademicDisplay> = ref()
	onLoad(async (option) => {
		if (option.academic !== undefined) {
			academic.value = JSON.parse(option.academic)
			const res = await uni.request({
				url: config.address + '/academic/getAcademicContentByAcademicId',
				data: {
					academicId: academic.value.academicId
				}
			})
			const contentRes = res.data as Response<string>
			if (contentRes.code === '200') {
				content.value = contentRes.data
			} else {
				content.value = '加载失败，请稍后再试'
			}
		} else {
			uni.showToast({
				title: "网络异常，请稍后再试",
				duration: 2000
			})
		}
	})
</script>

<style scoped>
	.u-content {
		padding: 16rpx;
		font-size: 32rpx;
		color: $u-content-color;
		line-height: 1.6;
	}
</style>