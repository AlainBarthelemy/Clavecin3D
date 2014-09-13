/**
    Touch box - Enabled resize, drag & rotate of DOM elements on the web touch devices & modern browsers.
    Copyright (C) 2013 Dannie Hansen
 
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
**/
;(function ($) {
    "use strict";
    
    var undef, zindex = 400, propNameTransform = 'Transform', propNameTransformOrigin = 'TransformOrigin', transformProps = [
		'O',
		'ms',
		'Webkit',
		'Moz'
	], i = transformProps.length, div = document.createElement('div'), divStyle = div.style;
    
    while(i--) {
        if((transformProps[i]+propNameTransform) in divStyle) {
            propNameTransform = transformProps[i]+propNameTransform;
            propNameTransformOrigin = transformProps[i]+propNameTransformOrigin;
        }
    }
    
    function getRotationAngle(touch1X, touch1Y, touch2X, touch2Y) {
        var x = touch1X - touch2X,
            y = touch1Y - touch2Y,
            radiant = Math.atan2(y, x);
		
        return (radiant * 180 / Math.PI);	
    }
    
    $.fn.TouchBox = function (options) {
        var defaults = {
            drag: false,
            resize: false,
            rotate: false,
			grid_drag: 1,
            callback_touches: null,
            callback_size_change: null,
            callback_position_change: null,
            callback_degree_change: null
        }
        
        if(options != undef) $.extend(defaults, options);
        
        this.each(function () {
            var $this = $(this);
			
			$.data($this[0], 'options', defaults);
			
			$.data($this[0], 'touches', 0);
			$.data($this[0], 'diffX', 0);
			$.data($this[0], 'diffY', 0);
			$.data($this[0], 'startWidth', 0);
			$.data($this[0], 'startHeight', 0);
			$.data($this[0], 'startDistance', 0);
			$.data($this[0], 'ignoreTouch', false);
			$.data($this[0], 'startX', 0);
			$.data($this[0], 'startY', 0);
			$.data($this[0], 'rotatePoint1X', 0);
			$.data($this[0], 'rotatePoint1Y', 0);
			$.data($this[0], 'rotatePoint2X', 0);
			$.data($this[0], 'rotatePoint2Y', 0);
			$.data($this[0], 'rotation', false);
			$.data($this[0], 'startDegree', 0);
			$.data($this[0], 'currDegree', 0);
			$.data($this[0], '_startDegree', 0);
			
            if(defaults.rotate) $this.css(propNameTransformOrigin, 'center center');
            
			this.draggable = false;
			
            $this.unbind('touchstart.touchBox mousedown.touchBox').bind('touchstart.touchBox mousedown.touchBox', function (e) {
				var $thiz = $(this),
					pageX = (typeof e.pageX != 'undefined' ? e.pageX : e.originalEvent.touches[0].pageX),
					pageY = (typeof e.pageY != 'undefined' ? e.pageY : e.originalEvent.touches[0].pageY),
					ignoreTouch = $.data($thiz[0], 'ignoreTouch'),
					touches = (typeof e.pageX != 'undefined' ? 1 : e.originalEvent.touches.length),
					options = $.data($thiz[0], 'options');
				
				zindex += 1;
				
				$thiz.css({ zIndex: zindex });
				$.data($thiz[0], 'touches', touches);
				
				if(ignoreTouch) {
					ignoreTouch = false;
					$.data($thiz[0], 'ignoreTouch', ignoreTouch);
				}
				
				if(!ignoreTouch) {
					var offsetLeft = parseFloat($thiz.css('left'), 10),
						offsetTop = parseFloat($thiz.css('top'), 10),
						x = pageX,
						y = pageY;
					
					$.data($thiz[0], 'startX', offsetLeft);
					$.data($thiz[0], 'startY', offsetTop);
					
					$.data($thiz[0], 'diffX',  (x - offsetLeft));
					$.data($thiz[0], 'diffY', (y - offsetTop));
				}
				
				if(options.rotate) {
					if(touches == 1) {
						$.data($thiz[0], 'rotatePoint1X', pageX);
						$.data($thiz[0], 'rotatePoint1Y', pageY);
					} else if(touches == 2) {
						var rotatePoint2X = e.originalEvent.touches[1].pageX,
							rotatePoint2Y = e.originalEvent.touches[1].pageY,
							rotatePoint1X = $.data($thiz[0], 'rotatePoint1X'),
							rotatePoint1Y = $.data($thiz[0], 'rotatePoint1Y');
						
						$.data($thiz[0], 'rotatePoint2X', rotatePoint2X);
						$.data($thiz[0], 'rotatePoint2Y', rotatePoint2Y);
						
						$.data($thiz[0], 'startDegree', getRotationAngle(rotatePoint1X, rotatePoint1Y, rotatePoint2X, rotatePoint2Y));
						$.data($thiz[0], '_startDegree', $.data($thiz[0], 'currDegree'));
						
						$.data($thiz[0], 'rotation', true);
					}
				}
				
				if(options.resize && touches == 2) {
					$.data($thiz[0], 'startWidth', $this.width());
					$.data($thiz[0], 'startHeight', $this.height());
					
					var x = e.originalEvent.touches[0].pageX,
						y = e.originalEvent.touches[0].pageY,
						x2 = e.originalEvent.touches[1].pageX,
						y2 = e.originalEvent.touches[1].pageY,
						xd = (x2 - x),
						yd = (y2 - y),
						distance = Math.sqrt((xd * xd) + (yd * yd));
					
					$.data($thiz[0], 'startDistance', distance);
				}
            }).unbind('touchmove.touchBox mousemove.touchBox').bind('touchmove.touchBox mousemove.touchBox', function (e) {
				var $thiz = $(this),
					touches = $.data($thiz[0], 'touches'),
					options = $.data($thiz[0], 'options');
				
				if(options.callback_touches != null) options.callback_touches.apply(this, [touches]);
				
				if(options.resize && touches == 2) {
					var x = e.originalEvent.touches[0].pageX,
						y = e.originalEvent.touches[0].pageY,
						x2 = e.originalEvent.touches[1].pageX,
						y2 = e.originalEvent.touches[1].pageY,
						xd = (x2 - x),
						yd = (y2 - y),
						distance = Math.sqrt((xd * xd) + (yd * yd)),
						halfDistance = ((distance - $.data($thiz[0], 'startDistance')) / 2),
						newWidth = ($.data($thiz[0], 'startWidth') + (distance - $.data($thiz[0], 'startDistance'))),
						newHeight = ($.data($thiz[0], 'startHeight') + (distance - $.data($thiz[0], 'startDistance'))),
						newLeft = ($.data($thiz[0], 'startX') - halfDistance),
						newTop = ($.data($thiz[0], 'startY') - halfDistance);
					
					$this.css({
						width: newWidth + 'px',
						height: newHeight + 'px',
						left: newLeft + 'px',
						top: newTop + 'px'
					});
					
					if(options.callback_size_change != null) options.callback_size_change.apply(this, [newWidth, newHeight]);
					if(options.callback_position_change != null) options.callback_position_change.apply(this, [newLeft, newTop]);
				}
				
				if(options.drag && !$.data($thiz[0], 'ignoreTouch') && touches == 1) {
					var x = (typeof e.pageX != 'undefined' ? e.pageX : e.originalEvent.touches[0].pageX),
						y = (typeof e.pageY != 'undefined' ? e.pageY : e.originalEvent.touches[0].pageY),
						newLeft = (x - $.data($thiz[0], 'diffX')),
						newTop = (y - $.data($thiz[0], 'diffY'));
					
					$this.css({
						left: (Math.floor((newLeft / options.grid_drag)) * options.grid_drag) + 'px',
						top: (Math.floor((newTop / options.grid_drag)) * options.grid_drag) + 'px'
					});
					
					if(options.callback_position_change != null) options.callback_position_change.apply(this, [newLeft, newTop]);
				}
				
				if(options.rotate && $.data($thiz[0], 'rotation')) {
					var lastDegrees = $.data($thiz[0], 'currDegree'),
					degrees = (($.data($thiz[0], 'startDegree') - getRotationAngle(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY, e.originalEvent.touches[1].pageX, e.originalEvent.touches[1].pageY) - $.data($thiz[0], '_startDegree')) * -1);
					
					$.data($thiz[0], 'currDegree', degrees);
					$thiz.css(propNameTransform, 'rotate(' + Math.floor(degrees) + 'deg)');
					
					if(options.callback_degree_change != null) options.callback_degree_change.apply(this, [lastDegrees, degrees]);
				}
				
				e.preventDefault();
            }).unbind('touchend.touchBox mouseup.touchBox').bind('touchend.touchBox mouseup.touchBox', function (e) {
				var $thiz = $(this),
					options = $.data($thiz[0], 'options'),
					touches = $.data($thiz[0], 'touches');
				
				touches -= 1;
				
				$.data($thiz[0], 'touches', touches);
				
				if(touches == 1) $.data($thiz[0], 'ignoreTouch', true);
				
				$.data($thiz[0], 'rotation', false);
				
				if(options.callback_touches != null) options.callback_touches.apply(this, [touches]);
            });
        });
    };
    
    $(document).ready(function () {
        var $boxes = $('.touch-box');
		
        if($boxes.length > 0) {
            $boxes.each(function () {
                var $this = $(this),
                    options = {
                        'drag': false,
                        'resize': false,
                        'rotate': false
                    },
                    resize = $this.attr('data-resize'),
                    drag = $this.attr('data-drag'),
                    rotate = $this.attr('data-rotate');
                
                if(resize != undef && resize == 'true') options['resize'] = true;
                if(drag != undef && drag == 'true') options['drag'] = true;
                if(rotate != undef && rotate == 'true') options['rotate'] = true;
                
                $this.TouchBox(options);
            });
        }
    });
})(jQuery);