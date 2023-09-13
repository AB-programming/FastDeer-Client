<template>
	<view>
		<u-skeleton :loading="false" rows="2" avatar title>
			<view>
				<view class="u-skeleton-slot">
					<image src="/static/test.jpg" class="u-skeleton-slot__image"></image>
					<view class="u-skeleton-slot__content">
						<u--text text="利剑出鞘,一统江湖" type="main" size="14"></u--text>
						<u--text type="tips" size="14" customStyle="margin-top: 5px"
							text="众多组件覆盖开发过程的各个需求，组件功能丰富，多端兼容。让您快速集成，开箱即用"></u--text>
					</view>
				</view>
			</view>
		</u-skeleton>
	</view>
</template>

<script setup lang="ts">
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
</style>