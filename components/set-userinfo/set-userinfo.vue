<template>
	<view class="body">
		<view class="set-userinfo">
			<view class="set-userinfo-list">
				<view class="set-userinfo-list-left">头像</view>
				<view class="set-userinfo-list-right" @click="changeimage">
					<view class="set-userinfo-list-right-pic">
						<image :src="avatarUrl" mode="aspectFill" lazy-load></image>
					</view>
					<view class="set-userinfo-list-right-icon icon iconfont">&#xe668;</view>
				</view>

			</view>
			<view class="set-userinfo-list">
				<view class="set-userinfo-list-left">昵称</view>
				<view class="set-userinfo-list-right">
					<input class="set-userinfo-list-right-name" type="text" v-model="username" />
					<view class="set-userinfo-list-right-icon icon iconfont">&#xe668;</view>
				</view>

			</view>
			<view class="set-userinfo-list">
				<view class="set-userinfo-list-left">性别</view>
				<view class="set-userinfo-list-right" @click="changeSex()">
					<view class="set-userinfo-list-right-name">
						{{sex}}
					</view>
					<view class="set-userinfo-list-right-icon icon iconfont">&#xe668;</view>
				</view>

			</view>
			<view class="set-userinfo-list">
				<view class="set-userinfo-list-left">生日</view>
				<view class="set-userinfo-list-right">
					<picker mode="date" :value="birthday" :start="getDate('start')" :end="getDate('end')"
						@change="bindDateChange">
						<view class="set-userinfo-list-right-name">{{birthday}}</view>
					</picker>
					<view class="set-userinfo-list-right-icon icon iconfont">&#xe668;</view>
				</view>
			</view>
			<view class="set-userinfo-list">
				<view class="set-userinfo-list-left">居住地</view>
				<u-icon name="map" size="24" @click="updateCurrentLocation"></u-icon>
				<view class="set-userinfo-list-right" @click="openPicker">
					<view class="set-userinfo-list-right-name">
						{{pickerText}}
					</view>
					<view class="set-userinfo-list-right-icon icon iconfont">&#xe668;</view>
				</view>

			</view>
			<view class="set-userinfo-list">
				<view class="set-userinfo-list-left">学校</view>
				<view class="set-userinfo-list-right">
					<input class="set-userinfo-list-right-name" type="text" v-model="school" />
					<view class="set-userinfo-list-right-icon icon iconfont">&#xe668;</view>
				</view>

			</view>
			<view class="set-userinfo-list">
				<view class="set-userinfo-list-left">专业</view>
				<view class="set-userinfo-list-right">
					<input class="set-userinfo-list-right-name" type="text" v-model="major" />
					<view class="set-userinfo-list-right-icon icon iconfont">&#xe668;</view>
				</view>

			</view>
			<view class="set-userinfo-list">
				<view class="set-userinfo-list-left">学历</view>
				<view class="set-userinfo-list-right" @click="changeQualification">
					<view class="set-userinfo-list-right-name">
						{{qualification}}
					</view>
					<view class="set-userinfo-list-right-icon icon iconfont">&#xe668;</view>
				</view>

			</view>
			<view class="set-userinfo-list">
				<view class="set-userinfo-list-left">毕业时间</view>
				<view class="set-userinfo-list-right">
					<picker mode="date" :value="graduationDate" :start="getDate('start')" :end="getDate('end')"
						@change="bindGraduationDateChange">
						<view class="set-userinfo-list-right-name">{{graduationDate}}</view>
					</picker>
					<view class="set-userinfo-list-right-icon icon iconfont">&#xe668;</view>
				</view>
			</view>
			<button class="button" type="default" @click="submit">完成</button>
		</view>
		<cc-selectDity :show="cityShow" @sureSelectArea="onsetCity" @hideShow="onhideShow"></cc-selectDity>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { useStore } from '../../stores/index.js'
	import { config } from '@/constant/config.js'
	import { Response } from '../../util/type'

	const store = useStore()

	const avatarUrl = ref(store.avatarUrl + '?' + Date.now())

	let username = ref(store.nickName)
	let sex = ref(store.gender)
	let birthday = ref(store.birth)
	let pickerText = ref(store.place)
	let cityShow = ref(false)
	let school = ref(store.school)
	let major = ref(store.major)
	let qualification = ref(store.qualification)
	let graduationDate = ref(store.graduationDate)

	const openPicker = () => {
		cityShow.value = true
	}

	const updateCurrentLocation = () => {
		uni.getLocation({
			type: 'gcj02',
			geocode: true,
			success: function (res) {
				pickerText.value = res.address.province + '-' + res.address.city + '-' + res.address.district
			}
		});
	}

	const onsetCity = (event : any) => {
		const selectedCity = event.detail.target.dataset
		pickerText.value = selectedCity.province + '-' + selectedCity.city + '-' + selectedCity.area
		cityShow.value = false
	}
	const onhideShow = () => {
		cityShow.value = false
	}
	
	const changeimage = () => {
		uni.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album'],
			success: (file) => {
				uni.getStorage({
					key: 'token',
					success: (token: any) => {
						uni.getStorage({
							key: "openId",
							success: (openId) => {
								uni.uploadFile({
									url: config.address + "/user/updateAvatar",
									name: 'file',
									fileType: 'image',
									filePath: file.tempFilePaths.toString(),
									header: {
										"Authorization": token.data
									},
									formData: {
										'openId': openId.data,
									},
									success: (res : UniApp.UploadFileSuccessCallbackResult) => {
										const uploadFileRes = JSON.parse(res.data) as Response<string>
										if (uploadFileRes.code === "200") {
											uni.showToast({
												title: uploadFileRes.msg,
												duration: 2000
											})
											store.avatarUrl = uploadFileRes.data
										}
										avatarUrl.value = store.avatarUrl + '?' + Date.now()
										uni.$emit('updateAvatar')
									}
								})
							},
							fail: () => {
								uni.showToast({
									title: "网络异常，请稍后再试",
									duration: 2000
								})
								uni.reLaunch({
									url: 'index'
								})
							}
						})
					},
					fail: () => {
						uni.showToast({
							title: "网络异常，请稍后再试",
							duration: 2000
						})
						uni.reLaunch({
							url: 'index'
						})
					}
				})
			},
			fail: (err) => {
				console.log('err ', err)
			}
		});
	}
	const bindDateChange = (e : any) => {
		birthday.value = e.detail.value
	}
	const bindGraduationDateChange = (e : any) => {
		graduationDate.value = e.detail.value
	}
	const getDate = (type : String) => {
		const date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		if (type === 'start') {
			year = year - 100;
		} else if (type === 'end') {
			year = year + 60;
		}

		let newMonth = month > 9 ? month : '0' + month;
		let newDay = day > 9 ? day : '0' + day;
		return `${year}-${newMonth}-${newDay}`;
	}
	// 单列选择
	const changeSex = () => {
		let sexs = ["男", "女"];
		uni.showActionSheet({
			itemList: sexs,
			success: (res) => {
				sex.value = sexs[res.tapIndex]
			},
		});
	}

	const changeQualification = () => {
		let qualifacations = ['小学', '初中', '高中', '专科', '本科', '研究生']
		uni.showActionSheet({
			itemList: qualifacations,
			success: (res) => {
				qualification.value = qualifacations[res.tapIndex]
			}
		})
	}
	const submit = () => {
		uni.getStorage({
			key: 'token',
			success: (token) => {
				uni.getStorage({
					key: 'openId',
					success: (openId) => {
						uni.request({
							url: config.address + "/user/updateUserById",
							method: 'POST',
							header: {
								"Authorization": token.data,
								"Content-Type": "application/json"
							},
							data: {
								'openId': openId.data,
								'nickName': username.value,
								'gender': sex.value,
								'place': pickerText.value,
								'birth': birthday.value,
								'school': school.value,
								'major': major.value,
								'qualification': qualification.value,
								'graduationDate': graduationDate.value,
								'avatarUrl': store.avatarUrl,
								'role': store.role
							},
							success: (res) => {
								const result = res.data as Response<null>
								if (result.code === '200') {
									updateStoreInfo()
									uni.showToast({
										title: result.msg,
										duration: 2000
									})
									uni.reLaunch({
										url: '/pages/me/index'
									})
								}
							}
						})
					},
					fail: () => {
						getStorageFailHandler()
					}
				})
			},
			fail: () => {
				getStorageFailHandler()
			}
		})
	}
	const getStorageFailHandler = () => {
		uni.showToast({
			title: "网络异常，请稍后再试",
			duration: 2000
		})
		uni.reLaunch({
			url: 'index'
		})
	}

	const updateStoreInfo = () => {
		store.nickName = username.value
		store.gender = sex.value
		store.place = pickerText.value
		store.birth = birthday.value
		store.school = school.value
		store.major = major.value
		store.qualification = qualification.value
		store.graduationDate = graduationDate.value
	}
</script>

<style lang="scss" scoped>
	@import url("iconfont.css");

	.body {
		margin: 20rpx 25rpx;

		.set-userinfo {
			border-top: 1rpx solid #F2F2F2;

			.set-userinfo-list {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10rpx 25rpx;
				border-bottom: 1rpx solid #F2F2F2;

				.set-userinfo-list-left {
					font-size: 30rpx;
					color: #989898;
					font-weight: 500;
				}

				.set-userinfo-list-right {
					display: flex;
					justify-content: center;
					align-items: center;

					.set-userinfo-list-right-pic {
						width: 90rpx;
						height: 90rpx;

						image {
							width: 100%;
							height: 100%;
							border-radius: 100%;
						}
					}

					.set-userinfo-list-right-name {
						display: flex;
						align-items: center;
						font-size: 30rpx;

						text-align: right;
					}

					.set-userinfo-list-right-icon {
						font-size: 45rpx;
						color: #989898;
						margin-left: 30rpx;
					}
				}
			}

			.button {
				margin-top: 30rpx;
				width: 95%;
				background-color: #007aff;
				font-size: 30rpx;
				color: #ffffff;
				border: 0;
			}
		}

	}
</style>