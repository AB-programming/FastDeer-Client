import { defineStore } from 'pinia'
import { config } from '@/constant/config.js'

export const useStore = defineStore('store', {
	state: () => ({ 
		openId: "",
		avatarUrl: config.address + '/static/logo.png',
		nickName: "快鹿用户",
		gender: "男",
		place: "未选择",
		birth: "未选择",
		school: "未选择",
		major: "未选择",
		qualification: "未选择",
		graduationDate: "未选择",
		role: "ROLE_user",
		isShowFloatWindow: false,
	})
});