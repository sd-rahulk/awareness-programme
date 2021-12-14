const apiKey = "AAPKd48908063f714adca5bdd9d7f0367b63BI76jTM-ToAzFLhDK6BFYaRDN8y8_88mvKXbspi-xzLoQ2GcxBSu1u6KbgEIG-TS";

      const map = new ol.Map({
        target: "map"
      });

      const view = new ol.View({

        center: ol.proj.fromLonLat([-122.4194,37.7749]), // San Francisco

        zoom: 14
      });
      map.setView(view);

      const basemapId = "ArcGIS:Navigation";

      const basemapURL = "https://basemaps-api.arcgis.com/arcgis/rest/services/styles/" + basemapId + "?type=style&token=" + apiKey;

      olms(map, basemapURL).then(function (map) {

        const placesLayer = new ol.layer.Vector({
          source: new ol.source.Vector(),

          style: (feature) =>
            new ol.style.Style({
              image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({ color: "white" }),
                stroke: new ol.style.Stroke({ color: "hsl(220, 80%, 40%)", width: 2 })
              }),
              text: new ol.style.Text({
                font: "14px sans-serif",
                textAlign: "left",
                text: feature.get("PlaceName"),
                offsetX: 8, // move text to the right to avoid overlapping circle
                offsetY: 2, // move down to align with circle's center
                fill: new ol.style.Fill({ color: "hsl(220, 80%, 40%)" }),
                stroke: new ol.style.Stroke({ color: "white" })
              })
            }),
          declutter: true

        });

        map.addLayer(placesLayer);

        function showPlaces() {

          const authentication = new arcgisRest.ApiKey({
            key: apiKey
          });
          const category = document.getElementById("places-select").value;
          arcgisRest
            .geocode({
              authentication,
              outFields: "Place_addr,PlaceName", // attributes to be returned

              params: {
                category,
                location: ol.proj.toLonLat(view.getCenter()),
                maxLocations: 25
              }
            })

            .then((response) => {
              const features = new ol.format.GeoJSON({ featureProjection: view.getProjection() }).readFeatures(response.geoJson);
              placesLayer.getSource().clear();
              placesLayer.getSource().addFeatures(features);
            })

            .catch((error) => {
              alert("There was a problem using the geocoder. See the console for details.");
              console.error(error);
            });

        }

        document.getElementById("places-select").addEventListener("change", showPlaces);

      });