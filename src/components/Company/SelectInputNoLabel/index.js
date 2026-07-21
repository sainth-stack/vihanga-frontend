import React from "react";
import Select from "react-select";
import "./styles.scss";

export default function SelectInputNoLabel({
  label = "",
  placeholder = "",
  options = [],
  name = "",
  value = "",
  onChangeText,
  index,
  style,
  readonly,
  ...rest
}) {
  let updatedOptions = options.map((item) => ({ ...item, label: item.key }));
  return (
    <div>
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
            className="custom-dropdown col-md-12"
            {...rest}
            isDisabled={true}
          />
        ) : (
          <Select
            value={[{ key: "Loading...", value: "Loading..." }]}
            options={[{ key: "Loading...", value: "Loading" }]}
            defaultValue={{ key: "Loading...", value: "Loading" }}
            className="custom-dropdown col-md-12"
            isDisabled={true}
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
          className="custom-dropdown col-md-8"
          {...rest}
        />
      ) : (
        <Select
          value={[{ key: "Loading...", value: "Loading..." }]}
          options={[{ key: "Loading...", value: "Loading" }]}
          defaultValue={{ key: "Loading...", value: "Loading" }}
          className="custom-dropdown col-md-8"
        />
      )}
    </div>
  );
}
