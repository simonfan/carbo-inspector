'use strict';

/**
 * Implements analysis related methods
 */

var DOMHelpers = require('../aux/dom');

/**
 * Retrieves data for an element
 * @param  {CSSSelector|DOMElementNode} selector Either a css selector or an element
 * @return {[type]}          [description]
 */
exports.getElementData = function (element) {

    // convert element into an element
    element = (typeof element === 'string') ? document.querySelector(element) : element;

    // get the boundingRect
    var boundingRect = element.getBoundingClientRect();

    var data = {
        tagName: element.tagName,
        attributes: DOMHelpers.getAttributes(element),
        // computedStyle: DOMHelpers.getComputedStyle(element),
        rect: {
            top: boundingRect.top,
            left: boundingRect.left,
            width: boundingRect.width,
            height: boundingRect.height,
        },
    };

    return data;
};

// https://developer.mozilla.org/en/docs/Web/API/Node
var NODE_TYPES = {
    '1': 'ELEMENT_NODE',
    '2': 'ATTRIBUTE_NODE',
    '3': 'TEXT_NODE',
    '4': 'CDATA_SECTION_NODE',
    '5': 'ENTITY_REFERENCE_NODE',
    '6': 'ENTITY_NODE',
    '7': 'PROCESSING_INSTRUCTION_NODE',
    '8': 'COMMENT_NODE',
    '9': 'DOCUMENT_NODE',
    '10': 'DOCUMENT_TYPE_NODE',
    '11': 'DOCUMENT_FRAGMENT_NODE',
    '12': 'NOTATION_NODE'
};

/**
 * Auxiliary function
 */
function _getElementNodeTreeData(node, filterFn) {

    if (node.nodeType !== 1) {
        // If node is not an element, return null
        return null;
    }

    var nodeData = {
        nodeType: node.nodeType,
        tagName: node.tagName,
        childNodes: []
    };

    // Use Polymer.dom API to normalize shady/shadow dom.
    Polymer.dom(node).childNodes.forEach(function (child) {

        var childNodeData = _getElementNodeTreeData(child, filterFn);

        if (childNodeData) {
            // only push to childNodes if is not null
            
            // check if there is a filter function
            // pass the node to the filterFn
            if (!filterFn || filterFn(child)) {
                nodeData.childNodes.push(childNodeData);
            } 
        }

    });

    return nodeData;
}

/**
 * Retrieves the nodes tree for a given root and a tree node selector
 * @param  {CSSSelector|Node} root   The root at which start looking for nodes
 * @param  {CSSSelector} filterFn 
 *     A CSS selector string to check if a node
 *     should be in the tree or not.
 * @return {POJO}                  The tree in a plain js object (may be JSON.stringified)
 */
exports.getElementNodeTreeData = function (root, filterFn) {

    return _getElementNodeTreeData(root, filterFn);

};