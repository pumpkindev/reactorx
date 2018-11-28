import { filter, map } from "lodash";
import { formUpdateField } from "./Actors";
import { FieldState } from "./Field";
import { FormProvider, useFormContext } from "./FormContext";
import { useStore } from "@reactorx/core";
import React from "react";

export interface IFieldArrayAPIs {
  add: () => void;
  remove: (idx: number) => void;
  each: (render: (idx: number) => JSX.Element | null) => JSX.Element | null;
}

export interface IFieldArrayProps {
  name: string;
  children: (fields: IFieldArrayAPIs) => JSX.Element | null;
}

export const FieldArray = ({ name, children }: IFieldArrayProps) => {
  const store$ = useStore();
  const formCtx = useFormContext();
  const fieldName = `${formCtx.fieldPrefix || ""}${name}`;

  return (
    <FieldState name={name}>
      {({ value }) => {
        return (
          <FormProvider
            value={{
              ...formCtx,
              fieldPrefix: fieldName,
            }}>
            {children({
              add: () =>
                formUpdateField
                  .with(
                    {
                      value: [...(value || []), undefined],
                    },
                    {
                      form: formCtx.formName,
                      field: fieldName,
                    },
                  )
                  .invoke(store$),
              remove: (idx) => {
                formUpdateField
                  .with(
                    {
                      value: filter(value, (_, i: number) => i !== idx),
                    },
                    {
                      form: formCtx.formName,
                      field: fieldName,
                    },
                  )
                  .invoke(store$);
              },
              each: (render: (idx: number) => JSX.Element | null) => {
                return <>{map(value || [], (_, i: number) => render(i))}</>;
              },
            })}
          </FormProvider>
        );
      }}
    </FieldState>
  );
};
