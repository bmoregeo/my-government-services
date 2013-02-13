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

//function to locate address
function LocateAddress() {
    map.infoWindow.hide();
    selectedGraphic = null;
    RemoveChildren(dojo.byId('tblAddressResults'));
    RemoveScrollBar(dojo.byId('divAddressScrollContainer'));
    if (dojo.byId("txtAddress").value.trim() == '') {
        dojo.byId('txtAddress').focus();
        dojo.byId("imgLocate").src = "images/locate.png";
        return;
    }
    var address = [];
        address[locatorFields[0]] = dojo.byId('txtAddress').value;
    var locator = new esri.tasks.Locator(locatorURL);
    locator.outSpatialReference = map.spatialReference;
    locator.addressToLocations(address, ["*"], function (candidates) {
        ShowLocatedAddress(candidates);
    }
    );
}

//function to populate address
function ShowLocatedAddress(candidates) {
    RemoveChildren(dojo.byId('tblAddressResults'));
    RemoveScrollBar(dojo.byId('divAddressScrollContainer'));
    if (dojo.byId("txtAddress").value.trim() == '') {
        dojo.byId('txtAddress').focus();
        return;
    }
    if (candidates.length > 0) {
        var table = dojo.byId("tblAddressResults");
        var tBody = document.createElement("tbody");
        table.appendChild(tBody);
        table.cellSpacing = 0;
        table.cellPadding = 0;
        var candidatesLength= 0;
        for (var i = 0; i < candidates.length; i++) {
            var candidate = candidates[i];
            var tempMapPoint;
             tempMapPoint = new esri.geometry.Point(candidate.location.x, candidate.location.y, map.spatialReference);
            for (var bMap = 0; bMap < baseMapLayers.length; bMap++) {
				for (var z = 0; z < baseMapLayers[bMap].MapURL.length; z++) {
					if (map.getLayer(baseMapLayers[bMap].Key + z).visible) {
						var bmap = baseMapLayers[bMap].Key + z;
					}
				}
			}
            if (!map.getLayer(bmap).fullExtent.contains(tempMapPoint)) {
                tempMapPoint = null;
            }

            else {
                for (j in locatorNameFields[0].FieldValues) {
                    if (candidate.attributes[locatorNameFields[0].FieldName] == locatorNameFields[0].FieldValues[j]) {
                        var tr = document.createElement("tr");
                        tBody.appendChild(tr);
                        var td1 = document.createElement("td");

                        td1.align = "left";
                        td1.className = 'bottomborder';
                        td1.style.cursor = "pointer";
                        td1.height = 20;
                        td1.setAttribute("x", candidate.location.x);
                        td1.setAttribute("y", candidate.location.y);

                        td1.setAttribute("address", candidate.address);
                        td1.innerHTML = candidate.address;

                        td1.onclick = function () {
                            dojo.byId("txtAddress").value = this.innerHTML;
                            dojo.byId('txtAddress').setAttribute("defaultAddress", this.innerHTML);
                            mapPoint = new esri.geometry.Point(this.getAttribute("x"), this.getAttribute("y"), map.spatialReference);
                            LocateAddressOnMap();
                        }

                        tr.appendChild(td1);
                        candidatesLength++;
                    }
                }

            }
            }
        if (candidatesLength==0) {
                var tr = document.createElement("tr");
                tBody.appendChild(tr);
                var td1 = document.createElement("td");
                td1.align = "left";
                td1.className = 'bottomborder';
                td1.height = 20;
                td1.innerHTML = messages.getElementsByTagName("invalidSearch")[0].childNodes[0].nodeValue;
                tr.appendChild(td1);
            }
            dojo.byId("imgLocate").src = "images/locate.png";
        SetHeightAddressResults();
    }

    else {
        HideProgressIndicator();
        dojo.byId("imgLocate").src = "images/locate.png";
        var table = dojo.byId("tblAddressResults");
        var tBody = document.createElement("tbody");
        table.appendChild(tBody);
        table.cellSpacing = 0;
        table.cellPadding = 0;
        var tr = document.createElement("tr");
        tBody.appendChild(tr);
        var td1 = document.createElement("td");
        td1.innerHTML = messages.getElementsByTagName("invalidSearch")[0].childNodes[0].nodeValue;
        td1.align = "left";
        td1.className = 'bottomborder';
        td1.height = 20;
        tr.appendChild(td1);
    }
}

//function to locate address on map
function LocateAddressOnMap() {
    map.getLayer(tempGraphicsLayerId).clear();
    HideServiceLayers();
    map.infoWindow.hide();
    selectedGraphic = null;
    newLeft = 0;
    if (!isMobileDevice) {
        dojo.byId("divCarouselDataContent").style.left = "0px";
        ResetSlideControls();
    }
    var symbol = new esri.symbol.PictureMarkerSymbol(locatorMarkupSymbolPath, 25, 25);
    var graphic = new esri.Graphic(mapPoint, symbol, null, null);
    map.getLayer(tempGraphicsLayerId).add(graphic);
    HideAddressContainer();
    map.setLevel(zoomLevel);
    map.centerAt(mapPoint);
    if (!isMobileDevice) {
        WipeInResults();
        ShowProgressIndicator();
        QueryService(mapPoint);
    }

    else {
        CreateCarousel();
        GetServices();
    }
}

//function to get the extent based on the map point
function GetExtent(point) {
    var xmin = point.x;
    var ymin = (point.y) - 30;
    var xmax = point.x;
    var ymax = point.y;
    return new esri.geometry.Extent(xmin, ymin, xmax, ymax, map.spatialReference);
}
