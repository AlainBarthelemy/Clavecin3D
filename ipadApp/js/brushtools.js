
//BRUSH Base Class
function Brush(width,height,radius)
{
	this.dim    	= { w: width, h: height, r: Math.max(1,radius) };
	
	//internal brush buffer
	this.minibuffer	= $('<canvas/>')[0];
	this.minibuffer.height = this.dim.h;
	this.minibuffer.width = this.dim.w;

	//extract source area into minibuffer
	this.fill 	= function (source) 
	{ 	
		var w = Math.min(source.width, this.dim.w);
		var h = Math.min(source.height, this.dim.h);
		this.minibuffer.getContext('2d').drawImage(source, this.pos.x, this.pos.y, w, h, 0, 0, w, h);
		return this.minibuffer;
	};

	this.move 	= function (center, source) {
		this.center = center;
		this.pos    = { x: Math.max(0, (center.x-this.dim.w/2)),
					    y: Math.max(0, (center.y-this.dim.h/2)) };
		
		this.pos.x = Math.min(this.pos.x, (source.width-this.dim.w));
		this.pos.y = Math.min(this.pos.y, (source.height-this.dim.h));
		
		this.fill(source);					    
		return this.pos;					  	 
	};
	
	this.draw = function() {
		return this.minibuffer;
	}
}

//CIRCLE BRUSH
function circleBrush(radius,blurring)
{
	Brush.call(this, radius*2, radius*2, radius);
	
	//Create MASK for the minibuffer
	var ctx = this.minibuffer.getContext('2d');
	var rad = ctx.createRadialGradient((this.dim.w/2), (this.dim.h/2), 1, (this.dim.w/2), (this.dim.h/2), (this.dim.w/2));
    rad.addColorStop(0, 'rgba(255,255,255,'+(1.0-blurring/100).toFixed(2)+')');
    rad.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = rad;
	ctx.beginPath();
	ctx.arc((this.dim.w/2),(this.dim.w/2),(this.dim.w/2),0,Math.PI*2,true);
	ctx.fill();
	ctx.globalCompositeOperation = 'source-in';    	
}

//GET POSITION OF AN EVENT INTO AN OBJECT
function getPos(event) 
{
	var obj = event.target;
	var current_left = 0, current_top = 0;
	if (obj.offsetParent){
		do{
			current_left += obj.offsetLeft;
			current_top += obj.offsetTop;
			obj = obj.offsetParent;
		} while(obj);
	}
	return {x:(event.pageX - current_left), y:(event.pageY - current_top)};
}

//POS IN THE VIEW (with zoom compensation)
function getPosView(event,zoom) 
{
	var pos = getPos(event);
	
	pos.x = Math.floor(pos.x/zoom.ratio);
	pos.y = Math.floor(pos.y/zoom.ratio);
	
	pos.x += (zoom.crop().x);
	pos.y += (zoom.crop().y);
	
	return pos;
}


function Zoom (width, height, render) 
{
	this.ratio = 1.0;
	this.center = {x: Math.floor(width/2), y: Math.floor(height/2)};
	this.lastpress = {x: 0, y: 0};
	this.space = {w: width, h: height};
	this.render = render;
	
	this.cropdim = function() {
		var cr = {w:0, h:0};
		cr.w = Math.floor(this.space.w/this.ratio);
		cr.h = Math.floor(this.space.h/this.ratio);
		return cr;	
	};
	
	this.crop = function() {
		this.checkcenter();
		var win = this.cropdim();
		var cr = {x:0, y:0, w:0, h:0};
		cr.w = win.w;
		cr.h = win.h;
		cr.x = (this.center.x - Math.floor(win.w/2));
		cr.y = (this.center.y - Math.floor(win.h/2));
		return cr;	
	};
	
	this.move = function(pos) {
		//move center (relative)
		this.center.x += Math.floor((this.lastpress.x - pos.x)/this.ratio);
		this.center.y += Math.floor((this.lastpress.y - pos.y)/this.ratio);	
		this.checkcenter();
		this.lastpress = pos;
	};
	
	this.zoomin = function() {
		if (this.ratio < 10) this.ratio *= 1.5;
		this.checkcenter();
	};
	
	this.zoomout = function() {
		if (this.ratio > 1) this.ratio /= 1.5;
		this.checkcenter();
	};
	
	this.reset = function() {
		this.ratio = 1.0;
		this.checkcenter();
	};
	
	this.checkcenter = function() 
	{	
		var win = this.cropdim();
		this.center.x = Math.min(this.center.x, (this.render.width - Math.floor(win.w/2)));
		this.center.y = Math.min(this.center.y, (this.render.height - Math.floor(win.h/2)));
		
		this.center.x = Math.max(this.center.x, Math.floor(win.w/2));
		this.center.y = Math.max(this.center.y, Math.floor(win.h/2));
	};	
}


//INTERPOLATE MOUSE MOVE
function Interpoler( start, drawer )
{
	this.drawer = drawer;
	this.working = false;
	this.steps = [];
	this.lastpoint = start;

	this.addpoint = function( point )
	{
		this.steps.push(point);
		if (!this.working) this.trace();
	};

	this.trace = function()  
	{
		var gap = Math.max(1, (101 - this.drawer.interpolate) );
		this.working = true;
		while (this.steps.length > 0)
		{
			var newPos = this.steps.shift();
			var point = this.lastpoint;

			while ((point.x != newPos.x) || (point.y != newPos.y)) {

				if (point.x >= (newPos.x+gap)) point.x -= gap;
				else if (point.x <= (newPos.x-gap)) point.x += gap;
				else point.x = newPos.x;

				if (point.y >= (newPos.y+gap)) point.y -= gap;
				else if (point.y <= (newPos.y-gap)) point.y += gap;
				else point.y = newPos.y;

				this.drawer.paint( point );
			}
			this.lastpoint = point;
		}
		this.working = false;
	};
}


//IMAGE READY
function onImageReady(image, handler) {

    if (image.complete) setTimeout(function() { fireHandler.call(image);}, 0); // Won't really be 0, but close
    else image.bind('load', fireHandler);

    function fireHandler(event) {
        $(this).unbind('load', fireHandler);
        handler.call(this);
    }
}
