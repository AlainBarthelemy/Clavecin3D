function MiniDiapo(){
	this.diapoPeriod = 5000;
	this.currentIndex = 0;
	this.diapos = [
		"contents/resto/diapo/fondpanneaux0.jpg",
		"contents/resto/diapo/fondpanneaux1.jpg",
		"contents/resto/diapo/fondpanneaux2.jpg",
		"contents/resto/diapo/fondpanneaux3.jpg",
		"contents/resto/diapo/fondpanneaux4.jpg",
		"contents/resto/diapo/fondpanneaux5.jpg",
		"contents/resto/diapo/fondpanneaux6.jpg",
		"contents/resto/diapo/fondpanneaux7.jpg",
	];
	//$("#miniDiapo").hide();
	this.populate();
}

MiniDiapo.prototype.populate = function(){
	$("#miniDiapo").empty();
	for(var k=0;k<this.diapos.length;k++)
		$("#miniDiapo").append('<img class="diap-hidden" src="'+this.diapos[k]+'">');	
}

MiniDiapo.prototype.start = function(){
	var self = this;
	this.intervalHandler = setInterval(function(){
			self.nextDiapo();
	},this.diapoPeriod);
}

MiniDiapo.prototype.stop = function(){
	clearInterval(this.intervalHandler);	
}

MiniDiapo.prototype.show = function(){
	$("#miniDiapo").fadeIn();
	$($("#miniDiapo img")[this.currentIndex]).removeClass("diap-hidden");
}

MiniDiapo.prototype.hide = function(){
	$("#miniDiapo").fadeOut();
}
MiniDiapo.prototype.nextDiapo = function(){
	//$("#miniDiapo img").fadeOut();
	//$($("#miniDiapo img")[this.currentIndex]).fadeIn();
	$($("#miniDiapo img")[this.currentIndex+1 > this.diapos.length - 1 ? 0 : this.currentIndex+1]).removeClass("diap-hidden");
	$($("#miniDiapo img")[this.currentIndex]).addClass("diap-hidden");
	this.currentIndex++;
	if(this.currentIndex > this.diapos.length - 1)
		this.currentIndex = 0;
}
