<script setup lang="ts">
	import { onLaunch, onUnload } from '@dcloudio/uni-app'
	import { config } from '@/constant/config.js'
	
	onLaunch(async () => {
		try {
			const openId = await uni.getStorage({
				key: 'openId'
			})

			const token = await uni.getStorage({
				key: 'token'
			})

			uni.connectSocket({
				url: config.wsAddress + "/ws/" + openId.data,
				header: {
					"Authorization": token.data
				},
				success: () => {
					console.log("websocket connect success")
				},
				fail: (err) => {
					uni.showToast({
						title: "服务器连接失败，消息异常",
						duration: 2000
					})
				}
			})
			uni.onSocketMessage(function (res) {
				// @ts-ignore
				if (JSON.parse(res.data).isMe === true) {
					uni.$emit('updateMessage', res.data)
				} else {
					uni.$emit('updateChatList', res.data)
					uni.$emit('updateMessage', res.data)
				}
			});
		} catch (e) {
			uni.showToast({
				title: "未登录，无法连接服务器",
				duration: 2000
			})
		}
	})

	onUnload(() => {
		uni.closeSocket()
	})
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-plus/index.scss";

	/* 引入colorUI */
	@import "static/colorui/main.css";
	@import "static/colorui/icon.css";
	@import "static/colorui/animation.css";
</style>