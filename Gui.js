
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
	this.modes = {tech:"tech-mode",elre:"elre-mode",histo:"histo-mode",none:"none"};
	this.currentMode = this.modes.none;
	this.EASING_TIME = 100;
    var scope = this;	
	$(window).load(function() {
		scope.addEventsListeners();
		
		//scope.changeActiveDDBtn($('#elre-dd-btn'));
		//scope.loadPrimaryContent("contents/elre/content.html");
			//$("#panel-secondary").draggable().resizable();
		});
}

GUI.prototype.addEventsListeners = function(){
	var scope = this;
/*	$('#folder-toggle-btn').click(function(){
		$("#folder-toggle-btn > .glyphicon").toggleClass("glyphicon-chevron-up");
		$("#folder-toggle-btn > .glyphicon").toggleClass("glyphicon-chevron-down");
	});*/
	$(document).on('click','#panel-primary #close-btn', function(event){
		scope.closePanel($('#panel-primary'));
		scope.closePanel($('#panel-secondary'));
		scope.changeMode(scope.modes.none);
	});
	$(document).on('click','#panel-secondary #close-btn', function(event){
		scope.closePanel($('#panel-secondary'));
		//scope.deactivateAllDDBtn();
		if(scope.currentMode == scope.modes.elre)
			$(".img-selected").removeClass("img-selected");
		else
			$(".link-selected").removeClass("link-selected");
	});
	
	$('#technique-dd-btn').click(function(){
			if(! $('#technique-dd-btn').hasClass("active")){
/*				scope.changeActiveDDBtn($('#technique-dd-btn'));
				scope.loadPrimaryContent("contents/technique/content.html");
				scope.emitEvent(scope.events.changeMode,{newMode:scope.modes.tech});*/
				scope.changeMode(scope.modes.tech);
			}
	});
	$('#elre-dd-btn').click(function(){
			if(! $('#elre-dd-btn').hasClass("active")){
				//$('#technique-dd-btn').addClass("active");
/*				scope.changeActiveDDBtn($('#elre-dd-btn'));
				scope.loadPrimaryContent("contents/elre/content.html");
				scope.emitEvent(scope.events.changeMode,{newMode:scope.modes.elre});*/
				scope.changeMode(scope.modes.elre);
			}
	});
	$('#histo-dd-btn').click(function(){
			if(! $('#histo-dd-btn').hasClass("active")){
				//$('#technique-dd-btn').addClass("active");
/*				scope.changeActiveDDBtn($('#histo-dd-btn'));
				scope.loadPrimaryContent("contents/histo/content.html");
				scope.emitEvent(scope.events.changeMode,{newMode:scope.modes.histo});*/
				scope.changeMode(scope.modes.histo);
			}
	});

	// elre
	$(document).on('click','.item',function(event){
		if(!$(this).hasClass("img-selected")){
			$(".img-selected").removeClass("img-selected");
			$(this).addClass("img-selected");
			//dirty
			scope.loadSecondaryContent("contents/elre/panel-secondary.php",{imgsrc:event.target.src.replace("thumbnails","1920x1080")});
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
	$("#panel-secondary").hide();
	$("#panel-primary").hide();
	var scope = this;
	$("#panel-primary").load(url, function(){
		// load complete
		$("#panel-primary").fadeIn(scope.EASING_TIME);

	});
}

GUI.prototype.loadSecondaryContent = function(url,data){
	$("#panel-secondary").hide();
	var scope = this;
	/*$("#panel-secondary").load(url, function(){
		// load complete
		$("#panel-secondary").fadeIn(scope.EASING_TIME);

	});*/
	$.get( url, data ).done(function( data ) {
			$("#panel-secondary").html(data);
	});
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
        handles:"e"
    }
	
	$('#panel-secondary').attr('style', '');
	if (typeof $( "#panel-secondary" ).draggable("instance") != 'undefined')
		$( "#panel-secondary" ).draggable("destroy")
	if (typeof $( "#panel-secondary" ).resizable("instance") != 'undefined')
		$( "#panel-secondary" ).resizable("destroy")
	//$( "#panel-secondary" ).draggable("destroy").resizable( "destroy" );
	switch(this.currentMode){
	 	case this.modes.tech:
	 		$("#panel-secondary").draggable();
			break;
		case this.modes.elre:
			$("#panel-secondary").draggable().resizable(resizableOptions);
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
	
}

