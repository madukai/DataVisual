
  
  const svg = d3.select('svg');
  
  const width = +svg.attr('width');
  const height = +svg.attr('height');
  
  const render = data => {
    const title = 'Stock Price';
    
    const xValue = d => d.timestamp;
    const xAxisLabel = 'Time';
    
    const yValue = d => d.price;
    const circleRadius = 5;
    const yAxisLabel = 'Price';
    
    const margin = { top: 60, right: 40, bottom: 88, left: 105 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth])
      .nice();
    
    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yValue))
      .range([innerHeight, 0])
      .nice();
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const xAxis = d3.axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickPadding(15);
    
    const yAxis = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickPadding(10);
    
    const yAxisG = g.append('g').call(yAxis);
    yAxisG.selectAll('.domain').remove();
    
    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -60)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);
    
    const xAxisG = g.append('g').call(xAxis)
      .attr('transform', `translate(0,${innerHeight})`);
    
    xAxisG.select('.domain').remove();
    
    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 80)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text(xAxisLabel);
    
    const lineGenerator = d3.line()
      .x(d => xScale(xValue(d)))
      .y(d => yScale(yValue(d)))
      .curve(d3.curveMonotoneX);
    
    g.append('path')
        .attr('class', 'line-path')
        .attr('d', lineGenerator(data));

    g.selectAll('circle').data(data)
        .enter().append('circle')
          .attr('cy', d => yScale(yValue(d)))
          .attr('cx', d => xScale(xValue(d)))
          .attr('r', circleRadius);
    
    g.append('text')
        .attr('class', 'title')
        .attr('y', -10)
        .text(title);
  };
  

d3.csv("apple.csv", function(data) {
    data.forEach(d => {
        d.price = +d.price;
        d.timestamp = new Date(d.date);
      });
      render(data);
});