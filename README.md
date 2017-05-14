# thingseeAPI
The goal is to collect various data with the [Thingsee device](https://thingsee.com/), send the data to my own API and then to access the api to display the data in various ways in a browser or via an mobile application.

## API (myapi.js)
The api is implemented with Node.js. It accesses a postgreSQL database
#### Depencies
* express
* pg
* connect
* body-parser

To access the database myapi.js requires a config.json file:

```javascript
{
  "user" : "myDatabaseUsername",
  "password" : "myDatabasePassword",
  "address" : "myDatabaseAddress",
  "port" : "myDatabasePort",
  "database" : "myDatabaseName"
}
```

## Clientside code (index.html, myclient.js)
Implemented with React. The script fetches data from the API via a http get and populates a list with the data

#### Depencies
* react
* react-dom
* whatwg-fetch
