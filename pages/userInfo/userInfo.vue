<template>
	<view>
		<view class="AvatarBar" :style="'background-image: url('+bgiURL+');'">
			<view class="avatar">
				<image class="avatar_xBox" :src="post.userInfo.avatar"
					style="width: 100rpx;height: 100rpx;border-radius: 50%;"></image>
				<view class="avatar_yBox">
					<u--text :text="post.userInfo.name" bold size="17" color="white"
						style="margin-left: 10rpx;"></u--text>
					<view class="cu-tag round line-green sm">普通用户</view>
				</view>
			</view>

			<view style="margin-left: 30rpx;">
				<view>
					<text class="iconf2" style="font-size: 40rpx;color: #A0A0A0A0;">&#xe62c;</text>
					<text
						style="font-size: 20rpx;color: #A0A0A0A0;margin-left: 10rpx;">{{post.userInfo.schoolInfo.schoolName}}</text>
				</view>
			</view>

			<view class="info">
				<view class="info_yBox">
					<text>{{post.userInfo.socialInfo.likes}}</text>
					<text class="ft">获赞</text>
				</view>

				<view class="info_yBox">
					<text>{{post.userInfo.socialInfo.fans}}</text>
					<text class="ft">粉丝</text>
				</view>

				<view class="info_yBox">
					<text>{{post.userInfo.socialInfo.following}}</text>
					<text class="ft">关注</text>
				</view>
				<view>
					<u-button :text="isAttention ? '已关注' : '+关注'" shape="circle"
						:color="isAttention ? '#c8c9cc' : '#31B96E'" @click="attention(post.userInfo)"
						style="width: 120rpx;height: 50rpx;margin-top: 10rpx;"></u-button>
				</view>
				<u-icon name="chat" size="50rpx" color="white"></u-icon>
			</view>

		</view>

		<view class="ContentBar">
			<u-sticky bgColor="#fff">
				<u-tabs :list="tabList" @click="clickTab"></u-tabs>
			</u-sticky>
			<view class="tab0" v-if="tabIndex==0">
				<FastPost></FastPost>
			</view>
			<view class="tab1" v-if="tabIndex==1">
				<view class="page1_content0 beautify">
					<text class="title">基本信息</text>
					<view>
						<view style="display: inline-block;width: 30%;">
							<text class="subtitle">性别</text>
						</view>
						<text class="text">{{post.userInfo.baseInfo.gender}}</text>
					</view>
					<view>
						<view style="display: inline-block;width: 30%;">
							<text class="subtitle">居住地</text>
						</view>

						<text class="text">{{post.userInfo.baseInfo.address}}</text>
					</view>


				</view>
				<view class="page1_content1 beautify">
					<text class="title">学校</text>
					<view>
						<view style="display: inline-block;width: 30%;">
							<text class="subtitle">学校学历</text>
						</view>

						<text class="text">
							{{post.userInfo.schoolInfo.schoolName}} - {{post.userInfo.schoolInfo.degree}}
						</text>
					</view>

					<view>
						<view style="display: inline-block;width: 30%;">
							<text class="subtitle">专业</text>
						</view>

						<text class="text">{{post.userInfo.schoolInfo.major}}</text>
					</view>

					<view>
						<view style="display: inline-block;width: 30%;">
							<text class="subtitle">毕业时间</text>
						</view>

						<text class="text">{{post.userInfo.schoolInfo.graduation}}</text>
					</view>

				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, Ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { Post, UserInfo } from '../../util/type';
	import FastPost from '../../components/FastPost.vue'
	import { config } from '@/constant/config.js'
	import { Response } from '@/util/type'

	const post : Ref<Post> = ref();
	const postNum = ref(0);
	const bgiURL = ref("https://img1.imgtp.com/2023/07/18/eqV8LJKe.jpg"); // userInfo背景图
	const tabList = ref([]);
	const tabIndex = ref(0);
	const isAttention = ref(false)

	const clickTab = (post : any) => {
		tabIndex.value = post.index;
	};

	// todo...
	const toDetail = () => {
		uni.navigateTo({
			url: "/pages/detail/detail"
		});
	};

	const attention = async (userInfo : UserInfo) => {
		try {
			const token = await uni.getStorage({ key: 'token' })
			const openId = await uni.getStorage({ key: 'openId' })
			
			if (userInfo.userId === openId.data) {
				uni.showToast({
					title: '用户不能关注自己',
					duration: 2000
				})
				return;
			}
			
			if (isAttention.value) {
				uni.request({
					url: config.address + '/user/decrementUserRelate',
					method: 'DELETE',
					header: {
						"Authorization": token.data
					},
					data: {
						userId: openId.data,
						targetId: userInfo.userId
					},
					success: (res : UniApp.RequestSuccessCallbackResult) => {
						const incrementAttentionRes = res.data as Response<Boolean>
						uni.showToast({
							title: incrementAttentionRes.msg,
							duration: 2000
						})
					}
				})
			} else {
				uni.request({
					url: config.address + '/user/incrementUserRelate',
					method: 'POST',
					header: {
						"Authorization": token.data
					},
					data: {
						userId: openId.data,
						targetId: userInfo.userId
					},
					success: (res : UniApp.RequestSuccessCallbackResult) => {
						const incrementAttentionRes = res.data as Response<Boolean>
						uni.showToast({
							title: incrementAttentionRes.msg,
							duration: 2000
						})
					}
				})
			}
			userInfo.socialInfo.fans = isAttention.value ?
				Number(userInfo.socialInfo.fans) - 1 :
				Number(userInfo.socialInfo.fans) + 1
			isAttention.value = !isAttention.value
		} catch (e) {
			uni.showToast({
				title: "网络错误，请稍后再试",
				duration: 2000
			})
		}
	}

	onMounted(() => {
		tabList.value = [{
			name: '发布(' + postNum.value + ')',
		}, {
			name: '档案',
		}];
	});

	onLoad(async (option : any) => {
		if (option.post != undefined) {
			uni.showLoading({
				title: "数据加载中..."
			});
			post.value = JSON.parse(decodeURIComponent(option.post));
			uni.hideLoading();
		}

		const token = await uni.getStorage({ key: 'token' })
		const openId = await uni.getStorage({ key: 'openId' })
		uni.request({
			url: config.address + '/user/isAttention',
			method: 'GET',
			header: {
				"Authorization": token.data
			},
			data: {
				userId: openId.data,
				targetId: post.value.userInfo.userId
			},
			success: (res : UniApp.RequestSuccessCallbackResult) => {
				const incrementAttentionRes = res.data as Response<boolean>
				isAttention.value = incrementAttentionRes.data
			}
		})
		console.log(isAttention.value)
	})
</script>


<style lang="scss">
	@font-face {
		font-family: 'iconfont';
		/* Project id 4171916 */
		src: url('//at.alicdn.com/t/c/font_4171916_v9uwsje0py.woff2?t=1689652841578') format('woff2'),
			url('//at.alicdn.com/t/c/font_4171916_v9uwsje0py.woff?t=1689652841578') format('woff'),
			url('//at.alicdn.com/t/c/font_4171916_v9uwsje0py.ttf?t=1689652841578') format('truetype');
	}

	/* 在线链接服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
	@font-face {
		font-family: 'iconfont2';
		/* Project id 4172847 */
		src: url('//at.alicdn.com/t/c/font_4172847_ub0b5tikg6e.woff2?t=1689672620242') format('woff2'),
			url('//at.alicdn.com/t/c/font_4172847_ub0b5tikg6e.woff?t=1689672620242') format('woff'),
			url('//at.alicdn.com/t/c/font_4172847_ub0b5tikg6e.ttf?t=1689672620242') format('truetype');
	}

	.iconf {
		font-family: iconfont;
		font-size: 75rpx;
		color: #FFCF4B;
		padding: 0;
		margin: 0;
	}

	.iconf2 {
		font-family: iconfont2;
		padding: 0;
		margin: 0;
	}

	.AvatarBar {
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
		height: 450rpx;

		.avatar {
			display: flex;
			flex: auto;
			padding: 42rpx;

			&_yBox {
				margin-left: 20rpx;
				display: flex;
				flex-direction: column;
			}
		}

		.info {
			margin-top: 40rpx;
			color: white;
			display: flex;
			width: 100%;
			justify-content: space-around;

			&_yBox {
				text-align: center;
				display: flex;
				flex-direction: column;
				margin-left: 20rpx;

				.ft {
					font-size: 20rpx;
				}
			}
		}

	}

	.ContentBar {
		.tab0 {
			margin-top: 20rpx;
		}

		.tab1 {
			.beautify {
				margin: 20rpx;
				padding: 15rpx;
				background-color: white;
				border-radius: 20rpx;

				.title {
					margin-top: 15rpx;
					margin-left: 10rpx;
					font-weight: bold;
				}

				.subtitle {
					margin-left: 10rpx;
					font-size: 28rpx;
					color: #737373;
				}

				.text {
					font-size: 28rpx;
				}
			}
		}
	}

	body {
		background-color: #DCDCDC;
	}
</style>