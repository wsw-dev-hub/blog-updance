$(document).ready(function() {
	var listas = ['news-lista','medida-lista','estrelas-lista']
	var ids = ['news', 'medida', 'estrelas' ]	
	//VERIFICA O TAMANHO DO TEMPLATE BASEADO NA QUANTIDADE DE CARDS DISPONÍVEIS
	function verficaValorTemplate(valorTemplate){
		var template = valorTemplate;
		
		if(template < 1.4){ template = 1; }
		if((template < 2.09) && (template > 1.5)){ template = 2; }
		if((template < 3.4) && (template > 2.1)){ template = 3; }
		if((template < 4.5) && (template > 3.5)){ template = 4; }
		
		return template;
	}
	
	iniciarPaginacaoDots();
	calcularPaginacao();
	
	$('.pages li').click(function(){
		//captura o nome da class [ PAGES ]
		var idName = $(this).attr('id'); 
		var idListName = idName+"-lista";
		//captura o ID ATUAL SELECIONADO 
		var idSelecaoAtual = parseInt($('#'+idListName+'.pages li.selected').index());
		//captura o ID DO CLICK
		var clickSelecao = parseInt($(this).index());
		
		console.log('valor do selected: '+idSelecaoAtual);
		console.log('valor do click: '+clickSelecao);
		console.log('idListName: '+idListName);
		console.log('id: '+idName);
		
		atualizarPaginacaoDots(idListName, idName, idSelecaoAtual, clickSelecao);
		
	})
		
	function iniciarPaginacaoDots(){
		for(var i=0; i<= listas.length -1; i++){
			//inicialização da qtd de [ LISTAS ]
			var totalCards = $('.'+listas[i]+' li').length;
			//Arredondamento de valores [ CARDSCONTENTES & MEDIADOTS ]
			var cardsContent =  Math.round($('.'+listas[i]).width() / 276);
			var mediaDots = Math.round(totalCards / cardsContent);
			
			//console.log('cardsContent: '+cardsContent);
			//console.log('calculo dots: '+mediaDots);
			
			for(var x=0; x <= mediaDots-1; x++){
				if(!$('#'+listas[i]+'.pages li').hasClass(""+x+"")){
					$('#'+listas[i]+'.pages').append('<li id="'+ids[i]+'" class="dots '+x+'"></li>');
					//console.log('page '+listas[i]+': '+x);
					//console.log("dots'"+x+"'");
				}
			}
			
		//inicialização da qtd de [ CARDS HIDDEM ]
		//var countHiddem = parseInt($('li.hiddem').length);	
		//calcularPaginacao(listas[i]);
		//console.log('passei por aqui: '+i);
		}
	}

	function calcularPaginacao(){
		for(var i=0; i<= listas.length -1; i++){
			//inicialização da qtd de [ CARDS HIDDEM ]
			var countHiddem = $('#'+listas[i]+' li.hiddem').length;	
			//valor da qtds [ DOTS ]
			var valorPaginacao = $('#'+listas[i]+'.pages li').length;
			//valor do indice do [ DOTS SELECTED ]
			var paginacao = $('#'+listas[i]+'.pages li').length;
			
			var cardsContent =  Math.round($('.'+listas[i]).width() / 276);
			
			//console.log('paginação: '+paginacao);
			//console.log('valor paginação: '+listas[i]+' '+valorPaginacao);
			
			if(countHiddem == 0){
				//valorPaginacao = 0
				for(var l=1; l <= valorPaginacao; l++){
					$('#'+listas[i]+'.pages li').removeClass("selected").css({"transitions":"0.5s"});
					$('#'+listas[i]+'.pages li:first').addClass("selected").css({"transitions":"0.5s"});
					//console.log(' pages li: '+l);
				}
				//console.log('valor hiddems: '+countHiddem);			
				//console.log('valor paginação1: '+listas[i]+' '+valorPaginacao);
				
			}else{
				valorPaginacao = countHiddem / (cardsContent);
				for(var l=1; l <= valorPaginacao; l++){
					$('#'+listas[i]+'.pages li').removeClass("selected").css({"transitions":"0.5s"});
					$('#'+listas[i]+'.pages li:eq('+valorPaginacao+')').addClass("selected").css({"transitions":"0.5s"});
					//console.log(' pages li: '+l);
				}
				//console.log('valor hiddems: '+countHiddem);			
				//console.log('valor paginação2: '+listas[i]+' '+valorPaginacao);
			}
			//return;
		}
	}
	
	function atualizarPaginacaoDots(idListName, idName, idSelecaoAtual, clickSelecao){
		//tamanho do template [ CARDS VIDEOS ]
		var widthCardsTemplate = parseInt($('.'+idListName).width());	
		//inicialização da qtd de [ CARDS ]
		var countCardsVideos = $('.'+idListName+' li').length;	
		//inicialização da qtd de [ CARDS HIDDEM ]
		var countCardsHiddem = $('.'+idListName+' li.hiddem').length;	
		var lasCardtHiddem;
		//valor da qtds [ DOTS ]
		var valorPaginacao = $('#'+idListName+'.pages li.'+idName).length ;
		var paginacao;
		//BASE DE CALCULO PARA MOVIMENTOS DOS [ CARDS ]
		
		var contentCardsVideos = parseInt( countCardsVideos / valorPaginacao);
		//if(widthCardsTemplate < 276){ widthCardsTemplate = 276; }
		
		var template = ($('.'+idListName).width() /276);
		template = verficaValorTemplate(template);
		
		
		//console.log('click atual: '+idSelecaoAtual);
		//console.log('click seleção: '+clickSelecao);
		/*console.log('listName: '+idListName);
		console.log('valor paginação: '+valorPaginacao);
		console.log('cards hiddem: '+countCardsHiddem);
		console.log('valor do content cards: '+countCardsVideos);
		console.log('valor do tamanho do template: '+widthCardsTemplate);
		console.log('valor do template: '+template);*/
		
		if(countCardsHiddem == 0){
			paginacao = 0;
			$('#'+idListName+' li').removeClass("selected").css({"transitions":"0.5s"});
			$('#'+idListName+' li:eq('+paginacao+")").addClass("selected").css({"transitions":"0.5s"});
			//console.log('preparando aqui');
			//console.log('preparando aqui:' +idListName);
		}
		
		if(idSelecaoAtual != clickSelecao){
			$('#'+idListName+' li').removeClass("selected").css({"transitions":"0.5s"});
			$('#'+idListName+' li:eq('+clickSelecao+")").addClass("selected").css({"transitions":"0.5s"});
			//console.log('entrei aqui...');
			
			//VERIFICAÇÃO DO AVANÇO DOS CARDS
			if(idSelecaoAtual < clickSelecao){
				//console.log('avancei...');
				
				var indiceCardAtual = $('.'+idListName+' li.selected').index();
				var indiceCardClick = contentCardsVideos * clickSelecao;
				console.log('indice atual: '+indiceCardAtual);
				console.log('indice click: '+indiceCardClick);
				
				indiceCardAtual = (contentCardsVideos * (clickSelecao - idSelecaoAtual));
				var valorPaginacaoClick = parseInt(indiceCardAtual * 276);
								
				valorTemplate = verficaValorTemplate(template);				
								
				var margemIndice = (clickSelecao - idSelecaoAtual) * contentCardsVideos;
				//Calcula o valor do [ INDICE CARD ATUAL ]
				indiceCardClick = valorTemplate * clickSelecao;
				
				$('.'+idListName+' li.'+idName+'.selected').removeClass("selected").css({"transitions":"0.5s"});
				//atualização de seleção da [ CLASSE DOTS ]
				$('.'+idListName+' li.'+idName+':eq('+indiceCardClick+")").addClass("selected").css({"transitions":"0.5s"});
				
				lastCardtHiddem = $('.'+idListName+' li.'+idName+'.hiddem:last').index();
				var margemDistance = parseInt($('.'+idListName+' li.'+idName+'.selected').index()) - lastCardtHiddem;
				
				//console.log('margem distance: '+margemDistance);
				valorPaginacaoClick = (margemDistance -1) * 276;
				
				//atualização de transição da [ LISTA DE CARDS ]
				$('.'+idListName+' li.'+idName+':first').animate({"margin-left":"-="+valorPaginacaoClick+"px"},"slow", function(){});
				
				for(var i=0; i < indiceCardClick; i++){
					$('.'+idListName+' li.'+idName+':eq('+i+")").addClass("hiddem").removeClass('no-actived').css({"transitions":"0.5s"});
					//console.log('card: '+i);
				}
			}
			//VERIFICAÇÃO DO RECUO DOS CARDS
			if(idSelecaoAtual > clickSelecao){
				//console.log('to do outro lado');
				
				var indiceCardsInativos = $('.'+idListName+' li.'+idName+'.no-actived').length;
				var indiceCardAtual = $('.'+idListName+' li.'+idName+'.selected').index();
				var indiceCardClick = contentCardsVideos * clickSelecao;
				//console.log('indice atual: '+indiceCardAtual);
				
				indiceCardAtual = (contentCardsVideos * (clickSelecao - idSelecaoAtual));
				var valorPaginacaoClick = parseInt(indiceCardAtual * -276);
				
				valorTemplate = verficaValorTemplate(template);				
								
				var margemIndice = (clickSelecao - idSelecaoAtual) * contentCardsVideos;
				//Calcula o valor do [ INDICE CARD ATUAL ]
				indiceCardClick = valorTemplate * clickSelecao;
												
				$('.'+idListName+' li.'+idName+'.selected').removeClass("selected").css({"transitions":"0.5s"});
				//atualização de seleção da [ CLASSE DOTS ]
				$('.'+idListName+' li.'+idName+':eq('+indiceCardClick+")").addClass("selected").css({"transitions":"0.5s"});
				
				firstCardNoActived = $('.'+idListName+' li.'+idName+'.no-actived:first').index();
				lastCardtHiddem = $('.'+idListName+' li.'+idName+'.hiddem:last').index();
				var margemDistance = (parseInt($('.'+idListName+' li.'+idName+'.selected').index()) - lastCardtHiddem);
				
				//console.log('margem distance: '+margemDistance);
				valorPaginacaoClick = (margemDistance -1) * -276;
				
				//atualização de transição da [ LISTA DE CARDS ]
				$('.'+idListName+' li.'+idName+':first').animate({"margin-left":"+="+valorPaginacaoClick+"px"},"slow", function(){});
				
				for(var x=$('.'+idListName+' li').length; x >= indiceCardClick; x--){
					$('.'+idListName+' li.'+idName+':eq('+x+")").removeClass('hiddem').next().addClass("no-actived").css({"transitions":"0.5s"});
					//console.log('card: '+x);
				}
				
				//console.log('count hiddem: '+countCardsHiddem);
				//console.log('indice click: '+indiceCardClick);
			}
		}
		
		$('.'+idListName+' li.'+idName+'.selected').removeClass("no-actived");
		//console.log('count hiddem: '+countCardsHiddem);
		
	}
	
});