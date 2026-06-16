// JavaScript Document
$(function(){
		
	//$videoPlayers = $(".playerVideos").length;	
	//alert($videoPlayers)	
	//var largura = window.screen.width;
	//alert(largura);
	
	$('.menu-list li span').click(function(){
		var nomeClasse = $(this).attr('class'); 
		
		if($(this).hasClass("ico-style-busca")){
			if(!$(this).hasClass("selected")){
				$(this).addClass("selected");
				
				$('.txt-style-busca-one').css({"visibility":"visible" , "transition":"1.2s", "width":"190", "opacity": "1"})
				
			}
			else {
				$(this).removeClass("selected");
				$('.txt-style-busca-one').css({"visibility":"hidden" , "transition":"1.2s", "width":"0", "opacity": "0"})
			}
		}
		
	})
	
	/*//window.onresize = function() {
		var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		if (w > 400) {
			//executar o código aqui dentro
			//w = document.body.clientWidth;
			//alert('tamanho da tela '+w);
		}
	//};*/
	
	function verificaClasse(classe, valor){
	//BUSCA O ATRIBUTO DA LISTA
	//contentClass = $(".navigation").parent().find("ul").attr('class');
	//BUSCA O ATRIBUTO DE CLASSE
	//contentParentClass = $(".navigation").parent().find("li").attr("class");
	
	var contentClass = "";
	// var arrayClasse = ["news","medida","estrelas","firme", "desc"];
	var arrayClasse = ["news","medida","estrelas", "desc"];
	var x;	

		for (x=0; x < arrayClasse.length; x++){
			if(classe.toString() == arrayClasse[x]){		
				switch(arrayClasse[x]){
					
					case "news":
						contentClass = $(".navigation").parent().find(".news")
						if(valor == "g"){
							slideGo(contentClass);
						}else{
							slideBack(contentClass);
							}
						break;
					case "medida":
						contentClass = $(".navigation").parent().find(".medida")
						if(valor == "g"){
							slideGo(contentClass);
						}else{
							slideBack(contentClass);
							}
						break;			
					case "estrelas":
						contentClass = $(".navigation").parent().find(".estrelas")
						if(valor == "g"){
							slideGo(contentClass);
						}else{
							slideBack(contentClass);
							}
						break;
					// case "firme":
						// contentClass = $(".navigation").parent().find(".firme")
						// if(valor == "g"){

							// slideGo(contentClass);
						// }else{
							// slideBack(contentClass);
							// }
						// break;
				} 
			}
		}	
	}
	function isDoubleClicked(element) {
    //if already clicked return TRUE to indicate this click is not allowed
    if (element.data("isclicked")) return true;
	//mark as clicked for 1 second
		element.data("isclicked", true);
		setTimeout(function () {
			element.removeData("isclicked");
		}, 1600);
		//return FALSE to indicate this click was allowed
		return false;
	}
	
	$('#descNavBack').on("click", function () {
    if (isDoubleClicked($(this))) {
		return;
		}else{
			var classe = "desc";
			verificaClasse(classe, "b"); }
	});
	
	$('#descNavGo').on("click", function () {
    if (isDoubleClicked($(this))) {
		return;
		}else{
			var classe = "desc";
			verificaClasse(classe, "g");}
	});
	
	$('#novidadesGO').on("click", function () {
    if (isDoubleClicked($(this))) {
		return;
		}else{
			var classe = "news";
			verificaClasse(classe, "g");}
	});
	 
	$('#novidadesBACK').on("click", function () {
    if (isDoubleClicked($(this))) {
		return;
		}else{
			var classe = "news";
			verificaClasse(classe, "b");}
	});
	
	$('#medidaGO').on("click", function () {
    if (isDoubleClicked($(this))) {
		return;
		}else{
			var classe = "medida";
			verificaClasse(classe, "g");}
	});
	 
	$('#medidaBACK').on("click", function () {
    if (isDoubleClicked($(this))) {
		return;
		}else{
			var classe = "medida";
			verificaClasse(classe, "b");}
	});

	$('#estrelasGO').on("click", function () {
    if (isDoubleClicked($(this))) {
		return;
		}else{
			var classe = "estrelas";
			verificaClasse(classe, "g");}
	});
	 
	$('#estrelasBACK').on("click", function () {
    if (isDoubleClicked($(this))) {
		return;
		}else{
			var classe = "estrelas";
			verificaClasse(classe, "b");}
	});
	
	// $('#firmeGO').on("click", function () {
    // if (isDoubleClicked($(this))) {
		// return;
		// }else{
			// var classe = "firme";
			// verificaClasse(classe, "g");}
	// });
	 
	// $('#firmeBACK').on("click", function () {
    // if (isDoubleClicked($(this))) {
		// return;
		// }else{
			// var classe = "firme";
			// verificaClasse(classe, "b");}
	// });
	
	function slideGo(contentClass){
	var classe = "";
	var lista = "";
	
	if($(contentClass).hasClass("news")){
		classe = '.news';
		lista = $(".navigation").parent().find(".news-lista");
		}
	if($(contentClass).hasClass("medida")){
		classe = '.medida';
		lista = $(".navigation").parent().find(".medida-lista");
		}
	if($(contentClass).hasClass("estrelas")){
		classe = '.estrelas';
		lista = $(".navigation").parent().find(".estrelas-lista");
		}
	// if($(contentClass).hasClass("firme")){
		// classe = '.firme';
		// lista = $(".navigation").parent().find(".firme-lista");
		// }
		
	//AVANÇAR	
	if($(contentClass).hasClass('selected')){
		//alert('entrei no contentClass');
		if($(classe +':first').hasClass("hide")){	
			//SEGUNDA SESSÃO
			//console.log('entrei no IF do GO');
			$(classe +'.selected:first').next().addClass("selected");
			$(classe +':first').next().clone().appendTo(lista).removeClass("selected").addClass("no-actived last");
			
			$(classe +':first').next().animate({"margin-left":"-=276px", "opacity":"0"},"slow", function(){
				$(classe +'.selected:first').removeClass("selected").addClass("hide").removeAttr("style");
				$(classe +'.no-actived:first').removeClass("no-actived last");
			});
			$(classe +':first').remove();	
		}
		else if(!$(classe +'.no-actived:first').hasClass('last')){
			//SESSÃO INICIAL
			//console.log('entrei no ELSE IF do GO');
			$(classe +'.selected').next().addClass("selected");
			$(classe +':first').clone().appendTo(lista).removeClass("selected").addClass("no-actived last");
			
			$(classe +':first').animate({"margin-left":"-=276px", "opacity":"0"},"slow", function(){
					$(this).addClass("hide").removeClass("selected").removeAttr("style");
					$(classe +'.no-actived:first').removeClass("no-actived last");									
			});
			$(classe +':first').removeAttr("style");
		}else{
			//SESSÃO DE RETORNO
			//console.log('entrei no ELSE do GO')
			$(classe +':first').clone().appendTo(lista).removeClass("selected").addClass("no-actived last");
			
			$(classe +':first').animate({"margin-left":"-=276px", "opacity":"0"},"slow", function(){
				$(this).removeClass("selected").addClass("hide").removeAttr("style").next().addClass("selected");
				$(classe +':last').prev().removeClass("no-actived last");
				
				if($(classe +':first').attr('id') == $(classe +':last').attr('id')){
					//$(classe +':last').remove();
					//alert('só pra testar');
				}
			});
		}
	}
}
	function slideBack(contentClass){
	var classe = "";
	var lista = "";
	
	if($(contentClass).hasClass("news")){
		classe = '.news';
		lista = $(".navigation").parent().find(".news-lista");
		}
		
	if($(contentClass).hasClass("medida")){
		classe = '.medida';
		lista = $(".navigation").parent().find(".medida-lista");
		}
	
	if($(contentClass).hasClass("estrelas")){
		classe = '.estrelas';
		lista = $(".navigation").parent().find(".estrelas-lista");
		}
		
	// if($(contentClass).hasClass("firme")){
		// classe = '.firme';
		// lista = $(".navigation").parent().find(".firme-lista");
		// }
	
	
	//RETROCEDER
	if(!$(contentClass).hasClass('hide')){
		//PRIMEIRA SESSÃO
		//console.log('entrei no IF do BACK');
		$(classe +':first').prev().addClass("hide");
		$(classe +'.selected').removeAttr("style");
		if($(classe +':last').hasClass('no-actived')){
			$(classe +':last').clone().prependTo(lista).removeClass("no-actived").addClass("hide");
			$(classe +'.selected').prev().animate({"margin-left":"0", "opacity":"1"},"slow", function(){
				$(this).removeAttr("style");
				$(classe +'.selected:first').removeClass("selected");
				$(classe +':first').removeClass("hide last").addClass("selected");
				$(classe +':last').addClass("no-actived last").prev().removeClass("no-actived last");
			});							
		}
		$(classe+':last').remove();
	}
	else
	if($(classe +':first').attr('id') == $(classe +':last').attr('id')){
		//SESSÃO DE RETORNO
		//console.log('entrei no ELSE IF do BACK');
		$(classe +':last').remove();
		$(classe +'.selected').prev().animate({"margin-left":"0", "opacity":"1"},"slow", function(){
			$(this).removeAttr("style").next().removeClass("selected");
			$(classe +':first').removeClass("hide last").addClass("selected");
			$(classe +':last').addClass("no-actived last");
		});
	}else{
		//console.log('entrei no ELSE do BACK');
		$(classe +':last').clone().prependTo(lista).removeClass("no-actived last").addClass("hide");
		$(classe +':first').animate({"margin-left":"+=276px", "opacity":"1"},"slow", function(){
			$(this).addClass("selected").next().removeClass("hide selected").removeAttr("style");
			$(classe +'.last').prev().addClass("no-actived last");
		});
		$(classe +':last').remove();
		}
	}	
})