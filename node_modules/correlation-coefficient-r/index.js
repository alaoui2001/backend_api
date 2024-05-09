var deviation = require('math-standard-deviation');

function correlationCoefficientR (x, y) {
    var xMean = deviation.mean(x)
    var yMean = deviation.mean(y)

    var xDeviation = deviation.standardDeviation(x)
    var yDeviation = deviation.standardDeviation(y)

    var sum = 0;
    for(let i = 0; i < x.length; i++) {
        sum += ((x[i] - xMean) / xDeviation) * ((y[i] - yMean) / yDeviation) 
    }

    return sum / (x.length - 1)
}

module.exports = correlationCoefficientR