const axios = require('axios')

require('dotenv').config()

const baseUrl = process.env.METABASE_BASE_URL
const username = process.env.METABASE_USERNAME
const password = process.env.METABASE_PASSWORD

const {
  DESTINATION_METABASE_BASE_URL,
  DESTINATION_METABASE_USERNAME,
  DESTINATION_METABASE_PASSWORD
} = process.env;

async function update(originQuestionId, destinationQuestionId, destinationDatabaseId) {
  console.log("Authenticating",username);
  const axiosConfig = await auth();
  console.log("Successfully authenticated with token", axiosConfig.headers);

  console.log("Retrieving question id", originQuestionId);
  const {visualization_settings, description, enable_embedding,
    result_metadata, dataset_query, display, embedding_params, } = await getQuestion(originQuestionId, axiosConfig);
    
  dataset_query.database = destinationDatabaseId;
  const body = {
          visualization_settings,
          description,
          result_metadata,
          dataset_query,
          display,
          enable_embedding,
          embedding_params
  };

  console.log("\nUpdating question id", destinationQuestionId);
  console.log(body)
  const url = baseUrl + "/card/" + destinationQuestionId;

  const response = await axios.put(url, body, axiosConfig);
  return response;
}

async function duplicate(questionId, collectionId, questionName, databaseId) {
  console.log("Authenticating",username);
  const axiosConfig = await auth();
  console.log("Successfully authenticated with token", axiosConfig.headers);

  console.log("Retrieving question id", questionId);
  const {visualization_settings, description, enable_embedding, collection_position,
     result_metadata, dataset_query, display, embedding_params, name:oldName } = await getQuestion(questionId, axiosConfig);
  dataset_query.database = databaseId;

  var name = questionName;
  if (!name) {
      name = oldName;
  }

  const body = {
    visualization_settings,
    description,
    collection_id: collectionId,
    collection_position,
    result_metadata,
    dataset_query,
    name,
    display,
    enable_embedding,
    embedding_params
  };
  console.log("\nCreating new question with payload...");
  console.log(body);
  const url = baseUrl + "/card/";

  const response = await axios.post(url, body, axiosConfig);
  return response;
}

async function duplicateAcross(questionId, collectionId, questionName, databaseId) {
  console.log("Authenticating",username);
  const axiosConfigSource = await auth();
  console.log("Successfully authenticated to source with token", axiosConfigSource.headers);

  console.log("Authenticating",DESTINATION_METABASE_USERNAME);
  const axiosConfigDestination = await destinationAuth();
  console.log("Successfully authenticated to destination with token", axiosConfigDestination.headers);

  console.log("From source retrieving question id", questionId);
  const {visualization_settings, description, enable_embedding, collection_position,
     result_metadata, dataset_query, display, embedding_params, name:oldName } = await getQuestion(questionId, axiosConfigSource);
  dataset_query.database = databaseId;

  const name = questionName ? questionName : oldName;

  const body = {
    visualization_settings,
    description: description ? description : null,
    collection_id: collectionId,
    collection_position,
    result_metadata,
    dataset_query,
    name,
    display,
    enable_embedding,
    embedding_params
  };
  console.log("\nCreating new question on destination with payload...");
  console.log(body);
  const url = DESTINATION_METABASE_BASE_URL + "/card/";

  const response = await axios.post(url, body, axiosConfigDestination);
  return response;
}

async function destinationAuth() {
  try {
      const authResponse = await axios({
          method: 'post',
          url: DESTINATION_METABASE_BASE_URL+ "/session",
          data: {
              username: DESTINATION_METABASE_USERNAME,
              password: DESTINATION_METABASE_PASSWORD
          }
      });
      const token = authResponse.data.id;
      const axiosConfig = {
          headers: {
              "X-Metabase-Session": token
          }
      };
      
      return axiosConfig;
  } catch (error) {
      console.log("error", error.response.status);
      return
  }
}

async function auth() {
  try {
      const authResponse = await axios({
          method: 'post',
          url: baseUrl+ "/session",
          data: {
              username: username,
              password: password
          }
      });
      const token = authResponse.data.id;
      const axiosConfig = {
          headers: {
              "X-Metabase-Session": token
          }
      };
      
      return axiosConfig;
  } catch (error) {
      console.log("error", error.response.status);
      return
  }
}

async function getQuestion(id, axiosConfig) {
  try {
      const url = baseUrl + "/card/" + id;
      const questionResponse = await axios.get(url, axiosConfig);
      return questionResponse.data;
  } catch (error) {
      console.log("Error retrieving question", error.response.status);
  }
}


module.exports = {
  update, duplicate, duplicateAcross
}