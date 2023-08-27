<template class="out">
	<view class="box">
		<view class="above">
			<view class="post_info">
				<image @click="toUserInfo(post)" :src="post.userInfo.avatar"
					style="width: 80rpx;height: 80rpx; border-radius: 50%;"></image>
				<view class="info" @click="toUserInfo(post)">
					<u--text class="username" :text="post.userInfo.name" :bold="true"></u--text>
					<u--text class="schoolInfo" color="#737373" size="25rpx" lineHeight="40rpx"
						:text="post.userInfo.schoolInfo.schoolName+'&nbsp;'+post.userInfo.schoolInfo.major"></u--text>
				</view>
				<u-button text="关注" shape="circle" color="#31B96E"
					style="width: 120rpx;height: 60rpx; margin-right: 40rpx; margin-top: 10rpx;"></u-button>
			</view>
			<view class="post_content">
				<u--text size="40rpx" lineHeight="90rpx" :text="post.content.title" bold></u--text>
				<u--text size="32rpx" lineHeight="50rpx" :text="post.content.text"></u--text>
				<view style="height: 20rpx;"></view>
				<u-album :urls="post.content.urls" multipleSize=200rpx maxCount=9></u-album>
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
			</view>

		</view>
		<view style="background-color: #e6e6e6; height: 10rpx;"></view>
		<view class="below">
			<view class="all-comment-top">全部评论（{{ commentList.length }}）</view>
			<view class="comment" v-for="comment in commentList" :key="comment.commentId">
				<view class="left">
					<image :src="comment.url" mode="aspectFill"></image>
				</view>
				<view class="right">
					<view class="top">
						<view class="name">{{ comment.name }}</view>
						<view class="like" :class="{ highlight: comment.isLike }">
							<view class="num">{{ comment.likeNum }}</view>
							<u-icon v-if="!comment.isLike" name="thumb-up" :size="30" color="#9a9a9a"
								@click="clickLike(comment)"></u-icon>
							<u-icon v-if="comment.isLike" name="thumb-up-fill" :size="30"
								@click="clickLike(comment)"></u-icon>
						</view>
					</view>
					<u--text :text="comment.contentText"></u--text>
					<view class="reply-box">
						<view class="item" v-for="(reply, index) in comment.replyList" :key="reply.replyId"
							v-show="index!=undefined && index<3" @click="toAllReply(comment)">
							<view class="username">{{ reply.name }}</view>
							<u--text :text="reply.contentText" size=14></u--text>
						</view>
						<view class="all-reply" @tap="toAllReply(comment)"
							v-if="(comment.replyList != undefined)&&(comment.replyList.length>3)">
							共{{ comment.replyList.length }}条回复
							<u-icon class="more" name="arrow-right" :size="26"></u-icon>
						</view>
					</view>
					<view class="bottom">
						{{ comment.date }}&nbsp;&nbsp;
						<u-tag text="回复" plain shape="circle" plainFill size="mini"
							@click="toAllReply(comment)"></u-tag>
					</view>
				</view>
			</view>
		</view>

		<u-tabbar :placeholder="true" :border="true" :fixed="true" :safeAreaInsetBottom="true">
			<u--input placeholder="在这里畅所欲言你的看法吧!" border="surround" v-model="contentText" shape="circle"
				style="margin: 20rpx;"></u--input>
			<u-button text="发送" shape="circle" color="#31B96E" @click="sendComment"
				style="width: 120rpx;height: 60rpx;margin: 20rpx;"></u-button>
		</u-tabbar>
	</view>
</template>

<script setup lang="ts">
	import { computed, ref, Ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { Response, Post, Comment } from "../../util/type"
	import { config } from '@/constant/config.js'
	import { useDate } from '@/hooks/useDate'
	import { useStore } from '@/stores/index.js'
	import { useLoginStatus } from '@/hooks/useLoginStatus'

	const contentText = ref("");
	const post : Ref<Post> = ref()
	const commentList : Ref<Array<Comment>> = ref([])

	const store = useStore()

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
				Number(post.socialStats.likeCount) - 1;
		} catch (e) {
			uni.showToast({
				title: "网络错误，请稍后再试",
				duration: 2000
			})
		}
	};

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
				Number(post.socialStats.bookmarkCount) - 1;
		} catch (e) {
			uni.showToast({
				title: "网络错误，请稍后再试",
				duration: 2000
			})
		}
	};

	const toUserInfo = (post : Post) => {
		uni.navigateTo({
			url: "/pages/userInfo/userInfo?post=" + encodeURIComponent(JSON.stringify(post))
		});
	};

	const toAllReply = (comment : Comment) => {
		uni.navigateTo({
			url: '../comment/reply?comment=' + encodeURIComponent(JSON.stringify(comment)),
			animationType: 'slide-in-bottom',
			animationDuration: 300
		});
	};

	const clickLike = async (comment : Comment) => {
		try {
			const token = await uni.getStorage({ key: 'token' })
			const openId = await uni.getStorage({ key: 'openId' })

			if (comment.isLike) {
				uni.request({
					url: config.address + '/comment/decrementCommentLike',
					method: 'DELETE',
					header: {
						"Authorization": token.data
					},
					data: {
						commentId: comment.commentId,
						userId: openId.data
					}
				})
			} else {
				uni.request({
					url: config.address + '/comment/incrementCommentLike',
					method: 'POST',
					header: {
						"Authorization": token.data
					},
					data: {
						commentId: comment.commentId,
						userId: openId.data
					}
				})
			}
			comment.isLike = !comment.isLike;
			comment.likeNum = comment.isLike ?
				Number(comment.likeNum) + 1 :
				Number(comment.likeNum) - 1
		} catch (e) {
			uni.showToast({
				title: "网络错误，请稍后再试",
				duration: 2000
			})
		}
	};

	const sendComment = async () => {
		if (await useLoginStatus()) {
			try {
				const token = await uni.getStorage({ key: 'token' })
				const openId = await uni.getStorage({ key: 'openId' })
				const date = useDate();
				const res = await uni.request({
					url: config.address + "/comment/insertComment",
					method: "POST",
					header: {
						"Authorization": token.data
					},
					data: {
						date: date,
						contentText: contentText.value,
						userId: openId.data,
						postId: post.value.postId
					}
				})
				const insertCommentRes = res.data as Response<String>
				if (insertCommentRes.code === '200') {
					uni.showToast({
						title: insertCommentRes.msg,
						duration: 2000
					})
					const comment : Comment = {
						commentId: insertCommentRes.data,
						name: store.nickName,
						date: date,
						contentText: contentText.value,
						url: store.avatarUrl,
						likeNum: 0,
						isLike: false,
						replyList: []
					}
					commentList.value.push(comment)
					contentText.value = ""
				} else {
					uni.showToast({
						title: insertCommentRes.msg,
						duration: 2000
					})
				}
			} catch (e) {
				uni.showToast({
					title: "网络错误，请稍后再试",
					duration: 2000
				})
			}
		} else {
			uni.showToast({
				title: "请先登录",
				duration: 2000
			})
		}
	}

	const fetchAllComment = (postId : String, openId : any = null) => {
		uni.request({
			url: config.address + "/comment/selectAllCommentByPostId?postId=" + postId + "&userId=" + openId,
			success: (res : any) => {
				const fetchCommentRes = res.data as Response<Array<Comment>>
				if (fetchCommentRes.code === '200') {
					commentList.value = fetchCommentRes.data
				}
			}
		})
	}
	
	onLoad((option) => {
		if (option.post != undefined) {
			uni.showLoading({
				title: "数据加载中..."
			});
			post.value = JSON.parse(decodeURIComponent(option.post))
			uni.getStorage({
				key: "openId",
				success: (openId : any) => {
					fetchAllComment(post.value.postId, openId.data)
				},
				fail: () => {
					fetchAllComment(post.value.postId)
				}
			})
			uni.hideLoading();
		}
	});
</script>


<style lang="scss" scoped>
	.above {
		padding-bottom: 20rpx;

		.post_info {
			@include flex;
			margin-top: 40rpx;
			margin-left: 30rpx;
			align-items: flex-start;

			.info {
				flex: auto;
				margin-left: 20rpx;
			}
		}

		.icon {
			display: flex;
			justify-content: space-around;
			flex: auto;

			.toX {
				display: flex;
			}
		}

		.post_content {
			margin-top: 20rpx;
			margin-left: 40rpx;
			margin-right: 40rpx;
			margin-bottom: 40rpx;
		}
	}

	.below {
		.all-comment-top {
			margin-top: 20rpx;
			margin-left: 20rpx;
			padding-left: 20rpx;
			border-left: solid 4rpx #5677fc;
			font-size: 30rpx;
			font-weight: bold;
		}

		.comment {
			display: flex;
			padding: 30rpx;

			.left {
				image {
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;
					background-color: #f2f2f2;
				}
			}

			.right {
				flex: 1;
				padding-left: 20rpx;
				font-size: 30rpx;

				.top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 10rpx;

					.name {
						color: #5677fc;
					}

					.like {
						display: flex;
						align-items: center;
						color: #9a9a9a;
						font-size: 26rpx;

						.num {
							margin-right: 4rpx;
							color: #9a9a9a;
						}
					}

					.highlight {
						color: #5677fc;

						.num {
							color: #5677fc;
						}
					}
				}

				.content {
					margin-bottom: 10rpx;
				}

				.reply-box {
					margin-top: 20rpx;
					background-color: rgb(230, 230, 230);
					border-radius: 12rpx;

					.item {

						padding: 20rpx;
						border-bottom: solid 2rpx $u-border-color;

						.username {
							font-size: 24rpx;
							color: #999999;
							font-weight: 700;
						}
					}

					.all-reply {
						padding: 20rpx;
						display: flex;
						color: #5677fc;
						align-items: center;

						.more {
							margin-left: 6rpx;
						}
					}
				}

				.bottom {
					margin-top: 20rpx;
					display: flex;
					font-size: 24rpx;
					color: #9a9a9a;
					
					.trash {
						margin-left: 40%;
					}
				}
			}
		}
	}
</style>