const yargs = require('yargs')
const metabase = require('./src/metabase.js')
const metabase_async_await = require('./src/metabase-async-await.js')

yargs.command({
    command: 'update',
    describe: 'Update question',
    builder: {
        originId: {
            describe: 'Origin question',
            demandOption: true,
            type: 'number'
        },
        destId: {
            describe: 'Destination question',
            demandOption: true,
            type: 'number'
        },
        databaseId: {
            describe: 'Database ID for destination question',
            demandOption: true,
            type: 'number'
        }
    },
    async handler(argv) {
        try {
            const response = await metabase_async_await.update(argv.originId, argv.destId, argv.databaseId)
            console.log("\n--------Question Updated!-------")
            console.log("Response status code", response.status, response.statusText)
            console.log("ID:", response.data.id)
            console.log("Name:", response.data.name)
            console.log("Collection:", response.data.collection.name)
            console.log("Updated At:", response.data.updated_at)
            console.log("Database ID:", response.data.dataset_query.database)
        } catch (error) {
            console.log("\nError!", error.response.status, error.response.statusText);
            console.log(error.response.data);
        }   
    }
})

yargs.command({
    command: 'duplicate',
    describe: 'Duplicate question',
    builder: {
        questionId: {
            describe: 'Question that will be duplicated',
            demandOption: true,
            type: 'number'
        },
        name: {
            describe: 'New question name',
            demandOption: false,
            type: 'string'
        },
        collectionId: {
            describe: 'Collection of new question',
            demandOption: true,
            type: 'number'
        },
        databaseId: {
            describe: 'Database ID for new question',
            demandOption: true,
            type: 'number'
        }
    },
    async handler(argv) {
        try {
            const response = await metabase_async_await.duplicate(argv.questionId, argv.collectionId, argv.name, argv.databaseId)
            console.log("\n--------New Question Created!-------")
            console.log("Response status code", response.status, response.statusText)
            console.log("ID:", response.data.id)
            console.log("Name:", response.data.name)
            console.log("Collection:", response.data.collection.name)
            console.log("Updated At:", response.data.updated_at)
            console.log("Database ID:", response.data.dataset_query.database)
        } catch (error) {
            if (error.response) {
                console.log("\nError!", error.response.status, error.response.statusText);
                console.log(error.response.data);
            } else{
                console.log(error);
            }
            
        }   
    }
})

yargs.command({
    command: 'duplicateAcross',
    describe: 'Duplicate question across environments',
    builder: {
        questionId: {
            describe: 'Question that will be duplicated on destination',
            demandOption: true,
            type: 'number'
        },
        name: {
            describe: 'New question name',
            demandOption: false,
            type: 'string'
        },
        collectionId: {
            describe: 'Destination collection of new question',
            demandOption: true,
            type: 'number'
        },
        databaseId: {
            describe: 'Destination Database ID for new question',
            demandOption: true,
            type: 'number'
        }
    },
    async handler(argv) {
        try {
            const response = await metabase_async_await.duplicateAcross(argv.questionId, argv.collectionId, argv.name, argv.databaseId)
            console.log("\n--------New Question Created!-------")
            console.log("Response status code", response.status, response.statusText)
            console.log("ID:", response.data.id)
            console.log("Name:", response.data.name)
            console.log("Collection:", response.data.collection.name)
            console.log("Updated At:", response.data.updated_at)
            console.log("Database ID:", response.data.dataset_query.database)
        } catch (error) {
            if (error.response) {
                console.log("\nError!", error.response.status, error.response.statusText);
                console.log(error.response.data);
            } else{
                console.log(error);
            }
            
        }   
    }
})

yargs.command({
    command: 'update-deprecated',
    describe: 'Update question',
    builder: {
        origin: {
            describe: 'Origin question',
            demandOption: true,
            type: 'number'
        },
        dest: {
            describe: 'Destination question',
            demandOption: true,
            type: 'number'
        },
        databaseId: {
            describe: 'Database ID for destination question',
            demandOption: true,
            type: 'number'
        }
    },
    handler(argv) {
        metabase.update(argv.origin, argv.dest, argv.databaseId, (error, response)=>{
            if (error){
                console.log(error)
                return
            }

            if (response.body.errors){
                console.log(response.body.errors)
                return
            }

            console.log("Response status code", response.statusCode)
            console.log("Question updated!")
            console.log("ID:", response.body.id)
            console.log("Name:", response.body.name)
            console.log("Collection:", response.body.collection.name)
            console.log("Updated At:", response.body.updated_at)
            console.log("Database ID:", response.body.dataset_query.database)
        })
    }
})

yargs.command({
    command: 'duplicate-deprecated',
    describe: 'Duplicate question',
    builder: {
        questionId: {
            describe: 'Question that will be duplicated',
            demandOption: true,
            type: 'number'
        },
        name: {
            describe: 'New question name',
            demandOption: false,
            type: 'string'
        },
        collectionId: {
            describe: 'Collection of new question',
            demandOption: true,
            type: 'number'
        },
        databaseId: {
            describe: 'Database ID for new question',
            demandOption: true,
            type: 'number'
        }
    },
    handler(argv) {
        metabase.duplicate(argv.questionId, argv.collectionId, argv.name, argv.databaseId, (error, response) => {
            if (error){
                console.log(error)
                return
            }

            if (response.body.errors){
                console.log(response.body.errors)
                return
            }

            console.log("Response status code:", response.statusCode)
            console.log("New question created!")
            console.log("ID:", response.body.id)
            console.log("Name:", response.body.name)
            console.log("Collection:", response.body.collection.name)
            console.log("Created At:", response.body.created_at)
            console.log("Database ID:", response.body.dataset_query.database)
        })
    }
})



yargs.parse()