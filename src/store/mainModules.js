import {
	storeResponse
} from '@Utils/module'
import { updateFileUrl } from '@/utils/apiConfig'


export default {
	actions: {
		// 账号密码登录
		async fetchLoginPost({ getters }, params) {

			const { loginPost } = getters.getHttps

			const result = await loginPost(params)

			return storeResponse(result)
		},
		// 修改密码
		async fetchUpdatePasswordPost({ getters }, params) {

			const { updatePasswordPost } = getters.getHttps

			const result = await updatePasswordPost(params)

			return storeResponse(result)
		},

		// 上传图片
		async fetchUploadImage({ getters }, params) {

			const { uploadImage } = getters.getHttps
			// console.log(updateFileUrl)
			const result = await uploadImage(params,{
				custom:{
					customApiUrl:updateFileUrl,
					isFile:true
				}
			})

			return storeResponse(result)
		},
	}

}