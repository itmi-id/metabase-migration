const yargs = require('yargs')
const metabase = require('./src/metabase.js')


yargs.command({
    command: 'update',
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