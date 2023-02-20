![version](https://img.shields.io/github/v/tag/itmi-id/metabase-migration?label=latest%20version)

# Metabase Migration
Script to update and duplicate Questions in Metabase using Metabase REST API.

Here is a blog post on how we approach managing multiple environments in Embedded Metabase https://medium.com/itmi-engineering/managing-multiple-environments-with-embedded-metabase-87b074ea9aad

## How to use
Clone this repository and `npm install`

Create a .env file in the root folder that contains

```sh
METABASE_BASE_URL=xxx
METABASE_USERNAME=xxx
METABASE_PASSWORD=xxx

# Optionaly, when performing actions on the source Metabase instance above to a destination/second Metabase instance, add the following
DESTINATION_METABASE_BASE_URL=xxx
DESTINATION_METABASE_USERNAME=xxx
DESTINATION_METABASE_PASSWORD=xxx
```

### Update Question

`node app.js update —-originId=[question_id] --destId=[question_id] —-databaseId=[database_id]`

### Duplicate Question

`node app.js duplicate —-questionId=[question_id] --collectionId=[collection_id] -—name=[name] -—databaseId=[database_id]`

`--name` is optional. If it's not provided, it will use the same question name.

### Duplicate Question on Destination Instance

`node app.js duplicateAcross —-questionId=[question_id] --collectionId=[collection_id] -—name=[name] -—databaseId=[database_id]`

`--name` is optional. If it's not provided, it will use the same question name.

## Work in Progress

- Duplicating or updating questions between different Metabase instances
- Duplicating or updating Dashboard


## Testing with Custom Metabase image just past initial setup

** Note: this container should be used for testing purposes only!!! **

Use the image already generated using the steps below (assumed to be used in the `docker-compose.yaml` file): 

```sh
docker-compose up
```

You should have a source `localhost:3000` and destination `localhost:3001` container to execute commands against. Add the following test `.env` file to your project to use them:

```sh
# source instance
METABASE_BASE_URL=http://localhost:3000/api
METABASE_USERNAME=test@test.com
METABASE_PASSWORD=test1234

# destination instance
DESTINATION_METABASE_BASE_URL=http://localhost:3001/api
DESTINATION_METABASE_USERNAME=test@test.com
DESTINATION_METABASE_PASSWORD=test1234
```

Sanity check by running the following: `node app.js duplicateAcross --questionId=6 --collectionId=2 --name="testing coordinates copy across instances" --databaseId=1`

If successful, you should be able to view the question @ [localhost:3001/collection/2](http://localhost:3001/collection/2)

### Steps to generate a post-install Metabase image

The following are the steps followed to generate the image used in the `docker-compose.yaml`:

1. From cli, run `docker run -it -p 3000:3000 --name metabase metabase/metabase[:TAG]`
1. Once the container is launched, visit [localhost:3000/setup](http://localhost:3000/setup)
1. Click `Let's get started`
1. Select `English` as your preferred language
1. Enter the following:
    * First name: `test`
    * Last name: `test`
    * Email: `test@test.com`
    * Create a password: `test1234`
    * Your company or team name: `test`
1. Click `Next`
1. Select `I'll add my data later`
1. Click `Next`
1. Click `Take me to Metabase`
1. Under the `TRY THESE X-RAYS BASED ON YOUR DATA.` section, click `A look at your People table`
1. Click `Save this`
1. Verify that you have a new collection (id 2 in URL) called `Automatically Generated Dashboards`
1. Verify that you have a new collection (id 3 in URL) called `A look at your People table`
1. Back on the CLI, run the following to generate a snapshot of the image: `docker commit metabase mafs/metabase-custom[:TAG]`
1. Push your image to DockerHub: `docker push mafs/metabase-custom[:TAG]`
1. Launch two instances (a source and destination instance) to run tests against containers: `docker-compose up`
