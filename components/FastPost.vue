<template>
	<view v-for="post in props.posts" :key="post.postId">
		<view class="u-page">
			<view class="u-demo-block">
				<view class="u-demo-block__content post">
					<view class="album">
						<view class="album__avatar">
							<image @click="toUserInfo(post)" :src="post.userInfo.avatar"
								style="width: 80rpx;height: 80rpx;border-radius: 50%;">
							</image>
						</view>
						<view class="album__content" @click="toUserInfo(post)">
							<u--text :text="post.userInfo.name" type="primary" bold size="17"></u--text>
							<view class="album__content__x">
								<text>{{post.date}}</text>
							</view>
							<view class="album__content__x">
								<text>{{post.userInfo.schoolInfo.schoolName}}</text>
								&nbsp;
								<text>{{post.userInfo.schoolInfo.major}}</text>
							</view>
						</view>
					</view>
					<view class="content">
						<view @click="toDetail(post)">
							<u--text :text="post.content.title" bold></u--text>
							<u--text :text="post.content.text" lines=2></u--text>
						</view>
						<view style="height: 20rpx;"></view>
						<u-album :urls="post.content.urls" multipleSize=60 maxCount=6></u-album>
					</view>
				</view>
			</view>

			<view class="icon">
				<view class="toX">
					<u-icon name="eye" size="40rpx"></u-icon>
					<u--text :text="post.socialStats.browserCount" size=14></u--text>
				</view>


				<view class="toX" @click="clickThumbUp(post)">
					<u-icon v-if="!post.socialStats.isLike" name="thumb-up" size="40rpx"></u-icon>
					<u-icon v-if="post.socialStats.isLike" name="thumb-up-fill" size="40rpx"></u-icon>
					<u--text :text="post.socialStats.likeCount" size=14></u--text>
				</view>

				<view class="toX" @click="clickCollect(post)">
					<u-icon v-if="!post.socialStats.isBookmark" name="star" size="40rpx"></u-icon>
					<u-icon v-if="post.socialStats.isBookmark" name="star-fill" size="40rpx"></u-icon>
					<u--text :text="post.socialStats.bookmarkCount" size=14></u--text>
				</view>

				<view class="toX">
					<u-icon name="chat" size="40rpx" @click="toDetail(post)"></u-icon>
					<u--text :text="post.commentCount" size=14></u--text>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { Post } from '../util/type';
	import { config } from '@/constant/config.js'

	const props = defineProps<{
		posts ?: Array<Post>
	}>()

	const toUserInfo = (post : Post) => {
		uni.navigateTo({
			url: "/pages/userInfo/userInfo?post=" + encodeURIComponent(JSON.stringify(post)),
			animationType: 'zoom-fade-out',
			animationDuration: 400
		});
	}

	const toDetail = async (post : Post) => {
		const token = await uni.getStorage({ key: 'token' })
		uni.request({
			url: config.address + '/post/incrementBrowser',
			method: 'POST',
			header: {
				"Authorization": token.data
			},
			data: post.postId
		})
		uni.navigateTo({
			url: "../detail/detail?post=" + encodeURIComponent(JSON.stringify(post)),
			animationType: 'slide-in-bottom',
			animationDuration: 300
		});
	}
	const clickThumbUp = async (post : Post) => {
		try {
			const token = await uni.getStorage({ key: 'token' })
			const openId = await uni.getStorage({ key: 'openId' })
			if (post.socialStats.isLike) {
				uni.request({
					url: config.address + '/post/decrementPostLike',
					method: 'DELETE',
					header: {
						"Authorization": token.data
					},
					data: {
						postId: post.postId,
						userId: openId.data
					}
				})
			} else {
				uni.request({
					url: config.address + '/post/incrementPostLike',
					method: 'POST',
					header: {
						"Authorization": token.data
					},
					data: {
						postId: post.postId,
						userId: openId.data
					}
				})
			}
			post.socialStats.isLike = !post.socialStats.isLike;
			post.socialStats.likeCount = post.socialStats.isLike ?
				Number(post.socialStats.likeCount) + 1 :
				Number(post.socialStats.likeCount) - 1
		} catch (e) {
			uni.showToast({
				title: "网络错误，请稍后再试",
				duration: 2000
			})
		}
	}
	const clickCollect = async (post : Post) => {
		try {
			const token = await uni.getStorage({ key: 'token' })
			const openId = await uni.getStorage({ key: 'openId' })
			
			if (post.socialStats.isBookmark) {
				uni.request({
					url: config.address + '/post/decrementPostBookmark',
					method: 'DELETE',
					header: {
						"Authorization": token.data
					},
					data: {
						postId: post.postId,
						userId: openId.data
					}
				})
			} else {
				uni.request({
					url: config.address + '/post/incrementPostBookmark',
					method: 'POST',
					header: {
						"Authorization": token.data
					},
					data: {
						postId: post.postId,
						userId: openId.data
					}
				})
			}
			post.socialStats.isBookmark = !post.socialStats.isBookmark;
			post.socialStats.bookmarkCount = post.socialStats.isBookmark ?
				Number(post.socialStats.bookmarkCount) + 1 :
				Number(post.socialStats.bookmarkCount) - 1
		} catch(e) {
			uni.showToast({
				title: "网络错误，请稍后再试",
				duration: 2000
			})	
		}
	}
</script>


<style lang="scss">
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


	.album {
		@include flex;
		align-posts: flex-start;

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
</style>