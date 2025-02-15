# Create a Turso Database Branch GitHub Action

Branches can be useful for development, testing, and staging environments. This GitHub Action creates a new branch in a Turso database.
Read more on [Turso Database Branches here](https://docs.turso.tech/features/branching#branching)

> Note: The Turso docs provide steps to do this using a GitHub Action using `curl`. This GitHub Action is a wrapper around the same steps using the Turso Database API [JavaScript library](https://www.npmjs.com/package/@tursodatabase/api).

You can get your Turso Details using the WebUI or using the Turso CLI.
Read more on installing and using the [Turso CLI here](https://docs.turso.tech/cli/introduction)

## Action Inputs

| Input                                                                                          | Description                               | Required | Default     |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------- | -------- | ----------- |
| [`org`](#api-token---turso-platform-api-token)                                                 | Turso Org Slug                            | Yes      |             |
| [`api-token`](#api-token---turso-platform-api-token)                                           | Turso Platform API Token                  | Yes      |             |
| [`branch-name`](#branch-name---name-of-the-branch-to-be-created)                               | Name of the branch to be created          | Yes      |             |
| [`overwrite-if-exists`](#overwrite-if-exists---overwrite-the-branch-if-it-already-exists)      | Overwrite the branch if it already exists | No       | false       |
| [`seed-database-name`](#seed-database-name---seed-database-name)                               | Name of the branch to be branched from    | Yes      |             |
| [`group`](#group---turso-database-group)                                                       | Turso Database Group                      | Yes      |             |
| [`create-auth-token`](#create-auth-token---create-an-auth-token-for-the-new-branch)            | Create an auth token for the new branch   | No       | false       |
| [`auth-token-authorization`](#auth-token-authorization---authorization-for-the-new-auth-token) | Authorization for the new auth token      | No       | `read-only` |
| [`auth-token-expiration`](#auth-token-expiration---expiry-for-the-new-auth-token)              | Expiry for the new auth token             | No       | `1d`        |

### Action Input Descriptions

#### `org` - Turso Org Slug

Using the Turso CLI, you can list the organizations by running

```bash
turso org list
```

#### `api-token` - Turso Platform API Token

You can either create a new Platform API token on the Turso Web UI or use the [turso cli](https://docs.turso.tech/cli/auth/api-tokens/mint).

> Note: The token is a secret and should be kept confidential. Do not share it with anyone or expose it in public repositories.
> You can pass this token as a secret in your GitHub repository. Read more on how to add secrets to your GitHub repository [here](https://docs.github.com/en/actions/reference/encrypted-secrets).

#### `branch-name` - Name of the branch to be created

The branch name should be unique and should not already exist in the database. The branch name should be a string and should not contain any special characters.
The branch name may only contain numbers, lowercase letters, and dashes.

#### `seed-database-name` - Seed Database Name

The action will create a new branch from the seed database. This is the name of the seed database. As well, data from the seed database will be seeded (copied) to the new branch.

#### `overwrite-if-exists` - Overwrite the branch if it already exists

If this is set to `true`, the action will overwrite the branch if it already exists. If this is set to `false`, the action will fail if the branch already exists.

#### `group` - Turso Database Group

This is the group where where the seed database is located.
You can [list the database groups using the Turso CLI](https://docs.turso.tech/cli/group/list#group-list) by running

```bash
turso group list
```

#### `create-auth-token` - Create an auth token for the new branch

If this is set to `true`, the action will create an auth token for the new branch. This auth token can be used to access the new branch. The auth token will be created with the permissions specified in the `auth-token-authorization` input.

#### `auth-token-authorization` - Authorization for the new auth token

This input is only used if `create-auth-token` is set to `true`. This input specifies the permissions for the new auth token. The permissions can be `read-only` or `read-write`.

#### `auth-token-expiration` - Expiry for the new auth token

This input is only used if `create-auth-token` is set to `true`. This input specifies the expiry for the new auth token. The expiry can be in the format `1d` for 1 day, `1w` for 1 week, `1m` for 1 month, or `1y` for 1 year.
Examples: `1d`, `1w`, `1m`, `1y`, `2w1d30m`

> Note: You should also avoid exposing this token by logging it.
