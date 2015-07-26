$(document).ready(function () {
  var Chart = function () {
    this.dataSet = [];
  };

  Chart.prototype.getData = function () {
    $.ajax({
      context: this,
      type: "GET",
      url: "https://www.quandl.com/api/v1/datasets/BTS_MM/RETAILGAS.json?trim_start=1995-01-02&trim_end=2012-10-15&auth_token=E6kNzExHjay2DNP8pKvB",
      success: function(response) {
        var obj = {
          name: "Weekly",
          data: []
        };
        var items = response.data.sort();
        for (var i = 0; i < items.length; i++) {
          obj.data.push({
            x: new Date(items[i][0]),
            y: items[i][1]
          });
        }
        this.dataSet.push(obj);
        this.dataSet.push(this.calculateSMA(this.dataSet[0].data, 4, "Monthly"));
        this.dataSet.push(this.calculateSMA(this.dataSet[0].data, 13, "Quarterly"));
        this.dataSet.push(this.calculateSMA(this.dataSet[0].data, 52, "Yearly"));
        this.graphData();
      }
    });
  };

  Chart.prototype.calculateSMA = function (dataSet, duration, name) {
    console.log(dataSet);
    var obj = {
      name: name,
      data: []
    }
    for (var i = duration; i < dataSet.length; i ++) {
      var total = 0;
      var average = 0;
      for (var j = duration; j > 0; j--) {
        total+=dataSet[i-j].y;
      }
      average = total/duration;
      obj.data.push({
        x: dataSet[i].x,
        y: average
      });
    }
    return obj;
  };

  Chart.prototype.graphData = function () {
    var highchartConfig = {
      title: {
        text: "Historical Gasoline Prices"
      },
      subtitle: {
        text: "Data Taken From Quandl"
      },
      legend: {
        align:"right",
        layout: "vertical",
        verticalAlign: "middle"
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: "US Dollars ($)"
        }
      },
      series: this.dataSet
    }
    $('#chart').highcharts(highchartConfig);
  };

  var newChart = new Chart();
  newChart.getData();

})