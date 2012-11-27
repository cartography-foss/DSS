function isTouchDevice(e) {
    try {
        document.createEvent('TouchEvent');
        return true;
    } catch(error) {
        return false;
    }
}

$(function() {
    var m, b,
        geoSelector = 0,
        partSelector = 0,
        catSelector = 0,
        yearSelector = 0,
        sorting = false,
        interaction,
        embedUrl, apiUrl, center,
        curTop,
        onScroll, offScroll,
        tilejson, newTilejson, baseTilejson,
        mm = com.modestmaps,
        layers = [], 
	baseLayers = [],
        baseLayersHidden = false,  
	themlayers = [];

        /*if (!badIE) {
        // Build background map
        wax.tilejson(urlBase + basemap + '.jsonp', function(baseTilejson) {
            b = new mm.Map('map-bg',
            new wax.mm.connector(baseTilejson));
            //b.setCenterZoom(new mm.Location(15, -1), 3);
            b.setCenterZoom(new mm.Location(-20, -120), 3);
        });
    }*/

    // Display base layers
    baseLayers.push('geoportal-arcal.map-98jy9k4j'); 
    selectDescription('REGIONAL');
    $(window).load(function() {
      m = mapbox.map('map');
      m.centerzoom({ lat: -12, lon: -100 }, 3, true);
      m.setZoomRange(3,19);
      m.ui.zoomer.add();
      m.ui.legend.add();
      m.interaction.auto();
     /* m.addCallback("zoomed", function(map, zoomOffset) {
        zoomLevel += zoomOffset; 
        console.log("Map zoomed by", zoomOffset);
        console.log("Zoom level", zoomLevel);
      });*/
      //m.ui.attribution.add()
      //      .content('<a href="http://mapbox.com/about/maps">Terms &amp; Feedback</a>');
      $('#geo-filter').val('Regional');
      initLayerSwitcher(['REGIONAL']);
    });

    // Update themLayers order
    function updateLayers() {
	layers = [];
        themLayers = [];
        $('#sortable li a').each(function(i) {
            if ($(this).hasClass('active') && this.id != '') {
                themLayers.unshift(this.id);
            }
        });
        if (baseLayersHidden == false) { 
	  layers = baseLayers.concat(themLayers);
        }
        else {
	  layers = themLayers;
        }
    }
    
    function refreshMap() {
      nbCurrentLayers = m.getLayers().length; 
      for (var i = 0; i < nbCurrentLayers; i++) {
        m.removeLayerAt(0);     
      }	
      nbNewLayers = layers.length;
      for (var i = 0; i < nbNewLayers; i++) {
        m.addLayer(mapbox.layer().id(layers[i], function(){
        m.interaction.refresh();
        m.ui.refresh();
        }));
      }	
      m.ui.zoombox.add();
   }

    // Select description
    function selectDescription(site) {
      $('span.site-description').addClass('geo-off'); 
      $('span.site-description.' + site).removeClass('geo-off');
    } 
 
    // Activate default layers
    function activateDefaultLayers(layer) {
      if (layer.hasClass('active')) {
        layer.removeClass('active');
        layer.next().removeClass('dark');
        layer.parent().parent().prependTo('#layerlist');
      } else {
        layer.addClass('active');
        layer.parent().parent().prependTo('#sortable');
        layer.next().addClass('dark');
      }
      $('#offlayers').css('top',$('#onlayers').height() + 15);
    }

    // Re-initialize data list based on site of interest
    function initLayerSwitcher(site) {
      $('.pull-tab-legend').removeClass('active');
      $('#legend-panel').addClass('active');
      $('.datalist a.layer-link.active').trigger('click'); // Unactivate all active layers
      $('.datalist li').addClass('geo-off'); // Unselect all layers
      for (var i = 0; i < site.length; i++) {
        $('.datalist li.' + site[i]).removeClass('geo-off');  // Select only layers with this specific geo category
      }	
      layersToActivate = $('#offlayers li.default:not(.geo-off)');
      layersToActivate.sort(function(a,b) {  //sort in reverse order based on default-position stored in the id
       return ($(b).attr('id')-$(a).attr('id'));
      }); 
      
      $(layersToActivate).each(function(i) {  // activate layers
       $(this).find('a.layer-link').each(function() {
         activateDefaultLayers($(this));
         updateLayers();
       });
      });
      refreshMap();
   }

    // Site selection autocomplete
    // Initialize autocomplete with 'Regional'
/*    $(document).ready(function() {
      $('#geo-filter').val('Regional');
      selectDescription('regional');
      initLayerSwitcher(['regional']);
    })*/
    // Erase input text when click before new choice
    $('#geo-filter').click(function(e) {
        e.preventDefault();
        $(this).val('');
    })

    $('a.dropdown').click(function(e) {
        e.preventDefault();
        $(this).addClass('active');
        $("#geo-filter").autocomplete( "search", '' );
    })


    $(function() {
      var availableTags = ["Regional",
			"Argentina",
                        "Bolivia",
                        "Brazil",
                        "Chile",
                        "Cuba",
                        "Dominican Rep.",
                        "El Salvador",
                        "Haiti",
                        "Jamaica",
                        "Mexico",
                        "Nicaragua",
                        "Peru",
                        "Uruguay",
                        "Venezuela",       
	                "Atlantida, Uruguay",
	                "Atlantida, Agr., Uruguay",
	                "Atlantida, Mt., Uruguay",
	                "Atlantida, Ref., Uruguay",
	                "Blue montains, Jamaica",
                        "Caracas, Venezuela",
	                "Caracas, Depo., Venezuela",
	                "Caracas, Eros., Venezuela",
	                "Caracas, Ref., Venezuela",
	                "Consolation, Cuba",
	                "Consolation, Ref., Cuba",
	                "Consolation, Estudio, Cuba",
	                "Cuenca Nizao, Dominican Rep.",
	                "El Cristal, Nicaragua",
	                "El Cristal, Ref., Nicaragua",
	                "El Cristal, Estudio, Nicaragua",
			"El Dorado, Argentina",
			"El Dorado, Site 1, Argentina",
	                "Inquisivi, Bolivia",
                        "La Presa, El Salvador",
                        "La Presa, Ref., El Salvador",
                        "La Presa, Mues., El Salvador",
	                "Los Pinos, Chile",
	                "Serra Tiririca, Brazil",
                        "Tequila, Mexico",
                        "Tequila, Ref., Mexico",
	                "Tequila, Eros., Mexico",
	                "Tequila, Sedi., Mexico" 
                       ];

      $( "#geo-filter" ).autocomplete({
        source: availableTags,
        minLength: 0,
        select: function (event, ui) {
          $('a.dropdown').removeClass('active');
	  switch (ui.item.value) {
            case 'Regional':
    	      m.centerzoom({ lat: -12, lon: -100 }, 3, false);
              selectDescription('REGIONAL');
              initLayerSwitcher(['REGIONAL']);
	    break;
            case 'Argentina':
    	      m.centerzoom({ lat: -33.5635, lon: -66.092 }, 4, false);
              selectDescription('ARG');
              initLayerSwitcher(['ARG', 'REGIONAL']);
	    break;
            case 'Bolivia':
    	      m.centerzoom({ lat: -17, lon: -70 }, 6, false);
              selectDescription('BOL');
              initLayerSwitcher(['BOL', 'REGIONAL']);
	    break;
            case 'Brazil':
    	      m.centerzoom({ lat: -11, lon: -80 }, 4, false);
              selectDescription('BRA');
              initLayerSwitcher(['BRA', 'REGIONAL']);
	    break;
            case 'Chile':
    	      m.centerzoom({ lat: -37.5, lon: -90 }, 4, false);
              selectDescription('CHL');
              initLayerSwitcher(['CHL', 'REGIONAL']);
	    break;
            case 'Cuba':
    	      m.centerzoom({ lat: 22, lon: -83 }, 7, false);
              selectDescription('CUB');
              initLayerSwitcher(['CUB', 'REGIONAL']);
	    break;
            case 'Dominican Rep.':
    	      m.centerzoom({ lat: 19, lon: -72 }, 8, false);
              selectDescription('DOM');
              initLayerSwitcher(['DOM', 'REGIONAL']);
   	    break;
            case 'El Salvador':
    	      m.centerzoom({ lat: 14, lon: -90 }, 9, false);
              selectDescription('SLV');
              initLayerSwitcher(['SLV', 'REGIONAL']);
	    break;
            case 'Haiti':
    	      m.centerzoom({ lat: 19, lon: -74 }, 8, false);
              selectDescription('HTI');
              initLayerSwitcher(['HTI', 'REGIONAL']);
	    break;
           case 'Jamaica':
    	      m.centerzoom({ lat: 18, lon: -78 }, 9, false);
              selectDescription('JAM');
              initLayerSwitcher(['JAM', 'REGIONAL']);
	    break;
            case 'Mexico':
    	      m.centerzoom({ lat: 22.5, lon: -110 }, 5, false);
              selectDescription('MEX');
              initLayerSwitcher(['MEX', 'REGIONAL']);
	    break;
            case 'Nicaragua':
    	      m.centerzoom({ lat: 13, lon: -89 }, 7, false);
              selectDescription('NIC');
              initLayerSwitcher(['NIC', 'REGIONAL']);
	    break;
            case 'Peru':
    	      m.centerzoom({ lat: -8, lon: -84 }, 5, false);
              selectDescription('PER');
              initLayerSwitcher(['PER', 'REGIONAL']);
	    break;
            case 'Uruguay':
    	      m.centerzoom({ lat: -33, lon: -60 }, 7, false);
              selectDescription('URY');
              initLayerSwitcher(['URY', 'REGIONAL']);
	    break;
	    case 'Venezuela':
    	      m.centerzoom({ lat: 7.6, lon: -73 }, 6, false);
              selectDescription('VEN');
              initLayerSwitcher(['VEN', 'REGIONAL']);
	    break;
	    case 'El Dorado, Site 1, Argentina':
    	      m.centerzoom({ lat: -33.563, lon: -66.09 }, 17, false);
              selectDescription('ARG-eldorado-site1');
              initLayerSwitcher(['ARG-eldorado-site1']);
	    break;
	    case 'El Dorado, Argentina':
    	      m.centerzoom({ lat: -33.535, lon: -66.13 }, 13, false);
              selectDescription('ARG-eldorado');
              initLayerSwitcher(['ARG-eldorado']);
	    break;
            case 'Tequila, Mexico':
    	      m.centerzoom({ lat: 20.7760, lon: -103.6692 }, 14, false);
              selectDescription('MEX-tequila');
              initLayerSwitcher(['MEX-tequila']);
	    break;
            case 'Tequila, Ref., Mexico':
    	      m.centerzoom({ lat: 20.7720, lon: -103.6605}, 17, false);
              selectDescription('MEX-tequila-ref');
              initLayerSwitcher(['MEX-tequila-ref']);
	    break;
	    case 'Tequila, Eros., Mexico':
    	      m.centerzoom({ lat: 20.7753, lon: -103.6781}, 17, false);
              selectDescription('MEX-tequila-eros');
              initLayerSwitcher(['MEX-tequila-eros']);
	    break;
	    case 'Tequila, Sedi., Mexico':
    	      m.centerzoom({ lat: 20.7797, lon: -103.6799}, 17, false);
              selectDescription('MEX-tequila-sedi');
              initLayerSwitcher(['MEX-tequila-sedi']);
	    break;
            case 'Caracas, Venezuela':
    	      m.centerzoom({ lat: 10.4955, lon: -66.8942}, 17, false);
              selectDescription('VEN-caracas');
              initLayerSwitcher(['VEN-caracas']);
	    break;
	    case 'Caracas, Ref., Venezuela':
    	      m.centerzoom({ lat: 10.4964, lon: -66.8925}, 18, false);
              selectDescription('VEN-caracas-ref');
              initLayerSwitcher(['VEN-caracas-ref']);
	    break;
	    case 'Caracas, Eros., Venezuela':
    	      m.centerzoom({ lat: 10.4942 , lon: -66.8926}, 18, false);
              selectDescription('VEN-caracas-eros');
              initLayerSwitcher(['VEN-caracas-eros']);
	    break;
	    case 'Caracas, Depo., Venezuela':
    	      m.centerzoom({ lat: 10.4960, lon: -66.8959}, 18, false);
              selectDescription('VEN-caracas-depo');
              initLayerSwitcher(['VEN-caracas-depo']);
	    break;
	    case 'La Presa, El Salvador':
    	      m.centerzoom({ lat: 13.8165, lon: -89.5049}, 15, false);
              selectDescription('SLV-la-presa');
              initLayerSwitcher(['SLV-la-presa']);
	    break;
	    case 'La Presa, Ref., El Salvador':
    	      m.centerzoom({ lat: 13.8211, lon: -89.5048}, 17, false);
              selectDescription('SLV-la-presa-ref');
              initLayerSwitcher(['SLV-la-presa-ref']);
	    break;
	    case 'La Presa, Mues., El Salvador':
    	      m.centerzoom({ lat: 13.8110, lon: -89.5052}, 17, false);
              selectDescription('SLV-la-presa-mues');
              initLayerSwitcher(['SLV-la-presa-mues']);
	    break;
	    case 'Atlantida, Uruguay':
    	      m.centerzoom({ lat: -34.7001, lon: -55.7688}, 16, false);
              selectDescription('URY-atlantida');
              initLayerSwitcher(['URY-atlantida']);
	    break;
	    case 'Atlantida, Ref., Uruguay':
    	      m.centerzoom({ lat: -34.7021, lon: -55.7655}, 19, false);
              selectDescription('URY-atlantida-ref');
              initLayerSwitcher(['URY-atlantida-ref']);
	    break;
	    case 'Atlantida, Mt., Uruguay':
    	      m.centerzoom({ lat: -34.7019, lon: -55.766}, 19, false);
              selectDescription('URY-atlantida-mt');
              initLayerSwitcher(['URY-atlantida-mt']);
	    break;
	    case 'Atlantida, Agr., Uruguay':
    	      m.centerzoom({ lat: -34.6981, lon: -55.7717}, 18, false);
              selectDescription('URY-atlantida-agr');
              initLayerSwitcher(['URY-atlantida-agr']);
	    break;
	    case 'Inquisivi, Bolivia':
    	      m.centerzoom({ lat: -16.9766, lon: -67.109}, 14, false);
              selectDescription('BOL-inquisivi');
              initLayerSwitcher(['BOL-inquisivi']);
	    break;
	    case 'Los Pinos, Chile':
    	      m.centerzoom({ lat: -39.7340, lon: -73.1763}, 18, false);
              selectDescription('CHL-los-pinos');
              initLayerSwitcher(['CHL-los-pinos']);
	    break;
	    case 'Consolation, Cuba':
    	      m.centerzoom({ lat: 22.5177, lon: -83.4752}, 16, false);
              selectDescription('CUB-consolation');
              initLayerSwitcher(['CUB-consolation']);
	    break;
	    case 'Consolation, Ref., Cuba':
    	      m.centerzoom({ lat: 22.5215, lon: -83.4767}, 17, false);
              selectDescription('CUB-consolation-ref');
              initLayerSwitcher(['CUB-consolation-ref']);
	    break;
	    case 'Consolation, Estudio, Cuba':
    	      m.centerzoom({ lat: 22.5139, lon: -83.4733}, 17, false);
              selectDescription('CUB-consolation-estu');
              initLayerSwitcher(['CUB-consolation-estu']);
	    break;
	    case 'El Cristal, Nicaragua':
    	      m.centerzoom({ lat: 12.5571, lon: -85.9451}, 16, false);
              selectDescription('NIC-el-cristal');
              initLayerSwitcher(['NIC-el-cristal']);
	    break;
	    case 'El Cristal, Ref., Nicaragua':
    	      m.centerzoom({ lat: 12.5544, lon: -85.9447}, 18, false);
              selectDescription('NIC-el-cristal-ref');
              initLayerSwitcher(['NIC-el-cristal-ref']);
	    break;
	    case 'El Cristal, Estudio, Nicaragua':
    	      m.centerzoom({ lat: 12.5594, lon: -85.9457}, 18, false);
              selectDescription('NIC-el-cristal-estu');
              initLayerSwitcher(['NIC-el-cristal-estu']);
	    break;
	    case 'Blue montains, Jamaica':
    	      m.centerzoom({ lat: 18.0726, lon: -76.6615}, 13, false);
              selectDescription('JAM-blue-mountains');
              initLayerSwitcher(['JAM-blue-mountains']);
	    break;
	    case 'Cuenca Nizao, Dominican Rep.':
    	      m.centerzoom({ lat: 18.5756, lon: -70.3845}, 14, false);
              selectDescription('DOM-cuenca');
              initLayerSwitcher(['DOM-cuenca']);
	    break;
	    case 'Serra Tiririca, Brazil':
    	      m.centerzoom({ lat: -22.9135, lon: -42.9754}, 13, false);
              selectDescription('BRA-tiri');
              initLayerSwitcher(['BRA-tiri']);
	    break;






















	  }
        }
      });
    });

   
    // Draggable data list
    $('#sortable').sortable({
        axis: 'y',
        containment:'parent',
        tolerance: 'pointer',
        update: function() {
          updateLayers();
          //updateEmbedApi();
          refreshMap();
        },
        start: function(e) {
          sorting = true;  //fix an event propagation issue in Firefox
        }
    });
    $('#sortable').disableSelection();
    
    // Data layerswitcher
    $('.datalist a.layer-link').click(function (e) {
      if (sorting == false ) { // fix an event propagation issue in Firefox
        e.preventDefault();
        if ($(this).hasClass('active')) {
          $(this).removeClass('active');
          $(this).next().removeClass('dark');
          $(this).parent().parent().prependTo('#layerlist');
        } else {
          $(this).addClass('active');
          $(this).parent().parent().prependTo('#sortable');
          $(this).next().addClass('dark');
        }
        $('#offlayers').css('top',$('#onlayers').height() + 15);
        updateLayers();
        refreshMap();
      } else {
        sorting = false;
      }
    });

    // Legend panel
    $(window).load(function() {
      $('.map-legends').appendTo('#legend-panel'); 
    });


    // Layer details dropdown
    $('.datalist a.layer-arrow').click(function (e) {
        e.preventDefault();
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).parent().next().removeClass('active');
            if ($(this).prev().hasClass('active')) {
                setTimeout(function() {
                    $('#offlayers').css('top',curTop);
                }, 150);
            }
        } else {
            curTop = $('#offlayers').css('top');
            $('.datalist a.layer-arrow').removeClass('active');
            $('.datalist .detail').removeClass('active');
            $(this).addClass('active');
            $(this).parent().next().addClass('active');
            if ($(this).prev().hasClass('active')) {
                setTimeout(function() {
                    $('#offlayers').css('top',$('#onlayers').height() + 20);
                }, 150);
            }
        }
    });

    // Hide/show sidebar
    $('a.close').click(function(e) {
        e.preventDefault();
        $('#side-panel').removeClass('active');
        $('.pull-tab').addClass('active');
    });
    
    $('a.pull-tab').click(function(e) {
        e.preventDefault();
        $('#side-panel').addClass('active');
        $(this).removeClass('active');
    });

    // Hide/show legend panel
    $('a.close-legend').click(function(e) {
        e.preventDefault();
        $('#legend-panel').removeClass('active');
        $('.pull-tab-legend').addClass('active');
    });
    
    $('a.pull-tab-legend').click(function(e) {
        e.preventDefault();
        $('#legend-panel').addClass('active');
        $(this).removeClass('active');
    });

    // Tooltips follow mouse
    /*$('#map').mousemove(function(e) {
        $('.map-tooltip').each(function() {
            $(this).css('display', 'block');
            if (!$(this).hasClass('arrowtrue')) {
                $(this).append('<div class="arrow"></div>');
                $(this).addClass('arrowtrue');
            }
            if (($(this).width() + 35) < (screen.width - e.pageX)) {
                if ($(this).hasClass('flip')) { $(this).removeClass('flip'); }
                $(this).css({
                    top: e.pageY - ($(this).height()/2) - 15,
                    left: e.pageX + 18
                });
            } else {
                $(this).addClass('flip').css({
                    top: e.pageY - ($(this).height()/2) - 15,
                    left: e.pageX - $(this).width() - 34
                });
            }
        });
    });*/

    // Update embed & API codes
    function updateEmbedApi() {
        center = m.pointLocation(new mm.Point(m.dimensions.x/2,m.dimensions.y/2));
        if (layer == '') {
            apiUrl = urlBase + basemap + '.jsonp';
            embedUrl = '<iframe src="'
                        + urlBase
                        + basemap
                        + '/mm/zoompan,tooltips,legend,bwdetect.html#'
                        + m.coordinate.zoom + '/'
                        + center.lat + '/'
                        + center.lon + '"'
                        + ' frameborder="0" width="650" height="500"></iframe>';
        } else {
            apiUrl = urlBase + basemap + ',' + layer + '.jsonp';
            embedUrl = '<iframe src="'
                        + urlBase
                        + basemap + ','
                        + layer
                        + '/mm/zoompan,tooltips,legend,bwdetect.html#'
                        + m.coordinate.zoom + '/'
                        + center.lat + '/'
                        + center.lon + '"'
                        + ' frameborder="0" width="650" height="500"></iframe>';
        }
        $('textarea.embed-code').text(embedUrl);
        $('textarea.api-code').text(apiUrl);
        $('#share-embed-field textarea').text(embedUrl);
    }

  // Share
    $('a.share').click(function(e){
        e.preventDefault();

        var twitter = 'http://twitter.com/intent/tweet?status=' + 
                        'Sahel Food Crisis ' + encodeURIComponent(window.location);
        var facebook = 'https://www.facebook.com/sharer.php?t=Sahel%20Food%20Crisis&u=' + 
                        encodeURIComponent(window.location);

        document.getElementById('twitter').href = twitter;
        document.getElementById('facebook').href = facebook;

        updateEmbedApi();
        $('.share-modal').css('display', 'block');
        if (!badIE) {
            $('#share-embed-code')[0].tabindex = 0;
            $('#share-embed-code')[0].select();
        }
    });

    // About and our data modal
    $('a.about,a.about-link').click(function(e){
        e.preventDefault();
        $('.about-modal').css('display', 'block');
    });

    $('a.ourdata').click(function(e){
        e.preventDefault();
        $('.ourdata-modal').css('display', 'block');
    });

    $('a.share-close, a.about-close,a.ourdata-close').click(function(e){
        e.preventDefault();
        $('.share-modal').css('display', 'none');
        $('.about-modal').css('display', 'none');
        $('.ourdata-modal').css('display', 'none');
    });
    
    if(isTouchDevice()) {
        $('body').removeClass('no-touch');;
    }
});
