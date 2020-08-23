import React, { useState } from "react";
import { Modal } from "../../Components/Modal";
import EntryService from "../../Model/EntryService";

interface ImportCsvPanelProps {
    onClose: () => void;
}

export function ImportCsvPanel(props: ImportCsvPanelProps) {
    const [textInput, setTextInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    function importButtonPressed() {
        EntryService.importFromCsv(textInput);
        props.onClose();
    }

    function cancelButtonPressed() {
        props.onClose();
    }

    return <Modal title="Import Keypass CSV">
        <div style={{width: "80vw", height: "80vh"}} className="flex flex-col">
            {errorMessage && <div>{errorMessage}</div>}
            <textarea className="flex-1 mb-2 resize-none border font-mono" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Paste keypass CSV here"></textarea>
            <div className="text-right">
                <button className="btn-primary" onClick={importButtonPressed}>Import</button>
                <button className="btn-secondary" onClick={cancelButtonPressed}>Cancel</button>
            </div>
        </div>
    </Modal>    
}