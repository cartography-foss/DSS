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
    baseLayers.push('franckalbinet.map-or3tq2cu'); 
    selectDescription('WORLD');
    $(window).load(function() {
      m = mapbox.map('map');
      m.centerzoom({ lat: 25.8, lon: -80 }, 2, true);
      m.setZoomRange(1,19);
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
      $('#geo-filter').val('World');
      initLayerSwitcher(['WORLD']);
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
    // Initialize autocomplete with 'World'
/*    $(document).ready(function() {
      $('#geo-filter').val('World');
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
      var availableTags = ["World",
                        "Japan",
                        "Vienna, Austria",
                        "Bayonne, France",
			"El Dorado, Argentina",
			"El Dorado, Site 1, Argentina",
                       ];

      $( "#geo-filter" ).autocomplete({
        source: availableTags,
        minLength: 0,
        select: function (event, ui) {
          $('a.dropdown').removeClass('active');
	  switch (ui.item.value) {
            case 'World':
    	      m.centerzoom({ lat: 25.8, lon: -90 }, 2, true);
              selectDescription('WORLD');
              initLayerSwitcher(['WORLD']);
	    break;
            case 'Japan':
    	      m.centerzoom({ lat: 37, lon: 132 }, 6, true);
              selectDescription('JPN');
              initLayerSwitcher(['JPN']);
	    break;
	    case 'Vienna, Austria':
    	      m.centerzoom({ lat: 48.14, lon: 16.1 }, 11, true);
              selectDescription('AUT-vienna');
              initLayerSwitcher(['AUT-vienna', 'WORLD']);
	    break;
            case 'Bayonne, France':
    	      m.centerzoom({ lat: 43.43, lon: -1.7 }, 12, true);
              selectDescription('FRA-bayonne');
              initLayerSwitcher(['FRA-bayonne', 'WORLD']);
	    break;
	    case 'El Dorado, Site 1, Argentina':
    	      m.centerzoom({ lat: -33.563, lon: -66.09 }, 17, true);
              selectDescription('ARG-eldorado-site1');
              initLayerSwitcher(['ARG-eldorado-site1']);
	    break;
	    case 'El Dorado, Argentina':
    	      m.centerzoom({ lat: -33.535, lon: -66.13 }, 13, true);
              selectDescription('ARG-eldorado');
              initLayerSwitcher(['ARG-eldorado']);
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
