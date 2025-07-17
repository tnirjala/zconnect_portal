// ECharts Pie3D Extension Helper
// Source: https://github.com/ecomfe/echarts-gl/issues/36#issuecomment-483113707

export function registerPie3D(echarts) {
  echarts.registerSeriesModel({
    type: 'series.pie3D',
    getInitialData: function (option) {
      var dimensions = echarts.helper.completeDimensions(['value'], option.data);
      var list = new echarts.List(dimensions, this);
      list.initData(option.data);
      return list;
    },
    defaultOption: echarts.util.merge({
      zlevel: 0,
      z: 2,
      center: ['50%', '50%'],
      radius: [0, '75%'],
      roseType: false,
      label: {
        show: true,
        position: 'inside',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        formatter: '{d}%'
      },
      itemStyle: {
        borderWidth: 2,
        borderColor: '#fff',
        shadowBlur: 20,
        shadowColor: 'rgba(40,40,80,0.25)'
      },
      pieDepth: 36,
      minAngle: 5,
      shading: 'lambert',
      viewControl: {
        alpha: 30,
        beta: 0
      }
    }, {})
  });
} 