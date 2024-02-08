const handleSchoolChartData = (chartDom: HTMLElement, assessmentTaskDetails: any[]) => {
  const assessmentTaskTitleSet = new Set([]);
  const seriesMap: Record<string, any[]> = {};
  assessmentTaskDetails.forEach((item: any) => {
    assessmentTaskTitleSet.add(item.assessmentTaskTitle);
    seriesMap[item.schoolName] = seriesMap[item.schoolName] || [];
    seriesMap[item.schoolName].push(item.totalScore || 0);
  });
  const series: any[] = [];
  Object.keys(seriesMap).forEach((key: string) => {
    series.push({
      name: key,
      type: 'line',
      smooth: true,
      data: seriesMap[key],
    })
  })
  console.log(series);
  const assessmentTaskTitles = Array.from(assessmentTaskTitleSet);
  const left = 50;
  const right = 50;
  const cellWidth = 120;
  const chartContentWidth = chartDom.clientWidth - left - right;
  const visibleAreaDataPercent = chartContentWidth / (cellWidth * assessmentTaskTitles.length) * 100;
  const needDataZoom = visibleAreaDataPercent < 90;
  const dataZoom = needDataZoom ? [{
    show: true,
    type: 'slider',
    zoomLock: true,
    start: 0,
    end: visibleAreaDataPercent,
    minValueSpan: 0,
    maxValueSpan: 30,
    backgroundColor: '#fff',
    showDetail: false,
    dataBackground: {
      lineStyle: {
        width: 1,
        color: '#E6E7F5'
      },
      areaStyle: {
        color: '#E6E7F5'
      },
    },
    height: 15,
    fillerColor: 'rgba(217, 229, 255, 0.8)',
    bottom: 8,
    left: 10,
    right: 10,
  }] : undefined;
  return {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      right: 15,
      top: 10,
      icon: 'circle',
      itemGap: 10,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: '#808080',
        fontWeight: 'normal'
      },
    },
    grid: {
      left,
      right,
      top: 50,
      bottom: needDataZoom ? 65 : 40,
    },
    dataZoom,
    toolbox: {},
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: assessmentTaskTitles,
      axisLabel: {
        interval: 0,
        lineHeight: 14,
        formatter: (value: string) => {
          if (value.length > 8) {
            const middleIndex = Math.round(value.length / 2);
            return value.slice(0, middleIndex) + '\n' + value.slice(middleIndex);
          }
          return value;
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#bbb',
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#bbb',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#999999',
        fontSize: 12,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#f3f3f3',
        },
      },
    },
    series,
  }
}

export {
  handleSchoolChartData,
}
