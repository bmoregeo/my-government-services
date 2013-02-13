/** @license
 | Version 10.1.1
 | Copyright 2012 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */

function CreateBaseMapComponent() {
    for (var i = 0; i < baseMapLayers.length; i++) {
        for (var z = 0; z < baseMapLayers[i].MapURL.length; z++) {
            console.log(baseMapLayers[i].MapURL[z])

            map.addLayer(CreateBaseMapLayer(baseMapLayers[i].MapURL[z], baseMapLayers[i].Key + z, (i == 0) ? true : false));
            console.log(baseMapLayers[i].Key + z);
            if (i == 0) {
                dojo.connect(map.getLayer(baseMapLayers[i].Key + z), "onLoad", function (e) {
                });
            }
        }
    }


    var layerList = dojo.byId('layerList');
    for (var i = 0; i < Math.ceil(baseMapLayers.length / 2); i++) {
        if (baseMapLayers[(i * 2) + 0]) {
            var layerInfo = baseMapLayers[(i * 2) + 0];
            layerList.appendChild(CreateBaseMapElement(layerInfo));
        }

        if (baseMapLayers[(i * 2) + 1]) {
            var layerInfo = baseMapLayers[(i * 2) + 1];
            layerList.appendChild(CreateBaseMapElement(layerInfo));
        }
    }
    dojo.addClass(dojo.byId("imgThumbNail" + baseMapLayers[0].Key), "selectedBaseMap");
}

function CreateBaseMapElement(baseMapLayerInfo) {
    //console.log(baseMapLayerInfo);
    var divContainer = dojo.create("div");
    divContainer.className = "baseMapContainerNode";
    var imgThumbnail = dojo.create("img");
    imgThumbnail.src = baseMapLayerInfo.ThumbnailSource;
    imgThumbnail.className = "basemapThumbnail";
    imgThumbnail.id = "imgThumbNail" + baseMapLayerInfo.Key;
    imgThumbnail.setAttribute("layerId", baseMapLayerInfo.Key);
    imgThumbnail.onclick = function () {
        ChangeBaseMap(this);
        ShowBaseMaps();
    };
    var spanBaseMapText = dojo.create("span");
    spanBaseMapText.id = "spanBaseMapText" + baseMapLayerInfo.Key;
    spanBaseMapText.className = "basemapLabel";
    spanBaseMapText.innerHTML = baseMapLayerInfo.Name;
    divContainer.appendChild(imgThumbnail);
    divContainer.appendChild(spanBaseMapText);
    return divContainer;
}

function ChangeBaseMap(spanControl) {
    HideMapLayers();
    var key = spanControl.getAttribute('layerId');

    console.log(baseMapLayers);

    for (var i = 0; i < baseMapLayers.length; i++) {
        dojo.removeClass(dojo.byId("imgThumbNail" + baseMapLayers[i].Key), "selectedBaseMap");
        if (dojo.isIE) {
            dojo.byId("imgThumbNail" + baseMapLayers[i].Key).style.marginTop = "0px";
            dojo.byId("imgThumbNail" + baseMapLayers[i].Key).style.marginLeft = "0px";
            dojo.byId("spanBaseMapText" + baseMapLayers[i].Key).style.marginTop = "0px";
        }


        //console.log(key);
        //console.log(baseMapLayers[i].Key);

        if (baseMapLayers[i].Key == key) {
            dojo.addClass(dojo.byId("imgThumbNail" + baseMapLayers[i].Key), "selectedBaseMap");
            for (var z = 0; z < baseMapLayers[i].MapURL.length; z++) {
                console.log(baseMapLayers[i].Key + z);
                var layer = map.getLayer(baseMapLayers[i].Key + z);
                layer.show();
            }
        }
    }
}

function CreateBaseMapLayer(layerURL, layerId, isVisible) {
    var layer = new esri.layers.ArcGISTiledMapServiceLayer(layerURL, { id: layerId, visible: isVisible });
    return layer;
}

function HideMapLayers() {
    for (var i = 0; i < baseMapLayers.length; i++) {
        for (var z = 0; z < baseMapLayers[i].MapURL.length; z++) {
            var layer = map.getLayer(baseMapLayers[i].Key + z);
            if (layer) {
                layer.hide();
            }
        }
    }
}

function ShowBaseMaps() {
    if (dojo.coords("divAppContainer").h > 0) {
        dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divAppContainer').style.height = '0px';
    }
    if (!isMobileDevice) {
        if (dojo.coords("divAddressHolder").h > 0) {
            dojo.replaceClass("divAddressHolder", "hideContainerHeight", "showContainerHeight");
            dojo.byId('divAddressHolder').style.height = '0px';
        }
    }

    if (dojo.coords("divLayerContainer").h > 0) {
        dojo.replaceClass("divLayerContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId("divLayerContainer").style.height = "0px";
    }
    else {
        dojo.byId('divLayerContainer').style.height = Math.ceil(baseMapLayers.length / 2) * (dojo.coords("divLayerHolder").h) + ((isTablet) ? 10 : 8) + "px";
        dojo.replaceClass("divLayerContainer", "showContainerHeight", "hideContainerHeight");
    }
}


