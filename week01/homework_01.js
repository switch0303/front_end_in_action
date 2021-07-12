// 进制转换，将10进制浮点数转换成64进制

const SIGNS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-+".split("");
const SIGN_TO_INDEX = {};
SIGNS.forEach((sign, index) => SIGN_TO_INDEX[sign] = index);

function to64(int) {
    let result = [];
    let div = int;
    while (div > 63) {
      result.push(SIGNS[div % 64]);
      div = Math.floor(div / 64);
    }
    result.push(SIGNS[div]);
    return result.reverse().join("");
}

function to10(str) {
    let result = 0;
    let index = 0;
    for (let i = str.length - 1; i >= 0; i -= 1) {
        result += SIGN_TO_INDEX[str[i]] * Math.pow(64, index);
        index += 1;
    }
    return result;
}

function encodeTo64(double) {
    const arr = String(double).split(".");
    let dotReverseIndex = 0; // 小数点从后往前的索引
    if (arr[1]) {
        let decimalLen = arr[1].length;
        dotReverseIndex = decimalLen;
        double = double * Math.pow(10, decimalLen);
    }
    return to64(dotReverseIndex) + to64(double); // 字符串第一位用来存储浮点数中小数点的位置，最大支持小数点后63位数
}

function decodeFrom64(str) {
    const dotReverseIndex = parseInt(str.slice(0, 1));
    const int = to10(str.slice(1));
    if (dotReverseIndex === 0) {
        return int;
    } else {
        const intStr = String(int);
        return parseFloat(intStr.slice(0, -dotReverseIndex) + "." + intStr.slice(-dotReverseIndex));
    }
}

console.log(encodeTo64(12.8)); // "120"
console.log(decodeFrom64("120")); // 12.8
console.log(encodeTo64(123456.78)); // "2L65e"
console.log(decodeFrom64("2L65e")); // 123456.78
console.log(encodeTo64(987654321)); // "0WTCyN"
console.log(decodeFrom64("0WTCyN")); // 987654321
