[![Quarto Publish](https://github.com/vanHeemstraSystems/lego-management/actions/workflows/publish.yml/badge.svg)](https://github.com/vanHeemstraSystems/lego-management/actions/workflows/publish.yml)

lego-management
# LEGO Management

Can be read as "LEGO Management" at https://app.gitbook.com/s/Rs3XPuVclvoj92Exb9AA/

Can be browsed as "LEGO Management" at https://vanheemstrasystems.github.io/lego-management/

Documentation of this repository is automatically done with Quarto using GitHub Actions as described at https://github.com/vanHeemstraSystems/quarto-to-github-pages/blob/main/300/300/README.md

Based on "Instagraph" at https://github.com/yoheinakajima/instagraph

Based on "Stack Exchange" at https://stackexchange.com/sites

Based on "create-react-app" at https://github.com/facebook/create-react-app

Based on "JSON Editor" at https://github.com/josdejong/jsoneditor

Based on "Getting started with React Query" at https://hasura.io/blog/getting-started-with-react-query/

Based on "How to Add a JSON Editor to a React + Next.js Application" at https://levelup.gitconnected.com/simplest-way-to-add-json-editor-to-nextjs-application-6baa71b5b4dd

Based on "Map Management" at https://github.com/vanHeemstraSystems/map-management

Based on "Create a Next.js App" at https://nextjs.org/learn/basics/create-nextjs-app

Based on "src Directory" at https://nextjs.org/docs/pages/building-your-application/configuring/src-directory

Based on "Moving Pages folder in Next.js application to src folder" at https://stackoverflow.com/questions/69690382/moving-pages-folder-in-next-js-application-to-src-folder

Based on "How to Use State in Functional React Components" at https://www.howtogeek.com/devops/how-to-use-state-in-functional-react-components/

Based on "How to Style Your React Apps with CSS Like a Pro" at https://www.freecodecamp.org/news/style-react-apps-with-css/

Based on "States and componentDidMount() in functional components with Hooks." at https://medium.com/@t93/states-and-componentdidmount-in-functional-components-with-hooks-cac5484d22ad

Based on "HTML React Parser" at https://github.com/remarkablemark/html-react-parser/blob/master/examples/create-react-app-typescript/src/App.tsx

Based on "React Class Components to Functional Components With Hooks" at https://catalins.tech/react-class-components-to-functional-components-with-hooks/

Based on "How to fix TypeError: Converting circular structure to JSON in JS?" at https://codedamn.com/news/javascript/how-to-fix-typeerror-converting-circular-structure-to-json-in-js

Based on "Unable to import svg files in typescript" at https://stackoverflow.com/questions/44717164/unable-to-import-svg-files-in-typescript

Based on "How to import SVGs into your NextJS application" at https://frontend-digest.com/how-to-import-svgs-into-nextjs-8ec6100e613f

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

How to use the Plotly.js React component.

Based on "Fetching Data and Updating State in a React Class" at https://www.pluralsight.com/guides/fetching-data-updating-state-react-class

Based on "Creating Dynamic Routes and Components using ReactJS" at https://meanstackdeveloper.in/creating-dynamic-routes-and-components-using-reactjs.html

Based on "Isometric diagram" at https://www.jointjs.com/demos/isometric-diagram

Based on "How to Move a Square with React Hooks and Styled Components" at https://medium.com/programming-essentials/how-to-move-a-square-with-react-hooks-and-styled-components-f649847a9635

Based on "How to Use Fetch with async/await" at https://dmitripavlutin.com/javascript-fetch-async-await/

Based on "Harusa GraphQL in Docker" at https://hasura.io/docs/latest/deployment/deployment-guides/docker/

Based on "Using Hasura with Docker and a PostgreSQL database - part 1 of 2 - Docker" at https://blog.alexanderwolf.tech/using-hasura-with-docker-and-a-postgresql-database-part-1-of-2-docker/

Based on "Auto-Apply Migrations and Metadata" at https://hasura.io/docs/latest/migrations-metadata-seeds/auto-apply-migrations/

Based on "export HTTP_PROXY and special characters in passwd" at https://unix.stackexchange.com/questions/42273/export-http-proxy-and-special-characters-in-passwd

Based on "Getting Started with Hasura" at https://www.youtube.com/watch?v=FEk9Li05Ye4

Based on "hasura/js-sdk" at https://github.com/hasura/js-sdk

Based on "Postgres: Schema" https://hasura.io/docs/latest/schema/postgres/index/

Based on "[Live Demo] Query JSON Data In Postgres Database | JSONB Data Type In Postgresql" at https://www.youtube.com/watch?v=PZFiThbuTFg

Based on "Working with a JSONB Array of Objects in PostgreSQL" at https://levelup.gitconnected.com/working-with-a-jsonb-array-of-objects-in-postgresql-d2b7e7f4db87

Based on "How To Implement One to One, One to Many and Many to Many Relationships When Designing A Database." at https://medium.com/@emekadc/how-to-implement-one-to-one-one-to-many-and-many-to-many-relationships-when-designing-a-database-9da2de684710

Based on "SQL Views With PostgreSQL" at https://towardsdatascience.com/sql-views-with-postgresql-493ba7aa0934

Based on "How to use GraphQL Alias and Aggregation?" at https://bitquery.io/blog/graphql-alias-and-aggregation

Based on "L3DI.js" at https://technicsphere.netlify.app/

**NOTE**: Encode your (proxy) password to avoid clashes with unsupported characters (such as '@'), using https://meyerweb.com/eric/tools/dencoder/

**NOTE**: We set the POSTGRES_DB environment variable in the docker file, otherwise it will use the POSTGRES_USER as database name.

**NOTE**: Remove Docker volume 'pgdata' if you want to start postgres with database initialization.

```mermaid
graph TD;
    linkStyle default interpolate basis
    wan1[<center>DSL 100/10 Mb<br><br>10.100.102.1</center>]---router{<center>EdgeRouter-X<br><br>10.20.30.1</center>}
    ip((<center><br>IP<br><br></center>))-.-router
    dns((<center><br>DNS<br><br></center>))-.-router
    wan2[<center>LTE 50/20 Mb<br><br>192.168.1.1</center>]---router
    router---|100Mb|ap[<center>RT-AC1200<br><br>10.20.30.3</center>]
    router---|1Gb|pc(<center>PC<br><br>10.20.30.190</center>)
    router---|1Gb|switch[<center>TL-SG105E<br><br>10.20.30.2</center>]
    subgraph red1
    ap-.-cam1(<center>Camera<br><br>10.20.30.171</center>)
    ap-.-cam2(<center>Camera<br><br>10.20.30.172</center>)
    ap-.-phone(<center>Phone<br><br>10.20.30.191</center>)
    ap-.-ir(<center>IR<br><br>10.20.30.180</center>)
    end
    subgraph red2
    switch---|100Mb|pi1(<center>RPi 3B<br><br>10.20.30.150</center>)
    switch---|1Gb|pi2(<center>RPi 3B+<br><br>10.20.30.151</center>)
    switch---|100Mb|nvr(<center>NVR<br><br>10.20.30.170</center>)
    switch---|1Gb|laptop(<center>Laptop<br><br>10.20.30.192</center>)
    end
``` 

### Figure: Diagram (needs rework to display the true architecture)

Run as follows:

```
$ cd containers/app
$ docker-compose --file docker-compose.dev.yml --project-name lego-management-dev up --build -d
```

**NOTE**: If you get the following error when browsing the Plotly service: 

``````
Unhandled Runtime Error
ApolloError: Failed to fetch
``````

Know that this is most likely caused by the Hasura service not being up and running yet, therefor not able to sent the requested data to the Plotly Service. To fix it, start the Hasura service.

**NOTE**: When you try to login to PostgreSQL database via **pgAdmin** (Recommended), use the following credentials:

- Email Address / Username: = Use the value of PGADMIN_DEFAULT_EMAIL_DEV/PROD as specified in the .env file
- Password: Use the value of PGADMIN_DEFAULT_PASSWORD_DEV/PROD as specified in the .env file

Inside pgAdmin register a new Server using the following credentials:

Right-Click Servers > Register ... Server:

In tab **General**:

- Name: Use a name like "lego-management-dev" (if for development) - REQUIRED

In tab **Connection**:

- Host name/address: **localhost** if network_mode is host, or **IP of host** otherwise (recommended).
- Port: = Use the value of port for the container if network_mode is host, or of the host otherwise (recommended), as specified in the docker-compose file =
- Maintenance database: **postgres**
- Username: = Use the value of POSTGRES_USER_DEV/PROD as specified in .env file =
- Password: = Use the value of POSTGRES_PASSWORD_DEV/PROD as specified in .env file =

**NOTE**: When you try to login to Hasura, use the following credentials:

- Admin secret: = Use the value of HASURA_GRAPHQL_ADMIN_SECRET_DEV/PROD as specified in .env file =

## Hasura

### Connect Your First Database

See http://hostname:hasura-port-number/console/data/manage/connect

- Database Display Name: **LEGO Management - Dev** (for development)
- Data Source Driver: **Postgres**
- Connect Database Via: **Database URL**
- Database URL: **postgresql://username:password@hostname:5432/databasename**, use the value of HASURA_GRAPHQL_DATABASE_URL_DEV/PROD as specified in .env file

- Extensions Schema: = stay with the default =
- Connection Settings: = stay with the default =
- GraphQL Field Customization: = stay with the default =

**WARNING**: make sure you did not copy ```sample.hasura_metadata.json``` to the Dockerhost as it will confuse it when there is already a ```hasura_metadata.json``` there.

**WARNING**: make sure you did not copy ```sample.hasura_migrations.json``` to the Dockerhost as it will confuse it when there is already a ```hasura_migrations.json``` there.

### Read the Getting Started Docs

Read https://hasura.io/docs/latest/graphql/core/getting-started/first-graphql-query.html?pg=oss-console&plcmt=onboarding#create-a-table

### Watch Our Getting Started Video

Watch https://www.youtube.com/watch?v=ZGKQ0U18USU

### Bookmark Our Course

Bookmark https://hasura.io/learn/graphql/hasura/introduction/?pg=oss-console&plcmt=onboarding-checklist

### Define the Schema in Postgres for Our LEGO Management Service

The schema of our lego management service is based on Plotly and should follow a nesting alike below:

```
	[
     {
       id: 1,
       position: { x: 36,
       y: 36 }
     },
     {
       id: 2,
       position: { x: 136,
       y: 136 }
     },
     {
       id: 3,
       position: { x: 236,
       y: 236 }
     },
  ]          
```
Example of a schema for Plotly nodes.

```
	 [
     {
       source: 1,
       target: 2
     },
     {
       source: 2,
       target: 3
     }
  ]      
```
Example of a schema for Plotly links.

Taken together, here is the schema for a map (which combines nodes and links):

```
  id: 1,

  nodes: [
     {
       id: 1,
       position: { x: 36,
       y: 36 }
     },
     {
       id: 2,
       position: { x: 136,
       y: 136 }
     },
     {
       id: 3,
       position: { x: 236,
       y: 236 }
     },
  ],

  links: [
     {
       source: 1,
       target: 2
     },
     {
       source: 2,
       target: 3
     }
  ]

```
Example of a schema for a Plotly plot.


Nodes are unique, they can only exist once (with the same unique identifier).

Links are a relation ship between nodes. One link can link to two nodes (source and target).

Hence the relationship between a node and a link is **1-to-many**.

In creating the tables & views see the following:

- Nodes schema: see containers/app/postgresql/sql/

- Links schema: see containers/app/postgresql/sql/

- Plots schema: see containers/app/postgresql/sql/

Plots are a collection of nodes and links.

In hasura you can - after having connected to the database and tracked the views - now run a query like below to get a JSON output:

```
query fetchFirstPlot {
  first_plot: plots_view(where: {name: {_eq: "first"}}) {
    nodes {
      id
      position
    }
    links {
      source
      target
    }
  }
}
```

Example outcome of above query:

```
{
  "data": {
    "first_plot": [
      {
        "nodes": [
          {
            "id": 1,
            "position": {
              "x": 36,
              "y": 36
            }
          },
          {
            "id": 2,
            "position": {
              "x": 136,
              "y": 136
            }
          },
          {
            "id": 3,
            "position": {
              "x": 236,
              "y": 236
            }
          }
        ],
        "links": [
          {
            "source": 1,
            "target": 2
          },
          {
            "source": 2,
            "target": 3
          }
        ]
      }
    ]
  }
}
```

**TIP**: To format the code, select the code and in Visual Studio Code (after installing the Prettier extension) combine the following keys: CTRL + SHIFT + P. A dialogue window will ask you for what command you want to execute, type "format" and from the dropdown options choose "prettier". This will format the selected code.

To be more precise in which file(s) to format, for example when in ```containers/app/plotly``` you can run the following:

```
$ npx prettier --write src/app/page.tsx
```

It will take the configuration from ```containers/app/plotly/.prettierrc```

See for documentation on **Prettier**, https://prettier.io/docs/en/index.html

## 100 - Introduction

See [README.md](./100/README.md)

## 200 - Requirements

See [README.md](./200/README.md)

## 300 - Building our Application

See [README.md](./300/README.md)

## 400 - Conclusion

See [README.md](./400/README.md)
