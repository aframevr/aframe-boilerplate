const axios = require('axios');
const fs = require('fs');
const baseURL = 'http://174.129.13.43:9080';

function getAssetList(type) {
  axios({ baseURL, url: `/smapi/data/getassetlist.jsp?type=${type}` })
  .then((response) => {
    const { data } = response;
    const dir = 'smapi/lists';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(`${dir}/${type}.json`, JSON.stringify(data));
  })
}

function getAssetData(id) {
  axios({ baseURL, url: `/smapi/data/gettimecodeddata.jsp?id=${id}` })
  .then((response) => {
    const { data } = response;
    const dir = 'smapi/assetdata'
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(`${dir}/${id}.json`, JSON.stringify(data));
  })
}

// function downloadMP4(path, id) {
//   axios({ baseURL: 'http://174.129.13.43', url: `${path}/${id}.mp4` })
//   .then((response) => {
//     const { data } = response;
//     const dir = 'smapi/videos'
//     if (!fs.existsSync(dir)){
//       fs.mkdirSync(dir);
//     }
//     fs.writeFileSync(`${dir}/${id}.json`, JSON.stringify(data));
//   })
// }

// get lists
// getAssetList('news') // news lists
// getAssetList('ce') // cable tv lists

// get time encoded data
// getAssetData('1819_20171003190000A');
// getAssetData('YSHR01022H')
// getAssetData('rhonyc_801')

// DOWNLOAD MP4 - not working yet
// downloadMP4('/media/sprout', 'YSHR01022H')
// downloadMP4('/media/rhonyc', 'rhonyc_801')
