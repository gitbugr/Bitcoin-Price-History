# Bitcoin Historic Price Downloader (GDAX Public API)

I needed a quick way to get price data, so I made this little command line utility.

### Installation

`npm install`

### Usage

`node btcpricedownloader.js -s {{START DATE/TIME}} -e {{END DATE/TIME}} -t {{TIMESCALE IN MINUTES}} > ~/{{DIRECTORY}}/{{FILENAME}}.json`

#### Example

`node btcpricedownloader.js -s 2017-01-01T00:00:00.000 -e 2017-01-03T00:00:00.000 -t 5 -c USD > ~/Desktop/btc_usd.json`

### Response Items

Each bucket is an array of the following information:

`start time
lowest price during the bucket interval
highest price during the bucket interval
opening price (first trade) in the bucket interval
closing price (last trade) in the bucket interval
volume of trading activity during the bucket interval`