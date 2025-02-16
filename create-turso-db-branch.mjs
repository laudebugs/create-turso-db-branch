import { createClient } from '@tursodatabase/api'
import { getInput, setOutput, setFailed, setSecret, getBooleanInput, warning, error, notice } from '@actions/core'

const org = getInput('org')
const token = getInput('api-token')
const dbBranchName = getInput('branch-name')
const seedDbName = getInput('seed-database-name')
const group = getInput('group')
const overWriteIfExists = getBooleanInput('overwrite-if-exists')

/* Options to create a db auth token */
const createAuthToken = getBooleanInput('create-auth-token')
const authTokenAuthorization = getInput('auth-token-authorization')
const authTokenExpiration = getInput('auth-token-expiration')

async function createDatabaseBranch() {
    const turso = createClient({
        org,
        token,
    })

    if(!turso) {
        setFailed('Unable to create client. Please verify that your org and token inputs are correct.')
    }

    const existingdb = await (await turso.databases.list()).find((db) => db.name === dbBranchName)

    /**
     * If the database already exists, check if the overwrite-if-exists option is set to true
     * If it is, delete the existing database
     * If it is not, log an error and exit the process
     */
    if (existingdb) {
        warning('Database already exists')
        if (overWriteIfExists) {
            notice('Overwrite-if-exists is set to true. Deleting existing database')
            await turso.databases.delete(dbBranchName)
        } else {
            error('Database already exists and overwrite-if-exists is set to false')
            setFailed('Database already exists and overwrite-if-exists is set to false')
        }
    }

    const { database, errorInCreation } = await turso.databases
        .create(dbBranchName, {
            group,
            seed: {
                type: 'database',
                name: seedDbName,
            },
        })
        .then((database) => ({ database, errorInCreation: null }))
        .catch((e) => ({ database: null, errorInCreation: e }))

    if (!database || errorInCreation) {
        setFailed(`Unable to create database, ${errorInCreation.message}`)
    }

    /** Pass the database host name to the output */
    setSecret(database.hostname)
    setOutput('db_branch_libsql_url', `libsql://${database.hostname}`)
    setOutput('db_branch_http_url', `https://${database.hostname}`)
    setOutput('db_branch_hostname', database.hostname)

    /**
     * If the createAuthToken option is set to true, create a token for the database
     */

    if (createAuthToken) {
        if(['read-only', 'full-access'].indexOf(authTokenAuthorization) === -1) {
            setFailed('Authorization must be either read-only or full-access')
        }
        const jwtToken = await turso.databases.createToken(database.name, {
            expiration: authTokenExpiration,
            authorization: authTokenAuthorization,
        })
        if (!jwtToken) {
            setFailed('Unable to create auth token')
        }

        /** Set the auth token as a secret */
        setSecret(jwtToken.jwt)
        /** Return auth token details */
        setOutput('db_jwt_auth_token', jwtToken.jwt)
    }
}

createDatabaseBranch()
