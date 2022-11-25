import app from './firestoreConfig.js';
import {
  getFirestore,
  getDocs,
  collection,
  onSnapshot,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

import { graph, graphWidth, graphHeight } from './graph.js';

const db = getFirestore(app);

// Chart
const x = d3
  .scaleBand()
  .range([0, graphWidth])
  .paddingInner(0.15)
  .paddingOuter(0.1);
const y = d3.scaleLinear().range([graphHeight, 0]);

// Axes
const xAxisGroup = graph
  .append('g')
  .attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g');

// Draw
const update = data => {
  const rects = graph.selectAll('rect').data(data);
  const t = d3.transition().duration(500);

  x.domain(data.map(d => d.name));
  y.domain([0, d3.max(data, d => d.orders)]);

  rects.exit().remove();

  rects
    .enter()
    .append('rect')
    .attr('y', graphHeight)
    .attr('height', 0)
    .merge(rects)
    .attr('width', x.bandwidth)
    .attr('fill', 'orange')
    .attr('x', d => x(d.name))
    .transition(t)
    .attrTween('width', widthTween)
    .attr('y', d => y(d.orders))
    .attr('height', d => graphHeight - y(d.orders));

  const xAxis = d3.axisBottom(x);
  const yAxis = d3
    .axisLeft(y)
    .ticks(10)
    .tickFormat(d => `${d} orders`);

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  xAxisGroup
    .selectAll('text')
    .attr('fill', 'orange')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-40)');
};

(async () => {
  const querySnapshot = await getDocs(collection(db, 'dishes'));

  let data = [];
  querySnapshot.forEach(item => data.push(item.data()));

  update(data);
})();

let data = [];
onSnapshot(collection(db, 'dishes'), doc => {
  doc.docChanges().forEach(change => {
    const doc = { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'removed':
        data = data.filter(item => item.id !== doc.id);
        break;
      case 'modified':
        data = data.map(item => (item.id === doc.id ? doc : item));
        break;
      default:
        break;
    }
  });

  update(data);
});

const widthTween = _ => t => d3.interpolate(0, x.bandwidth())(t);
