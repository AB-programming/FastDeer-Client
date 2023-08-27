# cc-selectDity


#### 使用方法 

```使用方法
<!-- 省市区选择 show:是否显示  @sureSelectArea：确认事件 @hideShow：隐藏事件-->
<cc-selectDity :show="show" @sureSelectArea="onsetCity" @hideShow="onhideShow"></cc-selectDity>

```

#### HTML代码实现部分
```html
<template>
	<view>
		<view class="editaddress">
			<view class="content">
				<view class="row">
					<view class="nominal">收货人</view>
					<view class="input"><input placeholder="请输入收货人姓名" v-model="addressData.name" type="text"></input>
					</view>
				</view>
				<view class="row">
					<view class="nominal">电话号码</view>
					<view class="input"><input placeholder="请输入收货人电话号码" v-model="addressData.phone" type="number"
							maxlength="11"></input></view>
				</view>
				<view class="row">
					<view class="nominal">所在地区</view>
					<view class="input selectcity" @tap="openPicker">
						<input placeholder="请选择省市区" disabled type="text" v-model="addressData.address"></input>
						<image src="/static/images/home/right.png" class="rights"></image>
					</view>
				</view>
				<view class="row">
					<view class="nominal">详细地址</view>
					<view class="input"><textarea style="font-size: 28upx;" v-model="addressData.moreAddres"
							auto-height="true" placeholder="输入详细地址" v-if="show == false"></textarea></view>
				</view>
				<view class="row">
					<view class="nominal" style="color: #999;margin-top: 10upx;">设为默认地址</view>
					<view class="input switch">
						<switch :color="colors" style="transform:scale(0.8)" @change="switchChange"
							:checked="addressData.isdefult == 1"></switch>
					</view>
				</view>
			</view>
			<view class="save">
				<view class="btn" :style="'background:' + colors">保存地址</view>
			</view>

			<!-- 省市区选择 show:是否显示  @sureSelectArea：确认事件 @hideShow：隐藏事件-->
			<cc-selectDity :show="show" @sureSelectArea="onsetCity" @hideShow="onhideShow"></cc-selectDity>

		</view>

	</view>
</template>

<script>
	var app = getApp();

	export default {
		data() {
			return {
				colors: '',
				show: false,
				addressData: {
					name: '',
					phone: '',
					address: '',
					moreAddres: '',
					isdefult: 0
				},
				isShow: true
			};
		},
		methods: {

			openPicker() {
				console.log('执行打开地址选择器')
				this.show = true
			},

			onhideShow() {
				this.show = false
				console.log('执行了关闭地址选择器')
			},
			//选中省市区
			onsetCity(e) {
				let data = e.detail.target.dataset;
				let address = data.province + data.city + data.area;
				this.show = false
				this.addressData.address = address
			},
			switchChange(e) {
				this.setData({
					checked: e.detail.value
				});
			}

		}
	};
</script>
<style lang="scss" scoped>
	.save {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.save view {
		display: flex;
	}

	.save .btn {
		box-shadow: 0upx 5upx 10upx rgba(0, 0, 0, 0.4);
		width: 70%;
		height: 80upx;
		border-radius: 80upx;
		background-color: #f23a3a;
		color: #fff;
		justify-content: center;
		align-items: center;
		font-size: 30upx;
		margin-bottom: 60px;
	}

	.save .btn .icon {
		height: 80upx;
		color: #fff;
		font-size: 30upx;
		justify-content: center;
		align-items: center;
	}

	.content {
		display: flex;
		flex-wrap: wrap;
		margin-top: 40upx;
	}

	.content view {
		display: flex;
	}

	.content .row {
		width: 92%;
		margin: 0 4%;
		border-bottom: solid 1upx #eee;
	}

	.content .row .nominal {
		width: 30%;
		height: 80upx;
		font-size: 28upx;
		font-family: Droid Sans Fallback;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		align-items: center;
	}

	.content .row .input {
		width: 70%;
		padding: 20upx 0;
		align-items: center;
		font-size: 28upx;

	}

	.content .row .input input {
		font-size: 28upx;
		color: #333333;
	}

	.content .row .switch {
		justify-content: flex-end;
	}

	.content .row .input textarea {
		min-height: 40upx;
		line-height: 40upx;
	}

	.content .del_box {
		width: 100%;
		display: block;
		overflow: hidden;
		margin-right: 30upx;
	}

	.content .del {
		width: 240upx;
		height: 80upx;
		float: right;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #F23A3A;
		margin: 0 auto;
		margin-top: 50upx;
		border-radius: 38upx;
		background-color: rgba(255, 0, 0, 0.05);
		border-bottom: solid 1upx #eee;
	}

	.selectcity input {
		width: 90%;
	}

	.selectcity image {
		width: 40upx;
		height: 40upx;
		float: right;
	}
</style>
```
