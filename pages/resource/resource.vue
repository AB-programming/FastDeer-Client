<template>
	<u-tabs :list="list" @click="click"></u-tabs>
	<view v-for="item in 3">
		<u-skeleton :loading="false" rows="2" avatar title>
			<view>
				<view class="u-skeleton-slot">
					<image src="/static/test.jpg" class="u-skeleton-slot__image"></image>
					<view class="u-skeleton-slot__content">
						<u--text text="利剑出鞘,一统江湖" type="main" size="14"></u--text>
						<view class="file" style="background: linear-gradient(#CCFBFF, #EF96C5);">
							<u-text type="" size="20" text="学术论文"></u-text>
							<u-text type="" size="20" text="PDF"></u-text>
						</view><br>
						<u-button type="primary" shape="circle" style="width: 40%;" plain icon="download">下载</u-button>
					</view>
				</view>
			</view>
		</u-skeleton>
	</view>
</template>

<script setup lang="ts">
	const list = [
		{
			name: '全部'
		},
		{
			name: '本校'
		}
	]
	
	const click = (item: any) => {
		console.log(item)
	}
	
</script>

<style scoped lang="scss">
	.u-skeleton-slot {
		@include flex;
		align-items: flex-start;

		&__image {
			width: 60px;
			height: 60px;
			border-radius: 100px;
			margin: 10px 10px;
		}

		&__content {
			margin-left: 20px;
			flex: 1;
			padding: 20px;
		}
	}
	.file {
		margin-top: 20rpx;
		// background: linear-gradient(#CCFBFF, #EF96C5);
		// background: linear-gradient(#EEBD89, #D13ABD);
		// background: linear-gradient(#C973FF, #AEBAF8);
		// background: linear-gradient(#0C7BB3, #F2BAE8);
		box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
		width: 400rpx;
		height: 100rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.file .extension {
		
		background-color: red;
	}
</style>