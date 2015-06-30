var CreateRoom = React.createClass({
  render: function(){
    return (
      <div className="col-xs-12 ">
        <div className="pull-right">
          <a href="/rooms/new" className="btn btn-success">New</a>
        </div>
      </div>
    )
  }
})
var RoomRow = React.createClass({
  render: function () {
    return (
      <div className="col-xs-6 col-lg-4">
        <h2>{this.props.room.Title}</h2>
        <p>{this.props.room.People}/{this.props.room.Limit}</p>
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
    feed.init(function(data){
      rsp = JSON.parse(data);
      rooms[rsp.Id] = rsp;
      this.setState({rooms: rooms});
    }.bind(this));
    feed.onChange(function(data){
      rsp = JSON.parse(data);
      switch(rsp.action) {
      case "roominfo":
        rooms[rsp.room.Id] = rsp.room;
        this.setState({rooms: rooms});
        break;
      case "del":
        rooms = this.state.rooms;
        delete rooms[rsp.room.Id];
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
        <CreateRoom />
        <div className="col-xs-12 col-sm-9">

          <RoomsBox rooms={this.state.rooms} />
        </div>
      </div>
    );
  }
});
React.render(<HomePage />, document.getElementById('main'));