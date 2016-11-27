'use strict';

const objs = require('./contas.json');
console.log(JSON.stringify(mapToParent(objs), "", "  "));

function mapToParent(objs) {
	objs = sortByDotsCount(objs);
	objs.forEach(calcParentDebitAndCredit);
	objs = objs.filter(obj => obj.credit + obj.debit);
	objs.forEach(putOnParent)

	const minDot = getCodeDotsCount(objs.slice(-1)[0]);
	const elders = filterByDotsCount(objs, minDot);

	return elders;
}

function putOnParent(obj) {
	const parent = getParent(obj, objs);
	parent && parent.children.push(obj);
}

function calcParentDebitAndCredit(obj) {
	const parent = getParent(obj, objs);
	
	obj.children = []

	if (!parent) {
		return;
	}

	parent.credit += obj.credit;
	parent.debit += obj.debit;

	return obj;
}

function filterByDotsCount(objs, equal) {
	return objs.filter((item) => getCodeDotsCount(item) === equal);
}

function sortByDotsCount(objs) {
	return objs.sort((a, b) => getCodeDotsCount(b) - getCodeDotsCount(a));
}

function getCodeDotsCount(item) {
	return item.code.split('.').length;
}

function getParent(self, candidates) {
	const codeBase = self.code.split('.').slice(0, -1).join('.');
	let parent = null;
	let maxMatch = 0;

	for (const candidate of candidates) {
		const { code } = candidate;

		if (codeMatch(code, maxMatch, codeBase)) {
			parent = candidate;
			maxMatch = code.split('.').length;
		}
	}

	return parent;
}

function codeMatch(code, maxMatch, codeBase) {
	return codeBase.startsWith(code) &&	code.split('.').length > maxMatch;
}
