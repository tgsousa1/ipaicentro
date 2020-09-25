const map = L.map('map').setView([40.007713,-7.9091],7.5)

/*const Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});
Stadia_AlidadeSmooth.addTo(map);*/

const OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
OpenStreetMap_Mapnik.addTo(map)

/* const Stadia_OSMBright = L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});
Stadia_OSMBright.addTo(map); */

function cores(q){
    return  q === "Muito baixo" ? '#ff0000':
            q === "Baixo" ? '#ff8000':
            q === "Médio" ? '#ffff00':
            q === "Alto" ? '#88d200':
            q === "Muito alto" ? '#008000':
            '#FFFFFF';
};

function style(feature){
    return {
        fillColor : cores(feature.properties.Quintil_IPA),
        fillOpacity: 0.8,
        weight: 0.5,
        opacity: 1,
        color: 'grey'
    }
};

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.8
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    ipaiL.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function infos(e){
    layer.bindTooltip(feature.properties.Concelho);
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
    });
    layer.bindTooltip('<h3>'+feature.properties.Concelho+'</h3><span></span><b>Potencial: </b>'+feature.properties.Quintil_IPA);
}

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h3>Índice Potencial de Atração de Investimentos</h3><br>Os resultados apresentados aqui se referem à classificação final em quintis.';
};

info.addTo(map);

const ipaiL = L.geoJson(ipai, {style: style, onEachFeature: onEachFeature});

ipaiL.addTo(map);

var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h3>Potencial de Atração</h3>";
  div.innerHTML += '<i style="background: #ff0000"></i><span>Muito baixo</span><br>';
  div.innerHTML += '<i style="background: #ff8000"></i><span>Baixo</span><br>';
  div.innerHTML += '<i style="background: #ffff00"></i><span>Médio</span><br>';
  div.innerHTML += '<i style="background: #88d200"></i><span>Alto</span><br>';
  div.innerHTML += '<i style="background: #008000"></i><span>Muito alto</span><br>';
  

  return div;
};

legend.addTo(map);
