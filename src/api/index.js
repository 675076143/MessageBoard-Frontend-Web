import ajax from './ajax'
const BASE_URL = 'http://114.55.36.231:8070'

export const reqMessages = (messageDto,that)=>{
    return ajax(BASE_URL+'/MessageBoard/getMessage.php',messageDto,'GET',that)
}
export const reqSendMessage = (sendMessageDto,that)=>{
    console.log("发送了请求：", sendMessageDto);
    return ajax(BASE_URL+'/MessageBoard/message.php',sendMessageDto,'POST',that)
}

export const reqLogin = (loginDto,that)=>{
    return ajax(BASE_URL+'/MessageBoard/login.php',loginDto,'POST',that)
}
export const reqReply = (replyDto,that)=>{
    return ajax(BASE_URL+'/MessageBoard/reply.php',replyDto,'POST',that)
}
export const reqDeleteMessage = (messageId,that)=>{
    return ajax(BASE_URL+'/MessageBoard/deleteMessage.php',messageId,'POST',that)
}
export const reqEditMessage = (messageId,comment,that)=>{
    return ajax(BASE_URL+'/MessageBoard/editMessage.php',{messageId,comment},'POST',that)
}