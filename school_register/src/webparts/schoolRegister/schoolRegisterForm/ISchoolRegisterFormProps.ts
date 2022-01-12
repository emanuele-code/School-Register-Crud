import { IDropdownOption } from "@fluentui/react";
import { IEntryRegister } from "../../../components/models/IEntryRegister";

export interface IRegisterFormProps {
  operationResult?: JSX.Element
  itemEntryRegister: IEntryRegister
  dropDownOptionsDefinition: { [id: string]: IDropdownOption[] };
  onClose: () => void;
  onChange: (idEntry: number, idSubject: number)  => void;
  onSave: (item: IEntryRegister) => void;
}