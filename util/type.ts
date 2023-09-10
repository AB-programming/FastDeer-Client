export interface Response<T> {
	code : string,
	msg : string,
	data : T
}

export interface User {
	id : String,
	nickName : String,
	avatarUrl : String,
	gender : String,
	place : String,
	birth : String,
	school : String,
	major : String,
	qualification : String,
	graduationDate : String,
	role : String
}

export interface UserInfo {
	userId : String,
	name : String,
	avatar : String,
	role : String, // 身份
	socialInfo : {
		likes : Number,
		fans : Number,
		following : Number
	},
	baseInfo : {
		gender : String,
		address : String
	},
	schoolInfo : {
		schoolName : String,
		degree : String,
		major : String,
		graduation : String // 毕业时间
	},
}

export interface Reply {
	replyId : String,
	name : String,
	date : String,
	contentText : String,
	url : String, //回复者头像
	likeNum : Number, // 点赞数量
	isLike : Boolean,
	reply : {
		name : String,
		contentStr : String
	}
}

export interface Comment {
	commentId : String,
	name : String,
	date : String,
	contentText : String,
	url : String, // 评论者头像
	likeNum : Number, // 点赞数量
	isLike : Boolean,
	replyList : Array<Reply>
}

export type SocialStats = {
	browserCount : Number, // 浏览量
	likeCount : Number, // 点赞量
	bookmarkCount : Number, // 收藏量
	isLike : Boolean, // 点赞
	isBookmark : Boolean, // 收藏
}

export interface Post {
	postId : String,
	date : String, // 帖子日期
	content : {
		urls : Array<String>, // 图片地址
		text : String,
		title : String
	},
	socialStats : SocialStats
	userInfo : UserInfo,
	commentCount : Number
}

export interface MessageView {
	senderId : string,
	senderName : string,
	senderAvatar : string,
	content : string,
	isMe : boolean
}

export interface AcademicDisplay {
	academicId : string,
	userId : string,
	name : string,
	avatar : string,
	title : string,
	cover : string,
	date : string
}