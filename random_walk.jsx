/** @jsx React.DOM */

require('./style.css');

var React = require('react');
var MountNode = document.getElementsByTagName('body')[0];

var Walk = {
  size: 400,

  move_cache: {},

  initializeArray: function(n, f) {
    return Array.apply(null, new Array(n)).map(function(x, i) { return f && f(i) ? 1 : 0 });
  },

  wander: function(path) {
    var adjusted = this.initializeArray(this.size);
    for(var i = 0; i < path.length; i++) {
      if (n = path[i]) {
        var move        = this.move(i);
        adjusted[move]  += n;
      }
    }
    Walk.path = adjusted;
    return Walk.path;
  },

  valid_moves: function(n) {
    if (cache = this.move_cache[n]) {
      return cache;
    } else {
      this.move_cache[n] = this.moves(n).filter(function(a) { return a > 0 && a < Walk.path.length - 1 });
      return this.move_cache[n];
    }
  },

  moves: function(n) {
    var sqr   = Walk.sqr;
    var moves = [];
    [n-sqr, n, n+sqr].forEach(function(a,i,o) {
      for (var i = -1; i < 2; i++) {
        var max = a - a % sqr + sqr - 1;
        var min = a - a % sqr;
        moves.push(Math.min(max, Math.max(min, a + i)));
      }
    });
    return moves;
  },

  move: function(n) {
    var choices = this.valid_moves(n);
    return choices[Math.floor(Math.random() * choices.length)];
  }
};

var Ball = React.createClass({
  render: function() {
    var alpha = Walk.path[this.props.no] * 0.01;
    var style = { background: 'rgba(255, 0, 0, ' + alpha +')'};
    return <div style={style} data-size={Walk.path[this.props.no]} className="ball">{Walk.path[this.props.no]}</div>
  }
});

var Cell = React.createClass({
  handleClick: function() {
    Walk.path[this.props.no] = 1;
  },

  render: function() {
    var active  = !!Walk.path[this.props.no];
    var ball    = active ? <Ball no={this.props.no} /> : null;
    return <div data-no={this.props.no} onClick={this.handleClick} className="cell">{ball}</div>
  }
});

var Row = React.createClass({
  render: function() {
    var cells = (function() {
      var collection = [];
      var sqr        = Walk.sqr;
      for (var i = 0; i < sqr; i++) {
        collection.push(<Cell no={i + (this.props.no * sqr)} />);
      }
      return collection;
    }.bind(this))();

    return (
      <div data-no={this.props.no} className="row">{cells}</div>
    );
  }
});

var Grid = React.createClass({
  getInitialState: function() {
    return {
      no: 0,
      path: Walk.path
    };
  },

  move: function() {
    this.setState({ path: Walk.wander(this.state.path) });
  },

  componentDidMount: function() {
    this.interval = setInterval(this.move, 100);
  },

  componentWillUnmount: function() {
    clearInterval(this.move);
  },

  render: function() {
    var styles = {
      height: window.innerHeight,
      width: window.innerWidth,
    };
    var rows = (function() {
      var collection = [];
      var sqr        = Walk.sqr;
      for (var i = 0; i < sqr; i++) {
        collection.push(<Row no={i} />);
      }
      return collection;
    })();

    return (
      <div className="grid" style={styles}>{rows}</div>
    );
  }
});

Walk.path = Walk.initializeArray(Walk.size, function(n) { return n % 3 == 0; });
Walk.sqr = Math.sqrt(Walk.path.length);

React.renderComponent(<Grid />, MountNode);
