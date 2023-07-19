'use strict';
exports.main = async (event, context) => {
    //event为客户端上传的参数
    console.log('event : ', event)
    const res = await uniCloud.getPhoneNumber({
      provider: 'univerify',
      appid: '__UNI__ABC6F0F', // 替换成自己开通一键登录的应用的DCloud appid
      apiKey: 'bdda04bee2e53249e268cb8992619b62', // 在开发者中心开通服务并获取apiKey
      apiSecret: 'e712d96b074003f12b5b2b28453cd497', // 在开发者中心开通服务并获取apiSecret
      access_token: event.access_token,
      openid: event.openid
    })
    
    //返回数据给客户端,是一个promise对象
    return res
};