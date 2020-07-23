# metabase-migration

Script for update and duplicating question in Metabase

## How to use
Clone this repository and `npm install`

### Update

`node app.js update —origin=[question_id] —dest=[question_id] —databaseId=[database_id]`

### Duplicate

`node app.js duplicate —questionId=[question_id] --collectionId=[collection_id] —name=[name] —databaseId=[database_id]`

`--name` is optional, if it's not provided it will use the same question name.
