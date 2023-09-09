<template>
	<view>
		<Personal />
	</view>
	<u-popup :safeAreaInsetBottom="true" :safeAreaInsetTop="true" :mode="popupData.mode" :show="store.isShowFloatWindow"
		:round="popupData.round" :overlay="popupData.overlay" :borderRadius="popupData.borderRadius"
		:closeable="popupData.closeable" :closeOnClickOverlay="popupData.closeOnClickOverlay"
		:overlayOpacity="popupData.overlayOpacity" @close="close" @open="open">
		<view class="u-popup-slot" :style="{
						width: ['bottom', 'top'].includes(popupData.mode) ? '750rpx' : '200px',
						marginTop: ['left', 'right'].includes(popupData.mode) ? '480rpx' : '0'
					}"><br><br>
			<view class="floating">
				<u-button type="success" shape="circle" icon="share-square" color="#c4c6c9" @click="editUserInfo"
					text="编辑资料" customStyle="width: 200rpx"></u-button>
				<u-button type="success" shape="circle" icon="error-circle" color="#909399" @click="logout" text="退出登录"
					customStyle="width: 200rpx"></u-button>
				<u-button type="success" shape="circle" icon="man-delete" color="#fab6b6" @click="remove" text="注销账号"
					customStyle="width: 200rpx"></u-button>
			</view>
			<br><br>
		</view>
	</u-popup>
</template>

<script setup lang="ts">
	import { useStore } from '../../stores/index.js'
	import Personal from '../../components/Personal.vue'
	import { onShow, onLoad } from '@dcloudio/uni-app'
	import { config } from '@/constant/config.js'
	import { Response, User } from '../../util/type'
	import { useLoginStatus } from '@/hooks/useLoginStatus'

	// onShow(async () => {
	// 	const loginStatus = await useLoginStatus()

	// 	if (loginStatus) {
	// 		try {
	// 			const openId = await uni.getStorage({ key: "openId" })
	// 			const token = await uni.getStorage({ key: "token" })
	// 			getUserById(openId.data, token.data)
	// 		} catch(e) {
	// 			login()
	// 		}
	// 	} else {
	// 		login()
	// 	}
	// })


	// Here is the test code
	
	onLoad((options) => {
		if (options.id === '1') {
			uni.setStorage({
				key: 'token',
				data: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6IntcImlkXCI6XCIxXCIsXCJuaWNrTmFtZVwiOlwiQUJcIixcImF2YXRhclVybFwiOlwiaHR0cDovLzE5Mi4xNjguOTEuMTM5OjgwODAvc3RhdGljL2xvZ28ucG5nXCIsXCJnZW5kZXJcIjpcIueUt1wiLFwicGxhY2VcIjpudWxsLFwiYmlydGhcIjpudWxsLFwic2Nob29sXCI6bnVsbCxcIm1ham9yXCI6bnVsbCxcInF1YWxpZmljYXRpb25cIjpudWxsLFwiZ3JhZHVhdGlvbkRhdGVcIjpudWxsLFwicm9sZVwiOlwiUk9MRV91c2VyXCJ9IiwiaXNzIjoiZmFzdC1kZWVyIiwiZXhwIjoxNjk0Mjc1NTAyLCJpYXQiOjE2OTQyNjgzMDIsImp0aSI6IjEzOTI5MTUxLWY3YzItNDU4Mi05OWNmLTczOTZmMTIxZDc2NiJ9.Euhzl7oa1Sr_7yCabn5c88vI6r5eacFJEIalkG3lCqg"
			})
			
			uni.setStorage({
				key: "openId",
				data: "1"
			})
		} 
		
		if (options.id === '2') {
			uni.setStorage({
				key: 'token',
				data: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6IntcImlkXCI6XCIyXCIsXCJuaWNrTmFtZVwiOlwiQUJcIixcImF2YXRhclVybFwiOlwiaHR0cDovLzE5Mi4xNjguOTEuMTM5OjgwODAvc3RhdGljL2xvZ28ucG5nXCIsXCJnZW5kZXJcIjpcIueUt1wiLFwicGxhY2VcIjpudWxsLFwiYmlydGhcIjpudWxsLFwic2Nob29sXCI6bnVsbCxcIm1ham9yXCI6bnVsbCxcInF1YWxpZmljYXRpb25cIjpudWxsLFwiZ3JhZHVhdGlvbkRhdGVcIjpudWxsLFwicm9sZVwiOlwiUk9MRV91c2VyXCJ9IiwiaXNzIjoiZmFzdC1kZWVyIiwiZXhwIjoxNjkzNTkyNDg4LCJpYXQiOjE2OTM1ODUyODgsImp0aSI6ImU1NDBjNDZhLTM4NmYtNDU3Yi1hZWI1LWMyOTFmMTIyOTM3ZCJ9.GkY0AHR5Zd9mQwA1q80HP5OqyulMNccprr2-18Y-hUg"
			})
			
			uni.setStorage({
				key: "openId",
				data: "2"
			})
		}
	})
	
	onShow(async () => {
		
		const loginStatus = await useLoginStatus()

		if (loginStatus) {
			try {
				const openId = await uni.getStorage({ key: "openId" })
				const token = await uni.getStorage({ key: "token" })
				getUserById(openId.data, token.data)
			} catch(e) {

			}
		} else {
		}
	})
	

	const login = () => {
		uni.login({
			provider: 'univerify',
			univerifyStyle: { // 自定义登录框样式
				"fullScreen": true,
				"backgroundColor": "#ecf5ff",
				"icon": {
					"path": "/static/logo.png"
				},
				"phoneNum": {
					"color": "#303133"
				},
				"authButton": {
					"normalColor": "#2b85e4", // 授权按钮正常状态背景颜色 默认值：#3479f5  
					"highlightColor": "#a0cfff",  // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）  
					"disabledColor": "#c8c9cc",  // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）  
					"textColor": "#ffffff",  // 授权按钮文字颜色 默认值：#ffffff  
					"title": "一键登录", // 授权按钮文案 默认值：“本机号码一键登录”  
					"borderRadius": "24px"	// 授权按钮圆角 默认值："24px" （按钮高度的一半）
				},
			},
			success(res) {
				uniCloud.callFunction({
					name: 'Fastdeer-Login',
					data: {
						// @ts-ignore
						'access_token': res.authResult.access_token, // 客户端一键登录接口返回的access_token
						// @ts-ignore
						'openid': res.authResult.openid // 客户端一键登录接口返回的openid
					}
				}).then(res => {
					uni.request({
						url: config.address + '/login',
						method: 'POST',
						header: {
							'Content-Type': 'application/json'
						},
						data: {
							'openId': res.result.phone,
							'nickName': "快鹿用户" + res.result.phone,
							'avatarUrl': config.address + "/static/logo.png",
							'gender': "男",
							'role': 'ROLE_user',
						},
						success: (result) => {
							const loginRes = result.data as Response<string>
							if (loginRes.code === '200') {
								uni.setStorage({
									key: 'openId',
									data: res.result.phone,
								})
								uni.setStorage({
									key: 'token',
									data: loginRes.data
								})

								getUserById(res.result.phone, loginRes.data)

								uni.closeAuthView()
								setTimeout(() => {
									uni.showToast({
										title: loginRes.msg,
										duration: 2000
									})
								}, 2000)
							}

						},
					})

				}).catch(_ => {
					// 发送云函数处理错误，可能是欠费等情况
					uni.showToast({
						title: "请稍后再试",
						duration: 2000
					})
					uni.reLaunch({
						url: '/pages/index/index'
					})
				})
			},
			fail(res) {
				if (res.metadata.resultCode === 10004) {
					uni.showToast({
						title: res.metadata.resultMsg,
						duration: 2000
					})
				}
				uni.closeAuthView()
			}
		})
	}

	const store = useStore()
	const open = () => {
	}
	const close = () => {
		store.isShowFloatWindow = false
	}

	const popupData = {
		overlay: true,
		mode: 'bottom',
		round: 30,
		borderRadius: '',
		closeable: false,
		closeOnClickOverlay: true,
		overlayOpacity: 0.6,
	}

	// To obtain user information through a mobile phone number, you need to carry a token
	const getUserById = (phone : string, token : string) => {
		uni.request({
			url: config.address + '/user/getUserById',
			method: 'GET',
			header: {
				"Authorization": token
			},
			data: {
				"openId": phone
			},
			success: (res) => {
				const getUserRes = res.data as Response<User>
				store.nickName = getUserRes.data.nickName
				store.avatarUrl = getUserRes.data.avatarUrl
				store.gender = getUserRes.data.gender
				store.place = getUserRes.data.place
				store.birth = getUserRes.data.birth
				store.school = getUserRes.data.school
				store.major = getUserRes.data.major
				store.qualification = getUserRes.data.qualification
				store.graduationDate = getUserRes.data.graduationDate
				store.role = getUserRes.data.role
			}
		})
	}

	const logout = () => {

		uni.getStorage({
			key: 'token',
			success: (token) => {
				uni.request({
					url: config.address + '/logout',
					method: 'GET',
					header: {
						"Authorization": token.data
					},
					success: (res) => {
						const logoutRes = res.data as Response<null>
						if (logoutRes.code == '200') {
							uni.removeStorage({
								key: 'token'
							})
							uni.removeStorage({
								key: "openId"
							})
							uni.showToast({
								title: logoutRes.msg,
								duration: 2000
							})
							uni.reLaunch({
								url: '/pages/index/index'
							})
						}
					}
				})
			}
		})
		store.isShowFloatWindow = false
	}

	const editUserInfo = () => {
		uni.navigateTo({
			url: '/pages/editor/userInfoEditor'
		})
		store.isShowFloatWindow = false
	}

	const remove = () => {
		uni.getStorage({
			key: "token",
			success: (token : any) => {
				uni.request({
					url: config.address + "/user/deleteUserById",
					method: "POST",
					header: {
						"Authorization": token.data
					},
					success: (res) => {
						const delUserRes = res.data as Response<number>
						if (delUserRes.code === '200') {
							uni.removeStorage({
								key: 'token'
							})
							uni.removeStorage({
								key: "openId"
							})
							uni.showToast({
								title: delUserRes.msg,
								duration: 2000
							})
							uni.reLaunch({
								url: '/pages/index/index'
							})
						}
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
	}
</script>

<style scoped>
	.floating {
		display: flex;
	}
</style>