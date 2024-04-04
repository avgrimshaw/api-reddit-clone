# Reddit Clone API

## Setup environment variables

You will require the necessary environment variables to run this project.

First of all, please run the command `npm install` in the terminal to install the necessary dependencies.

Once you the installations have completed, you can then create your environment variables:

If you are using a **Linux**, **MacOS** or **WSL terminal**, then you can simply paste this command in the project root directory:

<code>echo "PGDATABASE=reddit_clone_test" > .env.test; echo "PGDATABASE=reddit_clone" > .env.development</code>

Or, you can simply follow these instructions:

 1. Create two `.env` files in the project root directory: `.env.test`
    and `.env.development`
 2. In each .env file, add **PGDATABASE=**
 3. Assign PGDATABASE in each file with the corresponding database
    names: </br>`reddit_clone_test` for `.env.test` </br> `reddit_clone`
    for `.env.development`

Your files should look like so:

<code>PGDATABASE=reddit_clone_test</code> | **.env.test**</br>
<code>PGDATABASE=reddit_clone</code> | **.env.development**
