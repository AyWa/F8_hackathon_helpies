## Docker

* Dockerfile_cron is the docker cron job that will run in kubernate, it will ensure that the index, and user data are up to date
* Dockerfile_dev is the docker that is run when we run docker-compose in dev mode

## shared file

### user_idx_v1.json or other index

This file is used by the cron job and for the dev docker. So be sure to update all those related files / script when you make a change.

If you change the schema, analyser etc, it is better to create an other index and when all the migration is done, just apply the alias.
(migration mean than backend has been updated to use this model)

If the change on the index doesn't need any change in the model, then you can just create a new user idx version and change the alias after indexing all the data.

### Explain of analyzer/search
We are using two customs analyzers:
#### split_analyzer
this analyzer will just split the world when there is a caracters that is not a letter. for example:
- "mArc.test@gmail.com" will be transform in ["marc", "test", "gmail", "com"]
This is our main analyzer for all the field in user search.
we apply also a lowercase filter and an asciifolding filter.

#### keyword_analyser
This analyzer is pretty simple -> doesn't modify the input.
but we apply a lowerCase filter so for example:
- "mArc.test@gmail.com" will be transform in ["marc.test@gmail.com"]
We use this analyser as a secondary fields for unique value like email or userName(login).

#### Search
Because of the multiple analyzer for the same property, if you search on `email` you will be able to find result with a query like `gmail` or `marc` etc because of the split analyzer.
If you search on `email.raw` you will be able to get the full result.
In order to be sure to get the exact result as the first result you can add a boost when you search on booth field like  ["email", "email.row^10"]

### change on alias

This file is used by dockerfile. But cronjob is setting manually.
So be sure to update the cronjob if you change the alias
If you change the name (which should not really happen), you should change
the backend too

## Dockerfile_cron

### build:
in local:
`docker build -f Dockerfile_cron -t zepl-elastic-cron .`
for dev:
if a file is change in elastic-search folder
- it will trigger the elastic-job in CI
- then trigger the elastic codebuild job in aws
- then send slack message if succeed
- then you need to deploy on k8s:


### run:

run in local: **unsafe because --network="host"**
`docker run --network="host" -it --rm --name zepl-run-elastic-cron zepl-elastic-cron`

**With our related index, the bulk update user should looks like**
```
{
     "_op_type": "index",
     "_index": "user_idx",
     "_type": "user",
     "_id": "UXXXXXXX1",
     "userName": "anthonycorbacho",
     "name": "Anthony Corbacho",
     "email": "corbacho.anthony@gmail.com",
     "imageId": "",
     "orgIdList": [
         "OXXXXXXX1"
     ]
 }
```

### project:

* index: The script that call the others
* config: all the config depending of env variable
* helper: is a script that create the connection to the db, elastic, couchDb. It also contain some helper to bulk update elastic search
* ensureIndex: will create the user index and add the alias on it. It will also add the notebook index and add the notebook alias
* ensureUsers: will scroll our Users in DB and bash update elastic
* ensureNotebooks: will scroll our notebook in DB then get them from couch db and then get all the access permission on it (read users, write users etc) 

## Dockerfile_dev

run by docker compose
