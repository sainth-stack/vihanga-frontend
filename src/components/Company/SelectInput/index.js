import useWindowSize from "components/UseWindowSize";
import React from "react";
import Select from "react-select";
import "./styles.scss";

export default function SelectInput({
  label = "",
  placeholder = "",
  options = [],
  name = "",
  value = "",
  onChangeText,
  index,
  style,
  readonly,
  stackLabel = false, // New prop to control layout
  ...rest
}) {
  const isMobile = useWindowSize();
  let updatedOptions = options.map((item) => ({ ...item, label: item.key }));

  return (
    <div className={`${stackLabel ? 'd-flex flex-column' : 'd-flex justify-content-between align-items-center'}`}>
      {label && (
        <label className={`label fs14 ${stackLabel ? 'mb-1' : isMobile ? 'p-0 col-md-4' : 'col-md-4'}`}>
          {label}
        </label>
      )}
      
      {readonly ? (
        updatedOptions !== undefined && updatedOptions.length > 0 ? (
          <Select
            value={updatedOptions.filter(function (option) {
              return option.value === value;
            })}
            options={updatedOptions}
            defaultValue={
              updatedOptions && value
                ? updatedOptions.filter((option) => option.value === value)[0]
                : updatedOptions[0]
            }
            onChange={(e, index) =>
              onChangeText(
                { target: { name, value: e.value, label: e.label } },
                index
              )
            }
            className={`custom-dropdown ${stackLabel ? 'w-100' : isMobile ? 'p-0 col-md-8' : 'col-md-8'}`}
            {...rest}
            isDisabled={true}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: '#2A7A7B',
              },
            })}
          />
        ) : (
          <Select
            value={[{ key: "Loading...", value: "Loading..." }]}
            options={[{ key: "Loading...", value: "Loading" }]}
            defaultValue={{ key: "Loading...", value: "Loading" }}
            className={`custom-dropdown ${stackLabel ? 'w-100' : isMobile ? 'p-0 col-md-8' : 'col-md-8'}`}
            isDisabled={true}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: '#2A7A7B',
              },
            })}
          />
        )
      ) : updatedOptions !== undefined && updatedOptions.length > 0 ? (
        <Select
          value={updatedOptions.filter(function (option) {
            return option.value === value;
          })}
          options={updatedOptions}
          defaultValue={
            updatedOptions && value
              ? updatedOptions.filter((option) => option.value === value)[0]
              : updatedOptions[0]
          }
          onChange={(e) =>
            onChangeText(
              { target: { name, value: e.value, label: e.label } },
              index
            )
          }
          className={`custom-dropdown ${stackLabel ? 'w-100' : isMobile ? 'p-0 col-md-8' : 'col-md-8'}`}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: '#2A7A7B',
            },
          })}
          {...rest}
        />
      ) : (
        <Select
          value={[{ key: "Loading...", value: "Loading..." }]}
          options={[{ key: "Loading...", value: "Loading" }]}
          defaultValue={{ key: "Loading...", value: "Loading" }}
          className={`custom-dropdown ${stackLabel ? 'w-100' : isMobile ? 'p-0 col-md-8' : 'col-md-8'}`}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: '#2A7A7B',
            },
          })}
        />
      )}
    </div>
  );
}