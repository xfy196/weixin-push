const fetch = require("node-fetch");
const FormData = require("form-data");
// server酱推送KEY
const SCKEY = process.env.SCKEY;
// coolpush酷推KEY
const SKEY = process.env.SKEY;

async function get_iciba_everyday() {
  const icbapi = `http://open.iciba.com/dsapi/`;
  const eed = await fetch(icbapi);
  const bee = await eed.json();
  const english = bee.content;
  const zh_CN = bee.note;
  const str = `[奇怪的知识]\n ${english}\n${zh_CN}`;
  return str;
}

async function ServerPush(info) {
  const api = `https://sc.ftqq.com/SCT167595Tso7cDhKnFWsm31pcgCBSnMBM.send`;
  const title = "天气推送";
  const content = info.replace("\n", "\n\n");
  const formdata = new FormData();
  formdata.append("title", title);
  formdata.append("desp", content);
  console.log(content);
  await fetch(api, {
    method: "POST",
    body: formdata,
  });
}
async function CoolPush(info) {
  const api = `https://push.xuthus.cc/send/${SKEY}'`;
  await fetch(api, {
    method: "POST",
    body: info,
  });
}
async function main() {
  try {
    const api = `http://t.weather.itboy.net/api/weather/city/`;
    // 天长城市编码
    const city_code = "101221107";
    const tqurl = api + city_code;
    const response = await fetch(tqurl);
    const d = await response.json();
    if (d.status === 200) {
      // 省
      const parent = d.cityInfo.parent;
      //   市
      const city = d.cityInfo.city;
      //   更新时间
      const update_time = d.time;
      //   日期
      const date = d.data.forecast[0].ymd;
      //   星期
      const week = d.data.forecast[0].week;
      //   天气
      const weather_type = d.data.forecast[0].type;
      //   最高温度
      const wendu_hight = d.data.forecast[0].high;
      //   最低温度
      const wendu_low = d.data.forecast[0].low;
      //   湿度
      const shidu = d.data.shidu;
      //   pm2.5
      const pm25 = d.data.pm25;
      //   pm10
      const pm10 = d.data.pm10;
      //   天气质量
      const quality = d.data.quality;
      //   风向
      const fx = d.data.forecast[0].fx;
      //   风力
      const fl = d.data.forecast[0].fl;
      //   感冒指数
      const ganmao = d.data.ganmao;
      // 温馨提示
      const tips = d.data.forecast[0].notice;
      //   天气提示内容
      const tdwt = `[今日份天气] \n 城市：${parent} + ${city} \n日期：${date} \n星期：${week}\n天气：${weather_type}\n温度：${wendu_hight} / ${wendu_low}\n湿度：${shidu}\nPM25：${pm25}\nPM10：${pm10}\n空气质量：${quality}\n风力风向：${fx}${fl}\n感冒指数：${ganmao}\n温馨提示：${tips}\n更新时间：${update_time}\n-----------------------------------------\n${await get_iciba_everyday()}`;
      ServerPush(tdwt);
      CoolPush(tdwt);
    }
  } catch (error) {
    const err = `[出现错误]\n 今日天气推送错误，请检查服务或者网络状态`;
    console.log(err);
    console.log(error);
  }
}
main();
