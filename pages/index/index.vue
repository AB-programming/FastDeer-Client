<template>
	<view class="container">
		<view class="grid col-4 no-border bg-white radius-lg-bottom">
			<u-icon name="plus-circle" label="发帖" size="28" class="padding-lr-sm" @click="publishPost"></u-icon>
			<u-search shape="round" class="search"></u-search>
		</view>

		<view class="classify radius-lg">
			<u-grid col="3" @click="click">
				<u-grid-item v-for="(listItem,listIndex) in list" :key="listIndex">
					<u-icon :customStyle="{paddingTop:40+'rpx'}" :name="listItem.name" :size="22"
						:color="listItem.color"></u-icon>
					<text class="grid-text">{{listItem.title}}</text>
				</u-grid-item>
			</u-grid>
			<u-toast ref="uToast" />
		</view>

		<!-- 论坛 -->
		<u-sticky bgColor="#fff">
			<u-tabs :list="forumTypes" @click="clickTab"></u-tabs>
		</u-sticky>

		<view class="box">
			<FastPost :posts='posts'></FastPost>
		</view>

		<view class="wrap">
			<u-back-top :scroll-top="scrollTop" :duration="500" :customStyle="{backgroundColor: '#2979ff'}"
				:icon-style="{color: '#ffffff'}">
			</u-back-top>
		</view>

		<u-loadmore :status="loadStatus" color="#1CD29B" loadingText="正在加载帖子" lineColor="#1CD29B" dashed line />

		<u-popup :show="show" :round="10" mode="bottom" @close="close">
			<view class="popup">
				<view class="post_content" @click="toEditor">
					<u-text text="发布帖子" :bold=true lineHeight="90rpx"></u-text>
					<u-text text="来吧,尽情发挥吧..." color="#A9A9A9"></u-text>
					<u-text text="&nbsp;添加图片" lineHeight="150rpx" size="12"></u-text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, Ref } from 'vue';
	import { Response, Post } from '../../util/type'
	import FastPost from '../../components/FastPost.vue'
	import { onPullDownRefresh, onPageScroll, onReachBottom } from '@dcloudio/uni-app'
	import { config } from '@/constant/config.js'
	import { useLoginStatus } from '@/hooks/useLoginStatus'

	onPullDownRefresh(() => {
		setTimeout(function () {
			uni.stopPullDownRefresh()
			uni.reLaunch({
				url: 'index'
			})
		}, 500);
	})

	const list = [{
		name: 'integral',
		title: '学术资迅',
		color: "#e45656"
	},
	{
		name: 'account',
		title: '校园活动',
		color: "#398ade"
	},
	{
		name: 'arrow-upward',
		title: '资源共享',
		color: "#f1a532"
	},
	{
		name: 'hourglass',
		title: '校园就业',
		color: "#767a82"
	},
	{
		name: 'rewind-right',
		title: '志愿者通道',
		color: "#53c21d"
	},
	{
		name: 'server-man',
		title: '平台反馈',
		color: "#606266"
	},]
	
	const click = (name : any) => {
		
	}

	// 论坛内容
	const posts : Ref<Array<Post>> = ref([]);
	const show = ref(false);
	const scrollTop = ref(0);

	onPageScroll((e : Page.PageScrollOption) => {
		scrollTop.value = e.scrollTop
	})


	const loadStatus = ref('loading')
	let postPage : number = 1
	onReachBottom(() => {
		postPage++
		uni.getStorage({
			key: 'openId',
			success: (openId: any) => {
				fetchPostPage(postPage, 5, openId.data)
			},
			fail: () => {
				fetchPostPage(postPage, 5)
			}
		})
	})

	const forumTypes = ref([{
		name: '推荐',
	}, {
		name: '关注',
	}, {
		name: '本校'
	}]);

	const toEditor = async () => {
		if (await useLoginStatus()) {
			uni.navigateTo({
				url: "/pages/editor/postEditor",
				animationType: 'zoom-fade-out',
				animationDuration: 400
			});
			setTimeout(() => {
				show.value = false;
			}, 300);
		} else {
			uni.showToast({
				title: "请先登录",
				duration: 2000
			})
			show.value = false
		}
	};

	const clickTab = (item : any) => {
		// itemIndex.value = item.index;
	};

	const publishPost = () => {
		show.value = true;
	};

	const close = () => {
		show.value = false;
	};

	const fetchPostPage = (current : number, size : number, userId: String = null) => {
		uni.request({
			url: config.address + "/post/selectPostPage?userId="
				+ userId
				+ "&current="
				+ current
				+ "&size="
				+ size,
			success: (res) => {
				const postsRes = res.data as Response<Array<Post>>
				if (postsRes.code === '200') {
					posts.value.push(...postsRes.data)
					if (postsRes.data.length === 0) loadStatus.value = 'nomore'
					uni.hideLoading();
				} else {
					uni.hideLoading();
					fetchPostFailHandler()
				}
			},
			fail: () => {
				uni.hideLoading();
				fetchPostFailHandler()
			}
		})
	}

	const fetchPostFailHandler = () => {
		uni.showToast({
			title: "数据异常，请稍后重试",
			duration: 2000
		})
		loadStatus.value = "nomore"
	}

	onMounted(() => {
		uni.showLoading({
			title: "数据加载中...",
			mask: false
		});
		uni.getStorage({
			key: "openId",
			success: (openId) => {
				fetchPostPage(1, 5, openId.data)
			},
			fail: () => {
				fetchPostPage(1, 5);
			}
		})
	});
</script>

<style lang="scss" scoped>
	.search {
		padding: 35rpx;
	}

	.classify {
		background-color: white;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
	}

	.u-page {
		padding: 20rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		background-color: white;
		border-radius: 30rpx;
		box-sizing: border-box;

		.icon {
			display: flex;
			justify-content: space-around;
			flex: auto;
			margin: 0 40rpx;

			.toX {
				display: flex;
			}
		}
	}

	.header {
		width: 750rpx;
		height: 300rpx;
	}

	.album {
		@include flex;
		align-items: flex-start;

		&__avatar {
			// background-color: $u-bg-color;
			// padding: 5px;
			// border-radius: 50%;
		}

		&__content {
			margin-left: 10px;
			flex: 1;

			&__x {
				font-size: 12px;
				display: flex;
			}
		}
	}

	.content {
		margin: 15rpx 20rpx 0;
	}

	.post {
		padding-bottom: 20rpx;
		margin-left: 10rpx;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		box-sizing: border-box;
		border-radius: 10rpx;

	}

	.popup {
		height: 450rpx;
	}

	.box {
		background-color: #dcdcdc;
		padding-top: 20rpx;
	}

	.post_content {
		background-color: #F2F2F2;
		margin: 40rpx 50rpx 0rpx 50rpx;
		height: 250rpx;
		border-radius: 20rpx;
		padding-left: 30rpx;
	}
</style>