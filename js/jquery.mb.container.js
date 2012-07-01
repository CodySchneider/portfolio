/*******************************************************************************
 jquery.mb.components
 Copyright (c) 2001-2012. Matteo Bicocchi (Pupunzi); Open lab srl, Firenze - Italy
 email: mbicocchi@open-lab.com
 site: http://pupunzi.com

 Licences: MIT, GPL
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html
 ******************************************************************************/

/*
 * jQuery.mb.components: mb.container+
 * version: - 18/03/12 - 21
 * © 2001 - 2012 Matteo Bicocchi (pupunzi), Open Lab
 */


(function($){

  $.containerize={
    author:"Matteo Bicocchi",
    version:"3.0",
    defaults:{
      containment:"document",
      elementsPath:"elements/",
      dockedIconDim:35,
      onLoad:function(o){},
      onCollapse:function(o){},
      onBeforeIconize:function(o){},
      onIconize:function(o){},
      onClose: function(o){},
      onBeforeClose: function(o){},
      onResize: function(o,w,h){},
      onDrag: function(o,x,y){},
      onRestore:function(o){},
      onFullScreen:function(o){},
      mantainOnWindow:true,
      effectDuration:100,
      zIndexContext:"auto" // or your selector (ex: ".containerPlus")
    },

    init:function(opt){
      if(typeof opt === "string"){

        var method=opt;
        delete arguments[0];
        var params = [];

        for (var i=0; i<= arguments.length; i++){
          if(arguments[i])
            params.push(arguments[i]);
        }

        if($.containerize.methods[method])
          this.each(function(){
            $.containerize.methods[method].apply(this, params);
          });
        return false;
      }

      $(window).bind("resize",function(){
        $(".mbc_container").each(function(){
          var el = this;
          el.$.containerize("windowResize");
        })
      });

      return this.each(function(){
        var el= this;
        el.$=$(el);

        el.opt = {};
        $.extend (el.opt, $.containerize.defaults, opt);
        $.containerize.build(el);
        el.$.css("visibility","visible");
      });
    },

    build:function(el){

      el.$.css({opacity:0});
      el.id = el.id ? el.id : "mbc_" + new Date().getTime();
      var titleText = el.$.find("h2:first");
      el.$.find("h2:first").remove();
      var HTML = el.$.html();

      el.$.empty();

      el.$.addClass("mbc_container");

      var header = $("<div/>").addClass("mbc_header");
      var title = $("<div/>").addClass("mbc_title").html(titleText);
      var buttonBar = $("<div/>").addClass("mbc_buttonBar");
      var toolBar = $("<div/>").addClass("mbc_toolBar");

      var content = $("<div/>").addClass("mbc_content").html(HTML);
      var footer = $("<div/>").addClass("mbc_footer").unselectable();

      header.append(title).append(buttonBar).append(toolBar).addTouch();
      el.$.append(content).append(header).append(footer);

      el.header = header;
      el.containerTitle = title;
      el.footer = footer;
      el.content = content;
      el.toolBar = toolBar;
      el.buttonBar = buttonBar;

      el.$.bind("mousedown",function(){
        $(this).mb_bringToFront();
      });

      el.content.bind("touchmove",function(e){
        e.originalEvent.stopPropagation();
      });

      if(el.$.data("drag"))
        el.$.addClass("draggable");
      if(el.$.data("resize"))
        el.$.addClass("resizable");

      $.containerize.applyMethods(el).addTouch();
      setTimeout(function(){
        el.$.containerize("adjust");
        if(!el.isClosed)
          el.$.fadeTo(300,1);
        el.$.trigger("ready");

        $(window).trigger("resize");
      },500);

      if(typeof el.opt.onLoad === "function")
        el.opt.onLoad(el);
    },

    applyMethods:function(el, data){
      var properties = el.$.data();
      if(data)
        properties = properties[data];

      for (var els in properties){
        if(typeof $.containerize.methods[els] == "function" && properties[els]){
          var params=[];
          if(typeof properties[els] != "boolean")
            params.push(properties[els]);
          $.containerize.methods[els].apply(el,params);
        }
      }
      return el.$;
    },

    methods:{

      drag:function(){
        var el = this;

        if(el.$.css("position") == "relative" || el.$.css("position") == "static"){
          el.$.css("position","absolute");
        }

        if(!el.isDraggable){
          el.$.draggable({
            handle:".mbc_header",
            start:function(e,ui){
              ui.helper.addClass("dragging");
            },
            drag:function(){

              if(typeof el.opt.onDrag === "function")
                el.opt.onDrag(el);

              el.$.trigger("drag");

            },
            stop:function(e,ui){
              ui.helper.removeClass("dragging");
              el.$.trigger("dragged");
            },
            containment: el.$.containerize("setContainment")
          });
          el.isDraggable=true;
          return el.$;
        }
      },

      resize:function(){
        var el = this;

        el.position = el.$.data("drag") ?
                (el.$.css("position") == "relative" || el.$.css("position") == "static") ? el.$.css("position","absolute")
                        : el.$.css("position") :  el.$.css("position");

        if(!el.isResizable){
          el.$.resizable({
            helper: "mbproxy",
            start:function(e,ui){
              el.$.css("position",el.position);
              var elH= el.$.data("containment")?el.$.parents().height():$(window).height()+$(window).scrollTop();
              var elW= el.$.data("containment")?el.$.parents().width():$(window).width()+$(window).scrollLeft();
              var elPos= el.$.data("containment")? el.$.position():el.$.offset();
              el.$.resizable('option', 'maxHeight',elH-(elPos.top+20));
              el.$.resizable('option', 'maxWidth',elW-(elPos.left+20));
              ui.helper.mb_bringToFront();
            },
            resize:function(){
              if(typeof el.opt.onResize === "function")
                el.opt.onResize(el);

              el.$.trigger("resize");
            },
            stop:function(e,ui){
              var container= ui.element;
              container.containerize("adjust");
              container.containerize("setContainment");
              ui.helper.mb_bringToFront();
              el.$.trigger("resized");

            }
          });
          el.isResizable=true;
        }
        return el.$;
      },

      setContainment:function(containment){
        var el = this;

        containment = !containment ? el.$.data("containment") : containment;

        if(!containment)
          return false;

        el.$.data("containment", containment);
        if(containment == "document"){
          var dH=($(document).height()-(el.$.outerHeight()+10));
          var dW=($(document).width()-(el.$.outerWidth()+10));
          containment= [0,0,dW,dH]; //[x1, y1, x2, y2]
        }
        if(el.$.data("drag") && containment!=""){
          el.$.draggable('option', 'containment', containment);
        }
        return containment;
      },

      close:function(animate){
        var el = this;

        if(el.isClosed)
          return;

        var time= animate ? animate : 0;

        if(typeof el.opt.onBeforeClose === "function")
          el.opt.onBeforeClose(el);

        el.$.fadeOut(time,function(){

            if(typeof el.opt.onClose === "function")
              el.opt.onClose(el);

          });

        el.isClosed=true;
        return el.$;
      },

      open:function(animate){
        var el = this;

        var time= animate ? animate : 0;
        if(el.isClosed)
          el.$.fadeIn(time);
        el.isClosed=false;
        return el.$;
      },

      collapse:function(){
        var el = this;

        el.containerTitle.bind("dblclick",function(){
          if(!el.isCollapsed){
            el.h= el.$.outerHeight();
            el.minH = el.$.css("min-height");

            el.$.css("min-height",0);

            el.content.hide();
            el.buttonBar.hide();
            el.footer.hide();

            var height = parseFloat(el.header.outerHeight());
            el.$.animate({height:height},el.opt.effectDuration,function(){
              el.$.containerize("setContainment");
            });
            el.$.resizable("disable");
            el.isCollapsed = true;

            if(typeof el.opt.onCollapse === "function")
              el.opt.onCollapse(el);

          }else{
            el.$.animate({height:el.h},el.opt.effectDuration,function(){
              el.$.css("min-height",el.minH);
              el.content.show();
              el.buttonBar.show();
              el.footer.show();
              el.$.resizable("enable");
              el.$.containerize("setContainment");

              if(typeof el.opt.onRestore === "function")
                el.opt.onRestore(el);

            });
            el.isCollapsed = false;
          }
        })
      },

      skin:function(skin){
        var el = this;
        if(!skin){
          el.$.removeClass(el.$.data("skin"));
          return;
        }

        el.$.addClass(skin);
        el.$.data("skin",skin);


        el.$.containerize("adjust");
        return el.$;
      },

      adjust:function(){
        var el = this;
        var h= parseFloat(el.$.outerHeight()) - parseFloat(el.$.find(".mbc_header").outerHeight()) - parseFloat(el.$.find(".mbc_footer").outerHeight());
        el.$.find(".mbc_content").css({height:h});
        el.$.find(".mbc_content").css({marginTop:parseFloat(el.$.find(".mbc_header").outerHeight())});
        return el.$;
      },

      storeView:function(){
        var el = this;
        el.oWidth= el.$.css("width");
        el.oHeight= el.$.css("height");
        el.oTop= el.$.css("top");
        el.oLeft= el.$.css("left");
      },

      restoreView:function(animate){
        var el = this;

        el.$.containerize("open");
        el.$.animate({top:el.oTop, left:el.oLeft, width:el.oWidth, height: el.oHeight, opacity:1}, animate ? el.opt.effectDuration : 0, function(){
          el.content.css({overflow:"auto"});
          el.$.containerize("adjust");

        })
      },

      windowResize:function(){
        var el = this;

        el.$.containerize("setContainment", el.$.data("containment"))
      },

      alwaisontop:function(el){
        el.zi=el.$.css("z-index");
        el.$.css("z-index",100000).addClass("alwaysOnTop");
      },

      draggrid:function(xy){
        var el = this;

        if(!xy)
          return;

        var split = xy.split(",");
        var grid = [parseFloat(split[0]),parseFloat(split[1])];

        if(el.$.data("drag"))
          setTimeout(function(){
            el.$.draggable('option', 'grid', grid);
          },1);
        return grid;
      },

      resizegrid:function(xy){
        var el = this;

        if(!xy)
          return;

        var split = xy.split(",");
        var grid = [parseFloat(split[0]),parseFloat(split[1])];

        if(el.$.data("drag"))
          setTimeout(function(){
            el.$.resizable('option', 'grid', grid);
          },1);
        return grid;
      },
      addtobuttonbar:function(btn){
        var el = this;
        for (var i=0; i<= btn.length; i++){
          if(btn[i]!=undefined){
            var button = $(btn[i]).clone(true);
            el.buttonBar.append(button);
          }
        }
      },
      addtotoolbar:function(btn){
        var el = this;
        for (var i=0; i<= btn.length; i++){
          if(btn[i]!=undefined){
            var button = $(btn[i]).clone(true);
            el.toolBar.append(button);
          }
        }
      },
      iconize:function(dockId){
        var el = this;
        if(el.fullscreen)
          return;
        el.$.containerize("storeView");

        if(typeof el.opt.onBeforeIconize === "function")
          el.opt.onBeforeIconize(el);

        var t = dockId ? $("#"+dockId).offset().top : el.$.css("top");
        var l = dockId ? $("#"+dockId).offset().left : 0;
        el.content.css({overflow:"hidden"});
        el.$.animate({top:t,left:l,width:0,height:0,opacity:0},el.opt.effectDuration, function(){
          $(this).containerize("close");
          if(!dockId){
            el.iconElement = $("<div/>").addClass("containerIcon "+ el.$.data("skin")).css({position:"absolute", top:t, left:l});
            var title = $("<span/>").addClass("mbc_title").html(el.containerTitle.html());
            el.iconElement.append(title);
            $("body").append(el.iconElement);
          }else{
            el.iconElement = $("<span/>").addClass("containerDocked").html(el.containerTitle.html());
            $("#"+dockId).append(el.iconElement);
      }
          el.$.trigger("iconized");

          if(typeof el.opt.onIconize === "function")
            el.opt.onIconize(el);

          el.iconElement.bind("click",function(){
            $(this).remove();
            el.$.containerize("restoreView",true);
            el.$.mb_bringToFront();
            el.$.trigger("restored");

            if(typeof el.opt.onRestore === "function")
              el.opt.onRestore(el);
          })
        });
    },
      fullScreen:function(){
        var el = this;
        if(!el.fullscreen){
          if(el.$.data("resize"))
            el.$.resizable("disable");
          el.$.draggable("disable");
          el.oWidth= el.$.outerWidth();
          el.oHeight= el.$.outerHeight();
          el.oTop= el.$.position().top;
          el.oLeft= el.$.position().left;
          el.oPos= el.$.css("position");
          el.$.css({top:0,left:0, width:$(window).width(), height:$(window).height(), position:"fixed"});
          el.$.containerize("adjust");
          el.fullscreen=true;

          if(typeof el.opt.onFullScreen === "function")
            el.opt.onFullScreen(el);

        }else{
          if(el.$.data("resize"))
            el.$.resizable("enable");
          if(el.$.data("drag"))
            el.$.draggable("enable");
          el.$.css({top:el.oTop,left:el.oLeft, width:el.oWidth, height:el.oHeight, position: el.oPos});
          el.$.containerize("adjust");
          el.fullscreen=false;
        }
      },
      rememberme:function(){
        var el = this;
        el.$.bind("resized",function(){
          $.mbCookie.set(el.id+"_w", el.$.outerWidth(),7);
          $.mbCookie.set(el.id+"_h", el.$.outerHeight(),7);
        });
        el.$.bind("dragged",function(){
          $.mbCookie.set(el.id+"_t", el.$.css("top"),7);
          $.mbCookie.set(el.id+"_l", el.$.css("left"),7);
        });

        el.$.bind("iconized",function(){
          $.mbCookie.set(el.id+"_iconized", true,7);
        });

        el.$.bind("restored",function(){
          $.mbCookie.remove(el.id+"_iconized");
        });

        var w = $.mbCookie.get(el.id+"_w") ? $.mbCookie.get(el.id+"_w") : el.$.css("width");
        var h = $.mbCookie.get(el.id+"_h") ? $.mbCookie.get(el.id+"_h") : el.$.css("height");
        var t = $.mbCookie.get(el.id+"_t") ? $.mbCookie.get(el.id+"_t") : el.$.css("top");
        var l = $.mbCookie.get(el.id+"_l") ? $.mbCookie.get(el.id+"_l") : el.$.css("left");
        el.$.css({width:w, height:h, left:l, top:t});

        if($.mbCookie.get(el.id+"_iconized")){
          el.$.containerize("close");
          el.$.containerize("iconize");
        }
      }
    },

    addMethod:function(name, fn){
      $.containerize.methods[name]=fn;
    }
  };

  $.fn.containerize = $.containerize.init;


  $.fn.unselectable=function(){
    return this.each(function(){
      $(this).css({
        "-moz-user-select": "none",
        "-khtml-user-select": "none",
        "user-select": "none"
      }).attr("unselectable","on");
    });
  };

  $.fn.clearUnselectable=function(){
    return this.each(function(){
      $(this).css({
        "-moz-user-select": "auto",
        "-khtml-user-select": "auto",
        "user-select": "auto"
      });
      $(this).removeAttr("unselectable");
    });
  };

  /*COOKIES methods
   * -----------------------------------------------------------------*/
  $.mbCookie = {
    set: function(name,value,days, domain) {
      if (!days) days=7;
      domain= domain ?  "; domain="+domain : "";
      var date = new Date(), expires;
      date.setTime(date.getTime()+(days*24*60*60*1000));
      expires = "; expires="+date.toGMTString();
      document.cookie = name + "="+value+expires+"; path=/" + domain;
    },
    get: function(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
    },
    remove: function(name) {
      $.mbCookie.set(name,"",-1);
    }
  };

  /*-----------------------------------------------------------------*/

  $.fn.addTouch = function(){
    this.each(function(i,el){
      $(el).bind('touchstart touchmove touchend touchcancel',function(){
        //we pass the original event object because the jQuery event
        //object is normalized to w3c specs and does not provide the TouchList
        handleTouch(event);
      });
    });

    var handleTouch = function(event)
    {
      var touches = event.changedTouches,
              first = touches[0],
              type = '';

      switch(event.type)
      {
        case 'touchstart':
          type = 'mousedown';
          break;

        case 'touchmove':
          type = 'mousemove';
          event.preventDefault();
          break;

        case 'touchend':
          type = 'mouseup';
          break;

        default:
          return;
      }

      var simulatedEvent = document.createEvent('MouseEvent');
      simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0/*left*/, null);

      first.target.dispatchEvent(simulatedEvent);

    };
  };

  jQuery.fn.mb_bringToFront= function(zIndexContext){
    var zi=1;
    var els= zIndexContext && zIndexContext!="auto" ? $(zIndexContext): $("*");
    els.not(".alwaysOnTop").each(function() {
      if($(this).css("position")!="static"){
        var cur = parseInt($(this).css('zIndex'));
        zi = cur > zi ? parseInt($(this).css('zIndex')) : zi;
      }
    });
    $(this).not(".alwaysOnTop").css('zIndex',zi+=1);
    return zi;
  };

})(jQuery);
