import BigNumber from "bignumber.js";

let lastNonce = 0;
let lastTimestamp = Date.now();

export function generateNonce() {
  const currentTimestamp = Date.now();
  if (currentTimestamp !== lastTimestamp) {
    lastNonce = 0;
    lastTimestamp = currentTimestamp;
  }
  return `${currentTimestamp}${lastNonce++}`;
}

export function stringToHex(str: string) {
  let encoder = new TextEncoder();
  let view = encoder.encode(str);
  return uint8ToHex(view);
}

function uint8ToHex(uint8arr: Uint8Array) {
  let hexStr = "";
  for (let i = 0; i < uint8arr.length; i++) {
    let hex = uint8arr[i].toString(16);
    hex = hex.length === 1 ? "0" + hex : hex;
    hexStr += hex;
  }
  return ("0x" + hexStr) as `0x${string}`;
}



export default function formatStringNumber(value: any, left = 6, right = -4) {
  if (!value) {
    return "";
  }

  if (!left) {
    left = 3;
  }

  if (!right) {
    right = -4;
  }

  if (value.length <= (left - right)) {
    return value;
  }

  return value.slice(0, left) + "..." + value.slice(right);
  // return value;
}

export const verifyInt = (value: any) => {
  if (value && value.toString() == "0") {
    value = "";
  }
  return value.replace(/[^\d]/g, "");
};

//Symbol must be 11 characters or fewer.
export const verifySymbol = (value: any) => {
  let text = value.replace(/\s+/g, "");
  return text.slice(0, 11);
};

export const verify = (value: any) => {
  let str = value;
  let len1 = str.substr(0, 1);
  let len2 = str.substr(1, 1);
  if (str.length > 1 && len1 == 0 && len2 != ".") {
    str = str.substr(1, 1);
  }
  if (len1 == ".") {
    str = "";
  }
  if (str.indexOf(".") != -1) {
    let str_ = str.substr(str.indexOf(".") + 1);
    if (str_.indexOf(".") != -1) {
      str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
    }
  }
  if (str.length > 1 && str.charAt(str.length - 1) == "-") {
    str = str.substr(0, str.length - 1);
  }
  str = str.replace(/[^\-^\d^\.]+/g, "");
  if (str.indexOf(".") != -1) {
    str = str.substring(0, str.indexOf(".") + 5);
  }
  return str;
};

export const convertNormalFix = (v: any, v2: any, v3: number) => {
  if (v) {
    return new BigNumber(v)
      .dividedBy(v2)
      .multipliedBy(100)
      .toFixed(v3)
      .toString() + "%";
  } else {
    return new BigNumber(0).toFixed(v3).toString() + "%";
  }
};

export const convertFix = (v: any, v2?: any, v3?: any) => {
  if (!v2) {
    v2 = 18
  }
  if (!v3) {
    v3 = 0
  }
  if (v) {
    return new BigNumber(v)
      .dividedBy(10 ** v2)
      .toFixed(v3)
      .toString();
  } else {
    return new BigNumber(0).toFixed(v3).toString();
  }
};

export const amountUi = (v: any, v2?: any, v3?: number) => {
  if (!v3) {
    v3 = 0
  }
  if (!v2) {
    v2 = 10 ** 18
  }
  if (v) {
    return new BigNumber(v)
      .dividedBy(v2)
      .toFixed(v3)
  } else {
    return new BigNumber(0).toFixed(v3).toString();
  }
};

export const multValue = (v: any, v2: any) => {
  if (v) {
    return new BigNumber(v)
      .multipliedBy(v2)
      .toString();
  } else {
    return new BigNumber(0).toString();
  }
};

export const mult = (v: any, v2: any, v3: number) => {
  if (v) {
    return new BigNumber(v)
      .multipliedBy(v2)
      .toFixed(v3)
      .toString();
  } else {
    return new BigNumber(0).toFixed(v3).toString();
  }
};

export const minusFix = (v: any, v2: any, v3?: number) => {
  if (!v3) {
    v3 = 0
  }
  if (v) {
    return new BigNumber(v).minus(v2).toFixed(v3).toString();
  } else {
    return new BigNumber(0).toFixed(v3).toString();
  }
};

export const showErr = (err: any) => {
  let message = JSON.stringify(err)
  if (err && err.details) {
    message = err.details;
  } else if (err && err.message) {
    message = err.message;
  } else if (typeof err == 'string') {
    message = err;
  } else {
    try {
      message = JSON.parse(`{${err.toString().split('{')[1]}`).message;
    } catch (e) {
      message = "Execution Failed"
    }
  }

  if (message.indexOf(".") != -1) {
    message = message.split(".")[0] + "."
  }
  console.log(message.indexOf("."));

  if (message.toString().length > 220) {
    message = message.substring(0, 220) + "...";
  }
}

export const formatDateLocal = (millionSeconds: number) => {
  let date = new Date(millionSeconds);
  let monthArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let year = date.getFullYear();
  let month = monthArr[date.getMonth()];
  let dDate = date.getDate();
  let hours: any = date.getHours();
  let minute: any = date.getMinutes();
  let second: any = date.getSeconds();

  if (hours < 10) {
    hours = "0" + hours;
  }

  if (minute < 10) {
    minute = "0" + minute;
  }

  if (second < 10) {
    second = "0" + second;
  }

  return (
    month +
    " " +
    dDate +
    ", " +
    year +
    " " +
    hours +
    ":" +
    minute +
    ":" +
    second +
    ""
  );
};

export const formatDateUTC = (millionSeconds: number) => {
  let date = new Date(millionSeconds);
  let monthArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let year = date.getUTCFullYear();
  let month = monthArr[date.getUTCMonth()];
  let dDate = date.getUTCDate();
  let hours: any = date.getUTCHours();
  let minute: any = date.getUTCMinutes();
  let second: any = date.getUTCSeconds();

  if (hours < 10) {
    hours = "0" + hours;
  }

  if (minute < 10) {
    minute = "0" + minute;
  }

  if (second < 10) {
    second = "0" + second;
  }

  return (
    month +
    " " +
    dDate +
    ", " +
    year +
    " " +
    hours +
    ":" +
    minute +
    " UTC"
  );
};


export const commonFormatDateLocal = (millionSeconds: number) => {
  let date = new Date(millionSeconds);
  let monthArr = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  let year = date.getFullYear();
  let month = monthArr[date.getMonth()];
  let dDate = date.getDate();
  let hours: any = date.getHours();
  let minute: any = date.getMinutes();
  let second: any = date.getSeconds();

  if (hours < 10) {
    hours = "0" + hours;
  }

  if (minute < 10) {
    minute = "0" + minute;
  }

  if (second < 10) {
    second = "0" + second;
  }

  return (
    year +
    "-" +
    month +
    "-" +
    dDate +
    " " +
    hours +
    ":" +
    minute +
    ":" +
    second +
    ""
  );
};