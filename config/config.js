const env = {
	// 是否开启debug
    debug: true,

	// API 地址
    apiBaseUrl: process.env.NODE_ENV === 'development' ? process.env.VUE_APP_API_URL_DEV : process.env.VUE_APP_API_URL_BUILD,

	// token存储键名
	tokenKey: 'FMOCK-TOKEN-KEY',

	// 绑定状态
	bindingKey: 'FMOCK-BINDING-KEY',

	// 前端存储过期时间 （单位天）
	tokenExpire: 7
}

export default env