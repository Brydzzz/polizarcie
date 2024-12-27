import FilterModal, {
  Filters,
} from "@/components/modals/filter-modal.component";
const FilterModalPage = () => {
  const filters: Filters = {
    priceRange: { min: 0, max: 100 },
    isOpen: false,
    minRating: 0,
    sortOption: "name",
    faculty: { value: "none" },
  };
  return (
    <div
      style={{
        marginTop: "50px",
        width: "450px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <FilterModal filters={filters}></FilterModal>
    </div>
  );
};

export default FilterModalPage;
