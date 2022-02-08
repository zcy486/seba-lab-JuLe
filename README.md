# JuLe

Legal Learning System looking to provide law students with instant feedback regarding their writing style

## Simple Deployment

1. install & run docker

2. change directories to the `jule/` parent directory

3. run docker-compose up

4. visit jule.tk


## Troubleshooting

### Unable to find server

If your browser states it is unable to find the server when trying to access jule.tk this may be the result of your DNS not routing .tk domains. We recommend using either the 1.1.1.1 or 8.8.8.8 DNS services.

### Unable to create accounts

The service requires users to be part of a university upon signup, therefore Universities must exist in the database. You can either add them manually or load mock universities by enabling mock data in the backend config.

### Unable to obtain statistics

The statistic types can be altered so they are stored in a table and require initialization. This can be done either manually with custom statistics or by using the mock statistics provided when mock data is enabled in the backend config. 
