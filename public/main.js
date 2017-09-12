(function() {
  'use strict';
  var socket = io();

  var nodes = [];
  var documentContainer = document.getElementById("document");

  socket.on('initial nodes', function(initialNodes) {
    for (var i = 0; i < initialNodes.length; i++) {
      nodes.push({
        id: initialNodes[i].id,
        tag: initialNodes[i].tag
      });
      nodes[i].element = makeNodeElement(nodes[i], i);
      nodes[i].element.innerText = initialNodes[i].content;
      documentContainer.appendChild(nodes[i].element);
    }
  });

  socket.on('node content change', function(changeData) {
    if (nodes[changeData.index] === undefined) {
      createNode(changeData.index);
    }
    nodes[changeData.index].element.innerText = changeData.content;
  });

  documentContainer.onclick = function (event) {
    if (nodes.length === 0) {
      createNode(0);
      selectNode(0);
    } else {
      selectNode(0);
    }
  };

  function createNode(index) {
    var node = {
      id: generateId(),
      tag: 'p',
      'index': index
    };
    socket.emit('new node', node);

    node.element = makeNodeElement(node, index);
    if (index < nodes.length) {
      documentContainer.replaceChild(node.element, documentContainer.children[index]);
    } else {
      documentContainer.appendChild(node.element);
    }
    nodes[index] = node;
  }

  function makeNodeElement(node, index) {
    var element = document.createElement(node.tag);
    element.setAttribute('contenteditable', 'true');
    element.onclick = function(event) {
      selectNode(index);
      event.stopPropagation();
    };
    element.addEventListener('input', function() {
      socket.emit('node content change', {
        'index': index,
        content: node.element.innerText
      });
    });
    return element;
  }

  function selectNode(index) {
    nodes[index].element.focus();
  }

  function generateId() {
    return Math.round(Math.random() * 100000) + '-' + (new Date()).getTime();
  }
})();
