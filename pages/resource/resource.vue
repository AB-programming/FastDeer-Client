<template>
	<view>
		<u-tabs :list="list" @click="click"></u-tabs>
		<view class="u-page">
			<u-list @scrolltolower="scrolltolower">
				<u-list-item v-for="(item, index) in 10" :key="index">
					<u-cell :title="`列表长度-${index + 1}`" size="large" :border="false">
						<template #icon>
							<u-avatar shape="square" size="35" src="https://cdn.uviewui.com/uview/album/1.jpg"
								customStyle="margin: -3px 5px -3px 0"></u-avatar>
						</template>
					</u-cell>
					<u-text class="padding" :lines="2" text="关于uview-plus的取名来由，首字母u来自于uni-app首字母，
					uni-app是基Vuejs，Vue和View(延伸为UI、视图之意)同音，同时view组件uni-app中
					最础最重要的组件，故取名uview-plus，表达源于uni-app和Vue之意，同时在此也对它示感谢。"></u-text>	
					<u-text class="padding" mode="link" text="Go to uview-plus docs" href="https://www.uviewui.com"></u-text>
				</u-list-item>
			</u-list>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';

	const list = [
		{
			name: '全部'
		},
		{
			name: '本校'
		}
	]

	const click = (item : any) => {
		console.log(item)
	}

	const indexList = reactive([]);
	const urls = [
		'https://cdn.uviewui.com/uview/album/1.jpg',
		'https://cdn.uviewui.com/uview/album/2.jpg',
		'https://cdn.uviewui.com/uview/album/3.jpg',
		'https://cdn.uviewui.com/uview/album/4.jpg',
		'https://cdn.uviewui.com/uview/album/5.jpg',
		'https://cdn.uviewui.com/uview/album/6.jpg',
		'https://cdn.uviewui.com/uview/album/7.jpg',
		'https://cdn.uviewui.com/uview/album/8.jpg',
		'https://cdn.uviewui.com/uview/album/9.jpg',
		'https://cdn.uviewui.com/uview/album/10.jpg',
	];

	const onLoad = () => {
		loadmore();
	};

	const scrolltolower = () => {
		loadmore();
	};

	const loadmore = () => {
		for (let i = 0; i < 30; i++) {
			indexList.push({
				url: 'https://cdn.uviewui.com/uview/album/1.jpg'
			});
		}
	};
</script>

<style scoped lang="scss">
</style>