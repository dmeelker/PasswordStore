import React, { useState } from "react";
import { Modal } from "../../Components/Modal";
import EntryService from "../../Model/EntryService";
import { FaRegTired } from "react-icons/fa";

interface ImportCsvPanelProps {
    onClose: () => void;
}

export function ImportCsvPanel(props: ImportCsvPanelProps) {
    const [textInput, setTextInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    function importButtonPressed() {
        try {
            EntryService.importFromCsv(textInput);
        } catch(e) {
            setErrorMessage(e.message);
            return;
        }
        props.onClose();
    }

    function cancelButtonPressed() {
        props.onClose();
    }

    return <Modal title="Import Keypass CSV" 
                buttonBar={<>
                    <button className="btn-primary" onClick={importButtonPressed}>Import</button>
                    <button className="btn-secondary" onClick={cancelButtonPressed}>Cancel</button>
                </>}>
        <div style={{width: "80vw", height: "80vh"}} className="flex flex-col">
            {errorMessage && <div className="text-red-600"><FaRegTired className="inline-block"/> {errorMessage}</div>}
            <textarea 
                className="flex-1 resize-none border font-mono" 
                value={textInput} 
                onChange={(e) => setTextInput(e.target.value)} 
                placeholder="Paste keypass CSV here"
                wrap="off"
                spellCheck={false}></textarea>
        </div>
    </Modal>    
}