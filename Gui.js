
// Constructor
function GUI(){
	this.events = {
		zoomIn:"zoom-in",
		zoomOut:"zoom-out",
		setRotateMode:"set-rotate-mode",
		setPanMode:"set-pan-mode",
		viewOne:"view-one",
		viewTwo:"view-two",
		viewThree:"view-three",
		viewDeco:"view-deco",
		viewTech:"view-tech",
		viewHisto:"view-histo",
		changeMode:"change-mode"
	};
	this.modes = {tech:"tech-mode",elre:"elre-mode",histo:"histo-mode",info:"info",none:"none"};
	this.currentMode = this.modes.none;
	this.EASING_TIME = 300;
    var scope = this;	
	$(window).load(function() {
		scope.addEventsListeners();
		
		//scope.changeActiveDDBtn($('#info-dd-btn'));
		//scope.loadPrimaryContent("contents/info/content.html");
		
	});
}

GUI.prototype.addEventsListeners = function(){
	var scope = this;
/*	$('#folder-toggle-btn').click(function(){
		$("#folder-toggle-btn > .glyphicon").toggleClass("glyphicon-chevron-up");
		$("#folder-toggle-btn > .glyphicon").toggleClass("glyphicon-chevron-down");
	});*/
	$('.navbar-brand').click(function(){
		$('#main-nav').toggleClass('mini-navbar');
		$('.navbar-brand').toggleClass('mini-brand');		
	});
	$(document).on('click','#panel-primary #close-btn', function(event){
		scope.closePanel($('#panel-primary'));
		scope.closePanel($('#panel-secondary'));
		scope.closePanel($('#panel-tertiary'));
		scope.changeMode(scope.modes.none);
	});
	$(document).on('click touchstart','#panel-secondary #close-btn', function(event){
		scope.closePanel($('#panel-secondary'));
		scope.closePanel($('#panel-tertiary'));
		if(scope.currentMode == scope.modes.elre)
			$(".img-selected").removeClass("img-selected");
		else
			$(".link-selected").removeClass("link-selected");
	});
	$(document).on('click','#panel-tertiary #close-btn', function(event){
		scope.closePanel($('#panel-tertiary'));
	});
	
	$('#technique-dd-btn').click(function(){
			if(! $('#technique-dd-btn').hasClass("active")){
				scope.changeMode(scope.modes.tech);
			}
	});
	$('#elre-dd-btn').click(function(){
			if(! $('#elre-dd-btn').hasClass("active")){
				scope.changeMode(scope.modes.elre);
			}
	});
	$('#histo-dd-btn').click(function(){
			if(! $('#histo-dd-btn').hasClass("active")){
				scope.changeMode(scope.modes.histo);
			}
	});
	$('#info-dd-btn').click(function(){
			if(! $('#info-dd-btn').hasClass("active")){
				scope.changeMode(scope.modes.info);
			}
	});

	// elre
	$(document).on('click','.item',function(event){
		if(!$(this).hasClass("img-selected")){
			$(".img-selected").removeClass("img-selected");
			$(this).addClass("img-selected");
			//dirty --> watch out buggy
			var filename = event.target.src.substring(event.target.src.lastIndexOf('/')+1);
			scope.loadSecondaryContent("contents/elre/panel-secondary.php",{imgsrc:"contents/elre/1920x1080/"+filename});
			scope.loadTertiaryContent("contents/elre/panel-tertiary.php",{"id":event.currentTarget.id});
			//scope.loadSecondaryContent("contents/elre/panel-secondary.php",{imgsrc:event.target.src.replace("thumbnails","1920x1080")});
			scope.emitEvent(scope.events.viewDeco,{"id":event.currentTarget.id});
		}
	});
	
	// tech
	$(document).on('click','.techItem',function(event){
		if(!$(this).children().hasClass("link-selected")){
			$(".link-selected").removeClass("link-selected");
			$(this).addClass("link-selected");
			scope.loadSecondaryContent("contents/technique/panel-secondary.php",{id:event.target.id,title:event.target.innerHTML});
			scope.emitEvent(scope.events.viewTech,{id:event.target.id});
		}
	});
	
	// histo
	$(document).on('click','.histoItem',function(event){
		if(!$(this).children().hasClass("link-selected")){
			$(".link-selected").removeClass("link-selected");
			$(this).addClass("link-selected");
			scope.loadSecondaryContent("contents/histo/panel-secondary.php",{id:event.target.id});
			scope.emitEvent(scope.events.viewHisto,{id:event.target.id});
		}
	});
	
	$('#zoom-in-btn').click(function(){
		scope.emitEvent(scope.events.zoomIn);
	});
	$('#zoom-out-btn').click(function(){
		scope.emitEvent(scope.events.zoomOut);
	});
	$('#move-btn').click(function(){
	
		if(! $('#move-btn').hasClass("btn-primary")){
			$('#rotate-btn').removeClass("btn-primary");
			$('#rotate-btn').addClass("btn-default");
			$('#move-btn').addClass("btn-primary");
			$('#move-btn').removeClass("btn-default");
			
			scope.emitEvent(scope.events.setPanMode);	
		}
				
	});
	$('#rotate-btn').click(function(){
		
		
			
		if(! $('#rotate-btn').hasClass("btn-primary")){
			$('#move-btn').removeClass("btn-primary");
			$('#move-btn').addClass("btn-default");
			$('#rotate-btn').addClass("btn-primary");
			$('#rotate-btn').removeClass("btn-default");
			
			scope.emitEvent(scope.events.setRotateMode);
		}
	});	
	$('#view-one-btn').click(function(){
		scope.emitEvent(scope.events.viewOne);
	});
	$('#view-two-btn').click(function(){
		scope.emitEvent(scope.events.viewTwo);
	});
	$('#view-three-btn').click(function(){
		scope.emitEvent(scope.events.viewThree);
	});
	
};

GUI.prototype.changeMode = function(newMode){
	
	switch(newMode){
	 	case this.modes.tech:
	 			this.currentMode = this.modes.tech;
	 			this.changeActiveDDBtn($('#technique-dd-btn'));
				this.loadPrimaryContent("contents/technique/content.html");
				this.emitEvent(this.events.changeMode,{newMode:this.modes.tech});
			break;
		case this.modes.elre:
				this.currentMode = this.modes.elre;
				this.changeActiveDDBtn($('#elre-dd-btn'));
				this.loadPrimaryContent("contents/elre/content.html");
				this.emitEvent(this.events.changeMode,{newMode:this.modes.elre});
			break;
		case this.modes.histo:
				this.currentMode = this.modes.histo;
				this.changeActiveDDBtn($('#histo-dd-btn'));
				this.loadPrimaryContent("contents/histo/content.html");
				this.emitEvent(this.events.changeMode,{newMode:this.modes.histo});
			break;
		case this.modes.info:
				this.currentMode = this.modes.histo;
				this.changeActiveDDBtn($('#info-dd-btn'));
				this.loadPrimaryContent("contents/info/content.html");
				this.emitEvent(this.events.changeMode,{newMode:this.modes.info});
			break;
		case this.modes.none:
				this.currentMode = this.modes.none;
				this.deactivateAllDDBtn();
				this.emitEvent(this.events.changeMode,{newMode:this.modes.none});
			break;
		default:
			console.log("unkonwn mode");
			break;
		
	}
	
}

GUI.prototype.closePanel = function(element){
	element.fadeOut(this.EASING_TIME);	
}

GUI.prototype.emitEvent = function(eventType,eventData){
	//var event = new Event(eventType);
	var event = new CustomEvent(eventType,{"detail":eventData});
	document.dispatchEvent(event);
};

GUI.prototype.changeActiveDDBtn = function(element){
	this.deactivateAllDDBtn();
	element.addClass("active");
}
GUI.prototype.deactivateAllDDBtn = function(){
	if($(".dropdown-toggle.active").length >0){
		$(".dropdown-toggle.active").each(function(){
			$(this).removeClass("active");	
		});
	}
}

GUI.prototype.loadPrimaryContent = function(url){
	$("#panel-tertiary").hide();
	$("#panel-secondary").hide();
	$("#panel-primary").hide();
	var scope = this;
	$("#panel-primary").load(url, function(){
		// load complete
		$("#panel-primary").fadeIn(scope.EASING_TIME);

	});
}

GUI.prototype.loadSecondaryContent = function(url,data){
	var scope = this;
	$("#panel-tertiary").hide();
	$("#panel-secondary").hide();
	if(this.currentMode == this.modes.elre)
		$("#panel-secondary").addClass('panel-large');
	else
		$("#panel-secondary").removeClass('panel-large')
	
	$.get( url, data ).done(function( data ) {
			$("#panel-secondary").html(data);
			//scope.showPanelSecondary();	
	});
}

GUI.prototype.loadTertiaryContent = function(url){
	$("#panel-tertiary").hide();
	var scope = this;
	$("#panel-tertiary").load(url, function(){
		// load complete
		//$("#panel-tertiary").fadeIn(scope.EASING_TIME);

	});
}
GUI.prototype.showPanelTertiary = function(){
	$("#panel-tertiary").fadeIn(this.EASING_TIME);	
}

GUI.prototype.showPanelSecondary = function(){
	this.resetDR();
	$("#panel-secondary").fadeIn(this.EASING_TIME);	
}

GUI.prototype.resetDR = function(){
	
	var resizableOptions = {
		resize: function(event, ui) {
        ui.size.height = ui.originalSize.height;
        },
        aspectRatio: false,
        minWidth: 460,
        maxWidth:1920,
        handles:"e"
    }
	
	$('#panel-secondary').attr('style', '');
	if (typeof $( "#panel-secondary" ).draggable("instance") != 'undefined')
		$( "#panel-secondary" ).draggable("destroy")
	if (typeof $( "#panel-secondary" ).resizable("instance") != 'undefined')
		$( "#panel-secondary" ).resizable("destroy")
	
	$('#panel-tertiary').attr('style', '');
	if (typeof $( "#panel-tertiary" ).draggable("instance") != 'undefined')
		$( "#panel-tertiary" ).draggable("destroy")
	if (typeof $( "#panel-tertiary" ).resizable("instance") != 'undefined')
		$( "#panel-tertiary" ).resizable("destroy")
	
	switch(this.currentMode){
	 	case this.modes.tech:
	 		$("#panel-secondary").draggable();
			break;
		case this.modes.elre:
			$("#panel-secondary").draggable().resizable(resizableOptions);
			$("#panel-tertiary").draggable();
			break;
		case this.modes.histo:
			$("#panel-secondary").draggable().resizable(resizableOptions);
			break;
		case this.modes.none:
			break;
		default:
			console.log("unkonwn mode");
			break;
		
	}
	
	
	// hack for touch resize
	document.getElementById("panel-secondary" ).addEventListener( 'touchmove', touchmove, false );
	var lastDistance = null ;
	function touchmove(event){
		
		//event.preventDefault();
		//event.stopPropagation();
		if(event.touches.length ==2 && typeof $( "#panel-secondary" ).resizable("instance") != 'undefined'){
			var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
			var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
			var distance = Math.sqrt( dx * dx + dy * dy );
			
			if(lastDistance == null)
				lastDistance = distance;
			var diff = distance-lastDistance;
			lastDistance = distance;
			console.log(diff);
			if(diff>0 && $("#panel-secondary").width() < resizableOptions.maxWidth){
				$("#panel-secondary").css("width","+=2");
				//$("#panel-secondary").css("left","-=1.5");
				//$("#panel-secondary").css("top","-=1.5");
			}else if (diff<0 && $("#panel-secondary").width() > resizableOptions.minWidth){
				$("#panel-secondary").css("width","-=2");
				//$("#panel-secondary").css("left","+=1.5");
				//$("#panel-secondary").css("top","+=1.5");
			}
		
		}
	}

	
}

