const DiscoveryV1 = require('ibm-watson/discovery/v1');
const {IamAuthenticator} = require('ibm-watson/auth');
const config = require('config');

const discovery = new DiscoveryV1({
  version: config.get('watson.discovery.version'),
  authenticator: new IamAuthenticator({
    apikey: config.get('watson.discovery.apikey'),
  }),
  serviceUrl: config.get('watson.discovery.serviceUrl'),
});

const createQuery = (categoryLabel, searchStr) => {
  const texts = searchStr.split(' ').map((item) => `text:"${item}"`).join(',');
  return `enriched_text.categories.label::"${categoryLabel}",(${texts})`;
};

const runQuery = async (categoryLabel, searchStr) => {
  const query = createQuery(categoryLabel, searchStr);

  const queryParams = {
    environmentId: config.get('watson.discovery.environmentId'),
    collectionId: config.get('watson.discovery.collectionId'),
    highlight: true,
    query,
    _return: 'highlight',
  };

  console.log(`Running query - ${query}`);
  const queryResponse = await discovery.query(queryParams);

  if (queryResponse.result.results && queryResponse.result.results.length > 0) {
    return queryResponse.result.results[0].highlight.text[0]
        .replace(/<em>/g, '')
        .replace(/<\/em>/g, '');
  } else {
    return '該当する情報が見つかりませんでした。';
  }
};

const exec = async () => {
  try {
    const responseText = await runQuery('/health and fitness/disease', 'コロナ 症状');

    console.log(responseText);
  } catch (err) {
    console.log('error:', err);
  }
};

exec();
