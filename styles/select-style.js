export const selectStyles = {
  container: (provided, state) => ({
    ...provided,
    top: "4px",
    width: "100%",
  }),
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#50403c",
    boxShadow: "none",
    border: "none",
  }),
  option: (provided, state) => ({
    ...provided,
    color: "white",
    backgroundColor: state.isFocused ? "#1c1917" : "#3C322E",
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";
    const color = "white";

    return { ...provided, color, opacity, transition };
  },
  menu: (provided, state) => ({
    ...provided,
    backgroundColor: "#3C322E",
    marginTop: "-4px",
  }),
};
