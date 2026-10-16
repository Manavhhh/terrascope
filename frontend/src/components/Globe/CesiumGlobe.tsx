import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Cesium from 'cesium';
import { ProductMetadata, AnalysisResult, EventItem, ColorPaletteId } from '../../types';
import { getColorForClassification } from '../../utils/palettes';

interface CesiumGlobeProps {
  products: ProductMetadata[];
  selectedProduct: ProductMetadata | null;
  activeAnalysis: AnalysisResult | null;
  events: EventItem[];
  selectedEvent: EventItem | null;
  onSelectEvent: (event: EventItem | null) => void;
  onSelectProduct: (product: ProductMetadata | null) => void;
  flyToLocation: { lon: number; lat: number; height?: number } | null;
  showOrbits: boolean;
  showFootprints: boolean;
  showChangeLayer: boolean;
  layerOpacity: number;
  is2DMode: boolean;
  onCoordinatesHover: (coords: { lon: number; lat: number; height: number } | null) => void;
  cesiumIonToken?: string;
  zoomTrigger?: { action: 'in' | 'out'; timestamp: number } | null;
  colorPalette?: ColorPaletteId;
}

export const CesiumGlobe: React.FC<CesiumGlobeProps> = ({
  products,
  selectedProduct,
  activeAnalysis,
  events,
  selectedEvent,
  onSelectEvent,
  onSelectProduct,
  flyToLocation,
  showOrbits,
  showFootprints,
  showChangeLayer,
  layerOpacity,
  is2DMode,
  onCoordinatesHover,
  cesiumIonToken,
  zoomTrigger,
  colorPalette = 'spectral',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const dataSourcesRef = useRef<{
    footprints?: Cesium.CustomDataSource;
    changeLayers?: Cesium.GeoJsonDataSource;
    events?: Cesium.CustomDataSource;
    orbit?: Cesium.Entity;
  }>({});
  const [isGlobeReady, setIsGlobeReady] = useState(false);

  // Initialize Cesium Viewer
  useEffect(() => {
    if (!containerRef.current) return;

    // Configure Token if available
    const token = cesiumIonToken || import.meta.env.VITE_CESIUM_ION_TOKEN || '';
    if (token) {
      Cesium.Ion.defaultAccessToken = token;
    }

    try {
      // Photorealistic True-Color Satellite Imagery (Esri World Imagery - 100% Free, No Key, No Watermark)
      const baseImageryProvider = new Cesium.UrlTemplateImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        credit: 'Satellite Imagery © Esri, Maxar, Earthstar Geographics, USDA FSA, USGS, Aerogrid, IGN, IGP, and the GIS User Community',
        maximumLevel: 19,
      });

      const viewer = new Cesium.Viewer(containerRef.current, {
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        baseLayer: new Cesium.ImageryLayer(baseImageryProvider),
        skyBox: new Cesium.SkyBox({
          show: true,
        }),
        contextOptions: {
          webgl: {
            alpha: true,
          },
        },
      });

      // Add high-contrast geopolitical boundaries & geographic place references
      const boundaryProvider = new Cesium.UrlTemplateImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        credit: 'Boundaries & Places © Esri',
        maximumLevel: 19,
      });
      const boundaryLayer = viewer.imageryLayers.addImageryProvider(boundaryProvider);
      boundaryLayer.alpha = 0.65;

      // Enable 3D World Terrain if Cesium Ion Token is provided
      if (token) {
        Cesium.createWorldTerrainAsync({
          requestWaterMask: true,
          requestVertexNormals: true,
        }).then((terrain) => {
          if (viewer && !viewer.isDestroyed()) {
            viewer.terrainProvider = terrain;
          }
        }).catch((err) => {
          console.warn('Optional Cesium 3D World Terrain fallback:', err);
        });
      }

      // Mission Control deep-space ambiance & atmospheric glow
      viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#090e1b');
      viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#090e1b');
      viewer.scene.globe.enableLighting = false; // Evenly illuminates all continents with crystal-clear satellite imagery
      viewer.scene.globe.showGroundAtmosphere = true;
      if (viewer.scene.skyAtmosphere) {
        viewer.scene.skyAtmosphere.show = true;
      }
      // Configure screen space camera controller for smooth cursor zoom and rotation
      const sscController = viewer.scene.screenSpaceCameraController;
      sscController.enableZoom = true;
      sscController.enableRotate = true;
      sscController.enableTilt = true;
      sscController.enableLook = true;
      sscController.inertiaZoom = 0.75;
      sscController.inertiaSpin = 0.85;
      sscController.maximumZoomDistance = 38000000;
      sscController.minimumZoomDistance = 150;
      sscController.zoomEventTypes = [
        Cesium.CameraEventType.WHEEL,
        Cesium.CameraEventType.PINCH,
        Cesium.CameraEventType.RIGHT_DRAG,
      ];

      // Mouse move coordinates listener
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((movement: any) => {
        const ray = viewer.camera.getPickRay(movement.endPosition);
        if (ray) {
          const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
          if (cartesian) {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            onCoordinatesHover({
              lon: Number(Cesium.Math.toDegrees(cartographic.longitude).toFixed(4)),
              lat: Number(Cesium.Math.toDegrees(cartographic.latitude).toFixed(4)),
              height: Number(cartographic.height.toFixed(0)),
            });
            return;
          }
        }
        onCoordinatesHover(null);
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      // Double-click to zoom directly into cursor point on Earth surface
      handler.setInputAction((click: any) => {
        const ray = viewer.camera.getPickRay(click.position);
        if (ray) {
          const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
          if (cartesian) {
            const carto = Cesium.Cartographic.fromCartesian(cartesian);
            const currentHeight = viewer.camera.positionCartographic.height;
            const targetHeight = Math.max(currentHeight * 0.35, 10000);
            viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromRadians(
                carto.longitude,
                carto.latitude,
                targetHeight
              ),
              duration: 1.2,
            });
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

      // Click selection handler
      handler.setInputAction((click: any) => {
        const picked = viewer.scene.pick(click.position);
        if (Cesium.defined(picked) && picked.id) {
          const entity = picked.id as Cesium.Entity;
          if (entity.properties && entity.properties.hasProperty('eventType')) {
            const evtId = entity.properties.getValue().eventId;
            const foundEvt = events.find((e) => e.event_id === evtId);
            if (foundEvt) onSelectEvent(foundEvt);
          } else if (entity.properties && entity.properties.hasProperty('productId')) {
            const prodId = entity.properties.getValue().productId;
            const foundProd = products.find((p) => p.product_id === prodId);
            if (foundProd) onSelectProduct(foundProd);
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // Create data sources
      const footprintsDS = new Cesium.CustomDataSource('footprints');
      const eventsDS = new Cesium.CustomDataSource('events');
      viewer.dataSources.add(footprintsDS);
      viewer.dataSources.add(eventsDS);

      dataSourcesRef.current = {
        footprints: footprintsDS,
        events: eventsDS,
      };

      // Create 3D Orbit trajectory for NISAR (Sun-synchronous, ~747 km altitude)
      const orbitPositions: Cesium.Cartesian3[] = [];
      const numPoints = 120;
      for (let i = 0; i <= numPoints; i++) {
        const t = (i / numPoints) * 2 * Math.PI;
        // Sun-synchronous orbit inclination: ~98.4 degrees
        const lat = 81.6 * Math.sin(t);
        const lon = ((i / numPoints) * 360 - 180 + Math.cos(t) * 15) % 360;
        orbitPositions.push(Cesium.Cartesian3.fromDegrees(lon, lat, 747000));
      }

      const orbitLine = viewer.entities.add({
        name: 'NISAR Sun-Synchronous Orbital Trajectory',
        polyline: {
          positions: orbitPositions,
          width: 2,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.25,
            color: Cesium.Color.fromCssColorString('#a855f7').withAlpha(0.7),
          }),
        },
      });

      // Active Satellite point beacon
      const satelliteEntity = viewer.entities.add({
        name: 'NISAR Observatory (L-SAR / S-SAR)',
        position: orbitPositions[0],
        point: {
          pixelSize: 9,
          color: Cesium.Color.fromCssColorString('#00f0ff'),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
        },
        label: {
          text: 'NISAR (747 km)',
          font: '11px monospace',
          fillColor: Cesium.Color.fromCssColorString('#00f0ff'),
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -12),
        },
      });

      dataSourcesRef.current.orbit = orbitLine;

      // Animate satellite along orbit
      let step = 0;
      const timer = setInterval(() => {
        step = (step + 1) % orbitPositions.length;
        if (satelliteEntity.position) {
          satelliteEntity.position = new Cesium.ConstantPositionProperty(orbitPositions[step]);
        }
      }, 500);

      viewerRef.current = viewer;
      setIsGlobeReady(true);

      // Set initial view looking at active globe
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(20, 20, 18000000),
      });

      return () => {
        clearInterval(timer);
        handler.destroy();
        viewer.destroy();
        viewerRef.current = null;
      };
    } catch (err) {
      console.error('Cesium Globe initialization failed:', err);
    }
  }, [cesiumIonToken]);

  // Handle 2D / 3D Mode Toggle
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    if (is2DMode) {
      viewer.scene.morphTo2D(1.0);
    } else {
      viewer.scene.morphTo3D(1.0);
    }
  }, [is2DMode]);

  // Handle FlyTo Location
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !flyToLocation) return;

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        flyToLocation.lon,
        flyToLocation.lat,
        flyToLocation.height || 600000
      ),
      duration: 2.2,
    });
  }, [flyToLocation]);

  // Render Event Markers
  useEffect(() => {
    const ds = dataSourcesRef.current.events;
    if (!ds) return;
    ds.entities.removeAll();

    events.forEach((evt) => {
      const isSelected = selectedEvent?.event_id === evt.event_id;
      const colorHex =
        evt.severity === 'CRITICAL'
          ? '#ef4444'
          : evt.severity === 'HIGH'
          ? '#f59e0b'
          : '#00f0ff';

      ds.entities.add({
        id: `event-${evt.event_id}`,
        name: evt.title,
        position: Cesium.Cartesian3.fromDegrees(evt.coordinates[0], evt.coordinates[1], 1000),
        properties: new Cesium.PropertyBag({
          eventType: 'event',
          eventId: evt.event_id,
        }),
        point: {
          pixelSize: isSelected ? 14 : 9,
          color: Cesium.Color.fromCssColorString(colorHex),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: isSelected ? 3 : 1,
        },
        label: {
          text: evt.title.length > 25 ? evt.title.substring(0, 25) + '...' : evt.title,
          font: '11px sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 3,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -14),
          show: isSelected || evt.severity === 'CRITICAL',
        },
      });
    });
  }, [events, selectedEvent]);

  // Render Footprint Polygons
  useEffect(() => {
    const ds = dataSourcesRef.current.footprints;
    if (!ds) return;
    ds.entities.removeAll();

    if (!showFootprints) return;

    products.forEach((prod) => {
      const isSelected = selectedProduct?.product_id === prod.product_id;
      const coords = prod.footprint_geojson?.coordinates?.[0];
      if (!coords || coords.length < 3) return;

      const flatPositions: number[] = [];
      coords.forEach((c: [number, number]) => {
        flatPositions.push(c[0], c[1]);
      });

      ds.entities.add({
        id: `footprint-${prod.product_id}`,
        name: prod.title,
        properties: new Cesium.PropertyBag({
          productId: prod.product_id,
        }),
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(flatPositions),
          material: isSelected
            ? Cesium.Color.fromCssColorString('#00f0ff').withAlpha(0.25 * layerOpacity)
            : Cesium.Color.fromCssColorString('#38bdf8').withAlpha(0.08 * layerOpacity),
          outline: true,
          outlineColor: isSelected
            ? Cesium.Color.fromCssColorString('#00f0ff')
            : Cesium.Color.fromCssColorString('#38bdf8').withAlpha(0.6),
          outlineWidth: isSelected ? 3 : 1,
        },
      });
    });
  }, [products, selectedProduct, showFootprints, layerOpacity]);

  // Render GeoJSON Change Analysis Overlay
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    // Remove existing change layer
    if (dataSourcesRef.current.changeLayers) {
      viewer.dataSources.remove(dataSourcesRef.current.changeLayers);
      dataSourcesRef.current.changeLayers = undefined;
    }

    if (!showChangeLayer || !activeAnalysis || !activeAnalysis.geojson_layers) return;

    Cesium.GeoJsonDataSource.load(activeAnalysis.geojson_layers, {
      strokeWidth: 2,
      clampToGround: true,
    })
      .then((geoJsonDS) => {
        geoJsonDS.entities.values.forEach((entity) => {
          if (entity.polygon) {
            // Style polygon based on classification
            const props = entity.properties?.getValue(Cesium.JulianDate.now()) || {};
            const classification = String(props.classification || '').toLowerCase();
            const fillHex = getColorForClassification(classification, colorPalette);

            entity.polygon.material = new Cesium.ColorMaterialProperty(
              Cesium.Color.fromCssColorString(fillHex).withAlpha(0.45 * layerOpacity)
            );
            entity.polygon.outline = new Cesium.ConstantProperty(true);
            entity.polygon.outlineColor = new Cesium.ConstantProperty(
              Cesium.Color.fromCssColorString(fillHex)
            );
          }
        });

        viewer.dataSources.add(geoJsonDS);
        dataSourcesRef.current.changeLayers = geoJsonDS;
      })
      .catch((err) => {
        console.error('Failed to load GeoJSON change overlay:', err);
      });
  }, [activeAnalysis, showChangeLayer, layerOpacity, colorPalette]);

  // Handle Zoom Trigger (+ / - buttons on HUD)
  useEffect(() => {
    if (!zoomTrigger || !viewerRef.current) return;
    const camera = viewerRef.current.camera;
    const height = camera.positionCartographic.height;
    if (zoomTrigger.action === 'in') {
      camera.zoomIn(Math.max(height * 0.45, 1000));
    } else {
      camera.zoomOut(Math.max(height * 0.6, 2000));
    }
  }, [zoomTrigger]);

  // Toggle Orbit Trajectory Visibility
  useEffect(() => {
    if (dataSourcesRef.current.orbit) {
      dataSourcesRef.current.orbit.show = showOrbits;
    }
  }, [showOrbits]);

  return (
    <div className="relative w-full h-full bg-[#080b11] overflow-hidden select-none">
      <div ref={containerRef} className="w-full h-full" />
      <div className="scanline" />
    </div>
  );
};
