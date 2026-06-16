// JavaScript Document
$(function(){
	var i;
	
	var contentWidth = parseInt($('.firme-lista').width());
	var cardsContentCounts = (contentWidth) / 276;
	
	if(contentWidth < 276){ contentWidth = 276; }
	
	if((cardsContentCounts < 1 )&&(cardsContentCounts > 0 )){ cardsContentCounts = 1; }
	if((cardsContentCounts < 2 )&&(cardsContentCounts > 1 )){ cardsContentCounts = 2; }
	if((cardsContentCounts < 3 )&&(cardsContentCounts > 2 )){ cardsContentCounts = 3; }
	if((cardsContentCounts < 4 )&&(cardsContentCounts > 3 )){ cardsContentCounts = 4; }
	if((cardsContentCounts < 5 )&&(cardsContentCounts > 4 )){ cardsContentCounts = 5; }
	if((cardsContentCounts < 6 )&&(cardsContentCounts > 5 )){ cardsContentCounts = 6; }

	//alert('verificando...'+cardsContentCounts);
	//alert('conteúdos '+contentWidth);
	
	switch (cardsContentCounts){
		case 1:
			contentWidth = contentWidth * 1;
			//console.log('aqui...'+contentWidth);
			break;
		case 2:
			contentWidth = contentWidth * 2;
			//console.log('aqui...'+contentWidth);
			break;
		case 3:
			contentWidth = contentWidth * 3;
			//console.log('aqui...'+contentWidth);
			break;
		case 4:
			contentWidth = contentWidth * 4;
			//console.log('aqui...'+contentWidth);
			break;
		case 5:
			contentWidth = contentWidth * 5;
			//console.log('aqui...'+contentWidth);
			break;
	}
	
	
	//var video = document.querySelector('#player'),
    var range = document.querySelector('.video-bar-range');
	//var range = document.querySelector('input[type ="range"]');
	
	contentClass = $(".navigation").parent().find(".firme");
	// O container do video
	//Max players [ 16 / TEMPORADA ]
	var playerContainer = [ '#player1', '#player2', '#player3', 
							'#player4', '#player5', '#player6', 
							'#player7', '#player8', '#player9', 
							'#player10', '#player11', '#player12'	];
	// O container do video
	var playerDiv = $('#player');
   // inicializando o player
	var player;
	var vPlayer;
	//inicializando o tempo de duração do vídeo
	var videoDuration = 0;
	// inicializando o contador do tempo do video
	var videotime = 0;
	// inicializando intervalo
	var interval = null;
	//inicia lista de aulas
	var nPlayers = ['player1', 'player2', 'player3', 
					'player4', 'player5', 'player6', 
					'player7', 'player8', 'player9', 
					'player10', 'player12', 'player12'];
					
	var aulasURL = ['NuGPbfLRw5g', '5YciUGw1IyQ', '_gsZqMepp6g',
					'B-ZTXMN2cT4', '8qyTs9BjYpk', 'xGuVr_QuoFc',
					'ECATIY2DBwI', 'EREBvrtWBeU', 'NY30eWiBMZQ', 
					'v1uiLIUf1Tk', 'v1uiLIUf1Tk', 'v1uiLIUf1Tk'];
					
	/* [ TEXAS WALK - SHAMROCK - HEEL TOE - 
		BUTTERFLY - GABBAGE PATH - ROPE ] */	
		
					//X6nBMR4Xz70   NuGPbfLRw5g

	$('.progress-bar').click(function(){
		var $cronos = document.querySelector("span.mark");
		$cronos.innerHTML = formatarCronometro(parseInt(player.getCurrentTime()));
	})
	
	if(($('.lista-videos li').length)== 0){
		carregarPlayers(i);
	}

	iniciarPaginacaoDots();

	function carregarPlayers(id){
		var tag = document.createElement('script');
		var firstScriptTag = document.getElementsByTagName('script')[0];
		$('.btn-custon-right').css({"opacity":"0"});
		$('.btn-menu-left').css({"opacity":"0"});
		
		if((id == undefined)||(id == null)){
			id = 0;
			
			for(var x=0; x<= nPlayers.length-1;x++){
				//console.log(nPlayers[x]);
				$('ul.lista-videos').append('<li id='+nPlayers[x]+' class="playerVideos" data-video-id='+aulasURL[x]+'></li>');
			}
			$('.playerVideos:first').addClass("viewer");
			$('.firme-lista li:first').addClass("selected");
		}
		
		//verificação para o reset da lista de vídeos
		resetarPlayers(id);
		
		// Adicionando Youtube iframe API
		tag.src = 'https://www.youtube.com/iframe_api';
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		onYouTubeIframeAPIReady(id);
	}
	
	function resetarPlayers(idPlayer){
		if($('.playerVideos:eq('+idPlayer+')').hasClass("viewer")){
			for(var x=0; x <= $('.playerVideos').length; x++){
				if(x < idPlayer){
					$('.playerVideos:eq('+x+')').replaceWith('<li id='+nPlayers[x]+' class="playerVideos" data-video-id='+aulasURL[x]+'></li>');
					$('.playerVideos:eq('+x+')').removeClass("viewer").addClass("hiddem").css({"opacity":"0"});
					$('.firme-lista li:eq('+x+')').removeClass("selected no-actived").addClass("hiddem");
					console.log('reset1');
				
				}else if(x > idPlayer){
					$('.playerVideos:eq('+x+')').replaceWith('<li id='+nPlayers[x]+' class="playerVideos" data-video-id='+aulasURL[x]+'></li>');
					$('.playerVideos:eq('+x+')').removeClass("viewer").addClass("checked").css({"opacity":"0"});
					$('.firme-lista li:eq('+x+')').removeClass("selected").addClass("no-actived");
					console.log('reset2');
					
				}else{		
					$('.playerVideos:eq('+x+')').replaceWith('<li id='+nPlayers[x]+' class="playerVideos" data-video-id='+aulasURL[x]+'></li>');
					$('.playerVideos:eq('+x+')').removeClass("checked hiddem").addClass("viewer").css({"opacity":"1"});
					$('.firme-lista li:eq('+x+')').addClass("selected").removeClass("hiddem no-actived");
					console.log('reset3');
				}
			}
		}
	}
    // Método chamado automaticamente pela api do youtube
    function onYouTubeIframeAPIReady(i) {
			if((i != undefined)||(i != null)){
				//player = new YT.Player('player', {
				//vPlayer = nPlayers[i];	
				player = new YT.Player(nPlayers[i], {
				//height: 450, // qualquer altura desejada
				//width: 800, // qualquer largura desejada
				//host: 'https://www.youtube.com',
				host: 'https://www.youtube-nocookie.com',
				//videoId: $(playerDiv).attr('data-video-id'),
				videoId: $(playerContainer[i]).attr('data-video-id'),
				events: {
					'onReady': onPlayerReady,
					'onStateChange': onPlayerStateChange
				},
				playerVars: { // adicionando algumas variáveis
					'enablejsapi': '0',
					//'origin': 'window.location.origin',
					//'origin': 'http://localhost',   //adicionar o endereço e porta do site como origem da requisição
					'rel': '0', // não exibir videos relacionados ao final
					'showinfo': '0', // ocultar informações do video
					'autoplay': '1', // play automático
					'modestbranding':'1',
					'controls':'0'//,
					//'loop':'1'
				}
			});
		}
	}
	
    // Método chamado nos eventos do player
    function onPlayerReady(event) {
        // obtendo a duração do video, em segundos
		videoDuration = parseInt(player.getDuration());
		// aplicando o intervalo de 1 em 1 segundo
        interval = setInterval(discoverTime, 1000);
		
		$('.video-bar-range').on('click', function () {
			//captura o valor atual do elemento
			var $range = document.querySelector('.video-bar-range').value;
			//captura a posição do mouse no momento do click
			$range = (($range * videoDuration) / 1000);
			
			var valorJump = ($range - videotime);	
			
			if($range > videotime){
				player.seekTo($range, true);
				
			}else if($range < videotime){
				player.seekTo($range, true);
			}	
		});
	}

    // método utilizado para descobrir o tempo atual do vídeo
    function discoverTime() {
        if (player && player.getCurrentTime) {	
            videotime = parseInt(player.getCurrentTime());
			
		}
        //if (videotime < videoDuration && lyrics[videotime] !== undefined) {
		if (videotime <= videoDuration !== undefined) {	
            //fireEvent(videotime);
			var $tempo = document.querySelector("span.tempo");
			var $total = document.querySelector("span.duracao");
						
			$tempo.innerHTML = formatarCronometro(videotime);
			$total.innerHTML = formatarCronometro(videoDuration);
			
			//var position = videotime / videoDuration;
			//range.value = position * 1000;
			
			//define a cor do background			
			var usedColor = '#D9043D';
			//calcula o valor atual da barra de progresso
			var currentValue = (videotime / videoDuration )* 100;
			//range.value = position * 1000;
			//define os valores usados
			var updateBackgroundColor = (value, color) => {
			  range.style.setProperty(
				'background',
				`linear-gradient(to right,  ${color} 0%,  ${color} 
				 ${value}%,
				 #fff ${value}%, 
				 #fff 100%)`,
			  );
			};
			//atualiza o valor da barra de progresso
			updateBackgroundColor(currentValue, usedColor);
		}
		
		if((videoDuration - videotime) <= 5){
			$('.btn-custon-right').css({"opacity":"1"});
		}
		
		if((videoDuration - videotime) <= 5){
			//alert('alguma coisa');	
			var $timer = parseInt(videoDuration - videotime);
			var $texto = document.querySelector(".btn-custon-right tm");

			if($timer <= 2){
				$('.viewer').addClass("checked");
			}				
			formatarCronometro(videotime);
			$texto.innerHTML = $timer;		
		}
		else if((videoDuration - videotime) > 5){
			$('.btn-custon-right').css({"opacity":"0"});
		}

        if (videotime >= videoDuration) {
			$('.btn-custon-right').css({"opacity":"0"});
			 clearInterval(interval);
        }
	}

	//Método chamado nos eventos para saber quando o vídeo chegou ao fim
	function onPlayerStateChange(event) {
	switch (event.data) {
		case YT.PlayerState.ENDED:
			verificaPosicaoVideo('ENDED');

			//$('.btn-menu-left').css({"opacity":"0"});
			//$('.btn-custon-right').css({"opacity":"0"});	
			$('#main-content').addClass("float-content");
			$('.controles').css({"opacity":"0", "transition":"0.5s"});
			//atualizarTemplateCards();
			//calcularPaginacao();
			verificarSalto("g");
			
			console.log('Finalizou execução do video');
			break;
        case YT.PlayerState.PLAYING:
			
			//var altura = window.screen.height;
			var largura = window.screen.width;
			var valorTop = $('iframe').offset().top;
			
			console.log(valorTop);
			
			if((largura >= 842) && (largura < 991)){ 
				console.log(valorTop);
				$(window).scrollTop(30);
			}
			
			if(largura >= 720){ 
				console.log(valorTop);
				$(window).scrollTop(140);
			}
			
			if((largura >= 412) && (largura <= 480)){ 
				console.log(valorTop+'to aqui');
				$(window).scrollTop(190);
			}
			
			if((largura >= 481) && (largura < 576)){ 
				console.log(valorTop);
				$(window).scrollTop(30);
			}
			
			
			$('.controles').css({"opacity":"1", "transition":"0.5s"});
            $('#main-content.float-content').removeClass("float-content");
			//$('.btn-menu-left').css({"opacity":"1", "transition":"0.5s"});
			console.log('Assistindo...' +largura);
			break;
        case YT.PlayerState.PAUSED:
			
			//$('.btn-menu-left').css({"opacity":"0", "transition":"0.5s"});
			$('.controles').css({"opacity":"0", "transition":"0.5s"});
			$('#main-content').addClass("float-content");
			console.log('Pause '+player.getCurrentTime());
            break;
        case YT.PlayerState.BUFFERING:
			
			console.log('carregando');
            break;
			
		case YT.PlayerState.CUED:
			break;
    	}
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
			$('.firme:eq('+novoSelected+')').removeClass("hiddem no-actived").addClass("selected").prev().addClass("hiddem");
			verificarSalto("g");
			
		}else{
			resultIndice = parseInt(margemInicial - margemAtual) * (-1);

			$('.firme:first').animate({"margin-left":"-="+resultIndice+"px"},"slow", function(){});
			$('.firme-lista li.firme').removeClass("selected");
			$('.firme:eq('+novoSelected+')').removeClass("hiddem no-actived").addClass("selected").prev().addClass("hiddem");
			verificarSalto("b");
			
		}
		
		console.log('valor do resultIndice: '+resultIndice);
		resetarCardList()
		//atualizarTemplateCards();
		//calcularPaginacao();
		verificaPosicaoVideo(novoSelected);
		//console.log('valor do novo select '+novoSelected);
		carregarPlayers(novoSelected);
		$('.controles').css({"opacity":"0"});
	})
	// ======================================//
	// ========= INICIAR PAGINAÇÃO ==========//
	// ======================================//
	
	//==================================================================================//
	//============================= [ IMPLEMENTAÇÃO ] ==================================//
	//====== DATA:15/072023 - 16:40h ===================================================//
	//====== DESCRIÇÃO: Ajuste de controle de paginação dos [ DOTS ] ===================//
	//==================================================================================//

	function resetarCardList(){
		var listaHiddem = $('.firme-lista li.hiddem').length -1;
		var listaNoActived = $('.firme-lista li.no-actived').length -1;
		var cardSelected = $('.firme-lista li.selected').index();
		var totalCards = $('.firme-lista li').length -1;
		
		for(var x=0; x <= $('.firme-lista li').length -1; x++){
			if($('.firme-lista li:eq('+x+')').hasClass("hiddem")){
				$('.firme-lista li:eq('+x+')').removeClass("no-actived");
			}
		}
	}


	function iniciarPaginacaoDots(){
		var widthContent = $('.firme-lista').width() / 276;
		var totalCards = $('.firme-lista li').length;
		//var cardsContent = parseInt(contentWidth / 276);
		var cardsContent = cardsContentCounts;
		
		valorTemplate = verficaValorTemplate(widthContent);				
		
		var resultadoCalc = totalCards / cardsContent;
				
		for(var x=0; x < resultadoCalc; x++){
			$('.pages').append('<li id="" class="dots"></li>');
		}
		
		console.log('cardsContentCounts: '+cardsContent);
		
		//console.log('valor da paginação: '+ $('.pages li').length);
		//inicialização da qtd de [ CARDS HIDDEM ]
		var countHiddem = parseInt($('li.hiddem').length);	
		calcularPaginacao();
	}

	//CLIQUE DA PAGINAÇÃO	
	$('.pages li').click(function(){
		var idSelecaoAtual = parseInt($('.pages li.selected').index());
		var clickSelecao = parseInt($(this).index());
		
		if(!$(this).hasClass("selected")){
			$(this).addClass("selected").css({"transitions":"0.5s"});
		}
		
		console.log('valor do selected: '+idSelecaoAtual);
		console.log('valor do click: '+clickSelecao);
		
		atualizarPaginacaoDots(idSelecaoAtual, clickSelecao);
		//selecaoPaginacaoCards(".pages", ".dots", idSelecaoAtual, clickSelecao);
	})
	
	//VERIFICA O TAMANHO DO TEMPLATE BASEADO NA QUANTIDADE DE CARDS DISPONÍVEIS
	function verficaValorTemplate(valorTemplate){
		var template = valorTemplate;
		
		if(template < 1.4){ template = 1; }
		if((template < 2.09) && (template > 1.5)){ template = 2; }
		if((template < 3.4) && (template > 2.1)){ template = 3; }
		if((template < 4.5) && (template > 3.5)){ template = 4; }
		
		return template;
	}
	
	//CALCULAR O VALOR DO SALTO ENTRE OS CARDS BASEADO NA QUANTIDADE DE CARDS [ ON-ACTIVED ] E CARDS [ HIDDEM ]
	function calcularJumpCards(qdtInativos, qtdHiddem, indiceCardSelect, indiceNovoCardSelected){
		var indiceCardSelected  = $('.firme-lista li.selected').index();
		var lastIndiceHiddem = $('.firme-lista li.hiddem:last').index();
		var firstIndiceNoActived = $('.firme-lista li.no-actived:first').index();
		var valorJump;
		
		firstCardNoActived = $('.firme-lista li.no-actived:first').index();
		lastCardtHiddem = $('.firme-lista li.hiddem:last').index();
		var margemDistance = (parseInt($('.firme-lista li.selected').index()) - lastCardtHiddem);
				
		if(indiceCardSelect > indiceNovoCardSelected){
		//RECUAR [ ++ ]
		//[ HIDDEM ]
			valorJump = firstIndiceNoActived - lastIndiceHiddem;
		
		}else if(indiceCardSelect < indiceNovoCardSelected) {
		//AVANÇAR [ -- ]
		//[ NO-ACTIVED ]
			valorJump = indiceCardSelect - lastNoActived;
		
		}else{//NULO
		
		}
		return valorJump;
	}
	
	function atualizarPaginacaoDots(idSelecaoAtual, clickSelecao){
		//tamanho do template [ CARDS VIDEOS ]
		var widthCardsTemplate = parseInt($('.firme-lista').width());	
		//inicialização da qtd de [ CARDS ]
		var countCardsVideos = $('.firme-lista li').length-1;	
		//inicialização da qtd de [ CARDS HIDDEM ]
		var countCardsHiddem = $('.firme-lista li.hiddem').length;	
		var lasCardtHiddem;
		//valor da qtds [ DOTS ]
		var valorPaginacao = $('.pages li').length -1;
		var paginacao;
		//BASE DE CALCULO PARA MOVIMENTOS DOS [ CARDS ]
		var qtdTemplateCards = parseInt(widthCardsTemplate / 276);
		var contentCardsVideos = parseInt( countCardsVideos / valorPaginacao);
		
		if(widthCardsTemplate < 276){ widthCardsTemplate = 276; }
		
		var template = ($('.firme-lista').width() /276);
		
		//console.log('valor paginação: '+valorPaginacao);
		//console.log('cards hiddem: '+countCardsHiddem);
		//console.log('valor do content cards: '+contentCardsVideos);
		//console.log('valor do tamanho do template: '+widthCardsTemplate);
		//console.log('qtd cards template: '+qtdTemplateCards);
		///console.log('valor do template: '+parseInt(widthCardsTemplate / 276));
		console.log('indice atual: '+idSelecaoAtual);
		console.log('indice click: '+clickSelecao);
				
		if(countCardsHiddem == 0){
			paginacao = 0;
			$('.pages li').removeClass("selected").css({"transitions":"0.5s"});
			$('.pages li:eq('+paginacao+")").addClass("selected").css({"transitions":"0.5s"});
		}		
				
		//if(!$('.pages li').hasClass("selected")){
		/*if(idSelecaoAtual < 0){
			var indiceLastCardsSelected = $('.firme-lista li:last').index();	
			var indiceCardsInativos = $('.firme-lista li.no-actived').length -1;
			var indiceCardAtual = $('.firme-lista li.selected').index();
			var indiceCardClick = contentCardsVideos * clickSelecao;
			
			//console.log('idSelecaoAtual '+idSelecaoAtual);
			//console.log('clickSelecao '+clickSelecao);
						
			if(clickSelecao == 0){
				idSelecaoAtual = parseInt($('.pages li').length);
			}
			
			indiceCardAtual = (contentCardsVideos * (clickSelecao - idSelecaoAtual));
			var valorPaginacaoClick = parseInt(indiceCardAtual * -276);
			
			valorTemplate = verficaValorTemplate(template);				
							
			var margemIndice = (clickSelecao - idSelecaoAtual) * contentCardsVideos;
			//Calcula o valor do [ INDICE CARD ATUAL ]
			indiceCardClick = valorTemplate * clickSelecao;
			
			console.log('contentCardsVideos '+contentCardsVideos);
			console.log('indiceCardClick: '+indiceCardClick);
			console.log('indiceCardAtual: '+indiceCardAtual);
			console.log('idSelecaoAtual: '+idSelecaoAtual);
			console.log('valorPaginacaoClick: '+valorPaginacaoClick);
			
			$('.firme-lista li.selected').removeClass("selected").css({"transitions":"0.5s"});
			//atualização de seleção da [ CLASSE DOTS ]
			$('.firme-lista li:eq('+indiceCardClick+")").addClass("selected").css({"transitions":"0.5s"});
			
			firstCardNoActived = $('.firme-lista li.no-actived:first').index();
			lastCardtHiddem = $('.firme-lista li.hiddem:last').index();
			var margemDistance = (parseInt($('.firme-lista li.selected').index()) - lastCardtHiddem);
			
			console.log('margem distance: '+margemDistance);
			valorPaginacaoClick = (margemDistance -1) * -276;
			
			//atualização de transição da [ LISTA DE CARDS ]
			$('.firme-lista li:first').animate({"margin-left":"+="+valorPaginacaoClick+"px"},"slow", function(){});
			
			for(var x= indiceCardAtual; x <= $('.firme-lista li').length; x++){
				$('.firme-lista li:eq('+x+')').removeClass("hiddem").next().addClass("no-actived").css({"transitions":"0.5s"});
				//console.log('card: '+x);
				//console.log('indiceCardClick: '+indiceCardClick);
			}
		}
		else*/	
		
		if(idSelecaoAtual != clickSelecao){
			$('.pages li').removeClass("selected").css({"transitions":"0.5s"});
			$('.pages li:eq('+clickSelecao+")").addClass("selected").css({"transitions":"0.5s"});
			
			//VERIFICAÇÃO DO RECUO DOS CARDS
			if(idSelecaoAtual < clickSelecao){
				var indiceCardAtual = $('.firme-lista li.selected').index();
				var indiceCardClick = contentCardsVideos * clickSelecao;
				//console.log('indice atual1: '+indiceCardAtual);
				//console.log('indice click1: '+indiceCardClick);
				
				indiceCardAtual = (contentCardsVideos * (clickSelecao - idSelecaoAtual));
				var valorPaginacaoClick = parseInt(indiceCardAtual * 276);
								
				valorTemplate = verficaValorTemplate(template);				
								
				var margemIndice = (clickSelecao - idSelecaoAtual) * contentCardsVideos;
				//Calcula o valor do [ INDICE CARD ATUAL ]
				indiceCardClick = valorTemplate * clickSelecao;
				
				$('.firme-lista li.selected').removeClass("selected").css({"transitions":"0.5s"});
				//atualização de seleção da [ CLASSE DOTS ]
				$('.firme-lista li:eq('+indiceCardClick+")").addClass("selected").css({"transitions":"0.5s"});
				
				lastCardtHiddem = $('.firme-lista li.hiddem:last').index();
				var margemDistance = parseInt($('.firme-lista li.selected').index()) - lastCardtHiddem;
				
				//console.log('margem distance: '+margemDistance);
				valorPaginacaoClick = (margemDistance -1) * 276;
				
				//atualização de transição da [ LISTA DE CARDS ]
				$('.firme-lista li:first').animate({"margin-left":"-="+valorPaginacaoClick+"px"},"slow", function(){});
				
				for(var i=0; i < indiceCardClick; i++){
					$('.firme-lista li:eq('+i+")").addClass("hiddem").removeClass('no-actived').css({"transitions":"0.5s"});
					//console.log('card: '+i);
				}
			//}else{
			//VERIFICAÇÃO DO AVANÇO DOS CARDS
			if(idSelecaoAtual > clickSelecao){
				var indiceCardsInativos = $('.firme-lista li.no-actived').length -1;
				var indiceCardAtual = $('.firme-lista li.selected').index();
				var indiceCardClick = contentCardsVideos * clickSelecao;
				//console.log('indice atual2: '+indiceCardAtual);
				//console.log('indice click2: '+indiceCardClick);
				
				indiceCardAtual = (contentCardsVideos * (clickSelecao - idSelecaoAtual));
				var valorPaginacaoClick = parseInt(indiceCardAtual * -276);
				
				valorTemplate = verficaValorTemplate(template);				
								
				var margemIndice = (clickSelecao - idSelecaoAtual) * contentCardsVideos;
				//Calcula o valor do [ INDICE CARD ATUAL ]
				indiceCardClick = valorTemplate * clickSelecao;
				
				$('.firme-lista li.selected').removeClass("selected").css({"transitions":"0.5s"});
				//atualização de seleção da [ CLASSE DOTS ]
				$('.firme-lista li:eq('+indiceCardClick+")").addClass("selected").css({"transitions":"0.5s"});
				
				firstCardNoActived = $('.firme-lista li.no-actived:first').index();
				lastCardtHiddem = $('.firme-lista li.hiddem:last').index();
				var margemDistance = (parseInt($('.firme-lista li.selected').index()) - lastCardtHiddem);
				
				//console.log('margem distance: '+margemDistance);
				valorPaginacaoClick = (margemDistance -1) * -276;
				
				//atualização de transição da [ LISTA DE CARDS ]
				$('.firme-lista li:first').animate({"margin-left":"+="+valorPaginacaoClick+"px"},"slow", function(){});
				
				for(var x= indiceCardAtual; x <= $('.firme-lista li').length; x++){
				//for(var x=$('.firme-lista li.hiddem').length; x >= indiceCardClick; x--){
					$('.firme-lista li:eq('+x+')').removeClass("hiddem").next().addClass("no-actived").css({"transitions":"0.5s"});
					//console.log('card: '+x);
					//console.log('indiceCardClick: '+indiceCardClick);
				}
			}
		}
		$('.firme-lista li.selected').removeClass("no-actived");
		console.log('count hiddem: '+countCardsHiddem);
	}
	
	//==================================================================================//
	//========================= FIM DA IMPLEMENTAÇÃO ===================================//
	//==================================================================================//

	function calcularPaginacao(){
		//inicialização da qtd de [ CARDS HIDDEM ]
		var countHiddem = $('.firme-lista li.hiddem').length;	
		//valor da qtds [ DOTS ]
		var valorPaginacao = $('.pages li').length;
		//valor do indice do [ DOTS SELECTED ]
		//var dotsSelected = $('.pages li.selected').length;
		//var valorPaginacao;
				
		if(countHiddem == 0){
			valorPaginacao = 0
			$('.pages li').removeClass("selected").css({"transitions":"0.5s"});
			$('.pages li:eq('+valorPaginacao+")").addClass("selected").css({"transitions":"0.5s"});
			
		}else{
			valorPaginacao = countHiddem / (cardsContentCounts);
			$('.pages li').removeClass("selected").css({"transitions":"0.5s"});
			$('.pages li:eq('+valorPaginacao+")").addClass("selected").css({"transitions":"0.5s"});
		}
	}
	
	
	//==================================================================================//
	//============================= [ IMPLEMENTAÇÃO ] ==================================//
	//====== DATA:17/072023 - 17:00h ===================================================//
	//====== DESCRIÇÃO: Ajuste de controle de paginação do [ CARD TEMPLATE ] ===========//
	//==================================================================================//
	
	function atualizarTemplateCards(){
		var template = ($('.firme-lista').width() /276);
		
		var indiceCardSeleted = $('.firme-lista li.selected').index(); 
		var indiceInativos = $('.firme-lista li.no-actived').length;
		var totalCards = $('.firme-lista li').length;
		var dotSelected = $('.pages li.selected').index(); 
		var totalDots = $('.pages li').length;
		
		var valorTemplate = verficaValorTemplate(template);
		console.log('valor template: '+valorTemplate);
		
		//console.log('lista hiddem: '+listaHiddem);
		var mediaTemplate;
		var novoDotselected;
		var m;
		
		if(totalCards % valorTemplate == 0){
			//console.log('1');
			mediaTemplate = totalCards / valorTemplate;
			novoDotselected = (valorTemplate * (indiceCardSeleted -1)) / totalCards;
			m = (indiceCardSeleted) / valorTemplate;
		}else{
			//console.log('2');
			mediaTemplate = totalCards / totalDots;
			novoDotselected = (valorTemplate * (indiceCardSeleted -1)) / totalCards;
			m = (indiceCardSeleted) / mediaTemplate;					
		}
					
		if((valorTemplate == 1)||(mediaTemplate == 1)){
			$('.pages li').removeClass("selected").css({"transitions":"0.5s"});
			$('.pages li:eq('+indiceCardSeleted+')').addClass("selected").css({"transitions":"0.5s"});
			console.log('indice card1: '+indiceCardSeleted);
		}
		
		if((valorTemplate == 2)||(mediaTemplate == 2)){
			
			novoDotselected = Math.round(novoDotselected);
			
			/*console.log('indice card2: '+indiceCardSeleted);
			console.log('valor template: '+valorTemplate);
			console.log('média do template: '+mediaTemplate);
			console.log('novo dotSelected: '+(novoDotselected));
			console.log('total dots: '+(totalDots));
			console.log('valor de m: '+parseInt(m));*/
			
			if((novoDotselected) == parseInt(m)){				
			//if($('.pages li').find(m)){
				$('.pages li').removeClass("selected").css({"transitions":"0.5s"});
				$('.pages li:eq('+novoDotselected+')').addClass("selected").css({"transitions":"0.5s"});
			}
		}
		//}
		
		if((valorTemplate == 3)||(mediaTemplate == 3)){
			
			novoDotselected = Math.round(novoDotselected);
			
			/*console.log('indice card3: '+indiceCardSeleted);
			console.log('valor template: '+valorTemplate);
			console.log('média do template: '+mediaTemplate);
			console.log('novo dotSelected: '+(novoDotselected));
			console.log('total dots: '+(totalDots));
			console.log('valor de m: '+parseInt(m));*/
			
			if((novoDotselected) == parseInt(m)){				
			//if($('.pages li').find(m)){
				$('.pages li').removeClass("selected").css({"transitions":"0.5s"});
				$('.pages li:eq('+novoDotselected+')').addClass("selected").css({"transitions":"0.5s"});
			}
		}
		
		if((valorTemplate == 4)||(mediaTemplate == 4)){
			console.log('indice card4: '+indiceCardSeleted);
			console.log('novo dotSelected: '+parseInt(novoDotselected));
			console.log('total dots: '+(totalDots));
			console.log('valor de m: '+parseInt(m));
			
			if(parseInt(novoDotselected) == parseInt(m) ){				
			//if($('.pages li').find(m)){
				$('.pages li:eq('+m+')').addClass("selected").css({"transitions":"0.5s"});
			}
		}
		
		if($('.pages li:eq('+m+')').hasClass("selected")){
			console.log('valor de mmmmm: '+parseInt(m));
			$('.pages li').removeClass("selected").css({"transitions":"0.5s"});	
			$('.pages li:eq('+m+')').addClass("selected").css({"transitions":"0.5s"});
		}
		console.log('indice dot: '+dotSelected);
		//console.log('média de cards: '+mediaTemplate);
	}
	
	
	
	/*function selecaoPaginacaoCards(nomeLista, nomeClasse, valorSelecaoAtual, valorIndiceClick){
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
		console.log('contentCards: '+contentCards);
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
	}*/
	// ======================================//
	//============ FIM PAGINAÇÃO ============//
	// ======================================//

	function verificaPosicaoVideo(indiceVideo){
		var idAtual = "";
		var idAnterior = "";
		
		if(indiceVideo == "ENDED"){
			//verifica a quantidade de itens da lista atual
			for(var v=0; v <= $('.playerVideos').length;v++){
				idAtual = $('.playerVideos:eq('+v+')').index();
				
				//verifica se o item anterior possui a classe "viewer"
				if($('.playerVideos:eq('+v+')').prev().hasClass("viewer")){
					//verifica se o ultimo item da lista possui o valor "viewer"
					if($('.playerVideos:last').hasClass("viewer")){	
						//console.log('verifica viewer atual');
						//inicia o carregamento de um novo vídeo
						carregarPlayers(v);
					}
					//verifica se o item anterior possui o valor "checked"
					if($('.playerVideos:eq('+v+')').prev().hasClass("checked")){
						console.log('verifica video anterior '+v);
						$('.playerVideos:eq('+v+')').addClass("viewer").css({"opacity":"1"});
						//$('.playerVideos:eq('+v+')').prev().removeClass("viewer").addClass("checked hiddem").css({"opacity":"0"});
						
						resetarPlayers(s);
						//verifica se o id ANTERIOR é indefinido ou se é inferior ao id ATUAL						
						if((idAnterior != undefined)||(idAnterior < idAtual)){
							
							verificarSelecaoCard(v)
							//idAnterior = idAtual;
							idAtual = "";
						}
						carregarPlayers(v);
					}
				}
				idAnterior = idAtual;
			}
		}else{
			$('.playerVideos:eq('+indiceVideo+')').addClass("checked viewer");
		
			if(indiceVideo == -1){ 
				indiceVideo = 0; 
				$('.playerVideos:eq('+indiceVideo+')').addClass("viewer").css({"opacity":"1"});
				resetarPlayers(indiceVideo)
				carregarPlayers(indiceVideo);			
			}
					
			//verificação do vídeo selecionado
			for(var s=0; s <= $('.playerVideos').length -1;s++){
				idAtual = $('.playerVideos:eq('+s+')').index();
				
				if(idAtual == indiceVideo){
						$('.playerVideos:eq('+indiceVideo+')').addClass("viewer").css({"opacity":"1"});
						carregarPlayers(indiceVideo);
						//resetarPlayers(valorSelecao);
						break;	
				}
				
				if($('.playerVideos:eq('+s+')').prev().hasClass("viewer")){
					if($('.playerVideos:last').hasClass("viewer")){	
						//console.log('salto direto '+idAtual)
						carregarPlayers(s);
						//resetarPlayers(s);
					}
					
					if($('.playerVideos:eq('+s+')').prev().hasClass("checked")){
						if((idAnterior != undefined)||(idAnterior < idAtual)){
							$('.playerVideos:eq('+s+')').addClass("viewer").css({"opacity":"1"});
							//$('.playerVideos:eq('+s+')').prev().removeClass("viewer").addClass("hiddem").css({"opacity":"0"});
							
							resetarPlayers(s);
							verificarSelecaoCard(s);
							//idAnterior = idAtual;
							idAtual = "";
						}
						carregarPlayers(s);
					}
				}
				idAnterior = idAtual;
			}
		}
	}
	
	//verificação da lista de card de itens 
	function verificarSelecaoCard(cardSelected){
		var cardInicial = ((parseInt($('.firme:first').css("margin-left")) / 276) * (-1));
		var itensHiddem = parseInt($('.hiddem').length);
		// [ 0 ] [ 276 ] [ 552 ] [ 828 ] [ 1104 ] [ 1380 ] [ 1656 ]
		var margemInicial = (parseInt($('.firme:first').css("margin-left")) * (-1));
		//var margemAtual = (parseInt($(this).index()) * 276);
		var margemAtual = (parseInt(cardSelected) * 276);
		
		if(cardSelected < cardInicial){
			var resultIndice = ((cardInicial - cardSelected) * 276);
			
			$('.firme:first').animate({"margin-left":"+="+resultIndice+"px", "opacity":"1"},"slow", function(){});
			console.log('valor do resultIndice2: '+resultIndice);
			
			$('.firme-lista li .firme').prev().removeClass("selected");
			$('.firme:eq('+cardSelected+')').removeClass("hiddem").addClass("selected").prev().addClass("hiddem no-actived");
			
		}else if(cardSelected == (cardInicial +1)){
			var resultIndice = ((cardInicial - cardSelected) * 276);
	
			$('.firme:first').animate({"margin-left":"+="+resultIndice+"px", "opacity":"1"},"slow", function(){});
			console.log('valor do resultIndice2: '+resultIndice);
			
			$('.firme:eq('+cardSelected+')').removeClass("hiddem").addClass("selected").prev().addClass("hiddem no-actived");
		
		}else{
			var itensInativos = parseInt($('.no-actived').length);
			var resultIndice = parseInt(margemInicial - (margemAtual + 1)) * (-1);
			
			$('.firme:first').animate({"margin-left":"-="+resultIndice+"px", "opacity":"1"},"slow", function(){});
			console.log('valor do resultIndice2: '+resultIndice);
			
			$('.firme-lista li .firme').prev().removeClass("selected");
			$('.firme:eq('+cardSelected+')').removeClass("hiddem").addClass("selected").prev().addClass("hiddem no-actived");
		}
		//calcularPaginacao();
	}
    // Aqui vem sua lógica para que algo seja feito ao atingir o tempo desejado no video
    /*function fireEvent(index) {
        console.log(lyrics[index]);
    }*/
	
	function slideGo(listName, className, posicaoSelect, posicaoClick){
		if((listName != undefined) && (className != undefined) && (posicaoSelect != undefined) && (posicaoClick != undefined)){

		}else{
			var valorMargem = parseInt($('.firme:first').css("margin-left"));
			var indiceTotal = parseInt($('.firme').length) -1;
			var indiceAtual = ((valorMargem / 276) * (-1));
			
			var qtdItem = $('.firme').length;
			margem = ((qtdItem -1) * 276)*(-1);
					
			if(margem < valorMargem){
				$('.firme:first').animate({"margin-left":"-=276px", "opacity":"1"},"slow", function(){});
			}
			
			if(indiceAtual < indiceTotal){
				$('.firme:eq('+indiceAtual+')').addClass("hiddem").removeClass("selected").next().removeClass("no-actived").addClass("selected").css({"transitions":"0.5s"});
				$('.firme.selected').removeClass("no-actived");
			}
			verificarSalto("g");
			
		}
	}
	
	function slideBack(listName, className, posicaoSelect, posicaoClick){
		if((listName != undefined) && (className != undefined) && (posicaoSelect != undefined) && (posicaoClick != undefined)){
			
		}else{
			var valorMargem = parseInt($('.firme:first').css("margin-left"));
			var indiceAtual = ((valorMargem / 276) * (-1));
			
			var qtdItem = parseInt($('.firme-lista .firme').length);
			margem = ((qtdItem -1) * -276);


			if(valorMargem < 0){
				$('.firme:first').animate({"margin-left":"+=276px", "opacity":"1"},"slow", function(){});
			}
			$('.firme:eq('+indiceAtual+')').prev().removeClass("hiddem").addClass("selected").removeAttr("style").next().addClass("no-actived").removeClass("selected").css({"transitions":"0.5s"});
			$('.firme.selected').removeClass("no-actived");
			
			verificarSalto("b");
			
		}
	}
	
	function formatarCronometro(s){
		function duas_casas(numero){
			if(numero <= 9){
				numero = "0"+numero;
			}
			return numero;
		}
		hora = duas_casas(parseInt(s/3600));
		minuto = duas_casas(parseInt((s%3600)/60));
		segundo = duas_casas((s%3600)%60);
		
		hora = hora % 60;
		minuto = minuto % 60;
		//segundo = segundo % 60;
		
		if((hora == 00) || (hora == null) ||(hora == undefined)){
			formatado = " "+minuto+":"+segundo+" ";
		}else{
			formatado = " "+hora+":"+minuto+":"+segundo+" ";
		}
		return formatado;
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
	
	$('#firmeGO').on("click", function () {
    if (isDoubleClicked($(this))) {
		return;
		}else{
			var selectedAtual = $('.firme-lista .selected').index();
			slideGo();	
		}
	});
	
	$('#firmeBACK').on("click", function () {
    if (isDoubleClicked($(this))) {
		return;
		}else{
			var selectedAtual = $('.firme-lista .selected').index();
			slideBack();
		}
	});
	
	//BOTÃO DE AVANÇAR
	$('#btn-skip-next').on("click", function () {
	    if (isDoubleClicked($(this))) {
		return;
		}else{
			var selectedAtual = $('ul .firme.selected').index();
			//selectedAtual = selectedAtual +1;
			console.log('seleção atual '+selectedAtual);
			
			if($('.firme-lista li:last').hasClass("selected")){
				
			}else{
				selectedAtual = selectedAtual +1;
				verificarSelecaoCard(selectedAtual);
				resetarPlayers(selectedAtual);
				verificaPosicaoVideo(selectedAtual);
			}
			verificarSalto("b");
			
		}
	});
	
	//BOTÃO DE VOLTAR
	$('#btn-skip-back').on("click", function () {
	if (isDoubleClicked($(this))) {
		return;
		}else{
			var selectedAtual = $('ul .firme.selected').index();
			//selectedAtual = selectedAtual +1;
			console.log('seleção atual '+selectedAtual);
			
			selectedAtual = selectedAtual -1;
			//if(selectedAtual < 0){ selectedAtual = 0 }
			if($('.firme-lista li:first').hasClass("selected")){
				
			}else{
				verificarSelecaoCard(selectedAtual);
				resetarPlayers(selectedAtual);
				verificaPosicaoVideo(selectedAtual);
			}
		}
		verificarSalto("b");

	});	
	
	//BOTÕES DE CONTROLE DE VÍDEO
	$('#btn-ctrl-NEXT').on("click", function () {
    if (isDoubleClicked($(this))) {
		return;
		}else{
			var selectedAtual = $('ul .firme.selected').index();
			//selectedAtual = selectedAtual +1;
			console.log('seleção atual '+selectedAtual);
			
			if($('.firme-lista li:last').hasClass("selected")){
				
			}else{
				selectedAtual = selectedAtual +1;
				verificarSelecaoCard(selectedAtual);
				resetarPlayers(selectedAtual);
				verificaPosicaoVideo(selectedAtual);
			}
		}
		verificarSalto("g");
		
	});
	
	$('#btn-ctrl-BACK').on("click", function () {
    if (isDoubleClicked($(this))) {
		return;
		}else{
			var selectedAtual = $('ul .firme.selected').index();
			//selectedAtual = selectedAtual +1;
			console.log('seleção atual '+selectedAtual);
			
			selectedAtual = selectedAtual -1;
			
			//if(selectedAtual < 0){ selectedAtual = 0 }
			if($('.firme-lista li:first').hasClass("selected")){
				
			}else{
				verificarSelecaoCard(selectedAtual);
				resetarPlayers(selectedAtual);
				verificaPosicaoVideo(selectedAtual);
			}
		}
		verificarSalto("b");
		
	});	
	
	
	function verificarSalto(valorSalto){
		if(valorSalto == "g"){
			var dotAtual = $('.pages li.selected').index()+1;
			var cardAtual = $('.firme-lista li.selected').index()-1;
			
		}else if( valorSalto == "b"){
			var dotAtual = $('.pages li.selected').index()-1;
			var cardAtual = $('.firme-lista li.selected').index();
			
		}else{}
		
		var valorTemplate = ($('.firme-lista').width() /276);
		
		valorTemplate = verficaValorTemplate(valorTemplate);
		var media = Math.round(cardAtual / valorTemplate);
				
		if(dotAtual == media){
			$('.pages li').removeClass("selected");
			$('.pages li:eq('+media+')').addClass("selected").css({"transitions":"0.5s"});
		}
		
	}
	
})

