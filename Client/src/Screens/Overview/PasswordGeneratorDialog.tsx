import { Modal } from "../../Components/Modal";
import React from "react";
import { FieldSet } from "../../Components/FieldSet";

interface PasswordGeneratorDialogProps {

}

export function PasswordGeneratorDialog(props: PasswordGeneratorDialogProps) {
    return <Modal title="Generate Password">
        <div className="flex flex-col">
            <div className="flex-1">
                <div>
                    Password: <input type="text"/>
                </div>
                <FieldSet title="Random characters">
                    Length: <input type="number" className="text-input" value="32"/>
                </FieldSet>

                <FieldSet title="Random words">
                    Min. length: <input type="number" className="text-input" value="32"/>
                </FieldSet>
            </div>
            <div className="text-right m-4">
                <button type="submit" className="btn-primary">Ok</button>
                <button type="button" className="btn-secondary">Cancel</button>
            </div>
        </div>
      </Modal>
}