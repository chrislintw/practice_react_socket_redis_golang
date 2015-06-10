var EntryButton = React.createClass({
  render: function(){
    return (
      <div>

      </div>
    )
  }
})
var RoomRow = React.createClass({
  render: function () {
    return (
      <div className="col-xs-6 col-lg-4">
        <h2>{this.props.room.rname}</h2>
        <p>{this.props.room.people}/{this.props.room.limit}</p>
        <button className="btn btn-primary" >Entry</button>
      </div>
    )
  }
})
var RoomsBox = React.createClass({
  render: function () {
    var items = [];
    for (var symbol in this.props.rooms) {
      var room = this.props.rooms[symbol];
      items.push(<RoomRow key={symbol} room={room} />);
    }
    return (
      <div className="row">
        {items}
      </div>
    )
  }
})
var HomePage = React.createClass({
  getInitialState: function() {
    var rooms = {};
    feed.init();
    feed.onChange(function(data){
      rsp = JSON.parse(data);
      switch(rsp.action) {
      case "roominfo":
        rooms[rsp.room.id] = rsp.room;
        this.setState({rooms: rooms});
        break;
      case "del":
        rooms = this.state.rooms;
        delete rooms[rsp.room.id];
        this.setState({rooms: rooms});
        break;
      }
    }.bind(this));
    this.setState({rooms: rooms});
    return {rooms: rooms};
  },
  render: function () {
    return (
      <div className="row row-offcanvas row-offcanvas-right">
        <div className="col-xs-12 col-sm-9">
          <h1>HI </h1>
          <RoomsBox rooms={this.state.rooms} />
        </div>
      </div>
    );
  }
});
React.render(<HomePage />, document.getElementById('main'));