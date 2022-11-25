const canvas = d3.select('.canvas');

const svgWidth = 600;
const svgHeight = 600;
const svg = canvas
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

const margins = {
  top: 50,
  bottom: 50,
  left: 100,
  right: 100,
};

const graphWidth = svgWidth - margins.left - margins.right;
const graphHeight = svgHeight - margins.top - margins.bottom;
const graph = svg
  .append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margins.right}, ${margins.top})`);

export { graph, graphWidth, graphHeight };
