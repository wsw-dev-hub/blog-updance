// JavaScript Document
$(function(){
	var altura = window.screen.height;
	var largura = window.screen.width;
	
	var contentWidth = parseInt($('.firme-lista').width());
	var cardsContentCounts = parseInt(contentWidth) / 276;
	
	if(contentWidth < 276){ contentWidth = 276; }
	
	switch (cardsContentCounts){
		case 1:
			contentWidth = contentWidth * 1;
			alert(contentWidth);
			break;
		case 2:
			contentWidth = contentWidth * 2;
			alert(contentWidth);
			break;
		case 3:
			contentWidth = contentWidth * 3;
			alert(contentWidth);
			break;
		case 4:
			contentWidth = contentWidth * 4;
			alert(contentWidth);
			break;
		case 5:
			contentWidth = contentWidth * 5;
			alert(contentWidth);
			break;
	}

	//método de verificação de seleção de vídeo
	//busca do vídeo através do card selecionado
	//CLIQUE [ CARD LISTA ]
	$('.firme-lista li').click(function(){
		// [ 0 ] [ 276 ] [ 552 ] [ 828 ] [ 1104 ] [ 1380 ] [ 1656 ]
		var selectedAtual = parseInt($('li.selected').index());
		var novoSelected = parseInt($(this).index());
		var margemInicial = (parseInt($('.firme:first').css("margin-left")) * (-1));
		var margemAtual = (parseInt($(this).index()) * 276);
		var resultIndice;
		
		if(selectedAtual < novoSelected){
			resultIndice = parseInt(margemInicial - margemAtual);		

			$('.firme:first').animate({"margin-left":"+="+resultIndice+"px"},"slow", function(){});
			$('.firme-lista li.firme').removeClass("selected");
			$('.firme:eq('+novoSelected+')').removeClass("hiddem no-actived").addClass("selected").prev().addClass("hiddem no-actived");
			
		}else{
			resultIndice = parseInt(margemInicial - margemAtual) * (-1);

			$('.firme:first').animate({"margin-left":"-="+resultIndice+"px"},"slow", function(){});
			$('.firme-lista li.firme').removeClass("selected");
			$('.firme:eq('+novoSelected+')').removeClass("hiddem no-actived").addClass("selected").prev().addClass("hiddem no-actived");
			
		}
		
		console.log('valor do resultIndice: '+resultIndice);
		iniciarPaginacao();
		verificaPosicaoVideo(novoSelected);
		//console.log('valor do novo select '+novoSelected);
		carregarPlayers(novoSelected);
		$('.controles').css({"opacity":"0"});
	})
	//INICIAR PAGINAÇÃO
	function iniciarPaginacao(){
		//var widthContent = $('.firme-lista').width();
		var totalCards = $('.firme-lista li').length;
		//var cardsContent = parseInt(contentWidth / 276);
		var cardsContent = cardsContentCounts;
		var resultadoCalc = totalCards / cardsContent;
								
		console.log('iniciando paginação...');
		
		for(var x=0; x < resultadoCalc; x++){
			$('.pages').append('<li id="" class="dots"></li>');
		}
		
		console.log('dots pagination: '+$('.pages li').length);
		//inicialização da qtd de [ CARDS HIDDEM ]
		var countHiddem = parseInt($('li.hiddem').length);	
		calcularPaginacao();
	}
	
	//CLIQUE DA PAGINAÇÃO	
	$('.pages li').click(function(){
		var idSelecaoAtual = parseInt($('.pages li.selected').index());
		var clickSelecao = parseInt($(this).index());
		
		//selecaoPaginacaoCards(".pages", ".dots", idSelecaoAtual, clickSelecao);
	})
	
	function calcularPaginacao(){
		//inicialização da qtd de [ CARDS HIDDEM ]
		var countHiddem = $('.firme-lista li.hiddem').length;	
		//valor da qtds [ DOTS ]
		var dotsPages = $('.dots li').length;
		//valor do indice do [ DOTS SELECTED ]
		var dotsSelected = $('.dots li.selected').length;
		var valorPaginacao;
		
		console.log('valor da paginação: '+dotsPages);
		
		if(countHiddem == 0){
			valorPaginacao = 0
			$('.pages li').removeClass("selected").css({"transitions":"0.5s"});
			$('.pages li:eq('+valorPaginacao+")").addClass("selected").css({"transitions":"0.5s"});
			
		}else{
			valorPaginacao = countHiddem / (cardsContentCounts);
			
			
			for(var x=0; x<= valorPaginacao;x++){
				if( valorPaginacao == x){
					$('.pages li').removeClass("selected").css({"transitions":"0.5s"});
					$('.pages li:eq('+valorPaginacao+")").addClass("selected").css({"transitions":"0.5s"});
				}else{}
			}
		}
	}
	
	function selecaoPaginacaoCards(nomeLista, nomeClasse, valorSelecaoAtual, valorIndiceClick){
		//valor tamanho da lista [ CARDS ]
		if(contentWidth > 276){ contentWidth = 276; }
		//valor da qtds [ DOTS ]
		var dotsPages = $(nomeLista+' li').length;
		//valor total de [ CARDS ]	
		var totalCards = $('.firme-lista li').length;
		//[ QTDS DE CARDS ] no contentWidth 
		var contentCards = cardsContentCounts;
		//valor da margem inicial do [ PRIMEIRO CARD ]
		
		var valorSlide;
		var posicao = parseInt(contentCards) * valorIndiceClick;
		console.log('contentCards: '+(contentCards * 276));
		console.log('valorIndiceClick: '+valorIndiceClick);
		
		if(valorSelecaoAtual < valorIndiceClick){
			//inicialização da qtd de [ CARDS HIDDEM ]
			var countHiddem = parseInt($('li.hiddem').length);		
			//valor da margem do [ CONTENTCARDS ]
			valorSlide = (parseInt(contentCards) * valorIndiceClick) * 276;
			//correção do valor de [ TRANSIÇÃO DE AVANÇO ]
			if(countHiddem > 0){
				valorSlide = ((parseInt(contentCards) * valorIndiceClick) - parseInt(contentCards)) * 276;	
			}
			//verifica a igualdade de valores de [ DOTSPAGES & TOTALCARDS ]
			if(totalCards == dotsPages){
				valorSlide = 276;
			}
			posicao = (totalCards / dotsPages);		
					
			if(valorIndiceClick - valorSelecaoAtual == 1 ){
				console.log('clique '+valorIndiceClick+' selecao. '+valorSelecaoAtual);
				valorSlide = (posicao * valorIndiceClick ) * 276;
				
				//posicao	= posicao * valorIndiceClick;
				posicao	= posicao / dotsPages;
				//atualização de classe da [ LISTA DE CARDS ]
				console.log('posição '+posicao);
				console.log('dotsCards '+dotsPages);
				console.log(totalCards);
				for(var x=0; x <= posicao; x++ ){
					if(posicao > x){
						//console.log('valor do card '+x);
						//$('.firme-lista li:eq('+x+')').addClass("hiddem no-actived");
					}
				}
			}else{
				if(valorSelecaoAtual == 0){
					valorSlide = ((posicao) * valorIndiceClick) * 276;
					console.log('posição2 '+posicao);
					
				}else{
					result = valorIndiceClick - valorSelecaoAtual;
					console.log('clique '+valorIndiceClick+' selecao_ '+valorSelecaoAtual);
					valorSlide = (result)  * 276;
				}
			}
			//remoção da seleção na classe [ DOTS ]			
			$(nomeClasse+'.selected').removeClass("selected").css({"transitions":"0.5s"});
			//transição de seleção na classe [ DOTS ]
			$(nomeClasse+':eq('+valorIndiceClick+")").addClass("selected").css({"transitions":"0.5s"});
			//transição de margem da [ LISTA ]
			$('.firme-lista li:first').animate({"margin-left":"-="+valorSlide+"px"},"slow", function(){});
			
			console.log('valor do valorSlide: '+valorSlide);
			
			posicao	= posicao * valorIndiceClick;
			//atualização de classe da [ LISTA DE CARDS ]
			for(var x=countHiddem; x <= totalCards; x++ ){
				if(posicao > x){
					console.log('passando aqui... '+x);
					$('.firme-lista li:eq('+x+')').addClass("hiddem no-actived");
				}
			}
			//calcularPaginacao();
			
		}else if(valorSelecaoAtual == valorIndiceClick){ 
			//verificação de igualdade de valores
		}else{
			//qtd de [ CARDS HIDDEM ]
			var countHiddem = 0;
			countHiddem = parseInt($('.firme-lista li.hiddem').length);				
			//valor da margem para deslizar
			valorSlide = (contentCards / valorIndiceClick) * 276;
			//verifica a igualdade de valores de [ DOTSPAGES & TOTALCARDS ]
			console.log('entrei no else...');
			console.log('valor countHiddem: '+countHiddem);
			
			if((totalCards == dotsPages)){	
				console.log('verificar valor do clique '+valorIndiceClick);
				//inicializa a correção do carrossel para o retorno do primeiro [ CARD ]
				if(valorIndiceClick == 0){
					console.log('entrei no if do valorClick...');
					console.log('valor posicao: '+posicao);
					valorSlide = (countHiddem) * 276;	
					posicao =  0;

				}else{ 
					if(valorSelecaoAtual > valorIndiceClick){
						posicao = (valorSelecaoAtual - valorIndiceClick);	
						valorSlide =  posicao * 276;	
						console.log('passei no else com a posicao '+posicao);
					}
				}
				
				$(nomeClasse+'.selected').removeClass("selected").css({"transitions":"0.5s"});
				//atualização de seleção da [ CLASSE DOTS ]
				$(nomeClasse+':eq('+valorIndiceClick+")").addClass("selected").css({"transitions":"0.5s"});
				//atualização de transição da [ LISTA DE CARDS ]
				$('.firme-lista li:first').animate({"margin-left":"+="+valorSlide+"px"},"slow", function(){});
				
				console.log('valor do valorSlide: '+valorSlide);
				
				if(posicao == -1){ posicao = 0; }
				
				countHiddem = countHiddem - (valorSelecaoAtual - valorIndiceClick);
				for(var x=totalCards; x >= countHiddem; x-- ){
					if(x >= (countHiddem)){
						$('.firme-lista li:eq('+x+')').removeClass("hiddem");
					}
				}
				
			}else{
			//correção do valor de [ TRANSIÇÃO DE RECUO ]
				if(valorIndiceClick == 0){
					console.log(posicao);
					console.log(contentCards);
					//valorSlide = (countHiddem - contentCards) * 276;	
					valorSlide = (countHiddem) * 276;	
					posicao =  0;	
					console.log('countHiddem: '+countHiddem+' * 276 = valorSlide: '+valorSlide);
					
					if(valorSlide == 0){
						valorSlide = countHiddem * 276;
					}
					
				}else{ 
					//atualização do valor de [ TRANSIÇÃO ]
					posicao = countHiddem - contentCards; 
					console.log(posicao);
					console.log(valorSlide);
				}			
				
				$(nomeClasse+'.selected').removeClass("selected").css({"transitions":"0.5s"});
				//atualização de seleção da [ CLASSE DOTS ]
				$(nomeClasse+':eq('+valorIndiceClick+")").addClass("selected").css({"transitions":"0.5s"});
				//atualização de transição da [ LISTA DE CARDS ]
				$('.firme-lista li:first').animate({"margin-left":"+="+valorSlide+"px"},"slow", function(){});
				
				console.log('valor do valorSlidex: '+valorSlide);
				
				//atualização de classe da [ LISTA DE CARDS ]
				posicao	= posicao * valorIndiceClick;
				
				for(var x=countHiddem; x >= posicao; x-- ){
					if(x >= posicao){
						$('.firme-lista li:eq('+x+')').removeClass("hiddem");
					}
				}
			}
		}
		calcularPaginacao();
	}

})
