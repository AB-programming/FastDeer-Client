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
					<view class="bg-img radius" :style="`background-image: url(${academic.cover});height: 360rpx;`">
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
					<view class="cu-avatar round" :style="`background-image:url(${academic.avatar});`">
					</view>
					<view class="text-gray text-sm padding-left-sm">
						<view class="text-lg text-black">{{academic.name}}</view>
						<view class="">{{academic.title.substring(0, 16)}}...</view>
					</view>
				</view>
			</view>

			<view class="bg-white">
				<view class="cu-bar">
					<view class="text-blue text-lg padding-lr-sm">
						全部评论,共{{commentList.length}}条评论
					</view>
				</view>
				<view v-for="comment in commentList" :key="comment.academicCommentId">
					<view class="cu-list menu-avatar no-padding">
						<view class="cu-item">
							<view class="cu-avatar round lg" :style="`background-image:url(${comment.avatar});`">
							</view>
							<view class="content">
								<view class="text-lg text-bold">
									{{comment.name}}
								</view>
								<view class="text-gray text-sm">
									{{comment.date}}
								</view>
							</view>
						</view>
						<view class="margin-left-sm padding-left text-black">
							<view class="margin-lr-sm padding-left">
								<text>{{comment.content}}</text>
							</view>
						</view>
					</view>
				</view>
			</view><br>

			<u-text text="发布评论" type="success" margin="20rpx" bold size="16"></u-text>
			<view class="input">
				<u-input placeholder="请输入内容" border="surround" v-model="commentValue" shape="circle"
					class="margin-lr-xs" />
				<u-button type="primary" shape="circle" style="width: 200rpx;" @click="sendComment">发送</u-button>
			</view>
			<br>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { Ref, ref } from "vue";
	import { onLoad } from '@dcloudio/uni-app'
	import { AcademicDisplay } from '@/util/type'
	import { config } from '@/constant/config.js'
	import { Response } from '@/util/type'
	import { useDate } from '@/hooks/useDate'
	import { useLoginStatus } from '@/hooks/useLoginStatus'
	import { useStore } from '@/stores/index.js'

	const store = useStore()

	interface AcademicComment {
		academicCommentId : string,
		userId : string,
		name : string,
		avatar : string,
		date : string,
		content : string
	}

	const content = ref('加载中...')
	const academic : Ref<AcademicDisplay> = ref()
	const commentList : Ref<Array<AcademicComment>> = ref([])
	const commentValue = ref('')

	onLoad(async (option) => {
		if (option.academic !== undefined) {
			academic.value = JSON.parse(option.academic)
			let res = await uni.request({
				url: config.address + '/academic/getAcademicContentByAcademicId',
				method: 'GET',
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

			res = await uni.request({
				url: config.address + '/academic/selectAcademicCommentListByAcademicId',
				method: 'GET',
				data: {
					academicId: academic.value.academicId
				}
			})
			const commentRes = res.data as Response<Array<AcademicComment>>
			if (commentRes.code === '200') {
				commentList.value = commentRes.data
			}
		} else {
			uni.showToast({
				title: "网络异常，请稍后再试",
				duration: 2000
			})
		}
	})

	const sendComment = async () => {
		try {
			if (!await useLoginStatus()) {
				uni.showToast({
					title: "请先登录",
					duration: 2000
				});
				return;
			}
		
			const token = await uni.getStorage({key: 'token'});
			const openId = await uni.getStorage({key: 'openId'});
			const date = useDate();
			const res = await uni.request({
				url: config.address + '/academic/sendAcademicComment',
				method: 'POST',
				header: {
					"Authorization": token.data
				},
				data: {
					userId: openId.data,
					academicId: academic.value.academicId,
					date,
					content: commentValue.value
				}
			})
			const sendCommentRes = res.data as Response<Boolean>
			if (sendCommentRes.code === '200' && sendCommentRes.data) {
				commentList.value.push({
					academicCommentId: new Date().toString(),
					userId: openId.data,
					name: store.nickName,
					avatar: store.avatarUrl,
					date: date.toString(),
					content: commentValue.value
				})
			}
			uni.showToast({
				title: sendCommentRes.msg,
				duration: 2000
			})
		} catch (e) {
			uni.showToast({
				title: "网络异常，请稍后再试",
				duration: 2000
			})
		}
		commentValue.value = ''
	}
</script>

<style scoped>
	.u-content {
		padding: 16rpx;
		font-size: 32rpx;
		color: $u-content-color;
		line-height: 1.6;
	}

	.input {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		background-color: #fff;
	}
</style>