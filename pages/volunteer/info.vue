<template>
	<view>
		<view class="cu-timeline margin-xs radius-lg">
			<view class="padding-sm text-center">
				<text class="text-xxl text-bold text-black">{{volunteer.title}}</text>
			</view>

			<view class="flex justify-between margin-top-xs">
				<view class="flex padding-left-sm">
					<view class="cu-avatar round" :style="`background-image:url(${volunteer.avatar});`">
					</view>
					<view class="text-gray text-sm padding-left-sm">
						<view class="text-lg text-black">{{volunteer.name}}</view>
						<view class="">{{volunteer.date}}</view>
					</view>
				</view>

				<view class="padding-right flex align-center">
					<button class="cu-btn round bg-blue"><text class="cuIcon-add"></text>关注</button>
				</view>
			</view>
			<view class="padding-sm text-lg margin-top-sm">
				<view class="u-content">
					<u-parse lazyLoad :content="volunteer.description">
					</u-parse>
				</view>
			</view><br>

			<u-text :text="'截止日期：' + volunteer.deadline"></u-text><br><br>

			<u-text type="primary" text="报名者" bold size="17"></u-text>
			<view class="u-page">
				<u-list>
					<u-list-item v-for="member in volunteer.members" :key="member.userId">
						<u-cell :title="member.name" :label="member.qualification"
							:value="member.school + ' ' + member.major" center>
							<template #icon>
								<u-avatar shape="square" size="35" :src="member.avatar"
									customStyle="margin: -3px 5px -3px 0"></u-avatar>
								<u-icon :name="member.gender === '男' ? 'man' : 'woman'"
									:color="member.gender === '男' ? '#2979ff' : '#fab6b6'" size="20"></u-icon>
							</template>
						</u-cell>
					</u-list-item>
				</u-list>
			</view>
		</view>
		<u-button id="apply" class="button" :type="triggerStatus ? 'success': 'primary'" shape="circle"
			icon="plus-circle" @click="applyVolunteer">
			{{triggerStatus ? '取消报名' : '报名'}}
		</u-button>
	</view>
</template>

<script setup lang="ts">
	import { onLoad } from '@dcloudio/uni-app'
	import { VolunteerDisplay } from '@/pages/volunteer/volunteer.vue';
	import { Ref, ref } from "vue";
	import { config } from '../../constant/config';
	import { Response } from '@/util/type';
	import { useStore} from '@/stores/index.js'

	const store = useStore();

	const volunteer : Ref<VolunteerDisplay> = ref();

	onLoad(async (option) => {
		if (option.volunteer !== undefined) {
			volunteer.value = JSON.parse(option.volunteer);
		}
		try {
			const openId = await uni.getStorage({ key: 'openId' });
			const token = await uni.getStorage({ key: 'token' });
			const checkRes = (await uni.request({
				url: config.address + "/volunteer/checkVolunteerRegistrationStatus",
				header: {
					"Authorization": token.data
				},
				data: {
					userId: openId.data,
					volunteerId: volunteer.value.volunteerId
				}
			})).data as Response<boolean>;
			if (checkRes.code === '200') {
				triggerStatus.value = checkRes.data;
			}
		} catch (e) {
			uni.showToast({
				title: "网络异常，请稍后再试",
				duration: 2000
			})
		}
	})

	const triggerStatus = ref(false);

	const applyVolunteer = async () => {
		const openId = await uni.getStorage({ key: 'openId' });
		const token = await uni.getStorage({ key: 'token' });
		try {
			const url = triggerStatus.value ? config.address + '/volunteer/cancelVolunteer' : config.address + '/volunteer/applyVolunteer';
			const volunteerActionRes = (await uni.request({
				url: url,
				method: triggerStatus.value ? 'DELETE' : 'POST',
				header: {
					"Authorization": token.data
				},
				data: {
					userId: openId.data,
					volunteerId: volunteer.value.volunteerId
				}
			})).data as Response<boolean>;
			if (volunteerActionRes.code === '200' && volunteerActionRes.data) {
				if (triggerStatus.value) {
					volunteer.value.members = volunteer.value.members.filter(member => member.userId !== openId.data);
				} else {
					volunteer.value.members.push({
						userId: openId.data,
						name: store.nickName,
						avatar: store.avatarUrl,
						gender: store.gender,
						school: store.school,
						major: store.major,
						qualification: store.qualification
					})
				}
				uni.showToast({
					title: volunteerActionRes.msg,
					duration: 2000
				})
				triggerStatus.value = !triggerStatus.value;
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
		}
	}
</script>

<style scoped>
	.button {
		position: fixed;
		left: 25%;
		bottom: 5%;
		width: 50%;
	}
</style>