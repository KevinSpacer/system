
// 验证手机号
export const testPhone = (value) => {
	const reg = /^1[3456789]\d{9}$/;
	return reg.test(value);
};

// 验证密码
export const testPwd = (value) => {
	const reg = /^[0-9a-zA-Z]{6,20}$/;
	return reg.test(value);
};

// 验证正整数
export const testPositiveInteger = (value) => {
	if (!value) {
		return false
	}
	const reg = /^[+]{0,1}(\d+)$/;
	return reg.test(value);
};

// 验证 正数含小数点
export const testPositiveNumberFlot = (value) => {
	if (!value) {
		return false
	}
	const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
	return reg.test(value);
}

// 校验网页地址正确性
export const testServiceUrl = (value) => {
	if (!value) {
		return false
	}
	const reg = /^http(s)?:\/\/((www\.)?[a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9]{0,62})|(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d))?(?:\:([0-9]|[1-9])\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])?\/+[a-zA-Z0-9]/
	return reg.test(value);
}
