const express = require('express');

const DiscoveryV2 = require('ibm-watson/discovery/v2');
const {IamAuthenticator} = require('ibm-watson/auth');
const config = require('config');

// eslint-disable-next-line new-cap
const router = express.Router();


// 接続情報
const discovery = new DiscoveryV2({
  version: config.get('watson.discovery.version'),
  authenticator: new IamAuthenticator({
    apikey: config.get('watson.discovery.apikey'),
  }),
  serviceUrl: config.get('watson.discovery.serviceUrl'),
});

//const createQuery = (categoryLabel, searchStr) => {
  const createQuery = (searchStr) => {
  const texts = searchStr.split(' ').map((item) => `text:"${item}"`).join(',');
  //return `enriched_text.categories.label::"${categoryLabel}",(${texts})`;
  return `${texts}`;
};

const runQuery = async (categoryLabel, searchStr) => {
  const query = createQuery(categoryLabel, searchStr);

  const queryParams = {
    projectId: config.get('watson.discovery.projectId'),
    query,
    highlight: true
  };

  console.log(`Running query - ${query}`);
  const queryResponse = await discovery.query(queryParams);

  const results = queryResponse.result.results;
  
  console.log(JSON.stringify(results, null, 2));
  if (queryResponse.result.results && queryResponse.result.results.length > 0) {
    return queryResponse.result.results[0].extracted_metadata.filename
        .replace(/<em>/g, '')
        .replace(/<\/em>/g, '');

    // const textArray = queryResponse.result.results[0].text
    // const filtered = textArray.map((text) => {
    //   return text.replace(/<em>/g, '').replace(/<\/em>/g, '');
    // });
    // return filtered;
  } else {
    return '該当する情報が見つかりませんでした。';
  }
};


router.post('/search', async (req, res) => {
  try {
    if (!req.body.searchText) {
      res.status(400).send('Missing search text.');
      return;
    }

    //const responseText = await runQuery('/health and fitness/disease', req.body.searchText);
    const responseText = await runQuery(req.body.searchText);
    res.json({
      responseText,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to call watson service');
  }
});

module.exports = router;
