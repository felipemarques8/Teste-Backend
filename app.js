'use strict';

const objs = require('./contas.json');

var debitos = [];
var creditos = [];

function mapToChildrens (objs) {
  objs = objs.sort(sortByDotsCount);

  const topCount = getCodeDotsCount(objs[0]);
  const elders = objs.filter(filterByDotsCount(topCount));

  return elders.map(mapElders);

  function mapElders (elder) {
    const descendants = getDescendants(objs, elder.code);
    elder.children = descendants.length > 0 ? mapToChildrens(descendants) : [];
    return elder;
  }
}
function getDescendants (objs, parentCode) {
  return objs.filter(item => item.code.startsWith(parentCode) && item.code !== parentCode);

}
function filterByDotsCount (equal) {
  return item => getCodeDotsCount(item) === equal;
}
function sortByDotsCount (a, b) {
  return getCodeDotsCount(a) - getCodeDotsCount(b);
}
function getCodeDotsCount (item) {
  return item.code.split('.').length;
}

console.log(JSON.stringify(mapToChildrens(objs),"", "  "));
