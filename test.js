

const riksbanken = require('./index.js')

async function lowlevelApiTest () {

    // https://www.riksbank.se/sv/statistik/sok-rantor--valutakurser/oppet-api/serier-for-webbservices/
    //  130 SEKUSDPMI   USD Förenta Staterna, dollar (1993-01-04 - )
    // SEKUSDPMI


    //https://swea.riksbank.se/sweaWS/docs/api/call/CrossRequestParameters.htm
    //  <crossRequestParameters>
    //      <aggregateMethod>D</aggregateMethod>
    //      <!--1 or more repetitions:-->
    //      <crossPair>
    //        <seriesid1>SEKNOKPMI</seriesid1>
    //        <seriesid2>SEK</seriesid2>
    //        </crossPair>
    //      <datefrom>2011-01-01</datefrom>
    //      <dateto>2011-03-01</dateto>
    //      <languageid>en</languageid>
    //  </crossRequestParameters>

    var args = {
        crossRequestParameters: {
            aggregateMethod: 'D',
            crossPair: [{
                seriesid1: 'SEKUSDPMI', 
                seriesid2: 'SEK'
            }],
            datefrom: '2020-02-01',
            dateto: '2020-03-10',
            languageid: 'en'
        }
    }
    var result = await riksbanken.api.getCrossRates(args)
    // console.log('================================================================================')
    // console.log(result);
    console.log(JSON.stringify(result[0],0,2))
    if (result.length <2) {
        throw new Error("Didnt get result back")
    }
}


async function getSEKperUSD () {
    var result = await riksbanken.getSEKperUSD('2021-01-04','2021-01-05')
    // console.log('================================================================================')
    // console.log(result)
    if (result.length !== 2) {
        throw new Error("Expected two values for two days")
    }
}

async function aClosedBankDay () {
    var result = await riksbanken.getSEKperUSD('2021-01-01','2021-01-03')
    if (result.length !== 0) {
        throw new Error("Expected an empry array for closed banking days")
    }
}

async function aValue () {
    var result = await riksbanken.getSEKperUSD('2021-01-04','2021-01-04')
    if (result.length !== 1) {
        throw new Error("Expected one values for one day")
    }
    var price = result[0].value
    var expectedPrice = 8.1881
    var date = result[0].date

    var expectedDate = new Date('2021-01-04T00:00:00.000Z');
    
    if (price  !== expectedPrice) {
        throw new Error("Expected certain price")
    }
    if (date.getTime() !== expectedDate.getTime()) {
        throw new Error("Expected certain date")
    }
}

async function test() {
    await lowlevelApiTest()
    await getSEKperUSD()
    await aClosedBankDay()
    await aValue()
}
test()
