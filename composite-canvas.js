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
      let boxPlot = this.querySelector('box-plot');
      let scatterPlot = this.querySelector('scatter-plot');
      this.registerChart(boxPlot);
      this.registerChart(scatterPlot);
      this._source = crossfilter(this.source).dimension(r => r);
      this.charts = [boxPlot, scatterPlot];
      this.drawMaps(this.charts, {
        source: this.source,
        externals: this.externals
      }, arr => arr);
    });
  },

  toggleData: function(e) {
    console.log(e.detail.filter);
    console.log(this._source.filter(e.detail.filter).top(Infinity));
    console.log('toggles');
  },

  resetCharts: function() {},

  registerChart: function(chart) {
    chart.chartId = PolymerD3.utilities.getUUID();
    this.charts.push(chart);
  },

  deRegisterChart: function(chart) {
    var indexToRem;
    this.charts.forEach((c, i) => {
      if (c.chartId == chart.chartId) {
        indexToRem = i;
      }
    });
    this.splice('charts', indexToRem, 1);
  },

  drawMaps: function(mapsArr, config, filter) {
    this.charts = this.charts.map(chart => {
      chart.editMode = true;
      chart.source = filter(config.source);
      chart.externals = config.externals;
      return chart;
    });
    return this.charts;
  },

  remTwoRows: function() {
    this.resetCharts();
    // this.charts = this.drawMaps(this.charts, {
    //   source: this.source,
    //   externals: this.externals
    // }, arr => {
    //   let _src = crossfilter(arr);
    //   let filterByVal1 = _src.dimension(row => row);
    //   return filterByVal1.filter();
    // });
  }
});
