<template>
	<view>
		<u-skeleton rows="2" title :loading="false" avatar rowsHeight="14">
			<view v-for="post in posts" :key="post.postId">
				<u-divider :dot="true"></u-divider>
				<view class="u-skeleton-slot">
					<image :src="post.userInfo.avatar" class="u-skeleton-slot__image"></image>
					<view class="u-skeleton-slot__content" @click="toDetail(post)">
						<u--text :text="post.date" size="8"></u--text>
						<u--text :text="post.content.title" type="main" size="18"></u--text>
						<u--text type="tips" size="15" customStyle="margin-top: 5px"
							:text="post.content.text.length > 30 ?
							 post.content.text.substring(0, 50) + '...'
							 : post.content.text"></u--text>
						<u-album :urls="post.content.urls" @click.stop></u-album>
					</view>
					<u-icon @click="openDelPost(post.postId)" class="operation" name="trash" size="28"></u-icon>
				</view>
			</view>
		</u-skeleton>

		<u-modal @confirm="delPost" @cancel="delPrompt = false" showCancelButton title="删帖" content="确认删除这此条帖子吗"
			:show="delPrompt"></u-modal>
	</view>
</template>

<script setup lang="ts">
	import { Ref, ref } from 'vue'
	import { useLoginStatus } from '@/hooks/useLoginStatus'
	import { onLoad } from '@dcloudio/uni-app'
	import { config } from '@/constant/config.js'
	import { Response, Post } from '@/util/type'
	
	const posts : Ref<Array<Post>> = ref([])
	let postId: String = ""

	onLoad(async () => {
		try {
			const openId = await uni.getStorage({ key: 'openId' })
			const token = await uni.getStorage({ key: 'token' })

			const res = await uni.request({
				url: config.address + '/post/selectPostByUserId?userId=' + openId.data,
				method: 'GET',
				header: {
					"Authorization": token.data
				}
			})
			const postsRes = res.data as Response<Array<Post>>
			if (postsRes.code === '200') {
				posts.value = postsRes.data
			} else {
				uni.showToast({
					title: "网络异常，请稍后再试",
					duration: 2000
				})
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/me/index'
					})
				}, 1000)
			}
		} catch (e) {
			uni.showToast({
				title: "网络异常，请稍后再试",
				duration: 2000
			})
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/me/index'
				})
			}, 1000)
		}
	})

	const delPrompt = ref(false)

	const delPost = async () => {
		if (await useLoginStatus()) {
			try {
				const token = await uni.getStorage({key: 'token'})
				const res = await uni.request({
					url: config.address + '/post/deletePostByPostId',
					method: 'DELETE',
					data: postId,
					header: {
						"Authorization": token.data
					}
				})
				const delPostRes = res.data as Response<Boolean>
				
				if (delPostRes.code === '200' && delPostRes.data) {
					uni.showToast({
						title: delPostRes.msg,
						duration: 2000
					})
					posts.value.splice(posts.value.findIndex(post => post.postId === postId), 1)
				} else {
					uni.showToast({
						title: "网络异常，请稍后再试",
						duration: 2000
					})
				}
			} catch(e) {
				uni.showToast({
					title: "网络异常，请稍后再试",
					duration: 2000
				})
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/me/index'
					})
				}, 1000)
			}
		} else {
			uni.showToast({
				title: "请先登录",
				duration: 2000
			})
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/me/index'
				})
			}, 1000)
		}
		
		delPrompt.value = false
	}

	const openDelPost = (id: String) => {
		postId = id
		delPrompt.value = true
	}
	
	const toDetail = (post: Post) => {
		uni.navigateTo({
			url: "../detail/detail?post=" + encodeURIComponent(JSON.stringify(post)),
			animationType: 'slide-in-bottom',
			animationDuration: 300
		});
	}
</script>

<style lang="scss">
	.u-skeleton-slot {
		@include flex;
		align-items: flex-start;

		&__image {
			margin: 20rpx;
			width: 50px;
			height: 50px;
			border-radius: 100px;
		}

		&__content {
			margin: 25rpx;
			flex: 1;
		}

		.operation {
			margin: 10rpx;
		}
	}
</style>