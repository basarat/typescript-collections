"use strict";
var collections = require('../lib/index');
var chai_1 = require('chai');
describe('Multi Root Tree', function () {
    var tree;
    beforeEach(function () {
        tree = new collections.MultiRootIdsTree();
    });
    it('Constructs', function () {
        chai_1.expect(tree.getRootIds()).to.deep.equal([]);
        chai_1.expect(tree.getNodes()).to.deep.equal({});
    });
    it('Can insert one root key', function () {
        tree.insertIdIntoRoot('1');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1']);
        chai_1.expect(tree.getNodes()).to.deep.equal({ '1': [] });
    });
    it('Can insert 2 root keys', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2']);
        chai_1.expect(tree.getNodes()).to.deep.equal({ '1': [], '2': [] });
    });
    it('Can insert root key with +1 position', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoRoot('3');
        tree.insertIdIntoRoot('0', 1);
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '0', '2', '3']);
        chai_1.expect(tree.getNodes()).to.deep.equal({ '0': [], '1': [], '2': [], '3': [] });
    });
    it('Can insert root key with -1 position', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoRoot('3');
        tree.insertIdIntoRoot('0', -1);
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2', '3', '0']);
        chai_1.expect(tree.getNodes()).to.deep.equal({ '0': [], '1': [], '2': [], '3': [] });
    });
    it('Can insert root key with -2 position', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoRoot('3');
        tree.insertIdIntoRoot('0', -2);
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2', '0', '3']);
        chai_1.expect(tree.getNodes()).to.deep.equal({ '0': [], '1': [], '2': [], '3': [] });
    });
    it('Can insert a node', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoNode('1', '1.1');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1']);
        chai_1.expect(tree.getNodes()).to.deep.equal({ '1': ['1.1'], '1.1': [] });
    });
    it('Can insert two nodes', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoNode('1', '1.1');
        tree.insertIdIntoNode('1', '1.2');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1']);
        chai_1.expect(tree.getNodes()).to.deep.equal({ '1': ['1.1', '1.2'], '1.1': [], '1.2': [] });
    });
    it('Can insert a root key before a root key', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('3');
        tree.insertIdBeforeId('3', '2');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2', '3']);
        chai_1.expect(tree.getNodes()).to.deep.equal({ '1': [], '2': [], '3': [] });
    });
    it('Can insert a node before a node key v1', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoNode('1', '1.1');
        tree.insertIdIntoNode('1', '1.2');
        tree.insertIdBeforeId('1.2', 'A');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['1.1', 'A', '1.2'],
            '1.1': [], '1.2': [], 'A': []
        });
    });
    it('Can insert a node before a node key v2 ', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoNode('1', '1.1');
        tree.insertIdIntoNode('1', '1.2');
        tree.insertIdIntoNode('1.2', '1.2.1');
        tree.insertIdIntoNode('1.2.1', '1.2.1.1');
        tree.insertIdIntoNode('1.2.1', '1.2.1.2');
        tree.insertIdIntoNode('1.2.1', '1.2.1.3');
        tree.insertIdBeforeId('1.2.1.1', 'A');
        tree.insertIdBeforeId('1.2.1.3', 'B');
        tree.insertIdBeforeId('1.2.1.3', 'C');
        tree.insertIdBeforeId('1', 'D');
        tree.insertIdBeforeId('C', 'E');
        tree.insertIdBeforeId('1.2', 'F');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['D', '1']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['1.1', 'F', '1.2'],
            '1.1': [], '1.2': ['1.2.1'],
            '1.2.1': ['A', '1.2.1.1', '1.2.1.2', 'B', 'E', 'C', '1.2.1.3'],
            '1.2.1.1': [], '1.2.1.2': [], '1.2.1.3': [],
            'A': [], 'B': [], 'C': [], 'D': [], 'E': [], 'F': [],
        });
    });
    it('Can insert a root key after a root key', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('3');
        tree.insertIdAfterId('1', '2');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2', '3']);
        chai_1.expect(tree.getNodes()).to.deep.equal({ '1': [], '2': [], '3': [] });
    });
    it('Can insert a node key after a node key', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoNode('1', '1.1');
        tree.insertIdIntoNode('1', '1.2');
        tree.insertIdIntoNode('1.2', '1.2.1');
        tree.insertIdIntoNode('1.2.1', '1.2.1.1');
        tree.insertIdIntoNode('1.2.1', '1.2.1.2');
        tree.insertIdIntoNode('1.2.1', '1.2.1.3');
        tree.insertIdAfterId('1.2.1.1', 'A');
        tree.insertIdAfterId('1.2.1.3', 'B');
        tree.insertIdAfterId('1.2.1.3', 'C');
        tree.insertIdAfterId('1', 'D');
        tree.insertIdAfterId('C', 'E');
        tree.insertIdAfterId('1.2', 'F');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', 'D']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['1.1', '1.2', 'F'],
            '1.1': [], '1.2': ['1.2.1'],
            '1.2.1': ['1.2.1.1', 'A', '1.2.1.2', '1.2.1.3', 'C', 'E', 'B'],
            '1.2.1.1': [], '1.2.1.2': [], '1.2.1.3': [],
            'A': [], 'B': [], 'C': [], 'D': [], 'E': [], 'F': [],
        });
    });
    it('Can delete a key from root', function () {
        tree.insertIdIntoRoot('1');
        tree.deleteId('1');
        chai_1.expect(tree.getRootIds()).to.deep.equal([]);
        chai_1.expect(tree.getNodes()).to.deep.equal({});
    });
    it('Can delete a nested key', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('1', '1.1');
        tree.insertIdIntoNode('1', '1.2');
        tree.insertIdIntoNode('1.2', '1.2.1');
        tree.insertIdIntoNode('1.2.1', '1.2.1.1');
        tree.insertIdIntoNode('1.2.1', '1.2.1.2');
        tree.insertIdIntoNode('1.2.1', '1.2.1.3');
        tree.deleteId('1.2');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['1.1'], '2': [],
            '1.1': [],
        });
    });
    it('Can delete a nested key v2', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('1', '1.1');
        tree.insertIdIntoNode('1.1', '1.1.1');
        tree.insertIdIntoNode('1', '1.2');
        tree.insertIdIntoNode('1.2', '1.2.1');
        tree.insertIdIntoNode('1.2.1', '1.2.1.1');
        tree.insertIdIntoNode('1.2.1', '1.2.1.2');
        tree.insertIdIntoNode('1.2.1', '1.2.1.3');
        tree.deleteId('1.2');
        tree.deleteId('1.1.1');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['1.1'], '2': [],
            '1.1': [],
        });
    });
    it('Can delete a nested key v3', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('1', '1.1');
        tree.insertIdIntoNode('1.1', '1.1.1');
        tree.insertIdIntoNode('1', '1.2');
        tree.insertIdIntoNode('1.2', '1.2.1');
        tree.insertIdIntoNode('1.2.1', '1.2.1.1');
        tree.insertIdIntoNode('1.2.1', '1.2.1.2');
        tree.insertIdIntoNode('1.2.1', '1.2.1.3');
        tree.deleteId('1');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['2']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '2': [],
        });
    });
    it('Can insert id inside id v1', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoId('1', '1.1');
        tree.insertIdIntoId('1', '1.2');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['1.1', '1.2'],
            '1.1': [], '1.2': []
        });
    });
    it('Can insert id inside id v2', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoNode('1', '1.1');
        tree.insertIdIntoNode('1', '1.2');
        tree.insertIdIntoNode('1.2', '1.2.1');
        tree.insertIdIntoNode('1.2.1', '1.2.1.1');
        tree.insertIdIntoNode('1.2.1', '1.2.1.2');
        tree.insertIdIntoNode('1.2.1', '1.2.1.3');
        tree.insertIdAfterId('1.2.1.1', 'A');
        tree.insertIdAfterId('1.2.1.3', 'B');
        tree.insertIdAfterId('1.2.1.3', 'C');
        tree.insertIdAfterId('1', 'D');
        tree.insertIdAfterId('C', 'E');
        tree.insertIdAfterId('1.2', 'F');
        tree.insertIdIntoId('C', 'Z');
        tree.insertIdIntoId('Z', 'X');
        tree.insertIdIntoId('1.2', 'Y');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', 'D']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['1.1', '1.2', 'F'],
            '1.1': [], '1.2': ['1.2.1', 'Y'],
            '1.2.1': ['1.2.1.1', 'A', '1.2.1.2', '1.2.1.3', 'C', 'E', 'B'],
            '1.2.1.1': [], '1.2.1.2': [], '1.2.1.3': [],
            'A': [], 'B': [], 'C': ['Z'], 'D': [], 'E': [], 'F': [], 'Z': ['X'], 'X': [], 'Y': []
        });
    });
    it('Can move id before id (root to root)', function () {
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoRoot('3');
        tree.insertIdIntoRoot('1');
        tree.moveIdBeforeId('1', '2');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2', '3']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': [], '2': [], '3': []
        });
    });
    it('Can move id before id (root to node)', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('1', 'A');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['A'], '2': [],
            'A': []
        });
        tree.moveIdBeforeId('2', 'A');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['2', 'A'], '2': [],
            'A': []
        });
    });
    it('Can move id before id (root to node) v2', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('2', '2.1');
        tree.insertIdIntoNode('1', 'A');
        tree.insertIdIntoNode('A', 'B');
        tree.insertIdIntoNode('A', 'C');
        tree.moveIdBeforeId('2', 'B');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['A'], '2': ['2.1'],
            '2.1': [],
            'A': ['2', 'B', 'C'], 'B': [], 'C': []
        });
    });
    it('Can move id before id (node to root)', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('2', '2.1');
        tree.insertIdIntoNode('1', 'A');
        tree.insertIdIntoNode('A', 'B');
        tree.insertIdIntoNode('A', 'C');
        tree.moveIdBeforeId('A', '2');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', 'A', '2']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': [], '2': ['2.1'],
            '2.1': [],
            'A': ['B', 'C'], 'B': [], 'C': []
        });
    });
    it('Can move id before id (node to root) v2', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('2', '2.1');
        tree.insertIdIntoNode('1', 'A');
        tree.insertIdIntoNode('A', 'B');
        tree.insertIdIntoNode('A', 'C');
        tree.moveIdBeforeId('2.1', '2');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2.1', '2']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['A'], '2': [],
            '2.1': [],
            'A': ['B', 'C'], 'B': [], 'C': []
        });
    });
    it('Can move id before id (node to node)', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('2', '2.1');
        tree.insertIdIntoNode('1', 'A');
        tree.insertIdIntoNode('A', 'B');
        tree.insertIdIntoNode('A', 'C');
        tree.moveIdBeforeId('A', '2.1');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': [], '2': ['A', '2.1'],
            '2.1': [],
            'A': ['B', 'C'], 'B': [], 'C': []
        });
    });
    it('Can move id before id (node to node) v2', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('2', '2.1');
        tree.insertIdIntoNode('1', 'A');
        tree.insertIdIntoNode('A', 'B');
        tree.insertIdIntoNode('A', 'C');
        tree.moveIdBeforeId('C', 'A');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['C', 'A'], '2': ['2.1'],
            '2.1': [],
            'A': ['B'], 'B': [], 'C': []
        });
    });
    // after
    it('Can move id after id (root to root)', function () {
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoRoot('3');
        tree.insertIdIntoRoot('1');
        tree.moveIdAfterId('2', '1');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['3', '1', '2']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': [], '2': [], '3': []
        });
    });
    it('Can move id after id (root to node)', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('1', 'A');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['A'], '2': [],
            'A': []
        });
        tree.moveIdAfterId('2', 'A');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['A', '2'], '2': [],
            'A': []
        });
    });
    it('Can move id after id (root to node) v2', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('2', '2.1');
        tree.insertIdIntoNode('1', 'A');
        tree.insertIdIntoNode('A', 'B');
        tree.insertIdIntoNode('A', 'C');
        tree.moveIdAfterId('2', 'B');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['A'], '2': ['2.1'],
            '2.1': [],
            'A': ['B', '2', 'C'], 'B': [], 'C': []
        });
    });
    it('Can move id after id (node to root)', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('2', '2.1');
        tree.insertIdIntoNode('1', 'A');
        tree.insertIdIntoNode('A', 'B');
        tree.insertIdIntoNode('A', 'C');
        tree.moveIdAfterId('A', '2');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2', 'A']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': [], '2': ['2.1'],
            '2.1': [],
            'A': ['B', 'C'], 'B': [], 'C': []
        });
    });
    it('Can move id after id (node to root) v2', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('2', '2.1');
        tree.insertIdIntoNode('1', 'A');
        tree.insertIdIntoNode('A', 'B');
        tree.insertIdIntoNode('A', 'C');
        tree.moveIdAfterId('2.1', '2');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2', '2.1']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['A'], '2': [],
            '2.1': [],
            'A': ['B', 'C'], 'B': [], 'C': []
        });
    });
    it('Can move id after id (node to node)', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('2', '2.1');
        tree.insertIdIntoNode('1', 'A');
        tree.insertIdIntoNode('A', 'B');
        tree.insertIdIntoNode('A', 'C');
        tree.moveIdAfterId('A', '2.1');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': [], '2': ['2.1', 'A'],
            '2.1': [],
            'A': ['B', 'C'], 'B': [], 'C': []
        });
    });
    it('Can move id after id (node to node) v2', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('2', '2.1');
        tree.insertIdIntoNode('1', 'A');
        tree.insertIdIntoNode('A', 'B');
        tree.insertIdIntoNode('A', 'C');
        tree.moveIdAfterId('C', 'A');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['A', 'C'], '2': ['2.1'],
            '2.1': [],
            'A': ['B'], 'B': [], 'C': []
        });
    });
    // inside
    it('Can move id inside id (root to root)', function () {
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoRoot('3');
        tree.insertIdIntoRoot('1');
        tree.moveIdIntoId('2', '1');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['3', '1']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['2'], '2': [], '3': []
        });
    });
    //
    it('Can move id inside id (root to node)', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('1', 'A');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['A'], '2': [],
            'A': []
        });
        tree.moveIdIntoId('2', 'A');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['A'], '2': [],
            'A': ['2']
        });
    });
    it('Can move id inside id (root to node) v2', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('2', '2.1');
        tree.insertIdIntoNode('1', 'A');
        tree.insertIdIntoNode('A', 'B');
        tree.insertIdIntoNode('A', 'C');
        tree.moveIdIntoId('2', 'B');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['A'], '2': ['2.1'],
            '2.1': [],
            'A': ['B', 'C'], 'B': ['2'], 'C': []
        });
    });
    it('Can move id inside id (node to root)', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('2', '2.1');
        tree.insertIdIntoNode('1', 'A');
        tree.insertIdIntoNode('A', 'B');
        tree.insertIdIntoNode('A', 'C');
        tree.moveIdIntoId('A', '2');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': [], '2': ['A', '2.1'],
            '2.1': [],
            'A': ['B', 'C'], 'B': [], 'C': []
        });
    });
    it('Can move id inside id (node to root) v2', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('2', '2.1');
        tree.insertIdIntoNode('1', 'A');
        tree.insertIdIntoNode('A', 'B');
        tree.insertIdIntoNode('A', 'C');
        tree.moveIdIntoId('2.1', '2');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['A'], '2': ['2.1'],
            '2.1': [],
            'A': ['B', 'C'], 'B': [], 'C': []
        });
    });
    it('Can move id inside id (node to node)', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('2', '2.1');
        tree.insertIdIntoNode('1', 'A');
        tree.insertIdIntoNode('A', 'B');
        tree.insertIdIntoNode('A', 'C');
        tree.moveIdIntoId('A', '2.1');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': [], '2': ['2.1'],
            '2.1': ['A'],
            'A': ['B', 'C'], 'B': [], 'C': []
        });
    });
    it('Can move id inside id (node to node) v2', function () {
        tree.insertIdIntoRoot('1');
        tree.insertIdIntoRoot('2');
        tree.insertIdIntoNode('2', '2.1');
        tree.insertIdIntoNode('1', 'A');
        tree.insertIdIntoNode('A', 'B');
        tree.insertIdIntoNode('A', 'C');
        tree.moveIdIntoId('C', 'A');
        chai_1.expect(tree.getRootIds()).to.deep.equal(['1', '2']);
        chai_1.expect(tree.getNodes()).to.deep.equal({
            '1': ['A'], '2': ['2.1'],
            '2.1': [],
            'A': ['C', 'B'], 'B': [], 'C': []
        });
    });
});
//# sourceMappingURL=multiRootIdsTreeTest.js.map