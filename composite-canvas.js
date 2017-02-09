Polymer({

  is: 'composite-canvas',

  properties: {
    source: {
      type: Array,
      value: () => {
        return [[
          'Jo',
          12,
          53,
          67
        ], [
          'Aca',
          21,
          52,
          46
        ], [
          'as',
          22,
          43,
          67
        ], [
          'eqa',
          42,
          23,
          17
        ], [
          'qwe',
          52,
          33,
          97
        ], [
          'bnm',
          72,
          59,
          65
        ]]
      }
    },
    externals: {
      type: Array,
      value: () => {
        return [{
          key: 'Name',
          type: 'String',
          value: 0
        }, {
          key: 'Val1',
          type: 'Number',
          value: 1
        }, {
          key: 'Val2',
          type: 'Number',
          value: 2
        }, {
          key: 'Val3',
          type: 'Number',
          value: 3
        }]
      }
    },
    charts: {
      type: Array,
      value: () => []
    }
  },

  listeners: {
    'TOGGLE': 'toggleData',
    'RESET': 'resetCharts'
  },

  attached: function() {
    this.async(() => {
      // select and register chart
      let boxPlot = this.querySelector('box-plot');
      let scatterPlot = this.querySelector('pie-chart');
      this.registerChart(boxPlot);
      this.registerChart(scatterPlot);
      this._sourceDimension = crossfilter(this.source).dimension(r => r);
      var processed = this.initCharts([boxPlot, scatterPlot], {
        dimension: this._sourceDimension,
        externals: this.externals
      }, arr => arr);
      this.charts = processed.charts;
      this._sourceDimension = processed.newDimension;
    });
  },

  toggleData: function(e) {
    console.log(e.detail.filter);
    if (!e.detail.chart) {
      console.warn('Event source couldn\'t be identified');
      return false;
    }
    let otherCharts = this.charts.filter(chart => chart.chartId !=  e.detail.chart.chartId);
    let processed = this.initCharts(otherCharts, {
      externals: this.externals,
      dimension: this._sourceDimension
    }, e.detail.filter);
    this._sourceDimension = processed.newDimension;
  },

  resetAllCharts: function() {
    this.charts = this.initCharts(this.charts, {
      source: this.source,
      externals: this.externals
    }, arr => arr);
    this.charts.forEach(chart => chart.draw());
  },

  // register chart to chart-array
  registerChart: function(chart) {
    // search a list of available charts, push only if isn't present
    let chartIds = this.charts.map(chart => chart.id);
    if (chartIds.indexOf(chart.chartId) == -1) {
      chart.chartId = PolymerD3.utilities.getUUID();
      this.charts.push(chart);
    } else {
      console.warn('Chart already present');
    }
  },

  // removes chart form chart array
  deRegisterChart: function(chart) {
    var indexToRem;
    this.charts.forEach((c, i) => {
      if (c.chartId == chart.chartId) {
        indexToRem = i;
      }
    });
    if (indexToRem != null) {
      this.splice('charts', indexToRem, 1);
    }
  },

  initCharts: function(chartArr, config, filter) {
    let _source = config.dimension.filter(filter).top(Infinity);
    this.charts = chartArr.map(chart => {
      chart.editMode = true;
      chart.source = _source;
      chart.externals = config.externals;
      return chart;
    });
    return {
      charts: this.charts,
      newDimension: config.dimension
    };
  },

  remTwoRows: function() {
    this.resetAllCharts();
  }
});
