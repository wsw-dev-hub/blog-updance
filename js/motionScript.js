$(document).ready(function() { 

    //VERIFICAÇÃO DOS ITENS DE MENU	
    $('.bar-navigation').css({'display':'none'});


	$('ul.news-lista').on("click", "li", function (event) {
        var classe = '.news';
        //var lista = $(".navigation").parent().find("ul.news-lista ");
        var arrayLista = "ul.news-lista";
        var indice = parseInt($(this).index());
		console.log('passei aqui_news '+indice);
		
        correrSlide(classe, arrayLista, event, indice);
    });

    $('ul.medida-lista').on("click", "li", function (event) {
        var classe = '.medida';
        //var lista = $(".navigation").parent().find("ul.medida-lista ");
        var arrayLista = "ul.medida-lista";
        var indice = parseInt($(this).index());
		console.log('passei aqui_medida');
		
        correrSlide(classe, arrayLista, event, indice);
    });

    $('ul.estrelas-lista').on("click", "li", function (event) {
        var classe = '.estrelas';
        //var lista = $(".navigation").parent().find("ul.estrelas-lista ");
        var arrayLista = "ul.estrelas-lista";
        var indice = parseInt($(this).index());
		console.log('passei aqui_estrelas');
		
        correrSlide(classe, arrayLista, event, indice);
    });


    function correrSlide (classe, arrayLista, event, indice) {
        //console.log(arrayLista);

        var selectedAtual = parseInt($(arrayLista +' li.selected').index());
        var novoSelected = indice;

        console.log('valor do click: ' + novoSelected);
        console.log('valor do atual: ' + selectedAtual);

        resultado = novoSelected - selectedAtual;

        var arrayHiddens = [];
        console.log('valor do resultado: ' + resultado);

        //event.preventDefault();
        for (var w = 0; w <= $(arrayLista + ' li').length - 1; w++) {
            //console.log($(classe + ':eq(' + w + ')').attr('id'));
            setTimeout(function () {
                //console.log('total No-Activeds: ' + parseInt($(arrayLista + ' li.no-actived').length));
                if (parseInt($(arrayLista + ' li.no-actived').length) > 0) {
                    for (var c = 0; c <= parseInt($(arrayLista + ' li.no-actived').length - 1); c++) {

                        for (var l = 0; l <= parseInt($(arrayLista + ' li.hide').length - 1); l++) {
                            if ($(classe + ':eq(' + l + ')').attr('id') == $(classe + ':eq(' + c + ').no-actived').attr('id')) {

                                $(classe + '.hide:first').animate({ "opacity": "0" }, "slow", function () {
                                    $(classe + ':eq(' + l + ').hide').remove();
                                });
                            }
                        }
                    }
                }

                setTimeout(function () {
                    if ($(classe + '.hide').length > 1) {
                        $(classe + ':first').remove();
                    }
                }, 300)
            }, 2000)

            if (w < novoSelected) {
                //console.log('valor do indice é menor: ' +w);
                if ($(classe + ':eq(' + w + ')').attr('id') != $(classe + ':last').attr('id')) {
                    $(classe + ':eq(' + w + ')').addClass("selected");
                    $(classe + ':eq(' + w + ')').clone().appendTo(arrayLista).removeClass("hide selected").addClass("no-actived last");
                    $(classe + ':eq(' + w + ')').addClass("hide first").removeAttr("style").prev().removeClass("first");
                }
            }
        }
        //adiciona a classe [ SELECTED ] ao card selecionado
        $(classe + ':eq(' + novoSelected + ')').addClass("selected").removeClass("first");

        //aguarda 2 segundos para iniciar a função
        setTimeout(function () {
            var novoResultado = resultado / 276;
            //console.log(resultado)

            for (var a = 0; a <= parseInt(novoResultado); a++) {
                //console.log('valor do resultado: ' + a);
                //verifica se o card possui a classe [ HIDDEM ]
                if ($(classe + ':eq(' + a + ')').hasClass("hide")) {
                    //limpa todos os cards [ HIDDEM ] que tenham a classe [ SELECTED ]
                    $(classe + '.hide').removeClass("selected");
                }
            }

            for (var v = 0; v <= $(classe + '.hide').length - 1; v++) {
                arrayHiddens[v] = $(classe + ':eq(' + v + ').hide').attr("id");
                //console.log(arrayHiddens[v].toString() + ' Index: ' + arrayHiddens[v]);

                if (!$(classe + ':eq(' + v + ').hide').hasClass("first")) {
                    //console.log('indice ' + v)
                    $(classe + ':eq(' + v + ').hide').remove();
                }
            }
            $("no-actived").css({ "opacity": "1" });

        }, 1000)

        for (var z = $(arrayLista +' li').length - 1; z >= 0; z--) {
            //console.log(z);
            if ($(classe + ':eq(' + z + ')').index() != $(classe + ':last').index()) {
                $(classe + ':eq(' + z + ')').removeClass("no-actived last");
            }
        }
    }

	$('a[href^="#"] .menu-bar').on('click', function(e) {
		
  		e.preventDefault();
  		var id = $(this).attr('href'),
  		targetOffset = $(id).offset().top;
    
  		$('html, body').animate({ 
    	scrollTop: targetOffset - 100
  		}, 2000);
		
		$('#menu-hamburger').click();
	});
	
    //TRANSIÇÕES DO HAMBURGUER
	$('#menu-hamburger').click(function(){
		//alert('menu selecionado');
		
		if($('#menu-hamburger').is(':checked')){
			$('.bar-navigation').animate({top:'+50%','opacity':'1','transition':'0.5s ease-in-out'}).fadeIn('slow');
		
		}else{
			$('.bar-navigation').fadeOut('2000').animate({top:'-50%','opacity':'0','transition':'0.2s ease-in-out'});
		}
	});
	
	
	$('.acc-btn').click(function(){
			// Sobe todos textos 
			$('.acc-content').slideUp();
			// Se não estiver aberto executa função 
			if($(this).attr('acc-btn') != 'active'){
				//alert('entrei');
				// Remove classe ativo de todos 
				$('.acc-btn').removeClass('active');
				// Insere classe ativo no link clicado 
				$(this).addClass('active');
				// Abre o texto 
				$(this).next().slideDown();
				// Se estiver ativo fecha e remove a classe 
				} else {
					 //Fecha texto 
			 		$(this).next().slideUp();
            		// Remove classe ativo de todos 
					$(this).removeClass('active');
				}
		});	
	
	//VERIFICAÇÃO DE SELEÇÃO DOS PRODUTOS
	$('.tab-btn').click(function () {

	    if ($(this).attr('tab-btn') != 'active-btn') {
	        //alert("alerta!!!");
	        $('.tab-btn').removeClass('active-btn');
	        
	        $(this).addClass('active-btn');
	        //alert('adicionado');
	       

	    } else {
	        $(this).fadeOut('fast');
            $(this).removeClass('active-btn');
            
	    }
       //TABULAÇÃO DOS CONTENTES
	    if (!$('#package-yearly.tab').hasClass('active-tab')) {
	        //alert('to passando');
	        $('#package-monthly.tab').removeClass('active-tab').fadeOut('slow');
	        $('#package-yearly.tab').addClass('active-tab').fadeIn('slow');

	        $('li span.save').text('STANDARD').css({ 'background-color': 'lightgray', 'color': 'gold' });;
	    } 
	    else //{
	        if (!$('#package-monthly.tab').hasClass('active-tab')) {
	        //alert('to dentro');
	        $('#package-yearly.tab').removeClass('active-tab').fadeOut('slow');
	        $('#package-monthly.tab').addClass('active-tab').fadeIn('slow');
	        
	        $('li span.save').text('PREMIUN').css({ 'background-color': 'lightgray','color':'white' });
	    }
	});




    //PAGINAÇÃO DOS ITENS DO CARROSSEL
	var autoSlide = setInterval(slideGo, 12000);

	$('.forth').click(function(){
		slideGo();
		
		});

	$('.back').click(function(){
		slideBack();
		
		});

	var width = (parseInt($('.carousel .carousel-item').outerWidth() + parseInt($('.carousel .carousel-item').css('margin-right')))) * (parseInt($('.carousel .carousel-item').length));
	/*alert(width);*/
		
	$('.carousel').css('width', width);
	var numDeps = 1;
	var marginPadding = 70; 
	
	var ident = 0;
	var count = ($('.carousel .carousel-item').length / numDeps -2 );
	var slide = (numDeps * marginPadding) + ($('.carousel .carousel-item').outerWidth() * numDeps);
		
			
	function slideGo(){
		
		if(ident < count ){
			ident++;
			$('.carousel').animate({'margin-left': '-=' + slide + 'px'}, '9000');
			//alert(ident);	
		}else if(ident == count ){
			ident--;
			$('.carousel').animate({'margin-left': '+=' + slide * count + 'px'}, '9000');
			ident = 0;
		}
	}
	function slideBack(){
		
		if(ident >= 1 ){
			ident--;
			$('.carousel').animate({ 'margin-left': '+=' + slide + 'px' }, '9000');
			 //alert(ident);
		}
	}

	$('.btnOK').click(function () {

	    $('.message').fadeOut('slow');
	});
});

