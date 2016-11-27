'use strict';

const objs = require('./contas.json');
console.log(JSON.stringify(mapToParent(objs), "", "  "));

function mapToParent (objs) {
  objs = sortByDotsCount(objs);
  objs.forEach(obj => obj.children = []);
  objs.forEach(calcParentDebitAndCredit);
  objs = objs.filter(obj => obj.credit + obj.debit);
  objs.forEach(putOnParent)

  const minDot = getCodeDotsCount(objs.slice(-1)[0]);
  const elders = filterByDotsCount(objs, minDot);

  return elders;

  function calcParentDebitAndCredit (obj) {
    const parent = getParent(obj, objs);
    if (!parent) return;
    parent.credit += obj.credit;
    parent.debit += obj.debit;
  }
  function putOnParent (obj) {
    const parent = getParent(obj, objs);
    parent && parent.children.push(obj);
  }
}
function filterByDotsCount (objs, equal) {
  return objs.filter(filter);

  function filter (item) {
    return getCodeDotsCount(item) === equal;
  }
}
function sortByDotsCount (objs) {
  return objs.sort(sorter);

  function sorter (a, b) {
    return getCodeDotsCount(b) - getCodeDotsCount(a);
  }
}
function getCodeDotsCount (item) {
  return item.code.split('.').length;
}
function getParent (self, candidates) {
  const codeBase = self.code.split('.').slice(0, -1).join('.');
  let parent = null;
  let maxMatch = 0;

  for (const candidate of candidates) {
    const { code } = candidate;
    if (codeMatch(code)) {
      parent = candidate;
      maxMatch = code.split('.').length;
    }
  }

  return parent;

  function codeMatch(code) {
    return codeBase.startsWith(code) &&
      code.split('.').length > maxMatch;
  }
}
