// Initialize map with improved settings
const map = L.map('map', {
    zoomControl: false,        // We'll create custom zoom controls
    attributionControl: false, // Hide attribution initially for cleaner look
    minZoom: 12,               // Prevent zooming out too far
    maxZoom: 18,               // Prevent excessive zooming
    zoomSnap: 0.5,             // Allow for smoother zoom levels
    zoomDelta: 0.5,            // Smaller steps when zooming
    doubleClickZoom: true,     // Enable double click zoom
    wheelDebounceTime: 100,    // Debounce wheel events
    wheelPxPerZoomLevel: 100,  // More scrolling needed per zoom level
    closePopupOnClick: true    // Close popups when clicking elsewhere on the map
});

// Set a default initial view in case bounds calculation fails
map.setView([56.1575, 10.2085], 14);

// Track if user has manually interacted with the map
let userHasInteractedWithMap = false;

// Listen for user interactions with the map
map.on('drag zoomstart', function() {
    userHasInteractedWithMap = true;
});

// Add attribution control in a better position
L.control.attribution({
    position: 'bottomright'
}).addAttribution('© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, © Esri').addTo(map);

// Add custom zoom controls with clearer buttons
const zoomControl = L.control.zoom({
    position: 'topright',
    zoomInTitle: 'Zoom in',
    zoomOutTitle: 'Zoom out'
}).addTo(map);

// Add custom CSS to improve zoom control appearance
const styleZoomControls = document.createElement('style');
styleZoomControls.innerHTML = `
    .leaflet-control-zoom {
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    .leaflet-control-zoom a {
        width: 40px !important;
        height: 40px !important;
        line-height: 40px !important;
        font-size: 20px !important;
        color: #333;
        background-color: white;
    }
    .leaflet-control-zoom a:hover {
        background-color: #f0f0f0;
        color: #3498db;
    }
`;
document.head.appendChild(styleZoomControls);

// Ensure the tile layer is added properly
const tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18,
    attribution: '© Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// Add the tile layer to the map
tileLayer.addTo(map);

// Add a fallback in case the ESRI layer doesn't load
tileLayer.on('tileerror', function(error) {
    console.error('Tile layer error, trying OpenStreetMap as fallback');
    // If ESRI tiles fail, try OpenStreetMap as fallback
    if (!map._fallbackTileLayerAdded) {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        map._fallbackTileLayerAdded = true;
    }
});

// Improve zoom control touch-friendliness
const touchZoomStyles = document.createElement('style');
touchZoomStyles.innerHTML = `
    /* Make the zoom controls more touch-friendly */
    @media (pointer: coarse) {
        .leaflet-control-zoom a {
            width: 44px !important;
            height: 44px !important;
            line-height: 44px !important;
            font-size: 24px !important;
        }
    }
    
    /* Add active state for better touch feedback */
    .leaflet-control-zoom a:active {
        background-color: #3498db !important;
        color: white !important;
    }
`;
document.head.appendChild(touchZoomStyles);

// Improve map touch sensitivity
map.options.tap = true;
map.options.touchZoom = true;
map.options.bounceAtZoomLimits = false;

// Prevent browser zoom on double-tap
document.addEventListener('dblclick', function(e) {
    e.preventDefault();
});

// Prevent pinch zoom on the browser
document.addEventListener('touchmove', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// Ensure wheel events are captured by the map
document.getElementById('map').addEventListener('wheel', function(e) {
    e.stopPropagation();
}, { passive: false });

// Define locations with enhanced data
const locations = [
    {
        coords: [56.157570948453696, 10.208216412543132], 
        image: 'Images/storetorv.jpg',
        address: 'Store Torv 1, 8000 Aarhus',
        text: 'Store Torv',
        description: 'Store Torv i Aarhus er et hyggeligt og centralt sted at nyde sin frokost. Pladsen ligger lige ved Domkirken og midt i det historiske kvarter, omgivet af smukke bygninger og brostensbelagte gader. Her er bænke og god stemning – perfekt til en pause i solen med udsigt til både byliv og kulturarv. Placeringen gør det nemt at kombinere frokosten med sightseeing eller shopping.',
        icon: 'landmark'
    },
    {
        coords: [56.15881351931754, 10.21551008185272], 
        image: 'Images/navitas.jpg',
        address: 'Inge Lehmanns Gade 10, 8000 Aarhus',
        text: 'Navitas',
        description: 'Trappen ved Navitas er et oplagt frokost spot. Den ligger direkte ved havnefronten og byder på en fantastisk udsigt over Aarhus Bugt, Dokk1 og byens skyline. Her kan man tage en pause, nyde solen og mærke stemningen ved vandet – kun få minutters gang fra centrum. Et perfekt sted til billeder og en rolig stund midt i byen.',
        icon: 'building'
    },
    {
        coords: [56.15800939739154, 10.208610926034227], 
        image: 'Images/pv.jpg',
        address: 'Pustervig Rosensgade 21, 8000 Aarhus',
        text: 'PV',
        description: 'PV på Pustervig Torv er et skønt frokostspot – midt i byen og kun et stenkast fra Dingse. Her kan du nyde din sandwich fra os ved borde og stole i solen. Køber du drikkevarer hos PV, er du velkommen til at spise medbragt fra Dingse – perfekt kombi af mad, drikke og bystemning',
        icon: 'utensils'
    },
    {
        coords: [56.15607550916232, 10.200410394223178], 
        image: 'Images/moelleparken.jpg',
        address: 'Møllegade 1, 8000 Aarhus',
        text: 'Mølleparken',
        description: 'Mølleparken er et ideelt sted for de der ønsker at nyde en frokost i grønne omgivelser, midt i byen. Her kan du sætte dig på græsset, ved bordene eller på trappen ned mod åen og nyde udsigten over åen og de omkringliggende historiske bygninger. Parken ligger desuden tæt på attraktioner som ARoS Kunstmuseum og Latinerkvarteret.',
        icon: 'tree'
    }
];

// Custom marker icons
const createCustomIcon = (iconName) => {
    return L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-color: #3498db; color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                <i class="fas fa-${iconName}"></i>
              </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20]
    });
};

// Create markers and add them to the map
const markers = [];
locations.forEach(location => {
    const marker = L.marker(location.coords, {
        icon: createCustomIcon(location.icon)
    }).addTo(map);
    
    // Create enhanced popup content
    const popup = L.popup({
        closeButton: true,
        autoClose: true,
        className: 'custom-popup'
    }).setContent(`
        <div class="popup-content">
            <img src="${location.image}" alt="${location.text}">
            <div class="popup-text">
                <h3>${location.text}</h3>
                <p>${location.description}</p>
                <p style="font-size: 0.8rem; margin-top: 5px;">${location.address}</p>
                <button class="directions-button" onclick="openDirections([${location.coords}])">
                    <i class="fas fa-directions"></i> Get Directions
                </button>
            </div>
        </div>
    `);
    
    marker.bindPopup(popup);
    
    // Add event listeners for popup open WITHOUT auto-zooming
    // This lets users see a popup without changing view if they prefer
    marker.on('popupopen', function(e) {
        // Only set data-index attribute on active item if not already done
        if (!activeLocationItem || activeLocationItem.getAttribute('data-index') !== String(markers.indexOf(marker))) {
            // Find and highlight corresponding item in the panel
            const index = markers.indexOf(marker);
            const locationItem = document.querySelector(`.location-item[data-index="${index}"]`);
            
            if (locationItem) {
                // Update active item
                if (activeLocationItem) {
                    activeLocationItem.classList.remove('active');
                }
                locationItem.classList.add('active');
                activeLocationItem = locationItem;
            }
        }
    });
    
    // Do nothing on popup close to maintain current view
    marker.on('popupclose', function(e) {
        // No auto zoom-out behavior
    });
    
    markers.push(marker);
});

// Create a bounds object that encompasses all markers
let bounds;
try {
    if (locations && locations.length > 0) {
        // Create bounds from locations
        bounds = L.latLngBounds(locations.map(loc => loc.coords));
        
        // Validate bounds
        if (!bounds.isValid()) {
            console.warn("Created invalid bounds, using default view");
            bounds = L.latLngBounds([
                [56.1475, 10.1985],  // Southwest corner
                [56.1675, 10.2185]   // Northeast corner
            ]);
        }
    } else {
        // Fallback bounds for central Aarhus
        console.warn("No locations provided, using default bounds");
        bounds = L.latLngBounds([
            [56.1475, 10.1985],  // Southwest corner
            [56.1675, 10.2185]   // Northeast corner
        ]);
    }
} catch (e) {
    console.error("Error creating bounds:", e);
    // Fallback bounds for central Aarhus
    bounds = L.latLngBounds([
        [56.1475, 10.1985],  // Southwest corner
        [56.1675, 10.2185]   // Northeast corner
    ]);
}

// Function to check if we're on mobile
function isMobileDevice() {
    return (window.innerWidth <= 768) || 
           (typeof window.orientation !== 'undefined') || 
           (navigator.userAgent.indexOf('Mobile') !== -1);
}

// Initialize the map view - set to overview mode (no animation on initial load)
resetMapToOverview(false);

// Populate the location panel with items
const locationItems = document.getElementById('location-items');
let activeLocationItem = null;

locations.forEach((location, index) => {
    const locationItem = document.createElement('div');
    locationItem.className = 'location-item';
    locationItem.setAttribute('data-index', index);
    locationItem.innerHTML = `
        <div class="location-icon">
            <i class="fas fa-${location.icon}"></i>
        </div>
        <div class="location-info">
            <h3>${location.text}</h3>
            <p>${location.address}</p>
        </div>
    `;
    
    // Add click event to fly to location, open popup and highlight the selected item
    locationItem.addEventListener('click', () => {
        // Prevent multiple rapid clicks by adding a small debounce
        if (locationItem.dataset.processing === 'true') return;
        locationItem.dataset.processing = 'true';
        
        // Remove active class from previous item
        if (activeLocationItem) {
            activeLocationItem.classList.remove('active');
        }
        
        // Add active class to this item
        locationItem.classList.add('active');
        activeLocationItem = locationItem;
        
        // Close any open popups first to prevent flickering
        map.closePopup();
        
        // Get the location coordinates
        const latlng = location.coords;
        
        if (isMobileDevice()) {
            // For mobile: Pan to location first (quick), then zoom in (slower)
            // This gives better visual feedback
            map.once('moveend', function() {
                // After panning, zoom in to appropriate level
                map.setZoom(17, {
                    animate: true,
                    duration: 0.5
                });
                
                // Open popup after zoom completes
                setTimeout(() => {
                    markers[index].openPopup();
                    // Reset processing flag
                    locationItem.dataset.processing = 'false';
                }, 600);
            });
            
            // First pan to location
            map.panTo(latlng, {
                animate: true,
                duration: 0.5
            });
        } else {
            // For desktop: Fly to location with smooth animation
            map.flyTo(latlng, 17, {
                duration: 1.2,
                easeLinearity: 0.25
            });
            
            // Open popup after animation completes
            setTimeout(() => {
                markers[index].openPopup();
                // Reset processing flag
                locationItem.dataset.processing = 'false';
            }, 1300);
        }
        
        // On mobile, close the panel after selecting a location
        if (window.innerWidth < 768) {
            document.getElementById('locations-panel').classList.remove('expanded');
        }
    });
    
    // Add touch feedback for mobile
    locationItem.addEventListener('touchstart', function() {
        this.style.backgroundColor = '#f8f8f8';
    });
    
    locationItem.addEventListener('touchend', function() {
        this.style.backgroundColor = '';
    });
    
    locationItems.appendChild(locationItem);
});

// Add toggle functionality for the locations panel
const locationsPanel = document.getElementById('locations-panel');
const panelToggle = document.getElementById('panel-toggle');

// Make panel toggle more responsive on mobile
panelToggle.addEventListener('click', () => {
    locationsPanel.classList.toggle('expanded');
});

// Add touch-specific handling for better mobile experience
panelToggle.addEventListener('touchstart', function(e) {
    // Add visual feedback for touch
    this.style.backgroundColor = '#f0f0f0';
});

panelToggle.addEventListener('touchend', function(e) {
    // Reset visual feedback
    this.style.backgroundColor = '';
    // Prevent any weird touch behaviors
    e.preventDefault();
});

// On initial load, expand the panel after a short delay on larger screens
setTimeout(() => {
    if (window.innerWidth >= 768) {
        locationsPanel.classList.add('expanded');
    }
    
    // Don't auto-highlight any location initially
    // Just leave the panel open with no selection
}, 1000);

// Function to open directions in Google Maps
function openDirections(coords) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}&travelmode=walking`, '_blank');
}

// Make the function globally accessible
window.openDirections = openDirections;

// Add geolocation control
L.control.locate({
    position: 'topright',
    strings: {
        title: 'Show me where I am'
    },
    locateOptions: {
        maxZoom: 16
    }
}).addTo(map);

// Handle responsiveness
function handleResize() {
    // Close panel on small screens when resizing
    if (window.innerWidth < 768) {
        locationsPanel.classList.remove('expanded');
        
        // If we have an active location, maintain focus on it
        if (activeLocationItem) {
            const index = parseInt(activeLocationItem.getAttribute('data-index'));
            if (!isNaN(index) && index >= 0 && index < locations.length) {
                // Adjust the view with appropriate zoom
                map.setView(locations[index].coords, 17, { animate: false });
            }
        } else {
            // If no active location, reset to overview mode
            resetMapToOverview(false);
        }
    } else {
        // On larger screens, if no location is selected, ensure proper overview
        if (!activeLocationItem) {
            resetMapToOverview(false);
        }
    }
}

window.addEventListener('resize', handleResize);
// Handle orientation change on mobile
window.addEventListener('orientationchange', function() {
    // Small delay to ensure dimensions have updated
    setTimeout(handleResize, 200);
});
// Call on initial load
handleResize();

// Add some animation to markers to highlight them without moving them
function pulseMarkers() {
    // Add a CSS class to the head to define the pulse animation
    if (!document.getElementById('pulse-animation')) {
        const style = document.createElement('style');
        style.id = 'pulse-animation';
        style.innerHTML = `
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(52, 152, 219, 0); }
                100% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0); }
            }
            .marker-pulse {
                animation: pulse 2s infinite;
            }
        `;
        document.head.appendChild(style);
    }

    markers.forEach(marker => {
        const icon = marker.getElement();
        if (icon) {
            const innerDiv = icon.querySelector('div');
            if (innerDiv) {
                innerDiv.classList.add('marker-pulse');
            }
        }
    });
}

// Start the marker pulsing effect after a delay
setTimeout(pulseMarkers, 3000);

// Add map-wide event listener for popups
map.on('popupopen', function(e) {
    // Get the coordinates of the opened popup
    const coordinates = e.popup._latlng;
    
    // We no longer automatically zoom in when a popup opens
    // This allows users to view popups at their current zoom level
    // If they want to zoom in, they can do so manually or use the location panel
});

// Add separate click listener for markers to handle tap behavior on mobile
markers.forEach((marker, index) => {
    marker.getElement().addEventListener('click', function(e) {
        // For mobile, we need to make sure the marker is visible in the viewport
        // without changing the zoom level
        if (isMobileDevice()) {
            // Center on marker without zooming
            map.panTo(marker.getLatLng(), {
                animate: true,
                duration: 0.5
            });
        }
    });
});

// Add a button to return to overview
const returnToOverviewBtn = L.control({position: 'bottomleft'});
returnToOverviewBtn.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'overview-button');
    div.innerHTML = '<button style="padding: 10px 14px; background-color: white; border: none; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.3); cursor: pointer; font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; display: flex; align-items: center; font-size: 14px; font-weight: 500; min-width: 40px; min-height: 40px; touch-action: manipulation;"><i class="fas fa-map" style="margin-right: 6px; color: #3498db; font-size: 16px;"></i>Overview</button>';
    div.style.margin = '10px';
    
    // Add active state styles for better mobile touch feedback
    const button = div.querySelector('button');
    button.addEventListener('touchstart', function() {
        this.style.backgroundColor = '#f0f0f0';
    });
    button.addEventListener('touchend', function() {
        this.style.backgroundColor = 'white';
    });
    
    div.onclick = function() {
        // Use our centralized reset function with animation
        resetMapToOverview(true);
    };
    return div;
};
returnToOverviewBtn.addTo(map);

// Function to reset the map to overview mode
function resetMapToOverview(animate = true) {
    try {
        // Close any open popups
        map.closePopup();
        
        // Clear any highlighted locations
        if (activeLocationItem) {
            activeLocationItem.classList.remove('active');
            activeLocationItem = null;
        }
        
        // Check if bounds are valid
        if (!bounds || !bounds.isValid()) {
            console.warn("Invalid bounds, using default view");
            map.setView([56.1575, 10.2085], 14, { animate: animate });
            return;
        }
        
        // Determine appropriate padding and settings based on device
        const duration = animate ? (isMobileDevice() ? 0.8 : 1) : 0;
        const padding = isMobileDevice() ? 0.2 : 0.1;
        
        // Set options based on device type
        const options = {
            animate: animate,
            duration: duration,
            easeLinearity: 0.5
        };
        
        // Add padding for mobile
        if (isMobileDevice()) {
            options.paddingTopLeft = [20, 60];
            options.paddingBottomRight = [20, 20];
        }
        
        // Fit the map to show all markers
        map.fitBounds(bounds.pad(padding), options);
    } catch (e) {
        console.error("Error in resetMapToOverview:", e);
        // Fallback to default view if anything fails
        map.setView([56.1575, 10.2085], 14, { animate: animate });
    }
}

// After defining bounds, call this function to set initial view
resetMapToOverview(false);  // false = no animation for initial load

// Make sure map is properly initialized by checking for DOM readiness
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded - Map should be visible");
    
    // Force a redraw on the map container
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.style.display = 'none';
        setTimeout(() => {
            mapContainer.style.display = 'block';
            
            // Tell Leaflet to update its size
            map.invalidateSize();
            
            // Reset to overview 
            resetMapToOverview(false);
        }, 50);
    }
});

// Additional fallback for browsers where DOMContentLoaded may have already fired
window.addEventListener('load', function() {
    console.log("Window Loaded - Ensuring map is visible");
    map.invalidateSize();
    
    // If map is still blank, try forcing a redraw
    setTimeout(() => {
        map.invalidateSize();
        resetMapToOverview(false);
    }, 500);
});

// Add CSS fixes for blank map issues
const mapFixStyle = document.createElement('style');
mapFixStyle.innerHTML = `
    /* Force the map container to have layout and size */
    #map {
        height: 100vh !important;
        width: 100% !important;
        position: absolute !important;
        z-index: 1 !important;
        touch-action: none !important;
        background-color: #f0f0f0 !important; /* Light background so we see if tiles fail to load */
    }
    
    /* Force Leaflet tiles to be visible */
    .leaflet-tile-container img {
        width: 256px !important;
        height: 256px !important;
    }
    
    /* Fix for IE/Edge */
    .leaflet-container {
        min-height: 100vh !important;
    }
`;
document.head.appendChild(mapFixStyle);

// Function to diagnose and fix common map rendering issues
function fixBlankMap() {
    console.log("Attempting to fix blank map");
    
    // Try different ways to force redraw
    map.invalidateSize(true);
    
    // Try to reset view if the map is still blank
    resetMapToOverview(false);
    
    // Force the map to reconsider its container size
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        // Temporarily adjust size to force recalculation
        const oldHeight = mapContainer.style.height;
        mapContainer.style.height = '100vh';
        
        setTimeout(() => {
            mapContainer.style.height = oldHeight;
            map.invalidateSize(true);
            
            // If tiles are still not loading, try adding OSM as fallback
            if (!document.querySelector('.leaflet-tile')) {
                console.log("No tiles found, adding OSM fallback");
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
            }
        }, 100);
    }
}

// Call our fix functions after a delay
setTimeout(fixBlankMap, 1000);