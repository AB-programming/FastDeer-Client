'use strict';

exports.main = async (event, context) => {
	// event里包含着客户端提交的参数
	const res = await uniCloud.getPhoneNumber({
		appid: '__UNI__2E44E70', // 替换成自己开通一键登录的应用的DCloud appid
		provider: 'univerify',
		apiKey: '04d352d1c57f2600073bbfd94eea549e', // 在开发者中心开通服务并获取apiKey
		apiSecret: '4e61152ba6ff50539b6428d1c9fe4377', // 在开发者中心开通服务并获取apiSecret
		access_token: event.access_token,
		openid: event.openid
	})
	return {
		code: 200,
		message: '获取手机号成功',
		phone: res.phoneNumber,
	}
}