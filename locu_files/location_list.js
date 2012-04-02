function locationList(selector){
  var target = $(selector);
  var locations = saveable("locations", []);
  var selectEvt = new Callbacks();
  var newEvt = new Callbacks();
  var self = this;

  this.add = function(tag, lat, lng){
    locations.push({
      tag: tag,
      coords : {
        latitude: lat,
        longitude: lng
      }
    });  
    locations.save();
    render();
  };

  this.remove = function(tag) {
    var index = _.find(locations, function(value) {
      return value.tag === tag;
    });
    locations.splice(index,1);
  };

  this.coordsFor = function(tag) {
    var index = _.find(locations, function(val) {
      return value.tag === tag;
    });
    return locations[index].coords;
  } 

  this.onSelected = function(func){
    selectEvt.add(func);      
  }

  this.onNew = function(func){
    newEvt.add(func);      
  }

  function invokeSelected(loc){
    selectEvt.invoke(loc);
  }

  function invokeNew() {
    newEvt.invoke();
  }

  function locp(coords) {
    function s(v){
      if( v < 0) {
        return "+"+v;
      }
      return ""+v;
    }
    
    return s(coords.latitude) + "," + s(coords.longitude);
  }

  function render() {
    target.empty();
    _.each(locations, function (loc){
      $(ich.locButton(loc)).appendTo(target)
      .click(function() {
        navigator.geolocation.getCurrentPosition(function(geo){
          var url = "http://maps.google.com/maps?";
          var p = $.params({
            saddr: locp(geo.coords),
            daddr: locp(loc.coords),
            dirflg: 'r',
            z: 15,
            ttype: 'now'
          });
          window.location = url + p;
        },
        function(){
          alert("Could not find your position");
        })
      });
    });

    $("<div></div>").appendTo(target).addClass("bottom");

    ich.optButton({text: "Add From Search"})
      .appendTo(target.find(".bottom"))
      .click(invokeNew);

    ich.optButton({text: "Add Current Location"})
      .appendTo(target.find(".bottom"))
      .click(addCurrent);
  }

  function addCurrent(){
    navigator.geolocation.getCurrentPosition(function(geo) {
        var tag = prompt("What is the name of this place?");
        if(tag) {
          self.add(tag, geo.coords.latitude, geo.coords.longitude);
        }
      }, 
      function(err) {
        alert("Could not find your location");
    });
  }

  render();
}
