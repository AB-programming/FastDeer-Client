<template>
	<view class="wrap">
		<view class="comment">
			<view class="top">
				<view class="left">
					<view class="heart-photo">
						<image :src="comment.url"></image>
					</view>
					<view class="user-info">
						<view class="name">{{ comment.name }}</view>
						<view class="date">{{ comment.date }}</view>
					</view>
				</view>
				<view class="right" :class="{ highlight: comment.isLike }">
					{{ comment.likeNum }}
					<u-icon v-if="!comment.isLike" name="thumb-up" class="like" color="#9a9a9a" :size="30"
						@click="clickCommentThumbUp(comment)"></u-icon>
					<u-icon v-if="comment.isLike" name="thumb-up-fill" class="like" :size="30"
						@click="clickCommentThumbUp(comment)"></u-icon>
				</view>
			</view>
			<view class="content"
				@click="clickReply(comment.commentId, comment.name, comment.contentText, ReplyType.COMMENT)">
				{{ comment.contentText }}
			</view>
		</view>
		<view class="all-reply">
			<view class="all-reply-top">全部回复（{{ comment.replyList.length }}）</view>
			<view class="item" v-for="reply in comment.replyList" :key="reply.replyId">
				<view class="comment">
					<view class="top">
						<view class="left">
							<view class="heart-photo">
								<image :src="reply.url" mode=""></image>
							</view>
							<view class="user-info">
								<view class="name">{{ reply.name }}</view>
								<view class="date">{{ reply.date }}</view>
							</view>
						</view>
						<view class="right" :class="{ highlight: reply.isLike }">
							<view class="num">{{ reply.likeNum }}</view>
							<u-icon v-if="!reply.isLike" name="thumb-up" class="like" :size="30" color="#9a9a9a"
								@click="clickReplyThumbUp(reply)"></u-icon>
							<u-icon v-if="reply.isLike" name="thumb-up-fill" class="like" :size="30"
								@click="clickReplyThumbUp(reply)"></u-icon>
						</view>
					</view>
					<view class="reply" v-if="reply.reply">
						<view class="username">{{ reply.reply.name }}</view>
						<view class="text">{{ reply.reply.contentStr }}</view>
					</view>
					<view class="content"
						@click="clickReply(reply.replyId, reply.name, reply.contentText, ReplyType.REPLY)">
						{{ reply.contentText }}
					</view>
				</view>
			</view>
			<u-popup :show="show" mode="bottom" @close="close">
				<u-tabbar :placeholder="true" :border="true" :fixed="true" :safeAreaInsetBottom="true">
					<u--input :placeholder="'回复&nbsp;' + replyTarget.name + ':' + replyTarget.contentText"
						border="surround" maxlength=150 v-model="value" shape="circle"
						style="margin: 20rpx;"></u--input>
					<u-button text="发送" shape="circle" color="#31B96E" @click="sendReply()"
						style="width: 120rpx;height: 60rpx;margin: 20rpx;"></u-button>
				</u-tabbar>
			</u-popup>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { reactive, Ref, ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { Comment, Reply } from '../../util/type'
	import { config } from '@/constant/config.js'
	import { useDate } from '@/hooks/useDate'
	import { Response } from '@/util/type'
	import { useStore } from '@/stores/index.js'
	import { useLoginStatus } from '@/hooks/useLoginStatus'

	const store = useStore()

	const comment : Ref<Comment> = ref();

	const value = ref("");
	const show = ref(false);

	enum ReplyType {
		REPLY = "REPLY",
		COMMENT = "COMMENT"
	}

	const replyTarget = reactive({
		id: '',
		name: '',
		contentText: '',
		replyType: ReplyType.REPLY
	})

	const clickReply = (id : String, name : String, contentText : String, replyType : ReplyType) => {
		replyTarget.id = String(id)
		replyTarget.name = String(name)
		replyTarget.contentText = String(contentText)
		replyTarget.replyType = replyType
		show.value = true;
	};

	const close = () => {
		show.value = false;
	};

	// comment like
	const clickCommentThumbUp = async (comment : Comment) => {
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
	}

	// reply like
	const clickReplyThumbUp = async (reply : Reply) => {
		try {
			const token = await uni.getStorage({ key: 'token' })
			const openId = await uni.getStorage({ key: 'openId' })

			if (reply.isLike) {
				uni.request({
					url: config.address + '/reply/decrementReplyLike',
					method: 'DELETE',
					header: {
						"Authorization": token.data
					},
					data: {
						replyId: reply.replyId,
						userId: openId.data
					}
				})
			} else {
				uni.request({
					url: config.address + '/reply/incrementReplyLike',
					method: 'POST',
					header: {
						"Authorization": token.data
					},
					data: {
						replyId: reply.replyId,
						userId: openId.data
					}
				})
			}
			reply.isLike = !reply.isLike;
			reply.likeNum = reply.isLike ?
				Number(reply.likeNum) + 1 :
				Number(reply.likeNum) - 1
		} catch (e) {
			uni.showToast({
				title: "网络错误，请稍后再试",
				duration: 2000
			})
		}
	};

	const sendReply = async () => {
		if (await useLoginStatus()) {
			try {
				const token = await uni.getStorage({ key: "token" })
				const openId = await uni.getStorage({ key: "openId" })
				const date = useDate()
				const res = await uni.request({
					url: config.address + "/reply/insertReply",
					method: "POST",
					header: {
						"Authorization": token.data
					},
					data: {
						date: date,
						contentText: value.value,
						target: replyTarget.id,
						userId: openId.data,
						replyType: replyTarget.replyType
					}
				})
				const insertReplyRes = res.data as Response<String>
				if (insertReplyRes.code === '200') {
					uni.showToast({
						title: insertReplyRes.msg,
						duration: 2000
					})
					const reply : Reply = {
						replyId: insertReplyRes.data,
						name: store.nickName,
						date: date,
						contentText: value.value,
						url: store.avatarUrl,
						likeNum: 0,
						isLike: false,
						reply: {
							name: replyTarget.name,
							contentStr: replyTarget.contentText
						}
					}
					comment.value.replyList.push(reply)
					value.value = ""
					show.value = false
				} else {
					uni.showToast({
						title: insertReplyRes.msg,
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

	onLoad((data) => {
		if (data.comment != undefined) {
			comment.value = JSON.parse(decodeURIComponent(data.comment));
			uni.hideLoading();
		}
	});
</script>

<style lang="scss" scoped>
	page {
		background-color: #f2f2f2;
	}

	.comment {
		padding: 30rpx;
		font-size: 32rpx;
		background-color: #ffffff;

		.top {
			display: flex;
			justify-content: space-between;
		}

		.left {
			display: flex;

			.heart-photo {
				image {
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;
					background-color: #f2f2f2;
				}
			}

			.user-info {
				margin-left: 10rpx;

				.name {
					color: #5677fc;
					font-size: 28rpx;
					margin-bottom: 4rpx;
				}

				.date {
					font-size: 20rpx;
					color: $u-light-color;
				}
			}
		}

		.right {
			display: flex;
			font-size: 20rpx;
			align-items: center;
			color: #9a9a9a;

			.like {
				margin-left: 6rpx;
			}

			.num {
				font-size: 26rpx;
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

	.all-reply {
		margin-top: 10rpx;
		padding-top: 20rpx;
		background-color: #ffffff;

		.all-reply-top {
			margin-left: 20rpx;
			padding-left: 20rpx;
			border-left: solid 4rpx #5677fc;
			font-size: 30rpx;
			font-weight: bold;
		}

		.item {
			border-bottom: solid 2rpx $u-border-color;
		}

		.reply {
			padding: 20rpx;
			background-color: rgb(230, 230, 230);
			border-radius: 12rpx;
			margin: 10rpx 0;

			.username {
				font-size: 24rpx;
				color: #7a7a7a;
			}
		}
	}
</style>