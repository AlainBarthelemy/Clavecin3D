function MiniDiapo(id){
	this.diapoDelay = 1000;
	this.diapoPeriod = 5000;
	this.currentIndex = 0;
	this.id = id;
	//$("#miniDiapo").hide();
}

MiniDiapo.prototype.populate = function(diapos){
	this.diapos = diapos;
	$(this.id).empty();
	for(var k=0;k<this.diapos.length;k++)
		$(this.id).append('<img class="diap-hidden" src="'+this.diapos[k]+'">');

	// we let be visible the first diap
	$($(this.id+" img")[this.currentIndex]).removeClass("diap-hidden");	
}

MiniDiapo.prototype.start = function(){
	var self = this;
	this.delayHandler = setTimeout(function(){self.nextDiapo();},this.diapoDelay);
	this.intervalHandler = setInterval(function(){
			self.nextDiapo();
	},this.diapoPeriod);
}

MiniDiapo.prototype.stop = function(){
	clearTimeout(this.delayHandler);
	clearInterval(this.intervalHandler);	
}

MiniDiapo.prototype.show = function(){
	$(this.id).fadeIn();
	//$($(this.id+" img")[this.currentIndex]).removeClass("diap-hidden");
}

MiniDiapo.prototype.hide = function(){
	//$(this.id).fadeOut();
	$(this.id).hide();
}
MiniDiapo.prototype.nextDiapo = function(){
	//$("#miniDiapo img").fadeOut();
	//$($("#miniDiapo img")[this.currentIndex]).fadeIn();
	$($(this.id+" img")[this.currentIndex+1 > this.diapos.length - 1 ? 0 : this.currentIndex+1]).removeClass("diap-hidden");
	$($(this.id+" img")[this.currentIndex]).addClass("diap-hidden");
	this.currentIndex++;
	if(this.currentIndex > this.diapos.length - 1)
		this.currentIndex = 0;
}
MiniDiapo.prototype.goTo = function(index){
	if(index > this.diapos.length - 1)
		index = 0;
	
	$($(this.id+" img")[this.currentIndex]).addClass("diap-hidden");
	$($(this.id+" img")[index]).removeClass("diap-hidden");
	
	this.currentIndex = index;
	
}
