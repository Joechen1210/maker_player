(function() {
  var defaults = {
      0: {
        src: 'example-thumbnail.png'
      }
    },
    extend = function() {
      var args, target, i, object, property;
      args = Array.prototype.slice.call(arguments);
      target = args.shift() || {};
      for (i in args) {
        object = args[i];
        for (property in object) {
          if (object.hasOwnProperty(property)) {
            if (typeof object[property] === 'object') {
              target[property] = extend(target[property], object[property]);
            } else {
              target[property] = object[property];
            }
          }
        }
      }
      return target;
    };

  /**
   * register the thubmnails plugin
   */
  videojs.plugin('makerpoint', function(options) {
    var div, settings, img, player, progressControl, duration, moveListener, moveCancel, du, num, time, makerclassname, makerpoint;
    settings = extend({}, defaults, options);
    player = this;
    progressControl = player.controlBar.progressControl;
    progressControl.el().style.position = 'relative';
    
    player.ready(function(){
    settings = extend({}, defaults, options);
    
    console.log( " Length " + Object.keys(settings).length);
    
    for(var i = 0; i < Object.keys(settings).length; i++)
    {
    progressControl = player.controlBar.progressControl;
    time = settings[i].time;
    
    console.log( " No: " + i + " time: " + time);
    
    makerpoint = document.createElement('div');
    makerpoint.className = 'vjs-makerpoint ';
    makerpoint.className += 'vjs-makerpoint-' + i;
    makerpoint.id = time;
    makerbt = document.createElement('button');
    makerbt.className = 'vjs-makerbt';
    
    sec_num = player.duration();
    time1 = (time/Math.floor(sec_num))*100;
    makerpoint.style.left = time1 + '%';
    
    console.log(" No: " + i + " duration1: " + sec_num + " left1: " + time1);
    
    makerpoint.addEventListener('click', makerclickevent, false);
    
    progressControl.el().appendChild(makerpoint);
    
    }
    
     // when the container is MP4
    player.on('durationchange', function(event) {
      var makerpoint;
       for(var i = 0; i < Object.keys(settings).length; i++)
    {
      makerpoint = document.getElementById(i);
      sec_num = player.duration();
      time1 = (time/Math.floor(sec_num))*100;
      makerpoint.style.left = time1 + '%';
      console.log(" No: " + i +  " duration2: " + sec_num + " left2: " + time1);
    }
    });

    // when the container is HLS
    player.on('loadedmetadata', function(event) {
      var makerpoint;
       for(var i = 0; i < Object.keys(settings).length; i++)
    {
      makerpoint = document.getElementById(i);
      sec_num = player.duration();
      time1 = (time/Math.floor(sec_num))*100;
      makerpoint.style.left = time1 + '%';
      console.log( " No: " + i + " duration3: " + sec_num + " left3: " + time1);
    }
    });
     function makerclickevent(e) {
     var clickedItem = e.target.id;
     var t = parseInt(clickedItem);
     player.currentTime(t);
     //alert("Hello " + clickedItem);
     }
    
    });
  });
})();
