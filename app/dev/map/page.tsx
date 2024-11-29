import MapView from "@/components/map-view.component";

const MapPage = () => {
  return (
    <div
      className="centralized-x"
      style={{ marginTop: "100px", paddingBottom: "100px" }}
    >
      <div
        className="centralized-y"
        style={{ width: "700px", height: "500px" }}
      >
        <MapView X_coord={21.0148725} Y_coord={52.2237223}></MapView>
      </div>
    </div>
  );
};

export default MapPage;
