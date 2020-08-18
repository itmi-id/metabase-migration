# Metabase Migration
Script to update and duplicate Question in Metabase using Metabase REST API.

## How to use
Clone this repository and `npm install`

Create .env file in root folder that contains

```
METABASE_BASE_URL=xxx
METABASE_USERNAME=xxx
METABASE_PASSWORD
```

### Update Question

`node app.js update —-origin=[question_id] --dest=[question_id] —-databaseId=[database_id]`

### Duplicate Question

`node app.js duplicate —-questionId=[question_id] --collectionId=[collection_id] -—name=[name] -—databaseId=[database_id]`

`--name` is optional, if it's not provided it will use the same question name.


## Work in Progress

- Duplicating or updating question between different metabase instance
- Duplicating or updating Dashboard
