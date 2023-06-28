const DiscoveryV2 = require('ibm-watson/discovery/v2');
const {IamAuthenticator} = require('ibm-watson/auth');
const config = require('config');

const discovery = new DiscoveryV2({
  version: config.get('watson.discovery.version'),
  authenticator: new IamAuthenticator({
    apikey: config.get('watson.discovery.apikey'),
  }),
  serviceUrl: config.get('watson.discovery.serviceUrl'),
});

// const createQuery = (categoryLabel, searchStr) => {
//   const texts = searchStr.split(' ').map((item) => `text:"${item}"`).join(',');
//   return `enriched_text.categories.label::"${categoryLabel}",(${texts})`;
// };

const runQuery = async (searchStr) => {
  // const query = createQuery(categoryLabel, searchStr);

  const queryParams = {
    projectId: config.get('watson.discovery.projectId'),
    collectionIds: [config.get('watson.discovery.collectionId')],
    query: searchStr,
  };

  console.log(`Running query - ${searchStr}`);
  const queryResponse = await discovery.query(queryParams);

  if (queryResponse.result.results && queryResponse.result.results.length > 0) {
    return queryResponse.result.results.map((result, index) => {
      return {id: index + 1, name: result.extracted_metadata.title};
    });
  } else {
    return [];
  }
};

const exec = async () => {
  try {
    const responseText = await runQuery('/health and fitness/disease', 'コロナ');

    console.log(responseText);
  } catch (err) {
    console.log('error:', err);
  }
};

exec();
