// 中英文长度计算
function strLen(str) {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f))    {
            len++;
        } else {
            len+=2;
        }
    }
    return len;
}

// 正则类库
function regular(type, value) {
    let reg = ''
    switch(type) {
        case 'email' :
            reg = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            break;
        case 'phone' :
            reg = /^1(?:3|4|5|6|7|8|9)\d{9}$/;
            break;
        case 'password' :
            reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![!@#$%^&*()_.]+$)[\da-zA-Z!@#$%^&*()_.]{6,20}$/;
            break;
    }

    return reg.test(value)
}

export { strLen, regular }