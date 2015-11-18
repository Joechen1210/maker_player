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
    },
    getComputedStyle = function(el, pseudo) {
      return function(prop) {
        if (window.getComputedStyle) {
          return window.getComputedStyle(el, pseudo)[prop];
        } else {
          return el.currentStyle[prop];
        }
      };
    },
    offsetParent = function(el) {
      if (el.nodeName !== 'HTML' && getComputedStyle(el)('position') === 'relative') {
        return offsetParent(el.offsetParent);
      }
      return el;
    },
    getVisibleWidth = function(el, width) {
      var clip;

      if (width) {
        return parseFloat(width);
      }

      clip = getComputedStyle(el)('clip');
      if (clip !== 'auto' && clip !== 'inherit') {
        clip = clip.split(/(?:\(|\))/)[1].split(/(?:,| )/);
        if (clip.length === 4) {
          return (parseFloat(clip[1]) - parseFloat(clip[3]));
        }
      }
      return 0;
    },
    getScrollOffset = function() {
      if (window.pageXOffset) {
        return {
          x: window.pageXOffset,
          y: window.pageYOffset
        };
      }
      return {
        x: document.documentElement.scrollLeft,
        y: document.documentElement.scrollTop
      };
    };

  /**
   * register the thubmnails plugin
   */
  videojs.plugin('thumbnails', function(options) {
    var div, settings, img, player, progressControl, duration, moveListener, moveCancel, du, num, time, crright;
    settings = extend({}, defaults, options);
    player = this;
    progressControl = player.controlBar.progressControl;
    progressControl.el().style.position = 'relative';
    
    player.ready(function(){
    settings = extend({}, defaults, options);
    
    for(var i = 0; i < Object.keys(settings).length; i++)
    {
    progressControl = player.controlBar.progressControl;
    time = settings[i].time;
    
    makerpoint = document.createElement('div');
    makerpoint.className = 'vjs-makerpoint ';
    makerpoint.className += 'vjs-makerpoint-' + time;
    makerpoint.id = time;
    makerbt = document.createElement('button');
    makerbt.className = 'vjs-makerbt';
    
    
    sec_num = player.duration();
    time1 = (time/Math.floor(sec_num))*100;
    makerpoint.style.left = time1 + '%';
    
    // when the container is MP4
    player.on('durationchange', function(event) {
      sec_num = player.duration();
      time1 = (time/Math.floor(sec_num))*100;
      makerpoint.style.left = time1 + '%';
    });

    // when the container is HLS
    player.on('loadedmetadata', function(event) {
      sec_num = player.duration();
      time1 = (time/Math.floor(sec_num))*100;
      makerpoint.style.left = time1 + '%';
    });
    
    makerpoint.addEventListener('click', makerclickevent, false);
    
    progressControl.el().appendChild(makerpoint);
    
    }
    
     function makerclickevent(e) {
     var clickedItem = e.target.id;
     var t = parseInt(clickedItem);
     player.currentTime(t);
     //alert("Hello " + clickedItem);
     }
    
    });
    
   
    (function() {
      var progressControl, addFakeActive, removeFakeActive;
      // Android doesn't support :active and :hover on non-anchor and non-button elements
      // so, we need to fake the :active selector for thumbnails to show up.
      if (navigator.userAgent.toLowerCase().indexOf("android") !== -1) {
        progressControl = player.controlBar.progressControl;

        addFakeActive = function() {
          progressControl.addClass('fake-active');
        };
        removeFakeActive = function() {
          progressControl.removeClass('fake-active');
        };

        progressControl.on('touchstart', addFakeActive);
        progressControl.on('touchend', removeFakeActive);
        progressControl.on('touchcancel', removeFakeActive);
      }
    })();

    // create the thumbnail
    div = document.createElement('div');
    div.className = 'vjs-thumbnail-holder';
    img = document.createElement('img');
    div.appendChild(img);
    img.src = settings[0].src;
    img.className = 'vjs-thumbnail';
    extend(img.style, settings[0].style);
  
    // center the thumbnail over the cursor if an offset wasn't provided
    /*if (!img.style.left && !img.style.right) {
      img.onload = function() {
        img.style.left = (img.naturalWidth / 2) + 'px';
      };
    }*/
  
    // keep track of the duration to calculate correct thumbnail to display
   du = player.duration();

    
    // when the container is MP4
    player.on('durationchange', function(event) {
      du = player.duration();
    });

    // when the container is HLS
    player.on('loadedmetadata', function(event) {
      du = player.duration();
    });

    // add the thumbnail to the player
    progressControl = player.controlBar.progressControl;
    progressControl.el().appendChild(div);
    //progressControl.el().appendChild(makerpoint);

    moveListener = function(event) {
      var mouseTime, time, active, left, setting, pageX, right, width, halfWidth, pageXOffset, clientRect, ac;
      active = 0;
      pageXOffset = getScrollOffset().x;
      clientRect = offsetParent(progressControl.el()).getBoundingClientRect();
      right = (clientRect.width || clientRect.right) + pageXOffset;
      
     console.log( "clientRectright:" + right + " pageXOffset: " + pageXOffset + "progressControl.el()." );
     console.log(
    'page: ' + event.pageX + ',' + event.pageY, 
    'client: ' + event.clientX + ',' + event.clientY, 
    'screen: ' + event.screenX + ',' + event.screenY)
     
      pageX = event.pageX;
      if (event.changedTouches) {
        pageX = event.changedTouches[0].pageX;
      }
      console.log( "pagex:" + pageX );
      
      // find the page offset of the mouse
      left = pageX || (event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft);
      console.log( " left1: " + left + " offsetParent(progressControl.el()).getBoundingClientRect().left: " + offsetParent(progressControl.el()).getBoundingClientRect().left + " pageXOffset: " + pageXOffset);
      // subtract the page offset of the positioned offset parent
      left -= offsetParent(progressControl.el()).getBoundingClientRect().left + pageXOffset;
    
     console.log( "left2:" + left + " progressControl.el().offsetLeft: " + progressControl.el().offsetLeft + " progressControl.width() " + progressControl.width() + " du: " + du );
      // apply updated styles to the thumbnail if necessary
      // mouseTime is the position of the mouse along the progress control bar
      // `left` applies to the mouse position relative to the player so we need
      // to remove the progress control's left offset to know the mouse position
      // relative to the progress control
      mouseTime = Math.floor((left - progressControl.el().offsetLeft) / progressControl.width() * du);
      /*for (time in settings) {
        if (mouseTime > time) {
          active = Math.max(active, time);
        }
      }*/
      console.log( "mouseTime:" + mouseTime );
      
       for(var i=0; i < Object.keys(settings).length; i++)
       {
          time = settings[i].time;
          if (mouseTime > time) {
          active = Math.max(active, time);
         // ac = (active - 1);
           }
       }
       console.log( "active:" + active + " ac: " + ac);
    
      for(var i=0; i < Object.keys(settings).length; i++)
      {
        if(settings[i].time === active)
        {
          setting = settings[i];
          if (setting.src && img.src != setting.src) {
          img.src = setting.src;
          }
          if (setting.style && img.style != setting.style) {
           extend(img.style, setting.style);
          }
        }
      }
      width = getVisibleWidth(img, setting.width || settings[0].width);
      halfWidth = width / 2;
      
       console.log(" halfWidth: " + halfWidth + " width: " + width + " setting.width: " + setting.width + " settings[0].width: " + settings[0].width + "  left: " + left + " right: " + right);

      // make sure that the thumbnail doesn't fall off the right side of the left side of the player
      if ( (left + halfWidth) > right ) {
        left -= (left + halfWidth) - right;
      } else if (left < halfWidth) {
        left = halfWidth;
      }
      
      console.log( "left3:" + left );
      
      div.style.left = left + 'px';
    };

    // update the thumbnail while hovering
    progressControl.on('mousemove', moveListener);
    progressControl.on('touchmove', moveListener);

    moveCancel = function(event) {
      div.style.left = '-1000px';
    };

    // move the placeholder out of the way when not hovering
    progressControl.on('mouseout', moveCancel);
    progressControl.on('touchcancel', moveCancel);
    progressControl.on('touchend', moveCancel);
    player.on('userinactive', moveCancel);
  });
})();
