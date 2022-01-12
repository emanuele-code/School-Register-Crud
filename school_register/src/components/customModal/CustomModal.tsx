import * as React from "react";

import { DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton, Modal, mergeStyleSets, MessageBar, MessageBarType } from "@fluentui/react";

const modalStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) !important"
};

/**    <Modal show={true} size="sm">
      <ModalHeader>{this.props.header}</ModalHeader>
      <ModalContent>{this.props.content}</ModelContent>
      <ModalFooter>{this.props.footer}</ModalFooter>
    </Modal>/ */

const contentStyles = mergeStyleSets({
  container: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "stretch",
    minHeight: "initial !important",
    minWidth: "initial !important"
  },
  body: {
    padding: "10px"
  }
});

function CustomModal(props:any) {
  const modalPropsStyles = {
    main: {
      width: props.width + " !important",
      maxHeight: "initial !important",
      maxWidth: "initial !important"
    }
  };
  const modalProps = {
    isBlocking: props.isBlocking,
    styles: modalPropsStyles
  };

  let modalContentProps = {
    type: DialogType.largeHeader,
    title: props.modalHeader
  };

  let modalTypes = new Map<string, any>([
    [
      "fullModal",
      <Dialog
        hidden={!props.show}
        onDismiss={props.onDismiss}
        modalProps={modalProps}
        dialogContentProps={modalContentProps}
      >
        {props.modalBody}
        <DialogFooter>{props.modalFooter}</DialogFooter>
      </Dialog>
    ],
    [
      "noHeaderModal",
      <Dialog
        hidden={!props.show}
        onDismiss={props.onDismiss}
        modalProps={modalProps}
      >
        {props.modalBody}
        <DialogFooter>{props.modalFooter}</DialogFooter>
      </Dialog>
    ],
    [
      "bodyOnlyModal",
      <Modal
        isOpen={props.show}
        containerClassName={contentStyles.container}
        isBlocking={props.isBlocking}
      >
        <div>{props.modalBody}</div>
      </Modal>
    ]
  ]);

  return modalTypes.get(props.modalType);
}

export default CustomModal;

export enum ModalTypes {
  FULLMODAL = "fullModal",
  HEADERBODYMODAL = "headerBodyModal",
  NOHEADERMODAL = "noHeaderModal",
  BODYONLYMODAL = "bodyOnlyModal",
}

export enum Modals {
  NOMODAL,
  SPINNER,
  CONFIRM,
  SUCCESS,
  ERROR,
  WARNING,
  PROGRAMME_OVERVIEW,
  FORM,
  UPLOAD_DOCUMENT
}