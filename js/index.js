var map;
var markers = [];
var infoWindow;
var locationSelect;


function initMap() {
    // Create the map.
    var losAngeles = {
        lat: 34.063380,
        lng: -118.358080
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 11,
        mapTypeId: 'roadmap'
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
}


function searchStores() {
    var foundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;
    if (zipCode) {
        stores.forEach((store, index) => {
            var postal = store.address.postalCode.substring(0, 5);
            if (postal == zipCode) {
                foundStores.push(store);
            }
        })
    } else {
        foundStores = stores
    }
    clearLocations()
    displayStores(foundStores);
    showStoreMarkers(foundStores);
    setOnCLickListener()

};


function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null); //remove markers from map
    }
    markers.length = 0;
}


function setOnCLickListener() {
    var storeElements = document.querySelectorAll(".store-container");
    storeElements.forEach((elem, index) => {
        elem.addEventListener('click', () => {
            new google.maps.event.trigger(markers[index], 'click');
        })
    })
}




function displayStores(stores) {
    var storesHtml = "";
    stores.forEach((store, index) => {
        var address = store.addressLines;
        var phone = store.phoneNumber;
        storesHtml +=
            ` <div class="store-container">
                <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-address">
                          <span>${address[0]}</span>
                            <span>${address[1]}</span>
                        </div>
                        <div class="store-phone-number">${phone}</div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">${index+1}</div>
                    </div>
                </div>
            </div> 
            `
    });
    document.querySelector(".stores-list").innerHTML = storesHtml;
}


function showStoreMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();
    stores.forEach((store, index) => {
        var latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude);
        var name = store.name;
        var address = store.addressLines[0];
        var phoneNumber = store.phoneNumber;
        var openStatus = store.openStatusText;
        createMarker(latlng, name, address, phoneNumber,openStatus, index);
        bounds.extend(latlng);
    })
    map.fitBounds(bounds);
}



function createMarker(latlng, name, address, phoneNumber, openStatus, index) {
    var html = `<div class="info-box"><b> ${name} </b> <br/>
        ${openStatus}<br>
     <div><i class="fas fa-location-arrow"></i> ${address}</div> 
     <div><i class="fas fa-phone-alt"></i> ${phoneNumber}</div> </div>`;
    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: `${index + 1}`
    });

    google.maps.event.addListener(marker, "click", () => {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });


    markers.push(marker);
}