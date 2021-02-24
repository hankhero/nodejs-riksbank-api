
const soap = require('soap');
const { promisify } = require('util')
//require('request').debug = true

const wdslUrl = 'https://swea.riksbank.se/sweaWS/wsdl/sweaWS_ssl.wsdl'

var api = {}
function addMethod(name) {
    const method = async function (args) {
        var options = {
            forceSoap12Headers: true,
            //disableCache: true,
            returnFault: true,
        }
        const client = await soap.createClientAsync(wdslUrl, options)
        var mn = name + 'Async'
        var result = await client[mn](args);

        return result;
    }
    api[name] = method;
}
addMethod('getAllCrossNames')
addMethod('getAnnualAverageExchangeRates')
addMethod('getCrossRates')
addMethod('getCalendarDays')
addMethod('getInterestAndExchangeNames')
addMethod('getInterestAndExchangeGroupNames')
addMethod('getInterestAndExchangeRates')
addMethod('getLatestInterestAndExchangeRates')
addMethod('getMonthlyAverageExchangeRates')

// api.getCrossRates = async function (args) {
//     var options = {
//         forceSoap12Headers: true,
//         disableCache: true,
//         returnFault: true,
//     }
//     const client = await soap.createClientAsync(wdslUrl, options)
//     var result = await client.getCrossRatesAsync(args);
//     return result;
// }

function checkDateFormat(date) {
    if (/^\d\d\d\d-\d{1,2}-\d{1,2}/.test(date)) {
        return;
    }
    throw new Error(`Date ${date} is not YYYY-mm-dd`);
}

async function getSEKperUSD(fromDate,toDate) {
    checkDateFormat(fromDate);
    checkDateFormat(toDate);
    var args = {
        crossRequestParameters: {
            aggregateMethod: 'D',
            crossPair: [{
                seriesid1: 'SEKUSDPMI', 
                seriesid2: 'SEK'
            }],
            datefrom: fromDate,
            dateto: toDate,
            languageid: 'en'
        }
    }
    var raw = await api.getCrossRates(args);
    var object = raw[0];
    var result = object['return']
    if (!result.groups) {
        return [];
    }

    var rows;
    for (var serie of result.groups[0].series) {
        if (serie.seriesname === '1 USD = ? SEK') {
            rows = serie.resultrows;
        }
    }
    return rows;
}

module.exports = {
    api,
    getSEKperUSD
}



