const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const duringTime = () => {
  let date = new Date();
  const hour = date.getHours()

  return formatNumber(hour);
}

const countDown = (stamp) => {
  let date = new Date(stamp);
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return minute + "分" + second + "秒";
}

const nearTime = (oneSec) => {
  let date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  // const hourN = hour + 1;

  if (new Date().getMinutes() >= 40) {
    return "0秒"
  }

  const stamp = new Date(`${year}/${month}/${day} ${hour}:40:00`).getTime() - new Date().getTime();

  return countDown(stamp)
}


module.exports = {
  formatTime: formatTime,
  duringTime: duringTime,
  nearTime: nearTime
}
