import { config } from '@/constant/config.js'
import { Response } from '@/util/type'

export const useLoginStatus = async () => {
	try {
		const token = await uni.getStorage({key: 'token'})
		const res = await uni.request({
			url: config.address + "/isLogin",
			method: 'POST',
			header: {
				"Authorization": token.data
			}
		})
		const isLoginRes = res.data as Response<boolean>
		if (isLoginRes.code !== '200' || !isLoginRes.data) {
			// 未登录
			return false
		} else {
			// 已登录
			return true;
		}
	} catch(err) {
		return false
	}
	
	
}