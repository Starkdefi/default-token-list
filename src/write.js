import buildList from './buildList.js';

buildList().then(data => console.log(JSON.stringify(data, null, 2)));