import React from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { DefaultButton, DetailsList, FontIcon, IColumn, IDropdownOption, ITextFieldStyles, mergeStyles, mergeStyleSets, PrimaryButton, SelectionMode, Stack, TextField } from '@fluentui/react';
import { IEntryRegister } from '../../components/models/IEntryRegister';
import { getStudents, getStudents2Subjects, getSubjects } from '../../DataLayer';
import { ISubject } from '../../components/models/ISubject';
import { IStudent } from '../../components/models/IStudent';
import { IStudent2Subject } from '../../components/models/IStudent2Subject';
import CustomModal, { Modals, ModalTypes } from '../../components/customModal/CustomModal';
import RegisterForm from './schoolRegisterForm/schoolRegisterForm';


export default class SchoolRegister extends React.Component<{},{entryRegisterMap : IEntryRegister[], activeModal: Modals, formOperationResult: JSX.Element}>{
  private entryRegisterItem: IEntryRegister;
  private confirmMessageJSX: JSX.Element;
  private confirmButton: JSX.Element;
  private optionDefinitionSubject: { [id: string]: IDropdownOption[] } = {}
  private subjects : ISubject[] = [];
  private students : IStudent[] = [];
  private students2subjects : IStudent2Subject[] = [];
  private entryRegister: IEntryRegister[] = [];

  private _items: ICommandBarItemProps[] = [{
    key: 'newItem',
    text: 'New',
    iconProps: { iconName: 'Add' },
    onClick: () => this.goToSchoolRegister()
  }]

  private FilterChildClass = mergeStyles({
    display: "block",
    marginBottom: "10px"
  });

  private textFieldStyles: Partial<ITextFieldStyles> = {
    root: { maxWidth: "300px" }
  };

  private iconClass = mergeStyles({
    fontSize: 20,
    height: 20,
    width: 20,
    margin: "0 25px"
  });

  private classNames = mergeStyleSets({
    deepSkyBlue: [{ color: "deepskyblue" }, this.iconClass]
  });

  private _columns = [
    {
      key: "action",
      name: "",
      fieldName: "action",
      minWidth: 140,
      maxWidth: 140,
      isResizable: true
    },
    {
      key: "student_name",
      name: "Student Name",
      fieldName: "student_name",
      minWidth: 100,
      maxWidth: 350,
      isResizable: true
    },
    {
      key: "student_surname",
      name: "Student Surname",
      fieldName: "student_surname",
      minWidth: 100,
      maxWidth: 350,
      isResizable: true
    },
    {
      key: "student_age",
      name: "Student Age",
      fieldName: "student_age",
      minWidth: 100,
      maxWidth: 350,
      isResizable: true
    },
    {
      key: "subject",
      name: "Subject",
      fieldName: "subject",
      minWidth: 100,
      maxWidth: 350,
      isResizable: true
    },
    {
      key: "professor",
      name: "Professor",
      fieldName: "professor",
      minWidth: 100,
      maxWidth: 350,
      isResizable: true
    }
  ];
  
  constructor(props){
    super(props);
    this.state={
      entryRegisterMap : [],
      activeModal: Modals.NOMODAL,
      formOperationResult: undefined
    }
    initializeIcons();
  }

  private mapStudent2Subject(): IEntryRegister[] {
    return this.students2subjects.map((sc) => {
      let entryRegister: IEntryRegister = {} as IEntryRegister; 
      let student = this.students.filter((s) => s.student_id === sc.student_id)[0]; 
      let subject = this.subjects.filter((sub) => sub.subject_id === sc.subject_id)[0]; 
      entryRegister = {
        id: sc.id, 
        student_id: student.student_id,
        student_name: student.student_name, 
        student_surname: student.student_surname,
        student_age: student.student_age,
        subject_id: subject.subject_id,
        subject: subject.subject,
        professor: subject.professor
      };
      return entryRegister; //mi ritorno l oggetto
    }); 
  }

  createDropdownSubjectsOption() {
    let subjectOption: IDropdownOption[] = [];
    this.subjects.forEach((s) => {
      subjectOption.push({
        key: s.subject_id,
        text: s.subject
      });
    });
    return subjectOption;
  }

  async componentDidMount() {
    this.subjects = await getSubjects();
    this.students = await getStudents();
    this.students2subjects = await getStudents2Subjects();
    this.optionDefinitionSubject.subject = this.createDropdownSubjectsOption();
    this.entryRegister = this.mapStudent2Subject();
    this.setState({entryRegisterMap: this.entryRegister});
  }

  _renderItemColumn = (item: IEntryRegister, index: number, column: IColumn) => {
    const itemProps = item[column.fieldName as keyof IEntryRegister] as string;
    if (column.key === "action") {
      return (
        <div>
          <FontIcon
            iconName="edit"
            className={this.classNames.deepSkyBlue}
            onClick={() => this.onEditEntryRegisterItem(item.id)}
          />
          <FontIcon
            iconName="delete"
            className={this.classNames.deepSkyBlue}
            onClick={() => this.onClickDeleteEntryRegister(item.id)}
          />
        </div>
      );
    } else {
      return itemProps;
    }
  };

  cleanAndCloseForm = () => {
    this.setState({ activeModal: Modals.NOMODAL });
    this.entryRegisterItem = undefined;
  };

  goToSchoolRegister = () => {
    this.entryRegisterItem = {
      student_id: Math.max(...this.students.map((s) => s.student_id)) + 1,
      subject_id: 0,
      student_name: "",
      student_surname: "",
      student_age: 0,
      subject: this.subjects.map((s) => s.subject)[0]
    } as unknown as IEntryRegister;
    this.setState({ activeModal: Modals.FORM });
  }

  onEditEntryRegisterItem = (id: number) => {
    this.entryRegisterItem = { ...this.state.entryRegisterMap.filter((e) => e.id === id)[0] };
    this.setState({ activeModal: Modals.FORM });
  };

  changeEntryRegister = (idEntry: number, idSubject: number) => {
    let studentClassesToEdit = this.students2subjects.filter((sc) => sc.id === idEntry)[0];
    studentClassesToEdit.subject_id = idSubject;
    this.entryRegister = this.mapStudent2Subject();
    this.setState({ entryRegisterMap : this.entryRegister, activeModal: Modals.NOMODAL });
  };

  onClickDeleteEntryRegister = (id: number) => {
    this.confirmMessageJSX = <span>{"Do you want to delete this row?"}</span>
    this.confirmButton = (
      <PrimaryButton
        text={"Confirm"}
        onClick={() => this.deleteEntryRegister(id)}
      />
    );
    this.setState({activeModal: Modals.CONFIRM})
  }

  deleteEntryRegister = (id: number) => {
    let copyStudentClasses: IStudent2Subject[] = this.students2subjects;
    for (let idArray = 0; idArray < copyStudentClasses.length; idArray++) {
        if (copyStudentClasses[idArray].id === id) {
          copyStudentClasses.splice(idArray, 1);
          this.entryRegister = this.mapStudent2Subject();
          this.setState({ entryRegisterMap : this.entryRegister, activeModal: Modals.NOMODAL})
        }
      }
  };

  saveEntryRegister = (item: IEntryRegister) => {
    let newStudent: IStudent = {
      //creo un oggetto di tipo IStudent lo popolo e
      student_id: item.student_id,
      student_name: item.student_name,
      student_surname: item.student_surname,
      student_age: item.student_age
    };
    this.students.push(newStudent); 
    let newStudentClass: IStudent2Subject = {
      id: Math.max(...this.students2subjects.map((stdClass) => stdClass.id), 0) + 1,
      student_id: item.student_id,
      subject_id: item.subject_id
    };
    this.students2subjects.push(newStudentClass); 
    let newEntryRegister: IEntryRegister = {
      id: Math.max(...this.students2subjects.map((s) => s.id)) + 1,
      student_id: item.student_id,
      subject_id: item.subject_id,
      student_name: item.student_name,
      student_surname: item.student_surname,
      student_age: item.student_age,
      subject: item.subject,
      professor: item.professor
    };
    this.entryRegister.push(newEntryRegister);
    this.entryRegister = this.mapStudent2Subject(); 
    this.setState({ entryRegisterMap: this.entryRegister, activeModal: Modals.NOMODAL}); 
  };

  private _onFilter = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
    this.setState({entryRegisterMap : text ? this.entryRegister.filter((i) => i.subject.toLowerCase().indexOf(text) > -1) : this.entryRegister});
  };

  render() {
    console.log(this.state.entryRegisterMap)
    return(
      <>
        <CommandBar items={this._items}/>
        <TextField
          className={this.FilterChildClass}
          onChange={this._onFilter}
          styles={this.textFieldStyles}
          label="Filter By Subjects:"
          placeholder="Please enter subject here"
        />  
        <DetailsList 
          items={this.state.entryRegisterMap}
          columns={this._columns}
          selectionMode={SelectionMode.none} 
          onRenderItemColumn={this._renderItemColumn}/>
        <CustomModal 
          modalType={this.getModalType()}
          show={this.state.activeModal !== Modals.NOMODAL}
          isBlocking={this.state.activeModal === Modals.SPINNER}
          modalHeader={this.getModalHeader()}
          modalBody={this.getModalBody()}
          modalFooter={this.getModalFooter()}
          onDismiss={() => this.setState({ activeModal: Modals.NOMODAL })}
        />
      </>
    );
  }

  getModalType() {
    if ( this.state.activeModal === Modals.FORM || this.state.activeModal === Modals.CONFIRM )
      return ModalTypes.FULLMODAL;
    if ( this.state.activeModal === Modals.SPINNER || this.state.activeModal === Modals.SUCCESS || this.state.activeModal === Modals.ERROR )
      return ModalTypes.BODYONLYMODAL;
    return ModalTypes.BODYONLYMODAL;
  }

  getModalHeader() {
    if (this.state.activeModal === Modals.FORM) 
      return "New Register";
    if(this.state.activeModal === Modals.CONFIRM)
      return "Confirm Operation"
    return "";
  }

  getModalBody() {
    if (this.state.activeModal === Modals.FORM)
      return (
        <RegisterForm
          operationResult={this.state.formOperationResult}
          itemEntryRegister={this.entryRegisterItem}
          dropDownOptionsDefinition={this.optionDefinitionSubject}
          onClose={this.cleanAndCloseForm}
          onChange={this.changeEntryRegister}
          onSave={this.saveEntryRegister}
        />
      );
    if(this.state.activeModal === Modals.CONFIRM)
      return this.confirmMessageJSX
  }

  getModalFooter() {
    if(this.state.activeModal === Modals.CONFIRM) {
      return (
        <Stack horizontal reversed tokens={{childrenGap: 20}}>
          {this.confirmButton}
          <DefaultButton text="Close" onClick={()=> this.setState({activeModal: Modals.NOMODAL})}/>
        </Stack>
      );
    }
    return "";
  }
}

