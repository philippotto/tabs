webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(2);


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */
	function onChange(key) {
	  console.log(key + ' changed!');
	}
	__webpack_require__(5);
	var React = __webpack_require__(3);
	var Tabs = __webpack_require__(4);
	var TabPane = Tabs.TabPane;

	var ____Class1=React.Component;for(var ____Class1____Key in ____Class1){if(____Class1.hasOwnProperty(____Class1____Key)){PanelContent[____Class1____Key]=____Class1[____Class1____Key];}}var ____SuperProtoOf____Class1=____Class1===null?null:____Class1.prototype;PanelContent.prototype=Object.create(____SuperProtoOf____Class1);PanelContent.prototype.constructor=PanelContent;PanelContent.__superConstructor__=____Class1;
	  function PanelContent(props) {"use strict";
	    ____Class1.call(this,props);
	    console.log(this.props.id, 'constructor');
	  }

	  Object.defineProperty(PanelContent.prototype,"componentWillReceiveProps",{writable:true,configurable:true,value:function() {"use strict";
	    console.log(this.props.id, 'componentWillReceiveProps');
	  }});

	  Object.defineProperty(PanelContent.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
	    var count = [1, 1, 1, 1];// new Array(4) skip forEach ....
	    var els = count.map(function(c, i) {
	      return React.createElement("p", {key: i}, this.props.id)
	    }.bind(this));
	    return React.createElement("div", null, els);
	  }});

	var start = 0;
	function render() {
	  start += 10;
	  React.render(React.createElement("div", null, 
	    React.createElement("h1", null, "Simple Tabs"), 
	    React.createElement(Tabs, {activeKey: "2", 
	      onChange: onChange}, 
	      React.createElement(TabPane, {tab: ("tab " + start), key: "1"}, 
	        React.createElement(PanelContent, {id: start})
	      ), 
	      React.createElement(TabPane, {tab: ("tab " + (start + 1)), key: "2"}, 
	        React.createElement(PanelContent, {id: start + 1})
	      ), 
	      React.createElement(TabPane, {tab: ("tab " + (start + 1)), key: "3"}, 
	        React.createElement(PanelContent, {id: start + 2})
	      )
	    ), 
	    React.createElement("button", {onClick: render}, "rerender")
	  ), document.getElementById('__react-content'));
	}


	render();


/***/ }
]);