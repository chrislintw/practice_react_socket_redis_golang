var RoomForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var title = this.refs.title.getDOMNode().value.trim();
    var password = this.refs.password.getDOMNode().value.trim();
    if (!title) {
      return;
    }
    this.props.onRoomSubmit({title: title, password: password});
  },
  render: function(){
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group" >
          <label htmlFor="room_title" className="col-sm-2 control-label">Title</label>
          <div className="col-sm-10">
            <input type="text" name="room[title]" className="form-control" id="room_title" placeholder="Title" ref="title" />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="room_password" className="col-sm-2 control-label">Password</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" name="room[password]" id="room_password" placeholder="Password" ref="password" />
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button type="submit" className="btn btn-default">Create</button>
          </div>
        </div>
      </form>
    )
  }
});

var HomePage = React.createClass({
  getInitialState: function() {
    var room = {};

    return {room: room};
  },
  handleRoomSubmit: function(data){
    console.log(data)
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: data,
      success: function(data) {
        console.log(data)
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    return false;
  },
  render: function () {
    return (
      <div className="row row-offcanvas row-offcanvas-right">
        <div className="col-xs-8">
          <div className="row">
            <RoomForm onRoomSubmit={this.handleRoomSubmit} />
          </div>
        </div>
      </div>
    );
  }
});
React.render(<HomePage url="/rooms" />, document.getElementById('main'));