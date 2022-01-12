import * as React from "react";
import { IEntryRegister } from "../../../components/models/IEntryRegister";
import CustomModal from "../../../components/customModal/CustomModal";
import { Dropdown } from "@fluentui/react";
import { IRegisterFormProps } from "./ISchoolRegisterFormProps";
import { TextField } from "@fluentui/react";
import { Stack } from "@fluentui/react";
import {DefaultButton,PrimaryButton} from "@fluentui/react";

export default class RegisterForm extends React.Component<IRegisterFormProps,{ 
  item: IEntryRegister,
  validationErrors:{field: string, errorMessage:string}[]
  operationResult: JSX.Element
}> {
  private dropdownStyles = { dropdown: { width: 300 } }; 

  constructor(props) {
    super(props);
    this.state = {
      item: this.props.itemEntryRegister,
      validationErrors: [],
      operationResult: this.props.operationResult ? {...this.props.operationResult} : null
    };
  }

  private getOptionByType(type: string) {
    return this.props.dropDownOptionsDefinition[type];
  }

  private onHandlerChange(propName, e, inputValue?, inputType?) {
    if (inputType === "numeric") {
      let regex = /^-?\d*\.?\d*$/;
      if (!regex.test(inputValue)) {
        if (inputValue.length <= 1) {
          let replaceItem = {...this.state.item}  ;
          replaceItem[propName] = "";
          this.setState({ item: replaceItem });
        }
        return;
      }
    }
    let newItem = {...this.state.item};
    newItem[propName] =
      typeof inputValue === "object" && inputType === "DDL"
        ? inputValue["key"]
        : typeof inputValue === "object" && inputType === "DATE"
        ? (inputValue as Date).toDateString()
        : inputValue;        
    this.setState({ item: newItem });
  }

  insertOrChange = (id: number) => {
    let validationErrors: {field:string, errorMessage: string}[] = []
    if(this.state.item?.student_name === "") 
      validationErrors.push({field: "student_name", errorMessage: "this field is required"})
    if(this.state.item?.student_surname === "") 
      validationErrors.push({field: "student_surname", errorMessage: "this field is required"})
    if(this.state.item?.student_age === 0) 
      validationErrors.push({field: "student_age", errorMessage: "this field is required"})

    if(validationErrors.length > 0){
      this.setState({validationErrors: validationErrors})
      return;
    }
    
    if(!isNaN(id)){
      this.props.onChange(this.state.item.id, this.state.item.subject_id)  
    } else {
      let itemEntryRegister: IEntryRegister =  {
          student_id: this.state.item.student_id,
          student_name: this.state.item.student_name,
          student_surname: this.state.item.student_surname,
          student_age: this.state.item.student_age,
          subject_id: this.state.item.subject_id,
          subject: this.state.item.subject,
          professor: this.state.item.professor
      }as IEntryRegister
      this.props.onSave(itemEntryRegister)
    }
  }
  
  private getValidationErrorMessage(field: string): string {
    return this.state.validationErrors.filter(v => v.field === field)[0]?.errorMessage
  }

  render() {
    return (
      <div>
        <CustomModal
          modalType="bodyOnlyModal"
          show={undefined}
          isBlocking={true}
          modalHeader={undefined}
          modalBody={this.state.operationResult}
          modalFooter={undefined}
          onDismiss={undefined}
        />
        <TextField
          required
          disabled={!isNaN(this.state.item.id) ? true : false}
          label="Student Name"
          value={this.state.item.student_name ? this.state.item.student_name : ""}
          onChange={(e, input) =>
            this.onHandlerChange("student_name", e, input)
          }
          errorMessage={this.getValidationErrorMessage("student_name")}
        />

        <TextField
          required
          disabled={!isNaN(this.state.item.id) ? true : false}
          label="Student Surname"
          value={this.state.item.student_surname ? this.state.item.student_surname : ""}
          onChange={(e, input) =>
            this.onHandlerChange("student_surname", e, input)
          }
          errorMessage={this.getValidationErrorMessage("student_surname")}
        />
        
        <TextField
          required
          disabled={!isNaN(this.state.item.id) ? true : false}
          label="Student Age"
          value={this.state.item.student_age ? this.state.item.student_age+"" : ""}
          onChange={(e, input) => this.onHandlerChange("student_age", e, input)}
          errorMessage={this.getValidationErrorMessage("student_age")}
        />

        <Dropdown
          required
          placeholder="Select a subject"
          label="Subjects:"
          options={this.getOptionByType("subject")}
          selectedKey={this.state.item.subject_id}
          styles={this.dropdownStyles}
          onChange={(e, input) =>
            this.onHandlerChange("subject_id", e, input, "DDL")
          }
        />

        <div style={{ marginRight: "20px", marginTop: "50px" }}>
          <br />
          <Stack horizontal reversed tokens={{ childrenGap: 20 }}>
            <PrimaryButton
              text="Save"
              onClick={() => this.insertOrChange(this.state.item.id)}
            />
            <DefaultButton text="Close" onClick={this.props.onClose} />
          </Stack>
        </div>
      </div>
    );
  }
}